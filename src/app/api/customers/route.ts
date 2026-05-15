import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const tenantId = user.tenantId
  if (!tenantId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const customers = await prisma.customer.findMany({
    where: { tenantId },
    include: {
      bookings: {
        include: { service: true },
        orderBy: { startTime: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(customers)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const { id, name, email, phone, notes } = body

  const customer = await prisma.customer.findUnique({ where: { id } })
  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (customer.tenantId !== user.tenantId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const updated = await prisma.customer.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  })

  return NextResponse.json(updated)
}
