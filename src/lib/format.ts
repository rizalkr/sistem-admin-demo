/**
 * Formatting and URL helpers for Berkah Jaya Konveksi demo dashboard.
 * Complies with design-taste-frontend app-screens rules (tabular figures, fixed units, exact decimal conventions).
 */

export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(rounded);
  return `Rp${formatted}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

const MONTH_NAMES_ID: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'Mei',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Agu',
  '09': 'Sep',
  '10': 'Okt',
  '11': 'Nov',
  '12': 'Des',
};

const FULL_MONTH_NAMES_ID: Record<string, string> = {
  '01': 'Januari',
  '02': 'Februari',
  '03': 'Maret',
  '04': 'April',
  '05': 'Mei',
  '06': 'Juni',
  '07': 'Juli',
  '08': 'Agustus',
  '09': 'September',
  '10': 'Oktober',
  '11': 'November',
  '12': 'Desember',
};

export function formatDateShortIndo(isoDate: string): string {
  if (!isoDate) return '-';
  const parts = isoDate.split('-');
  if (parts.length < 3) return isoDate;
  const day = parseInt(parts[2], 10);
  const month = MONTH_NAMES_ID[parts[1]] || parts[1];
  const year = parts[0];
  return `${day} ${month} ${year}`;
}

export function formatMonthYearIndo(yearMonth: string): string {
  if (!yearMonth) return '-';
  const parts = yearMonth.split('-');
  if (parts.length < 2) return yearMonth;
  const month = FULL_MONTH_NAMES_ID[parts[1]] || parts[1];
  return `${month} ${parts[0]}`;
}

export function formatDaysAgo(isoDate: string, referenceDate = '2026-11-04'): string {
  if (!isoDate) return '-';
  const dateObj = new Date(`${isoDate}T00:00:00Z`).getTime();
  const refObj = new Date(`${referenceDate}T00:00:00Z`).getTime();
  const diffDays = Math.round((refObj - dateObj) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Hari ini';
  if (diffDays === 1) return '1 hari lalu';
  return `${diffDays} hari lalu`;
}

export function formatWhatsappDisplay(raw: string): string {
  if (!raw) return '-';
  // format 081234567810 -> 0812-3456-7810
  const clean = raw.replace(/\D/g, '');
  if (clean.length === 12) {
    return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8)}`;
  }
  if (clean.length === 11) {
    return `${clean.slice(0, 4)}-${clean.slice(4, 7)}-${clean.slice(7)}`;
  }
  return clean;
}

export function getWhatsAppUrl(): string {
  const number = process.env.NEXT_PUBLIC_WA_NUMBER || '';
  const cleanNumber = number.replace(/\D/g, '');
  const message = encodeURIComponent(
    'Halo Nalar Solusi Digital, saya baru mencoba Demo Sistem Administrasi Berkah Jaya Konveksi dan ingin konsultasi sistem serupa.'
  );
  if (!cleanNumber) {
    return `https://wa.me/?text=${message}`;
  }
  return `https://wa.me/${cleanNumber}?text=${message}`;
}
