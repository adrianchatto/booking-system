import { Tenant, TenantSettings, Service, Customer, Booking, BlockedSlot, TenantType, TenantStatus, BookingStatus } from '@prisma/client'

export type { TenantType, TenantStatus, BookingStatus }

export type TenantWithSettings = Tenant & {
  settings: TenantSettings | null
  services: Service[]
}

export type BookingWithRelations = Booking & {
  customer: Customer
  service: Service
}

export type CustomerWithBookings = Customer & {
  bookings: (Booking & { service: Service })[]
}

export type OpeningHours = {
  [key: string]: {
    open: string
    close: string
    enabled: boolean
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface BookingRequest {
  tenantSlug: string
  serviceId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  startTime: string
  notes?: string
}

export interface AvailabilitySlot {
  time: string
  available: boolean
}

export interface SessionUser {
  id: string
  email: string
  name: string
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN'
  tenantId: string | null
  tenantSlug: string | null
}
