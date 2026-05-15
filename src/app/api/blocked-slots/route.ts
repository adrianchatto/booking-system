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

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const slots = await prisma.blockedSlot.findMany({
    where: {
      tenantId,
      ...(from && to ? {
        startTime: { gte: new Date(from) },
        endTime: { lte: new Date(to) },
      } : {}),
    },
    orderBy: { startTime: 'asc' },
  })

  return NextResponse.json(slots)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const tenantId = user.tenantId
  if (!tenantId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { startTime, endTime, reason } = body

  if (!startTime || !endTime) {
    return NextResponse.json({ error: 'startTime and endTime required' }, { status: 400 })
  }

  const slot = await prisma.blockedSlot.create({
    data: {
      tenantId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      reason,
    },
  })

  return NextResponse.json(slot, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const slot = await prisma.blockedSlot.findUnique({ where: { id } })
  if (!slot) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (slot.tenantId !== user.tenantId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.blockedSlot.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
