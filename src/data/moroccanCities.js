export const MOROCCAN_CITIES = [
  { name: 'Casablanca', nameAr: 'الدار البيضاء', region: 'Grand Casablanca', deliveryFee: 20, deliveryHours: '24h', expressAvailable: true },
  { name: 'Rabat', nameAr: 'الرباط', region: 'Rabat-Salé-Kénitra', deliveryFee: 25, deliveryHours: '24h-48h', expressAvailable: true },
  { name: 'Marrakech', nameAr: 'مراكش', region: 'Marrakech-Safi', deliveryFee: 35, deliveryHours: '24h-48h', expressAvailable: true },
  { name: 'Tanger', nameAr: 'طنجة', region: 'Tanger-Tétouan-Al Hoceïma', deliveryFee: 35, deliveryHours: '24h-48h', expressAvailable: true },
  { name: 'Fès', nameAr: 'فاس', region: 'Fès-Meknès', deliveryFee: 35, deliveryHours: '24h-48h', expressAvailable: true },
  { name: 'Agadir', nameAr: 'أكادير', region: 'Souss-Massa', deliveryFee: 35, deliveryHours: '48h', expressAvailable: true },
  { name: 'Meknès', nameAr: 'مكناس', region: 'Fès-Meknès', deliveryFee: 35, deliveryHours: '24h-48h', expressAvailable: true },
  { name: 'Salé', nameAr: 'سلا', region: 'Rabat-Salé-Kénitra', deliveryFee: 25, deliveryHours: '24h-48h', expressAvailable: true },
  { name: 'Kénitra', nameAr: 'القنيطرة', region: 'Rabat-Salé-Kénitra', deliveryFee: 30, deliveryHours: '24h-48h', expressAvailable: true },
  { name: 'Tétouan', nameAr: 'تطوان', region: 'Tanger-Tétouan-Al Hoceïma', deliveryFee: 35, deliveryHours: '48h', expressAvailable: true },
  { name: 'Oujda', nameAr: 'وجدة', region: 'Oriental', deliveryFee: 40, deliveryHours: '48h-72h', expressAvailable: false },
  { name: 'Mohammedia', nameAr: 'المحمدية', region: 'Grand Casablanca', deliveryFee: 25, deliveryHours: '24h', expressAvailable: true },
  { name: 'El Jadida', nameAr: 'الجديدة', region: 'Casablanca-Settat', deliveryFee: 35, deliveryHours: '24h-48h', expressAvailable: true },
  { name: 'Nador', nameAr: 'الناظور', region: 'Oriental', deliveryFee: 40, deliveryHours: '48h-72h', expressAvailable: false },
  { name: 'Safi', nameAr: 'آسفي', region: 'Marrakech-Safi', deliveryFee: 35, deliveryHours: '48h', expressAvailable: false },
  { name: 'Béni Mellal', nameAr: 'بني ملال', region: 'Béni Mellal-Khénifra', deliveryFee: 40, deliveryHours: '48h', expressAvailable: false },
  { name: 'Essaouira', nameAr: 'الصويرة', region: 'Marrakech-Safi', deliveryFee: 40, deliveryHours: '48h-72h', expressAvailable: false },
  { name: 'Taza', nameAr: 'تازة', region: 'Fès-Meknès', deliveryFee: 40, deliveryHours: '48h-72h', expressAvailable: false },
  { name: 'Dakhla', nameAr: 'الداخلة', region: 'Dakhla-Oued Ed-Dahab', deliveryFee: 45, deliveryHours: '72h', expressAvailable: false },
  { name: 'Laâyoune', nameAr: 'العيون', region: 'Laâyoune-Sakia El Hamra', deliveryFee: 45, deliveryHours: '72h', expressAvailable: false }
];

export const FREE_SHIPPING_THRESHOLD = 350; // MAD

export function validateMoroccanPhone(phone) {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-\(\)\.]/g, '');
  // Accepts 06XXXXXXXX, 07XXXXXXXX, 05XXXXXXXX, +2126XXXXXXXX, +2127XXXXXXXX
  const regex = /^(?:(?:\+|00)212|0)([5-7])\d{8}$/;
  return regex.test(clean);
}

export function formatMoroccanPhone(phone) {
  if (!phone) return '';
  const clean = phone.replace(/[\s\-\(\)\.]/g, '');
  if (clean.length === 10 && clean.startsWith('0')) {
    return `${clean.slice(0, 2)} ${clean.slice(2, 4)} ${clean.slice(4, 6)} ${clean.slice(8, 10)}`;
  }
  return phone;
}
