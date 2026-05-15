'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO, addMinutes } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, X, Loader2 } from 'lucide-react'
import { BookingWithRelations } from '@/types'

interface BlockedSlot {
  id: string
  startTime: string
  endTime: string
  reason: string | null
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 07:00 – 20:00

export default function CalendarPage() {
  const { slug } = useParams() as { slug: string }
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [bookings, setBookings] = useState<BookingWithRelations[]>([])
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [blockingSlot, setBlockingSlot] = useState<{ date: string; hour: number } | null>(null)
  const [blockReason, setBlockReason] = useState('')
  const [saving, setSaving] = useState(false)
  const businessName = slug

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))
  const weekEnd = addDays(currentWeekStart, 6)

  useEffect(() => {
    fetchData()
  }, [currentWeekStart])

  async function fetchData() {
    setLoading(true)
    const from = currentWeekStart.toISOString()
    const to = weekEnd.toISOString()
    const [bRes, blRes] = await Promise.all([
      fetch(`/api/bookings?tenantSlug=${slug}`),
      fetch(`/api/blocked-slots?from=${from}&to=${to}`),
    ])
    if (bRes.ok) setBookings(await bRes.json())
    if (blRes.ok) setBlockedSlots(await blRes.json())
    setLoading(false)
  }

  async function addBlock() {
    if (!blockingSlot) return
    setSaving(true)
    const startTime = new Date(blockingSlot.date)
    startTime.setHours(blockingSlot.hour, 0, 0, 0)
    const endTime = addMinutes(startTime, 60)
    const res = await fetch('/api/blocked-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startTime: startTime.toISOString(), endTime: endTime.toISOString(), reason: blockReason || null }),
    })
    if (res.ok) {
      const slot = await res.json()
      setBlockedSlots((prev) => [...prev, slot])
    }
    setBlockingSlot(null)
    setBlockReason('')
    setSaving(false)
  }

  async function removeBlock(id: string) {
    await fetch(`/api/blocked-slots?id=${id}`, { method: 'DELETE' })
    setBlockedSlots((prev) => prev.filter((s) => s.id !== id))
  }

  function getBookingsForSlot(day: Date, hour: number) {
    return bookings.filter((b) => {
      const start = new Date(b.startTime)
      return isSameDay(start, day) && start.getHours() === hour && b.status !== 'CANCELLED'
    })
  }

  function getBlocksForSlot(day: Date, hour: number) {
    return blockedSlots.filter((s) => {
      const start = new Date(s.startTime)
      return isSameDay(start, day) && start.getHours() === hour
    })
  }

  const STATUS_COLORS: Record<string, string> = {
    CONFIRMED: 'bg-blue-100 border-l-2 border-blue-500 text-blue-800',
    COMPLETED: 'bg-green-100 border-l-2 border-green-500 text-green-800',
    PENDING: 'bg-yellow-100 border-l-2 border-yellow-500 text-yellow-800',
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar slug={slug} businessName={businessName} />
      <main className="flex-1 pt-14 md:pt-0">
        <div className="max-w-full px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
              <p className="text-gray-500 text-sm mt-1">View bookings and block out unavailable time</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentWeekStart((w) => subWeeks(w, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-36 text-center">
                {format(currentWeekStart, 'dd MMM')} – {format(weekEnd, 'dd MMM yyyy')}
              </span>
              <button onClick={() => setCurrentWeekStart((w) => addWeeks(w, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Today
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Day headers */}
              <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
                <div className="border-r border-gray-100" />
                {weekDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className={`px-2 py-3 text-center border-r border-gray-100 last:border-r-0 ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}`}
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{format(day, 'EEE')}</p>
                    <p className={`text-sm font-bold mt-0.5 ${isSameDay(day, new Date()) ? 'text-blue-600' : 'text-gray-700'}`}>
                      {format(day, 'd')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Time grid */}
              <div className="overflow-y-auto max-h-[560px]">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="grid border-b border-gray-50"
                    style={{ gridTemplateColumns: '56px repeat(7, 1fr)', minHeight: '60px' }}
                  >
                    <div className="border-r border-gray-100 px-2 py-1">
                      <span className="text-xs text-gray-400">{hour.toString().padStart(2, '0')}:00</span>
                    </div>
                    {weekDays.map((day) => {
                      const slotBookings = getBookingsForSlot(day, hour)
                      const slotBlocks = getBlocksForSlot(day, hour)
                      return (
                        <div
                          key={day.toISOString()}
                          className="border-r border-gray-50 last:border-r-0 p-1 min-h-[60px] cursor-pointer hover:bg-gray-50 transition-colors group relative"
                          onClick={() => {
                            if (slotBookings.length === 0 && slotBlocks.length === 0) {
                              setBlockingSlot({ date: format(day, 'yyyy-MM-dd'), hour })
                            }
                          }}
                        >
                          {slotBlocks.map((block) => (
                            <div key={block.id} className="relative bg-gray-200 rounded px-1.5 py-1 text-xs text-gray-600 mb-0.5 group/block">
                              <span>Blocked{block.reason ? `: ${block.reason}` : ''}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); removeBlock(block.id) }}
                                className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-gray-400 text-white flex items-center justify-center opacity-0 group-hover/block:opacity-100 transition-opacity"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </div>
                          ))}
                          {slotBookings.map((booking) => (
                            <div
                              key={booking.id}
                              className={`rounded px-1.5 py-1 text-xs mb-0.5 truncate ${STATUS_COLORS[booking.status] ?? 'bg-gray-100 text-gray-700'}`}
                            >
                              <p className="font-medium truncate">{booking.customer.name}</p>
                              <p className="truncate opacity-70">{booking.service.name}</p>
                            </div>
                          ))}
                          {slotBookings.length === 0 && slotBlocks.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="w-4 h-4 text-gray-300" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Block slot modal */}
          {blockingSlot && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <h3 className="font-bold text-gray-900 mb-1">Block This Time</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {blockingSlot.date} at {blockingSlot.hour.toString().padStart(2, '0')}:00 – {(blockingSlot.hour + 1).toString().padStart(2, '0')}:00
                </p>
                <input
                  type="text"
                  placeholder="Reason (optional, e.g. Lunch break)"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3">
                  <button onClick={() => { setBlockingSlot(null); setBlockReason('') }} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={addBlock}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Block Slot
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
