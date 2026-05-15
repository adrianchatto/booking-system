import { SessionProvider } from '@/components/admin/SessionProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface Props {
  children: React.ReactNode
  params: { slug: string }
}

export default async function TenantAdminLayout({ children, params }: Props) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
