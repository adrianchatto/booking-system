import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addMinutes, format, parseISO, startOfDay, endOfDay, getDay } from 'date-fns'
import { OpeningHours } from '@/types'

const DAY_MAP = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tenantSlug = searchParams.get('tenantSlug')
  const date = searchParams.get('date')
  const serviceId = searchParams.get('serviceId')

  if (!tenantSlug || !date || !serviceId) {
    return NextResponse.json({ error: 'tenantSlug, date, and serviceId are required' }, { status: 400 })
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug, status: 'ACTIVE' },
    include: { settings: true },
  })
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

  const targetDate = parseISO(date)
  const dayName = DAY_MAP[getDay(targetDate)]
  const openingHours = tenant.settings?.openingHours as OpeningHours | null

  if (!openingHours) return NextResponse.json([])

  const dayHours = openingHours[dayName]
  if (!dayHours?.enabled) return NextResponse.json([])

  // Get existing bookings and blocked slots for that day
  const dayStart = startOfDay(targetDate)
  const dayEnd = endOfDay(targetDate)

  const [existingBookings, blockedSlots] = await Promise.all([
    prisma.booking.findMany({
      where: {
        tenantId: tenant.id,
        status: { in: ['CONFIRMED', 'PENDING'] },
        startTime: { gte: dayStart, lte: dayEnd },
      },
    }),
    prisma.blockedSlot.findMany({
      where: {
        tenantId: tenant.id,
        startTime: { gte: dayStart, lte: dayEnd },
      },
    }),
  ])

  // Generate 30-min slots during opening hours
  const [openH, openM] = dayHours.open.split(':').map(Number)
  const [closeH, closeM] = dayHours.close.split(':').map(Number)

  const slots: { time: string; available: boolean }[] = []
  let current = new Date(targetDate)
  current.setHours(openH, openM, 0, 0)
  const closeTime = new Date(targetDate)
  closeTime.setHours(closeH, closeM, 0, 0)

  while (addMinutes(current, service.duration) <= closeTime) {
    const slotEnd = addMinutes(current, service.duration)
    const slotStart = new Date(current)

    const hasConflict =
      existingBookings.some(
        (b) =>
          (slotStart >= b.startTime && slotStart < b.endTime) ||
          (slotEnd > b.startTime && slotEnd <= b.endTime) ||
          (slotStart <= b.startTime && slotEnd >= b.endTime)
      ) ||
      blockedSlots.some(
        (b) =>
          (slotStart >= b.startTime && slotStart < b.endTime) ||
          (slotEnd > b.startTime && slotEnd <= b.endTime) ||
          (slotStart <= b.startTime && slotEnd >= b.endTime)
      )

    slots.push({ time: format(current, 'HH:mm'), available: !hasConflict })
    current = addMinutes(current, 30)
  }

  return NextResponse.json(slots)
}
