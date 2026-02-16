-- Production Database Improvements
-- Run this in your Supabase SQL Editor

-- Add missing index on orders.created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Add index on orders.preferred_date for date-based filtering
CREATE INDEX IF NOT EXISTS idx_orders_preferred_date ON orders(preferred_date);

-- Add index on workers.user_id for quick lookups
CREATE INDEX IF NOT EXISTS idx_workers_user_id ON workers(user_id);

-- Add composite index for worker order queries
CREATE INDEX IF NOT EXISTS idx_orders_worker_status ON orders(worker_id, status);

-- Add index on order_status_history for tracking
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at DESC);

-- Add index on reviews for worker rating calculations
CREATE INDEX IF NOT EXISTS idx_reviews_worker_id ON reviews(worker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id);

-- Add function to update worker total_jobs count
CREATE OR REPLACE FUNCTION update_worker_job_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE workers 
    SET total_jobs = total_jobs + 1 
    WHERE user_id = NEW.worker_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating worker job count
DROP TRIGGER IF EXISTS update_worker_jobs_trigger ON orders;
CREATE TRIGGER update_worker_jobs_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_worker_job_count();

-- Add function to prevent duplicate reviews
CREATE OR REPLACE FUNCTION prevent_duplicate_review()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM reviews 
    WHERE order_id = NEW.order_id 
    AND worker_id = NEW.worker_id
  ) THEN
    RAISE EXCEPTION 'تم إضافة تقييم لهذا الطلب من قبل';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_duplicate_review_trigger ON reviews;
CREATE TRIGGER prevent_duplicate_review_trigger
  BEFORE INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION prevent_duplicate_review();
