import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { addMinutes } from 'date-fns'

// GET /api/bookings?tenantSlug=xxx — returns bookings for a tenant
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const tenantSlug = searchParams.get('tenantSlug')

  const user = session.user as any
  let tenantId: string | null = null

  if (user.role === 'SUPER_ADMIN') {
    if (tenantSlug) {
      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } })
      tenantId = tenant?.id ?? null
    }
  } else {
    tenantId = user.tenantId
  }

  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

  const statusFilter = searchParams.get('status')
  const bookings = await prisma.booking.findMany({
    where: {
      tenantId,
      ...(statusFilter ? { status: statusFilter as any } : {}),
    },
    include: { customer: true, service: true },
    orderBy: { startTime: 'asc' },
  })

  return NextResponse.json(bookings)
}

// POST /api/bookings — public, used by chatbot and booking form
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { tenantSlug, serviceId, customerName, customerEmail, customerPhone, startTime, notes } = body

  if (!tenantSlug || !serviceId || !customerName || !customerEmail || !startTime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug, status: 'ACTIVE' },
  })
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

  const service = await prisma.service.findFirst({
    where: { id: serviceId, tenantId: tenant.id, active: true },
  })
  if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

  const bookingStart = new Date(startTime)
  const bookingEnd = addMinutes(bookingStart, service.duration)

  // Check for conflicts
  const conflict = await prisma.booking.findFirst({
    where: {
      tenantId: tenant.id,
      status: { in: ['CONFIRMED', 'PENDING'] },
      OR: [
        { startTime: { gte: bookingStart, lt: bookingEnd } },
        { endTime: { gt: bookingStart, lte: bookingEnd } },
        { startTime: { lte: bookingStart }, endTime: { gte: bookingEnd } },
      ],
    },
  })
  if (conflict) return NextResponse.json({ error: 'That time slot is no longer available' }, { status: 409 })

  const blockedConflict = await prisma.blockedSlot.findFirst({
    where: {
      tenantId: tenant.id,
      OR: [
        { startTime: { gte: bookingStart, lt: bookingEnd } },
        { endTime: { gt: bookingStart, lte: bookingEnd } },
        { startTime: { lte: bookingStart }, endTime: { gte: bookingEnd } },
      ],
    },
  })
  if (blockedConflict) return NextResponse.json({ error: 'That time slot is not available' }, { status: 409 })

  // Upsert customer
  let customer = await prisma.customer.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email: customerEmail } },
  })
  if (!customer) {
    customer = await prisma.customer.create({
      data: { tenantId: tenant.id, name: customerName, email: customerEmail, phone: customerPhone },
    })
  }

  const booking = await prisma.booking.create({
    data: {
      tenantId: tenant.id,
      customerId: customer.id,
      serviceId: service.id,
      startTime: bookingStart,
      endTime: bookingEnd,
      notes,
    },
    include: { customer: true, service: true },
  })

  return NextResponse.json(booking, { status: 201 })
}
