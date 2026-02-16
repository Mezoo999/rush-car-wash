-- Seed data for services and add-ons
-- Run this in Supabase SQL Editor

-- Insert services
INSERT INTO services (name_ar, name_en, description, base_price_standard, base_price_suv, base_price_luxury, duration_minutes, features, is_active, display_order) VALUES
('أساسية', 'Basic', 'غسيل خارجي وداخلي أساسي', 330, 400, 445, 45, '["غسيل خارجي", "تنظيف الداخلية", "شفط الأرضيات"]', true, 1),
('مميزة', 'Plus', 'غسيل شامل مع تلميع خفيف', 450, 540, 607, 60, '["غسيل خارجي", "تنظيف الداخلية", "تلميع خفيف", "تلميع النوافذ"]', true, 2),
('بخار', 'Steam', 'غسيل بالبخار لجميع أجزاء السيارة', 600, 720, 810, 75, '["غسيل بالبخار", "تنظيف عميق", "تعطير"]', true, 3),
('فاخرة', 'Signature', 'خدمة VIP شاملة كل شيء', 800, 960, 1080, 90, '["غسيل فاخر", "تلميع كامل", "حماية السيراميك", "تعطير فاخر", "تنظيف المحرك"]', true, 4);

-- Insert add-ons
INSERT INTO add_ons (name_ar, name_en, description, price, duration_minutes, is_active) VALUES
('تلميع', 'Polishing', 'تلميع خارجي كامل', 150, 30, true),
('تنظيف المحرك', 'Engine Cleaning', 'تنظيف محرك السيارة', 200, 45, true),
('تعطير', 'Fragrance', 'تعطير داخلي فاخر', 50, 10, true),
('حماية سيراميك', 'Ceramic Protection', 'طبقة حماية سيراميك', 300, 60, true);
