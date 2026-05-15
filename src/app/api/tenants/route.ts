import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session || user?.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const tenants = await prisma.tenant.findMany({
    include: {
      settings: true,
      _count: { select: { bookings: true, customers: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(tenants)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session || user?.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { businessName, slug, type, adminEmail, adminName, adminPassword } = body

  if (!businessName || !slug || !type || !adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const existing = await prisma.tenant.findUnique({ where: { slug } })
  if (existing) return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })

  const hashedPw = await bcrypt.hash(adminPassword, 10)

  const defaultSettings: Record<string, any> = {
    WINDOW_CLEANER: { primaryColor: '#0EA5E9', secondaryColor: '#0369A1', accentColor: '#38BDF8', tagline: 'Professional window cleaning you can trust' },
    HAIRDRESSER: { primaryColor: '#BE185D', secondaryColor: '#831843', accentColor: '#F9A8D4', tagline: 'Where style meets precision' },
    PERSONAL_TRAINER: { primaryColor: '#DC2626', secondaryColor: '#7F1D1D', accentColor: '#F97316', tagline: 'Achieve your fitness goals' },
    PLUMBER: { primaryColor: '#1D4ED8', secondaryColor: '#1E3A8A', accentColor: '#F97316', tagline: 'Fast, reliable, fixed right first time' },
  }

  const tenant = await prisma.tenant.create({
    data: {
      businessName,
      slug,
      type,
      settings: {
        create: { ...defaultSettings[type] },
      },
      users: {
        create: {
          email: adminEmail,
          name: adminName ?? adminEmail.split('@')[0],
          password: hashedPw,
        },
      },
    },
    include: { settings: true },
  })

  return NextResponse.json(tenant, { status: 201 })
}
