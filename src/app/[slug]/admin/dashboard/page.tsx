import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/admin/Sidebar'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { BookOpen, Users, TrendingUp, Clock, Calendar } from 'lucide-react'
import { startOfMonth, endOfMonth } from 'date-fns'
import Link from 'next/link'

export default async function TenantDashboard({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session || user?.role !== 'TENANT_ADMIN' || user?.tenantSlug !== params.slug) {
    redirect(`/${params.slug}/admin/login`)
  }

  const tenantId = user.tenantId
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const [tenant, bookingsThisMonth, upcomingToday, totalCustomers, recentBookings] = await Promise.all([
    prisma.tenant.findUnique({ where: { id: tenantId }, include: { settings: true } }),
    prisma.booking.count({ where: { tenantId, startTime: { gte: monthStart, lte: monthEnd }, status: { in: ['CONFIRMED', 'COMPLETED'] } } }),
    prisma.booking.count({
      where: {
        tenantId,
        startTime: { gte: new Date(now.setHours(0,0,0,0)), lte: new Date(now.setHours(23,59,59,999)) },
        status: 'CONFIRMED',
      },
    }),
    prisma.customer.count({ where: { tenantId } }),
    prisma.booking.findMany({
      where: { tenantId },
      include: { customer: true, service: true },
      orderBy: { startTime: 'desc' },
      take: 8,
    }),
  ])

  // Revenue this month
  const completedBookings = await prisma.booking.findMany({
    where: { tenantId, startTime: { gte: monthStart, lte: monthEnd }, status: 'COMPLETED' },
    include: { service: true },
  })
  const revenueThisMonth = completedBookings.reduce((sum, b) => sum + Number(b.service.price), 0)

  const stats = [
    { label: 'Bookings This Month', value: bookingsThisMonth.toString(), icon: <BookOpen className="w-5 h-5" />, color: 'blue' },
    { label: 'Today\'s Appointments', value: upcomingToday.toString(), icon: <Calendar className="w-5 h-5" />, color: 'green' },
    { label: 'Total Customers', value: totalCustomers.toString(), icon: <Users className="w-5 h-5" />, color: 'purple' },
    { label: 'Revenue This Month', value: formatCurrency(revenueThisMonth), icon: <TrendingUp className="w-5 h-5" />, color: 'amber' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    NO_SHOW: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar slug={params.slug} businessName={tenant?.businessName ?? params.slug} />
      <main className="flex-1 md:ml-0 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user.name?.split(' ')[0]}</h1>
            <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening with {tenant?.businessName} today.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[stat.color]}`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent bookings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
              <Link href={`/${params.slug}/admin/dashboard/bookings`} className="text-sm text-blue-600 hover:underline">
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Customer</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Service</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Date & Time</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-gray-900">{booking.customer.name}</p>
                        <p className="text-xs text-gray-400">{booking.customer.phone ?? booking.customer.email}</p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">{booking.service.name}</td>
                      <td className="px-4 py-3.5 text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {formatDateTime(booking.startTime)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentBookings.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">No bookings yet</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
