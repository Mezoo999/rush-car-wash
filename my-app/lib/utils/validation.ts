// Egyptian phone number validation and formatting

export const EGYPT_PHONE_REGEX = /^\+20[0-9]{10}$/;
export const EGYPT_PHONE_REGEX_LOCAL = /^(01)[0-9]{9}$/;

/**
 * Validates if a phone number is in correct Egyptian format
 * Accepts: +201031564146 or 01031564146
 */
export function validateEgyptianPhone(phone: string): boolean {
  const cleanPhone = phone.trim();
  return EGYPT_PHONE_REGEX.test(cleanPhone) || EGYPT_PHONE_REGEX_LOCAL.test(cleanPhone);
}

/**
 * Formats a phone number to international format
 * Input: 01031564146 or +201031564146
 * Output: +201031564146
 */
export function formatPhoneToInternational(phone: string): string {
  const cleanPhone = phone.trim().replace(/\s/g, '');
  
  // If already in international format
  if (cleanPhone.startsWith('+20')) {
    return cleanPhone;
  }
  
  // If starts with 0, replace with +20
  if (cleanPhone.startsWith('0')) {
    return '+20' + cleanPhone.substring(1);
  }
  
  // If starts with 2 (without +), add +
  if (cleanPhone.startsWith('2')) {
    return '+' + cleanPhone;
  }
  
  // Otherwise assume it needs +20 prefix
  return '+20' + cleanPhone;
}

/**
 * Formats phone for display
 * Input: +201031564146
 * Output: +20 103 156 4146
 */
export function formatPhoneForDisplay(phone: string): string {
  const cleanPhone = formatPhoneToInternational(phone);
  
  if (cleanPhone.length === 13) { // +20 + 10 digits
    return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 9)} ${cleanPhone.slice(9)}`;
  }
  
  return cleanPhone;
}

/**
 * Creates WhatsApp click-to-chat link
 */
export function createWhatsAppLink(phone: string, message?: string): string {
  const formattedPhone = formatPhoneToInternational(phone).replace('+', '');
  const baseUrl = `https://wa.me/${formattedPhone}`;
  
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  
  return baseUrl;
}

/**
 * Creates pre-filled WhatsApp message for order confirmation
 */
export function createOrderWhatsAppMessage(orderDetails: {
  orderId: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  address: string;
  total: number;
}): string {
  return `مرحباً لمعة،

أريد تأكيد طلبي رقم: #${orderDetails.orderId.slice(-6)}

الاسم: ${orderDetails.customerName}
الخدمة: ${orderDetails.service}
التاريخ: ${orderDetails.date}
الوقت: ${orderDetails.time}
العنوان: ${orderDetails.address}
الإجمالي: ${orderDetails.total} جنيه

شكراً!`;
}
