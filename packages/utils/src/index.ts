export function formatEventDate(dateString: string | Date): string {
  try {
    const d = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(d.getTime())) return String(dateString);
    const months = [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık',
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month}, ${hours}:${minutes}`;
  } catch {
    return String(dateString);
  }
}

export function formatTimeAgo(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Şimdi';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} dk önce`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} gün önce`;
    return formatEventDate(date);
  } catch {
    return 'Az önce';
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumberCompact(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function sanitizeUsername(raw: string): string {
  let clean = raw.trim().replace(/^@/, '').toLowerCase();
  clean = clean.replace(/[^a-z0-9_.]/g, '');
  return clean;
}
