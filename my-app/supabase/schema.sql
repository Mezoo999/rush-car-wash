-- Lam3a Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'customer', -- customer, admin, worker
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cars table
CREATE TABLE cars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  plate_number TEXT,
  category TEXT DEFAULT 'standard', -- standard, suv, luxury
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  base_price_standard DECIMAL(10,2) NOT NULL,
  base_price_suv DECIMAL(10,2) NOT NULL,
  base_price_luxury DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Packages table
CREATE TABLE packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  washes_per_month INTEGER NOT NULL,
  price_standard DECIMAL(10,2) NOT NULL,
  price_suv DECIMAL(10,2) NOT NULL,
  price_luxury DECIMAL(10,2) NOT NULL,
  includes_steaming INTEGER DEFAULT 0,
  includes_polishing INTEGER DEFAULT 0,
  benefits JSONB,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add-ons table
CREATE TABLE add_ons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  car_id UUID REFERENCES cars(id),
  service_id UUID REFERENCES services(id),
  package_id UUID REFERENCES packages(id),
  order_type TEXT NOT NULL, -- 'single', 'package'
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  category_multiplier DECIMAL(3,2) DEFAULT 1.00,
  add_ons_total DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Location & Time
  address TEXT NOT NULL,
  google_maps_link TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, confirmed, assigned, on_the_way, in_progress, completed, cancelled
  worker_id UUID REFERENCES users(id),
  
  -- Payment
  payment_method TEXT DEFAULT 'cash', -- cash, online
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order add-ons junction table
CREATE TABLE order_add_ons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  add_on_id UUID REFERENCES add_ons(id),
  price_at_time DECIMAL(10,2) NOT NULL
);

-- Workers table
CREATE TABLE workers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  employee_id TEXT UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1) DEFAULT 5.0,
  total_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Offers table
CREATE TABLE offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE,
  title_ar TEXT NOT NULL,
  description TEXT,
  discount_type TEXT, -- percentage, fixed
  discount_value DECIMAL(10,2),
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order status history
CREATE TABLE order_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_worker_id ON orders(worker_id);
CREATE INDEX idx_orders_preferred_date ON orders(preferred_date);
CREATE INDEX idx_cars_user_id ON cars(user_id);
CREATE INDEX idx_order_add_ons_order_id ON order_add_ons(order_id);

-- Seed Data - Services
INSERT INTO services (id, name_ar, description, base_price_standard, base_price_suv, base_price_luxury, duration_minutes, features, display_order) VALUES
('11111111-1111-1111-1111-111111111111', 'لمعة الأساسية', 'غسيل خارجي احترافي بالفوم مع تنظيف داخلي شامل', 330, 400, 445, 60, '["غسيل خارجي بالفوم الاحترافي", "تنظيف العجلات والكاوتش", "مكنسة داخلية كاملة", "تنظيف الطبلون والأبواب", "تنظيف الزجاج من الداخل والخارج", "عطر احترافي للمقصورة", "معطر هواء لمعة هدية"]', 1),
('22222222-2222-2222-2222-222222222222', 'لمعة المميزة', 'تجربة متكاملة مع عناية إضافية بالتفاصيل', 450, 540, 607, 75, '["كل ما في الباقة الأساسية", "تنظيف فتحات التكييف", "تلميع داخلي للطبلون", "معالجة البقع البسيطة", "حماية مؤقتة للدهان"]', 2),
('33333333-3333-3333-3333-333333333333', 'لمعة البخار', 'تنظيف عميق بالبخار للمقاعد والأماكن الضيقة', 600, 720, 810, 90, '["كل ما في الباقة المميزة", "تنظيف بالبخار للمقاعد", "تعقيم وتطهير الداخلية", "إزالة الروائح العميقة", "تنظيف الأماكن الضيقة"]', 3),
('44444444-4444-4444-4444-444444444444', 'لمعة التوقيع', 'أعلى مستوى من العناية والتفصيل لسيارتك', 800, 960, 1080, 120, '["كل ما في باقة البخار", "تلميع المصابيح الأمامية", "تنظيف حجرة المحرك", "معالجة شاملة للدهان", "حماية طويلة الأمد"]', 4);

