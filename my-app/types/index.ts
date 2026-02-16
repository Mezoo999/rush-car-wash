export type CarCategory = 'standard' | 'suv' | 'luxury';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'assigned' 
  | 'on_the_way' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type PaymentMethod = 'cash' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type UserRole = 'customer' | 'admin' | 'worker';
export type OrderType = 'single' | 'package';
export type DiscountType = 'percentage' | 'fixed';

export interface User {
  id: string;
  full_name: string | null;
  phone: string;
  email: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Car {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  year: number | null;
  color: string | null;
  plate_number: string | null;
  category: CarCategory;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  name_ar: string;
  name_en: string | null;
  description: string | null;
  base_price_standard: number;
  base_price_suv: number;
  base_price_luxury: number;
  duration_minutes: number | null;
  features: string[] | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Package {
  id: string;
  name_ar: string;
  name_en: string | null;
  description: string | null;
  washes_per_month: number;
  price_standard: number;
  price_suv: number;
  price_luxury: number;
  includes_steaming: number;
  includes_polishing: number;
  benefits: string[] | null;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
}

export interface AddOn {
  id: string;
  name_ar: string;
  name_en: string | null;
  description: string | null;
  price: number;
  duration_minutes: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  car_id: string;
  service_id: string | null;
  package_id: string | null;
  order_type: OrderType;
  base_price: number;
  category_multiplier: number;
  add_ons_total: number;
  discount_amount: number;
  total_amount: number;
  address: string;
  google_maps_link: string | null;
  preferred_date: string;
  preferred_time: string;
  status: OrderStatus;
  worker_id: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  customer_notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  car?: Car;
  service?: Service;
  worker?: User;
  add_ons?: OrderAddOn[];
}

export interface OrderAddOn {
  id: string;
  order_id: string;
  add_on_id: string;
  price_at_time: number;
  add_on?: AddOn;
}

export interface Worker {
  id: string;
  user_id: string;
  employee_id: string | null;
  is_active: boolean;
  rating: number;
  total_jobs: number;
  created_at: string;
  user?: User;
}

export interface Offer {
  id: string;
  code: string | null;
  title_ar: string;
  description: string | null;
  discount_type: DiscountType | null;
  discount_value: number | null;
  min_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  worker_id: string;
  customer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface BookingFormData {
  carBrand: string;
  carModel: string;
  carYear: number;
  carColor: string;
  plateNumber: string;
  carCategory: CarCategory;
  selectedServiceId: string | null;
  orderType: OrderType;
  address: string;
  googleMapsLink: string;
  preferredDate: string;
  preferredTime: string;
  phone: string;
  selectedAddOns: string[];
  paymentMethod: PaymentMethod;
  customerNotes: string;
}

export interface WorkerEarnings {
  today: number;
  week: number;
  month: number;
  totalJobs: number;
  completedJobs: number;
}

export interface DashboardStats {
  todayOrders: number;
  revenue: number;
  activeWorkers: number;
  pendingOrders: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  completionRate: number;
  averageRating: number;
}

export const CAR_BRANDS = [
  'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'BMW', 'Mercedes', 'Audi', 
  'Volkswagen', 'Ford', 'Chevrolet', 'Peugeot', 'Renault', 'Fiat', 'Chery',
  'BYD', 'MG', 'Geely', 'Changan', 'Suzuki', 'Mitsubishi', 'Subaru', 'Lexus',
  'Infiniti', 'Acura', 'Volvo', 'Jaguar', 'Land Rover', 'Porsche', 'Tesla'
];

export const SERVICE_AREAS = ['6th of October', 'Sheikh Zayed'];

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

export const CATEGORY_MULTIPLIERS: Record<CarCategory, number> = {
  standard: 1.0,
  suv: 1.2,
  luxury: 1.35
};

export const CATEGORY_LABELS: Record<CarCategory, string> = {
  standard: 'عادية',
  suv: 'دفع رباعي',
  luxury: 'فاخرة'
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'معلق',
  confirmed: 'مؤكد',
  assigned: 'تم التعيين',
  on_the_way: 'في الطريق',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتمل',
  cancelled: 'ملغي'
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  assigned: 'bg-purple-500',
  on_the_way: 'bg-orange-500',
  in_progress: 'bg-cyan-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500'
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'كاش',
  online: 'دفع إلكتروني'
};

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  single: 'غسيلة فردية',
  package: 'باقة'
};
