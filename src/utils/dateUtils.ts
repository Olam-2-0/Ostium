/**
 * Dynamic date utilities for MindVibe.
 * All calculations derive from `new Date()` and use normalized YYYY-MM-DD strings.
 */

export function toISODateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function todayISO(): string {
  return toISODateString(new Date());
}

export function addDays(date: Date | string, amount: number): string {
  const d = typeof date === 'string' ? parseISODate(date) : new Date(date.getTime());
  d.setDate(d.getDate() + amount);
  return toISODateString(d);
}

export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = typeof date1 === 'string' ? date1 : toISODateString(date1);
  const d2 = typeof date2 === 'string' ? date2 : toISODateString(date2);
  return d1 === d2;
}

export function isToday(dateStr: string): boolean {
  return isSameDay(dateStr, todayISO());
}

export function isYesterday(dateStr: string): boolean {
  const yesterday = addDays(new Date(), -1);
  return isSameDay(dateStr, yesterday);
}

export function isTomorrow(dateStr: string): boolean {
  const tomorrow = addDays(new Date(), 1);
  return isSameDay(dateStr, tomorrow);
}

export function daysBetween(date1: string, date2: string): number {
  const d1 = parseISODate(date1);
  const d2 = parseISODate(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseISODate(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseISODate(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatFullDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseISODate(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getGreeting(name: string): { greeting: string; period: 'Morning' | 'Afternoon' | 'Evening' } {
  const hour = new Date().getHours();
  if (hour < 12) {
    return { greeting: `Good morning, ${name} 👋`, period: 'Morning' };
  } else if (hour < 18) {
    return { greeting: `Good afternoon, ${name} 👋`, period: 'Afternoon' };
  } else {
    return { greeting: `Good evening, ${name} 👋`, period: 'Evening' };
  }
}

/**
 * Returns an array of ISO dates for the last N days (including today), in chronological order.
 */
export function getLastNDaysISO(n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    dates.push(addDays(new Date(), -i));
  }
  return dates;
}