-- Seed Data - Packages
INSERT INTO packages (id, name_ar, description, washes_per_month, price_standard, price_suv, price_luxury, includes_steaming, includes_polishing, benefits, is_popular) VALUES
('55555555-5555-5555-5555-555555555555', 'الباقة الأساسية', '3 غسيلات شهرياً', 3, 900, 1100, 1240, 0, 0, '["3 غسيلات داخلي + خارجي", "توفير مقارنة بالغسيل الفردي", "زيارات مجدولة مسبقاً", "أولوية في الحجز"]', FALSE),
('66666666-6666-6666-6666-666666666666', 'الباقة المميزة', '4 غسيلات + تنظيف بخار', 4, 1300, 1600, 1800, 1, 0, '["4 غسيلات داخلي + خارجي", "تنظيف بالبخار مرة شهرياً", "عناية أعمق بشكل دوري", "أفضل قيمة من الحجز الفردي"]', TRUE),
('77777777-7777-7777-7777-777777777777', 'باقة العناية المميزة', 'تجربة بريميوم شاملة', 4, 1900, 2200, 2475, 2, 1, '["4 غسيلات داخلي + خارجي", "تنظيف بالبخار مرتين", "تلميع المصابيح مرة", "مظهر بريميوم طوال الشهر"]', FALSE);

-- Seed Data - Add-ons
INSERT INTO add_ons (id, name_ar, description, price, duration_minutes) VALUES
('88888888-8888-8888-8888-888888888888', 'تنظيف المقاعد بالبخار', 'تنظيف عميق بالبخار لجميع المقاعد', 180, 30),
('99999999-9999-9999-9999-999999999999', 'إزالة البقع', 'معالجة البقع الصعبة في المقصورة', 120, 20),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'تلميع المصابيح', 'تلميع وتنظيف المصابيح الأمامية', 180, 25),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'تنظيف حجرة المحرك', 'تنظيف وتلميع حجرة المحرك', 220, 30),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'حماية الطبلون', 'حماية وتلميع الطبلون والبلاستيك', 80, 15),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'معالجة الروائح', 'إزالة الروائح الكريهة من المقصورة', 150, 20);

-- RLS Policies
-- Users can view their own data
CREATE POLICY "Users view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Only admins can insert/update users
CREATE POLICY "Admins manage users" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Cars: Users can CRUD their own cars
CREATE POLICY "Users CRUD own cars" ON cars
  FOR ALL USING (auth.uid() = user_id);

-- Services: Everyone can view active services
CREATE POLICY "Everyone view active services" ON services
  FOR SELECT USING (is_active = TRUE);

-- Packages: Everyone can view active packages
CREATE POLICY "Everyone view active packages" ON packages
  FOR SELECT USING (is_active = TRUE);

-- Add-ons: Everyone can view active add-ons
CREATE POLICY "Everyone view active add-ons" ON add_ons
  FOR SELECT USING (is_active = TRUE);

-- Orders: Users can view their own orders
CREATE POLICY "Users view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Orders: Workers can view assigned orders
CREATE POLICY "Workers view assigned orders" ON orders
  FOR SELECT USING (auth.uid() = worker_id);

-- Orders: Admins can manage all orders
CREATE POLICY "Admins manage orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Orders: Allow insert for authenticated users
CREATE POLICY "Authenticated users insert orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Workers: Everyone can view active workers
CREATE POLICY "Everyone view active workers" ON workers
  FOR SELECT USING (is_active = TRUE);

-- Offers: Everyone can view active offers
CREATE POLICY "Everyone view active offers" ON offers
  FOR SELECT USING (is_active = TRUE);

-- Realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_status_history;
