'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import { BookingWithRelations } from '@/types'
import { Loader2, Phone, Mail, CheckCircle2, XCircle, RotateCcw, AlertTriangle } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-600 border-red-200',
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  NO_SHOW: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function BookingsPage() {
  const { slug } = useParams() as { slug: string }
  const [bookings, setBookings] = useState<BookingWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [updating, setUpdating] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState(slug)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    setLoading(true)
    const res = await fetch(`/api/bookings?tenantSlug=${slug}`)
    if (res.ok) {
      const data = await res.json()
      setBookings(data)
    }
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: status as any } : b))
    }
    setUpdating(null)
  }

  const filtered = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter)

  const statusCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar slug={slug} businessName={businessName} />
      <main className="flex-1 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and update all your appointments</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'PENDING', 'NO_SHOW'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  filter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {s === 'ALL' ? 'All' : s} {s !== 'ALL' && statusCounts[s] ? `(${statusCounts[s]})` : ''}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">No bookings found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left font-medium text-gray-500 px-5 py-3">Customer</th>
                      <th className="text-left font-medium text-gray-500 px-4 py-3">Contact</th>
                      <th className="text-left font-medium text-gray-500 px-4 py-3">Service</th>
                      <th className="text-left font-medium text-gray-500 px-4 py-3">Date & Time</th>
                      <th className="text-left font-medium text-gray-500 px-4 py-3">Value</th>
                      <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
                      <th className="text-left font-medium text-gray-500 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-gray-900">{booking.customer.name}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="space-y-0.5">
                            {booking.customer.phone && (
                              <a href={`tel:${booking.customer.phone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                                <Phone className="w-3 h-3" /> {booking.customer.phone}
                              </a>
                            )}
                            <a href={`mailto:${booking.customer.email}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                              <Mail className="w-3 h-3" /> {booking.customer.email}
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-700">{booking.service.name}</td>
                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{formatDateTime(booking.startTime)}</td>
                        <td className="px-4 py-3.5 font-semibold text-gray-900">{formatCurrency(booking.service.price)}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[booking.status]}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            {updating === booking.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                            ) : (
                              <>
                                {booking.status === 'CONFIRMED' && (
                                  <button
                                    onClick={() => updateStatus(booking.id, 'COMPLETED')}
                                    title="Mark Complete"
                                    className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                )}
                                {booking.status === 'CONFIRMED' && (
                                  <button
                                    onClick={() => updateStatus(booking.id, 'NO_SHOW')}
                                    title="Mark No Show"
                                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                  >
                                    <AlertTriangle className="w-4 h-4" />
                                  </button>
                                )}
                                {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                                  <button
                                    onClick={() => updateStatus(booking.id, 'CANCELLED')}
                                    title="Cancel"
                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                                {booking.status === 'CANCELLED' && (
                                  <button
                                    onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                                    title="Reinstate"
                                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
