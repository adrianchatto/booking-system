'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, Mail, Phone, CheckCircle2, Loader2 } from 'lucide-react'
import { format, addDays, parseISO } from 'date-fns'
import { formatCurrency } from '@/lib/utils'

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number | string
}

interface BookingModalProps {
  tenantSlug: string
  services: Service[]
  primaryColor: string
  onClose: () => void
}

type Step = 'service' | 'datetime' | 'details' | 'confirm'

export default function BookingModal({ tenantSlug, services, primaryColor, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')

  const next7Days = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i + 1)
    return { value: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE dd MMM') }
  })

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchSlots()
    }
  }, [selectedDate, selectedService])

  async function fetchSlots() {
    setLoadingSlots(true)
    setAvailableSlots([])
    try {
      const res = await fetch(
        `/api/availability?tenantSlug=${tenantSlug}&date=${selectedDate}&serviceId=${selectedService!.id}`
      )
      const data = await res.json()
      setAvailableSlots(data)
    } catch {
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  async function handleSubmit() {
    if (!selectedService || !selectedDate || !selectedTime || !name || !email) return
    setSubmitting(true)
    setError('')
    try {
      const startTime = `${selectedDate}T${selectedTime}:00`
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug,
          serviceId: selectedService.id,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          startTime,
          notes,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong')
      } else {
        setConfirmed(true)
      }
    } catch {
      setError('Unable to complete booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const btnStyle = { backgroundColor: primaryColor }

  if (confirmed) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re booked in!</h3>
          <p className="text-gray-500 text-sm mb-1">
            {selectedService?.name} on {format(parseISO(selectedDate), 'EEEE dd MMMM')} at {selectedTime}
          </p>
          <p className="text-gray-400 text-xs mb-6">A confirmation has been sent to {email}</p>
          <button
            onClick={onClose}
            className="w-full text-white py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={btnStyle}
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">Book an Appointment</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 py-3 gap-2">
          {(['service', 'datetime', 'details'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${
                ['service', 'datetime', 'details'].indexOf(step) >= i ? '' : 'bg-gray-200'
              }`}
              style={['service', 'datetime', 'details'].indexOf(step) >= i ? { backgroundColor: primaryColor } : {}}
            />
          ))}
        </div>

        <div className="px-6 pb-6">
          {/* Step 1: Service */}
          {step === 'service' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">What service are you booking?</p>
              <div className="space-y-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => { setSelectedService(service); setStep('datetime') }}
                    className="w-full text-left p-4 rounded-xl border-2 transition-all hover:border-gray-300"
                    style={selectedService?.id === service.id ? { borderColor: primaryColor, backgroundColor: `${primaryColor}08` } : { borderColor: '#E5E7EB' }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        {service.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{service.duration} mins</p>
                      </div>
                      <span className="font-bold text-gray-900">{formatCurrency(service.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 'datetime' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">When would you like to come in?</p>
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Select a date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                  {next7Days.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => { setSelectedDate(d.value); setSelectedTime('') }}
                      className="flex-shrink-0 snap-start px-3 py-2 rounded-xl border-2 text-center transition-all"
                      style={selectedDate === d.value ? { borderColor: primaryColor, backgroundColor: `${primaryColor}10`, color: primaryColor } : { borderColor: '#E5E7EB', color: '#374151' }}
                    >
                      <p className="text-xs font-medium">{d.label.split(' ')[0]}</p>
                      <p className="text-sm font-bold">{d.label.split(' ')[1]}</p>
                      <p className="text-xs opacity-70">{d.label.split(' ')[2]}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Available times
                  </label>
                  {loadingSlots ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="w-6 h-6 animate-spin" style={{ color: primaryColor }} />
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No availability on this day</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.filter(s => s.available).map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot.time)}
                          className="py-2 px-1 rounded-lg border-2 text-sm font-medium transition-all"
                          style={selectedTime === slot.time ? { borderColor: primaryColor, backgroundColor: primaryColor, color: '#fff' } : { borderColor: '#E5E7EB', color: '#374151' }}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('service')} className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50">
                  Back
                </button>
                <button
                  onClick={() => setStep('details')}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 py-3 rounded-xl text-white font-semibold transition-opacity disabled:opacity-40"
                  style={btnStyle}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 'details' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Just a few details and you&apos;re all set.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.co.uk"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07700 900 000"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Any notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything useful for us to know..."
                    rows={2}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm">
                <p className="font-semibold text-gray-800">{selectedService?.name}</p>
                <p className="text-gray-500">{format(parseISO(selectedDate), 'EEEE dd MMMM')} at {selectedTime}</p>
                <p className="font-bold mt-1" style={{ color: primaryColor }}>{formatCurrency(selectedService?.price ?? 0)}</p>
              </div>

              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep('datetime')} className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !name || !email}
                  className="flex-1 py-3 rounded-xl text-white font-semibold transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                  style={btnStyle}
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
