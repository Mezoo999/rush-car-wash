-- =====================================================
-- LAM3A DATABASE SIMPLIFICATION MIGRATION
-- Phase 0: MVP Database Schema
-- 
-- This migration simplifies the database for production MVP
-- Keeps only essential tables for core functionality
-- =====================================================

-- =====================================================
-- STEP 1: Clean up non-essential tables and data
-- =====================================================

-- Drop tables that are not needed for MVP (they can be re-added later)
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS user_activity_log CASCADE;
DROP TABLE IF EXISTS user_payment_methods CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS user_addresses CASCADE;
DROP TABLE IF EXISTS car_photos CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- =====================================================
-- STEP 2: Core Tables - Keep and optimize
-- =====================================================

-- Users table (extends Supabase auth)
-- Already exists, verify structure
COMMENT ON TABLE users IS 'Extended user profiles linked to Supabase Auth';

-- Ensure users table has proper structure
ALTER TABLE users 
  ALTER COLUMN phone SET NOT NULL,
  ALTER COLUMN role SET DEFAULT 'customer';

-- Cars table
COMMENT ON TABLE cars IS 'Customer vehicles';

-- Add index if not exists
CREATE INDEX IF NOT EXISTS idx_cars_user_id ON cars(user_id);
CREATE INDEX IF NOT EXISTS idx_cars_plate_number ON cars(plate_number);

-- Services table
COMMENT ON TABLE services IS 'Available car wash services';

-- Add index for active services
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- Add-ons table
COMMENT ON TABLE add_ons IS 'Optional service add-ons';

CREATE INDEX IF NOT EXISTS idx_addons_active ON add_ons(is_active);

-- Orders table
COMMENT ON TABLE orders IS 'Customer booking orders';

-- Add essential indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_worker_id ON orders(worker_id);
CREATE INDEX IF NOT EXISTS idx_orders_preferred_date ON orders(preferred_date);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Order add-ons junction table
COMMENT ON TABLE order_add_ons IS 'Links orders to their selected add-ons';

CREATE INDEX IF NOT EXISTS idx_order_addons_order_id ON order_add_ons(order_id);
CREATE INDEX IF NOT EXISTS idx_order_addons_addon_id ON order_add_ons(add_on_id);

-- Workers table
COMMENT ON TABLE workers IS 'Worker profiles and assignments';

CREATE INDEX IF NOT EXISTS idx_workers_user_id ON workers(user_id);
CREATE INDEX IF NOT EXISTS idx_workers_active ON workers(is_active);

-- =====================================================
-- STEP 3: Clean up and standardize column names
-- =====================================================

-- Ensure consistent naming in orders table
-- Rename any inconsistent columns if needed
DO $$
BEGIN
  -- Add updated_at trigger if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'orders_updated_at'
  ) THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Same for users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'users_updated_at'
  ) THEN
    CREATE TRIGGER users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- =====================================================
-- STEP 4: Comprehensive RLS Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users view own data" ON users;
DROP POLICY IF EXISTS "Admins manage users" ON users;
DROP POLICY IF EXISTS "Users CRUD own cars" ON cars;
DROP POLICY IF EXISTS "Everyone view active services" ON services;
DROP POLICY IF EXISTS "Everyone view active add-ons" ON add_ons;
DROP POLICY IF EXISTS "Users view own orders" ON orders;
DROP POLICY IF EXISTS "Workers view assigned orders" ON orders;
DROP POLICY IF EXISTS "Admins manage orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users insert orders" ON orders;
DROP POLICY IF EXISTS "Everyone view active workers" ON workers;
DROP POLICY IF EXISTS "users_self_access" ON users;
DROP POLICY IF EXISTS "users_admin_access" ON users;
DROP POLICY IF EXISTS "cars_user_access" ON cars;
DROP POLICY IF EXISTS "services_view_active" ON services;
DROP POLICY IF EXISTS "services_admin_manage" ON services;
DROP POLICY IF EXISTS "addons_view_active" ON add_ons;
DROP POLICY IF EXISTS "addons_admin_manage" ON add_ons;
DROP POLICY IF EXISTS "orders_customer_view" ON orders;
DROP POLICY IF EXISTS "orders_worker_view" ON orders;
DROP POLICY IF EXISTS "orders_customer_insert" ON orders;
DROP POLICY IF EXISTS "orders_customer_update" ON orders;
DROP POLICY IF EXISTS "order_addons_user_view" ON order_add_ons;
DROP POLICY IF EXISTS "order_addons_user_insert" ON order_add_ons;
DROP POLICY IF EXISTS "workers_view_active" ON workers;
DROP POLICY IF EXISTS "workers_self_view" ON workers;
DROP POLICY IF EXISTS "workers_admin_manage" ON workers;

-- USERS TABLE POLICIES
-- Users can view and update their own data
CREATE POLICY "users_self_access"
  ON users
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can manage all users
CREATE POLICY "users_admin_access"
  ON users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- CARS TABLE POLICIES
-- Users can CRUD their own cars
CREATE POLICY "cars_user_access"
  ON cars
  FOR ALL
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (auth.uid() = user_id);

-- SERVICES TABLE POLICIES
-- Everyone can view active services
CREATE POLICY "services_view_active"
  ON services
  FOR SELECT
  USING (is_active = TRUE);

-- Only admins can manage services
CREATE POLICY "services_admin_manage"
  ON services
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ADD-ONS TABLE POLICIES
-- Everyone can view active add-ons
CREATE POLICY "addons_view_active"
  ON add_ons
  FOR SELECT
  USING (is_active = TRUE);

-- Only admins can manage add-ons
CREATE POLICY "addons_admin_manage"
  ON add_ons
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ORDERS TABLE POLICIES
-- Customers can view their own orders
CREATE POLICY "orders_customer_view"
  ON orders
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Workers can view assigned orders
CREATE POLICY "orders_worker_view"
  ON orders
  FOR SELECT
  USING (
    auth.uid() = worker_id OR
    EXISTS (
      SELECT 1 FROM workers 
      WHERE user_id = auth.uid() AND is_active = TRUE
    )
  );

-- Authenticated users can create orders for themselves
CREATE POLICY "orders_customer_insert"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Customers can update their own pending orders
CREATE POLICY "orders_customer_update"
  ON orders
  FOR UPDATE
  USING (
    (auth.uid() = user_id AND status = 'pending') OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM workers 
      WHERE user_id = auth.uid() AND is_active = TRUE
    )
  );

-- ORDER ADD-ONS TABLE POLICIES
-- Users can view add-ons for their orders
CREATE POLICY "order_addons_user_view"
  ON order_add_ons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_add_ons.order_id 
      AND (user_id = auth.uid() OR worker_id = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can add add-ons to their own pending orders
CREATE POLICY "order_addons_user_insert"
  ON order_add_ons
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_add_ons.order_id 
      AND user_id = auth.uid() 
      AND status = 'pending'
    )
  );

-- WORKERS TABLE POLICIES
-- Everyone can view active workers (for display purposes)
CREATE POLICY "workers_view_active"
  ON workers
  FOR SELECT
  USING (is_active = TRUE);

-- Workers can view their own profile
CREATE POLICY "workers_self_view"
  ON workers
  FOR SELECT
  USING (user_id = auth.uid());

-- Only admins can manage workers
CREATE POLICY "workers_admin_manage"
  ON workers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STEP 5: Realtime Configuration
-- =====================================================

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

COMMENT ON SCHEMA public IS 'Lam3a MVP Database - Simplified for production';
