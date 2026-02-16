-- Fix RLS policies (only create if not exists)
-- Run this in Supabase SQL Editor

-- Users policies (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_read_for_auth' AND tablename = 'users') THEN
    CREATE POLICY "users_read_for_auth" ON users
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_insert_own' AND tablename = 'users') THEN
    CREATE POLICY "users_insert_own" ON users
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_update_own' AND tablename = 'users') THEN
    CREATE POLICY "users_update_own" ON users
      FOR UPDATE TO authenticated USING (auth.uid() = id);
  END IF;
END $$;

-- Cars policies (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cars_insert_for_authenticated' AND tablename = 'cars') THEN
    CREATE POLICY "cars_insert_for_authenticated" ON cars
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cars_select_own' AND tablename = 'cars') THEN
    CREATE POLICY "cars_select_own" ON cars
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- Services and add_ons public read
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'services_read_public' AND tablename = 'services') THEN
    CREATE POLICY "services_read_public" ON services
      FOR SELECT TO public USING (is_active = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'add_ons_read_public' AND tablename = 'add_ons') THEN
    CREATE POLICY "add_ons_read_public" ON add_ons
      FOR SELECT TO public USING (is_active = true);
  END IF;
END $$;
