import { createBrowserClient } from '@supabase/ssr';
import { Database } from './database.types';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { PostgrestError } from '@supabase/supabase-js';

// Cache for deduplicating concurrent requests
const requestCache = new Map<string, Promise<unknown>>();
const CACHE_DURATION = 5000; // 5 seconds

function getCacheKey(table: string, query: string): string {
  return `${table}:${query}`;
}

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Export singleton instance for backward compatibility
export const supabase = createClient();

// Optimized query helper with deduplication
export async function cachedQuery<T>(
  table: string,
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  cacheDuration: number = CACHE_DURATION
): Promise<{ data: T | null; error: PostgrestError | null }> {
  const cacheKey = getCacheKey(table, JSON.stringify(queryFn.toString()));
  
  // Check if there's an ongoing request
  const cachedRequest = requestCache.get(cacheKey);
  if (cachedRequest) {
    return cachedRequest as Promise<{ data: T | null; error: PostgrestError | null }>;
  }
  
  // Create new request
  const request = queryFn().finally(() => {
    // Clear from cache after duration
    setTimeout(() => {
      requestCache.delete(cacheKey);
    }, cacheDuration);
  });
  
  requestCache.set(cacheKey, request);
  return request;
}

// Batch fetch helper for related data
export async function batchFetch<T>(
  requests: Array<() => Promise<{ data: T | null; error: PostgrestError | null }>>
): Promise<Array<{ data: T | null; error: PostgrestError | null }>> {
  return Promise.all(requests.map(req => req()));
}

// Optimized real-time subscription manager
class SubscriptionManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  
  subscribe<T extends { [key: string]: unknown }>(channelName: string, _callback?: (payload: RealtimePostgresChangesPayload<T>) => void) {
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName);
    }
    
    const channel = supabase
      .channel(channelName)
      .subscribe();
    
    this.channels.set(channelName, channel);
    return channel;
  }
  
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }
  
  unsubscribeAll() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

export const subscriptionManager = new SubscriptionManager();
