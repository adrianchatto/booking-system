'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import { formatDate, formatCurrency } from '@/lib/utils'
import { CustomerWithBookings } from '@/types'
import { Loader2, Phone, Mail, ChevronDown, ChevronRight, Search } from 'lucide-react'

export default function CustomersPage() {
  const { slug } = useParams() as { slug: string }
  const [customers, setCustomers] = useState<CustomerWithBookings[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/customers')
      .then((r) => r.json())
      .then((d) => { setCustomers(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone ?? '').includes(search)
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar slug={slug} businessName={slug} />
      <main className="flex-1 pt-14 md:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-500 text-sm mt-1">{customers.length} total customers</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
          ) : (
            <div className="space-y-2">
              {filtered.map((customer) => {
                const isOpen = expanded === customer.id
                const totalSpend = customer.bookings
                  .filter((b) => b.status === 'COMPLETED')
                  .reduce((sum, b) => sum + Number(b.service.price), 0)
                const lastBooking = customer.bookings[0]

                return (
                  <div key={customer.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setExpanded(isOpen ? null : customer.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                        {customer.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{customer.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <a href={`mailto:${customer.email}`} onClick={(e) => e.stopPropagation()} className="text-xs text-gray-400 hover:text-blue-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {customer.email}
                          </a>
                          {customer.phone && (
                            <a href={`tel:${customer.phone}`} onClick={(e) => e.stopPropagation()} className="text-xs text-gray-400 hover:text-blue-600 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {customer.phone}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-6 text-right flex-shrink-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{customer.bookings.length}</p>
                          <p className="text-xs text-gray-400">bookings</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{formatCurrency(totalSpend)}</p>
                          <p className="text-xs text-gray-400">total spend</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{lastBooking ? formatDate(lastBooking.startTime) : '—'}</p>
                          <p className="text-xs text-gray-400">last visit</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-gray-100 px-5 py-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Booking History</p>
                        {customer.bookings.length === 0 ? (
                          <p className="text-sm text-gray-400">No bookings yet</p>
                        ) : (
                          <div className="space-y-2">
                            {customer.bookings.map((booking) => (
                              <div key={booking.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{booking.service.name}</p>
                                  <p className="text-xs text-gray-400">{formatDate(booking.startTime)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold text-gray-700">{formatCurrency(booking.service.price)}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                    booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-3">
                          {customer.phone && (
                            <a href={`tel:${customer.phone}`} className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                              <Phone className="w-3.5 h-3.5" /> Call
                            </a>
                          )}
                          <a href={`mailto:${customer.email}`} className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                            <Mail className="w-3.5 h-3.5" /> Email
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No customers found</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
