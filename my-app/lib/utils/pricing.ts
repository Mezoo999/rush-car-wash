import { CarCategory, CATEGORY_MULTIPLIERS, Service, AddOn } from '@/types';

export function calculateServicePrice(
  service: Service,
  category: CarCategory
): number {
  switch (category) {
    case 'suv':
      return service.base_price_suv;
    case 'luxury':
      return service.base_price_luxury;
    default:
      return service.base_price_standard;
  }
}

export function calculateAddOnsTotal(addOns: AddOn[]): number {
  return addOns.reduce((total, addon) => total + addon.price, 0);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

export function formatPriceWithCurrency(price: number): string {
  return `${formatPrice(price)} ج.م`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'م' : 'ص';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
}

export function formatDateTime(dateString: string, timeString: string): string {
  return `${formatDate(dateString)} - ${formatTime(timeString)}`;
}

export function getCategoryMultiplier(category: CarCategory): number {
  return CATEGORY_MULTIPLIERS[category];
}

export function calculateDiscount(
  total: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number {
  if (discountType === 'percentage') {
    return Math.round((total * discountValue) / 100);
  }
  return discountValue;
}

export function generateOrderId(): string {
  const prefix = 'LAM';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getYearsRange(start: number = 1990, end: number = getCurrentYear()): number[] {
  const years: number[] = [];
  for (let year = end; year >= start; year--) {
    years.push(year);
  }
  return years;
}

export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export function getMaxBookingDate(daysAhead: number = 30): string {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + daysAhead);
  return maxDate.toISOString().split('T')[0];
}
