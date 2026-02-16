export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'admin' | 'worker';
export type CarCategory = 'standard' | 'suv' | 'luxury';
export type OrderStatus = 'pending' | 'confirmed' | 'assigned' | 'on_the_way' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderType = 'single' | 'package';
export type DiscountType = 'percentage' | 'fixed';

// Generic type for partial selects
export type PartialSelect<T> = {
  [K in keyof T]?: T[K] extends object ? PartialSelect<T[K]> : T[K];
};

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string;
          email: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone: string;
          email?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string;
          email?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      cars: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          brand: string;
          model: string;
          year?: number | null;
          color?: string | null;
          plate_number?: string | null;
          category?: CarCategory;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          brand?: string;
          model?: string;
          year?: number | null;
          color?: string | null;
          plate_number?: string | null;
          category?: CarCategory;
          is_active?: boolean;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name_ar: string;
          name_en: string | null;
          description: string | null;
          base_price_standard: number;
          base_price_suv: number;
          base_price_luxury: number;
          duration_minutes: number | null;
          features: Json | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_ar: string;
          name_en?: string | null;
          description?: string | null;
          base_price_standard: number;
          base_price_suv: number;
          base_price_luxury: number;
          duration_minutes?: number | null;
          features?: Json | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_ar?: string;
          name_en?: string | null;
          description?: string | null;
          base_price_standard?: number;
          base_price_suv?: number;
          base_price_luxury?: number;
          duration_minutes?: number | null;
          features?: Json | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      packages: {
        Row: {
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
          benefits: Json | null;
          is_popular: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_ar: string;
          name_en?: string | null;
          description?: string | null;
          washes_per_month: number;
          price_standard: number;
          price_suv: number;
          price_luxury: number;
          includes_steaming?: number;
          includes_polishing?: number;
          benefits?: Json | null;
          is_popular?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_ar?: string;
          name_en?: string | null;
          description?: string | null;
          washes_per_month?: number;
          price_standard?: number;
          price_suv?: number;
          price_luxury?: number;
          includes_steaming?: number;
          includes_polishing?: number;
          benefits?: Json | null;
          is_popular?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
      };
      add_ons: {
        Row: {
          id: string;
          name_ar: string;
          name_en: string | null;
          description: string | null;
          price: number;
          duration_minutes: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_ar: string;
          name_en?: string | null;
          description?: string | null;
          price: number;
          duration_minutes?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_ar?: string;
          name_en?: string | null;
          description?: string | null;
          price?: number;
          duration_minutes?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          car_id: string;
          service_id?: string | null;
          package_id?: string | null;
          order_type?: OrderType;
          base_price: number;
          category_multiplier?: number;
          add_ons_total?: number;
          discount_amount?: number;
          total_amount: number;
          address: string;
          google_maps_link?: string | null;
          preferred_date: string;
          preferred_time: string;
          status?: OrderStatus;
          worker_id?: string | null;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          customer_notes?: string | null;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          car_id?: string;
          service_id?: string | null;
          package_id?: string | null;
          order_type?: OrderType;
          base_price?: number;
          category_multiplier?: number;
          add_ons_total?: number;
          discount_amount?: number;
          total_amount?: number;
          address?: string;
          google_maps_link?: string | null;
          preferred_date?: string;
          preferred_time?: string;
          status?: OrderStatus;
          worker_id?: string | null;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          customer_notes?: string | null;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_add_ons: {
        Row: {
          id: string;
          order_id: string;
          add_on_id: string;
          price_at_time: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          add_on_id: string;
          price_at_time: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          add_on_id?: string;
          price_at_time?: number;
        };
      };
      workers: {
        Row: {
          id: string;
          user_id: string;
          employee_id: string | null;
          is_active: boolean;
          rating: number;
          total_jobs: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          employee_id?: string | null;
          is_active?: boolean;
          rating?: number;
          total_jobs?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          employee_id?: string | null;
          is_active?: boolean;
          rating?: number;
          total_jobs?: number;
          created_at?: string;
        };
      };
      offers: {
        Row: {
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
        };
        Insert: {
          id?: string;
          code?: string | null;
          title_ar: string;
          description?: string | null;
          discount_type?: DiscountType | null;
          discount_value?: number | null;
          min_order_amount?: number;
          max_uses?: number | null;
          current_uses?: number;
          valid_from?: string | null;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string | null;
          title_ar?: string;
          description?: string | null;
          discount_type?: DiscountType | null;
          discount_value?: number | null;
          min_order_amount?: number;
          max_uses?: number | null;
          current_uses?: number;
          valid_from?: string | null;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          status: OrderStatus;
          changed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: OrderStatus;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          status?: OrderStatus;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          order_id: string;
          worker_id: string;
          customer_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          worker_id: string;
          customer_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          worker_id?: string;
          customer_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
