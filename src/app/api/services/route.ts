import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tenantSlug = searchParams.get('tenantSlug')
  if (!tenantSlug) return NextResponse.json({ error: 'tenantSlug required' }, { status: 400 })

  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } })
  if (!tenant) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const services = await prisma.service.findMany({
    where: { tenantId: tenant.id, active: true },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(services)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const { name, description, duration, price } = body
  const tenantId = user.tenantId

  if (!tenantId || !name || !duration || price === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const service = await prisma.service.create({
    data: { tenantId, name, description, duration: Number(duration), price: Number(price) },
  })

  return NextResponse.json(service, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const { id, name, description, duration, price, active } = body

  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (service.tenantId !== user.tenantId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const updated = await prisma.service.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(duration ? { duration: Number(duration) } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(active !== undefined ? { active } : {}),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (service.tenantId !== user.tenantId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.service.update({ where: { id }, data: { active: false } })
  return NextResponse.json({ success: true })
}
