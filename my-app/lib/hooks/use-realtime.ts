"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { Order, OrderStatus } from "@/types";
import { toast } from "sonner";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface UseRealtimeOrdersOptions {
  userId?: string;
  userRole?: "customer" | "worker" | "admin";
  enabled?: boolean;
}

export function useRealtimeOrders(options: UseRealtimeOrdersOptions = {}) {
  const { userId, userRole = "customer", enabled = true } = options;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isMountedRef = useRef(true);

  const fetchOrders = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("orders")
        .select(
          `
          *,
          car:cars(*),
          service:services(*),
          worker:users!orders_worker_id_fkey(*)
        `
        )
        .order("created_at", { ascending: false });

      if (userRole === "customer" && userId) {
        query = query.eq("user_id", userId);
      } else if (userRole === "worker" && userId) {
        query = query.eq("worker_id", userId);
      }

      const { data, error: queryError } = await query;
      
      if (queryError) throw queryError;
      
      if (isMountedRef.current) {
        setOrders(data || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error("Failed to fetch orders"));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [userId, userRole, enabled]);

  useEffect(() => {
    isMountedRef.current = true;
    
    fetchOrders();

    if (!enabled) return;

    // Subscribe to realtime changes
    channelRef.current = supabase
      .channel(`orders_${userRole}_${userId || "admin"}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          const newOrder = payload.new as Order;

          // Only add if relevant to current user
          const isRelevant =
            userRole === "admin" ||
            (userRole === "customer" && newOrder.user_id === userId) ||
            (userRole === "worker" && newOrder.worker_id === userId);

          if (isRelevant && isMountedRef.current) {
            // Fetch full order details with relations
            const { data: fullOrder } = await supabase
              .from("orders")
              .select(
                `
                *,
                car:cars(*),
                service:services(*),
                worker:users!orders_worker_id_fkey(*)
              `
              )
              .eq("id", newOrder.id)
              .single();

            if (fullOrder) {
              setOrders((prev) => [fullOrder, ...prev]);

              if (userRole === "admin") {
                toast.success("طلب جديد!", {
                  description: `طلب جديد بقيمة ${newOrder.total_amount} ج.م`,
                });
              }
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          const oldOrder = payload.old as Order;

          if (!isMountedRef.current) return;

          setOrders((prev) =>
            prev.map((order) =>
              order.id === updatedOrder.id
                ? { ...order, ...updatedOrder }
                : order
            )
          );

          // Notify about status changes
          if (oldOrder.status !== updatedOrder.status) {
            handleStatusChange(updatedOrder, oldOrder.status, userRole);
          }
        }
      )
      .subscribe();

    return () => {
      isMountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId, userRole, enabled, fetchOrders]);

  const refresh = useCallback(() => {
    return fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refresh, setOrders };
}

export function useOrderUpdates(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!!orderId);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!orderId) {
      setOrder(null);
      setLoading(false);
      return;
    }

    // Fetch initial order
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            *,
            car:cars(*),
            service:services(*),
            worker:users!orders_worker_id_fkey(*)
          `
          )
          .eq("id", orderId)
          .single();

        if (error) throw error;

        if (isMountedRef.current) {
          setOrder(data);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    // Subscribe to this specific order
    channelRef.current = supabase
      .channel(`order_${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (isMountedRef.current) {
            setOrder((prev) =>
              prev ? { ...prev, ...(payload.new as Order) } : null
            );
          }
        }
      )
      .subscribe();

    return () => {
      isMountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [orderId]);

  return { order, loading };
}

function handleStatusChange(
  order: Order,
  oldStatus: string,
  role?: string
) {
  const statusMessages: Record<OrderStatus, string> = {
    pending: "معلق",
    confirmed: "مؤكد",
    assigned: "تم التعيين",
    on_the_way: "في الطريق",
    in_progress: "قيد التنفيذ",
    completed: "مكتمل",
    cancelled: "ملغي",
  };

  if (role === "customer") {
    toast.info("تحديث الحالة", {
      description: `حالة طلبك تغيرت إلى: ${statusMessages[order.status]}`,
    });
  } else if (role === "worker") {
    toast.info("تحديث", {
      description: `تم تحديث حالة الطلب ${order.id.slice(0, 8)}`,
    });
  }
}

// Hook for worker earnings
export function useWorkerEarnings(workerId: string | null) {
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    totalJobs: 0,
    completedJobs: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workerId) return;

    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split("T")[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        const { data: orders } = await supabase
          .from("orders")
          .select("total_amount, status, created_at")
          .eq("worker_id", workerId)
          .eq("status", "completed");

        if (orders) {
          const todayEarnings = orders
            .filter((o: { created_at: string }) => o.created_at.startsWith(today))
            .reduce((sum: number, o: { total_amount: number }) => sum + o.total_amount, 0);

          const weekEarnings = orders
            .filter((o: { created_at: string }) => o.created_at >= weekAgo)
            .reduce((sum: number, o: { total_amount: number }) => sum + o.total_amount, 0);

          const monthEarnings = orders
            .filter((o: { created_at: string }) => o.created_at >= monthAgo)
            .reduce((sum: number, o: { total_amount: number }) => sum + o.total_amount, 0);

          setEarnings({
            today: todayEarnings,
            week: weekEarnings,
            month: monthEarnings,
            totalJobs: orders.length,
            completedJobs: orders.length,
          });
        }
      } catch (error) {
        console.error("Error fetching earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [workerId]);

  return { earnings, loading };
}
