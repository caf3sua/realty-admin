/**
 * Helper utilities for date extraction, sorting, and formatting in admin data grids.
 */

/**
 * Extracts a numeric timestamp (milliseconds) from an item based on its update date
 * or fallback to creation/publication date.
 */
export const getItemDateTimestamp = (item: any): number => {
  if (!item) return 0;

  // Order of priority: updatedAt / updated_at, then publishedAt, then createdAt / created_at
  const dateVal =
    item.updatedAt ||
    item.updated_at ||
    item.publishedAt ||
    item.createdAt ||
    item.created_at;

  if (!dateVal) return 0;
  const time = new Date(dateVal).getTime();
  return isNaN(time) ? 0 : time;
};

/**
 * Returns a new array sorted descending by update date (or creation date).
 */
export const sortByDateDesc = <T>(items: T[]): T[] => {
  return [...items].sort((a, b) => getItemDateTimestamp(b) - getItemDateTimestamp(a));
};

/**
 * Formats date into Vietnamese DD/MM/YYYY format.
 */
export const formatDateVN = (dateStr?: string | null): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return String(dateStr);
  }
};

/**
 * Formats date and time into Vietnamese DD/MM/YYYY HH:mm format.
 */
export const formatDateTimeVN = (dateStr?: string | null): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateStr);
  }
};
