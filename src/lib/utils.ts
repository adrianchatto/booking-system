import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'dd/MM/yyyy')
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

export function formatTime(date: Date | string): string {
  return format(new Date(date), 'HH:mm')
}

export function formatCurrency(amount: number | string): string {
  return `£${Number(amount).toFixed(2)}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function tenantTypeLabel(type: string): string {
  const map: Record<string, string> = {
    WINDOW_CLEANER: 'Window Cleaner',
    HAIRDRESSER: 'Hairdresser / Salon',
    PERSONAL_TRAINER: 'Personal Trainer',
    PLUMBER: 'Plumber',
  }
  return map[type] ?? type
}

export function generateTimeSlots(
  openTime: string,
  closeTime: string,
  durationMinutes: number,
): string[] {
  const slots: string[] = []
  const [openH, openM] = openTime.split(':').map(Number)
  const [closeH, closeM] = closeTime.split(':').map(Number)
  let current = openH * 60 + openM
  const end = closeH * 60 + closeM
  while (current + durationMinutes <= end) {
    const h = Math.floor(current / 60).toString().padStart(2, '0')
    const m = (current % 60).toString().padStart(2, '0')
    slots.push(`${h}:${m}`)
    current += durationMinutes
  }
  return slots
}

export const DAYS_OF_WEEK = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}
