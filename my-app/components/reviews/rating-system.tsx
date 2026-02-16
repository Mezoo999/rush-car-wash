"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Review {
  id: string;
  order_id: string;
  user_id: string;
  worker_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    full_name: string;
  };
}

interface RatingSystemProps {
  orderId: string;
  workerId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function RatingDialog({ orderId, workerId, isOpen, onClose, onSubmit }: RatingSystemProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("يرجى اختيار التقييم");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("يرجى تسجيل الدخول أولاً");
        return;
      }

      // Save review
      const { error } = await (supabase as any).from("reviews").insert({
        order_id: orderId,
        user_id: user.id,
        worker_id: workerId,
        rating,
        comment,
      });

      if (error) throw error;

      // Update worker rating
      const { data: workerReviews } = await (supabase as any)
        .from("reviews")
        .select("rating")
        .eq("worker_id", workerId);

      if (workerReviews) {
        const avgRating = workerReviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / workerReviews.length;
        await (supabase as any)
          .from("workers")
          .update({ rating: Math.round(avgRating * 10) / 10 })
          .eq("id", workerId);
      }

      toast.success("شكراً لتقييمك!");
      onSubmit();
      onClose();
    } catch (error: any) {
      toast.error("خطأ: " + error.message);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">قيم خدمتنا</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <p className="text-center text-gray-600 mb-6">
            كيف كانت تجربتك مع عاملنا؟
          </p>
          
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </motion.button>
            ))}
          </div>

          {/* Rating Text */}
          <p className="text-center text-sm text-gray-500 mb-4">
            {rating === 1 && "سيء جداً"}
            {rating === 2 && "سيء"}
            {rating === 3 && "مقبول"}
            {rating === 4 && "جيد"}
            {rating === 5 && "ممتاز!"}
          </p>

          {/* Comment */}
          <Textarea
            placeholder="اكتب تعليقك هنا (اختياري)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-4"
            rows={3}
          />

          {/* Submit Button */}
          <Button
            className="w-full bg-[#d4a574] hover:bg-[#c49464] text-[#1a1a1a]"
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
          >
            {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Component to display reviews on landing page
export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*, user:users(full_name)")
        .order("created_at", { ascending: false })
        .limit(6);

      if (data) setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#d4a574] border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#faf8f5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">
            آراء عملائنا
          </h2>
          <p className="text-gray-600">شوف اللي بيقولوه عن خدمتنا</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-4 line-clamp-3">{review.comment}</p>

      {/* User Info */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-[#d4a574]/20 rounded-full flex items-center justify-center">
          <span className="font-bold text-[#d4a574]">
            {review.user?.full_name?.charAt(0) || "م"}
          </span>
        </div>
        <div>
          <p className="font-medium text-sm">{review.user?.full_name || "عميل"}</p>
          <p className="text-xs text-gray-400">
            {new Date(review.created_at).toLocaleDateString("ar-EG")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Average Rating Display
export function AverageRating() {
  const [stats, setStats] = useState({ avg: 0, count: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await (supabase as any).from("reviews").select("rating");
      if (data && data.length > 0) {
        const avg = data.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / data.length;
        setStats({ avg: Math.round(avg * 10) / 10, count: data.length });
      }
    };
    fetchStats();
  }, []);

  if (stats.count === 0) return null;

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
      <div className="text-4xl font-bold text-[#d4a574]">{stats.avg}</div>
      <div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(stats.avg)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500">من {stats.count} تقييم</p>
      </div>
    </div>
  );
}
