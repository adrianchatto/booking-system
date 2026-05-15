import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import WindowCleanerTheme from '@/components/themes/WindowCleanerTheme'
import HairdresserTheme from '@/components/themes/HairdresserTheme'
import PersonalTrainerTheme from '@/components/themes/PersonalTrainerTheme'
import PlumberTheme from '@/components/themes/PlumberTheme'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: params.slug, status: 'ACTIVE' },
    include: { settings: true },
  })
  if (!tenant) return { title: 'Not Found' }
  return {
    title: tenant.settings?.metaTitle ?? `${tenant.businessName} — Book Online`,
    description: tenant.settings?.metaDescription ?? tenant.settings?.description ?? `Book your appointment with ${tenant.businessName} online.`,
  }
}

export default async function TenantPage({ params }: Props) {
  // Reserve /admin for the super-admin
  if (params.slug === 'admin') return notFound()

  const tenant = await prisma.tenant.findUnique({
    where: { slug: params.slug, status: 'ACTIVE' },
    include: {
      settings: true,
      services: {
        where: { active: true },
        orderBy: { price: 'asc' },
      },
    },
  })

  if (!tenant) return notFound()

  switch (tenant.type) {
    case 'WINDOW_CLEANER':
      return <WindowCleanerTheme tenant={tenant} />
    case 'HAIRDRESSER':
      return <HairdresserTheme tenant={tenant} />
    case 'PERSONAL_TRAINER':
      return <PersonalTrainerTheme tenant={tenant} />
    case 'PLUMBER':
      return <PlumberTheme tenant={tenant} />
    default:
      return notFound()
  }
}
