'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Clock, Phone, Mail, MapPin, Instagram, Scissors } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import ChatBot from '@/components/ChatBot'
import BookingModal from '@/components/BookingModal'
import { TenantWithSettings } from '@/types'

interface Props {
  tenant: TenantWithSettings
}

const TEAM = [
  { name: 'Emma', role: 'Senior Stylist & Owner', bio: '12 years experience. Specialist in colour and balayage.' },
  { name: 'Jade', role: 'Colour Technician', bio: 'Trained in London. Expert in creative colour and fashion shades.' },
  { name: 'Mia', role: 'Stylist', bio: 'Passionate about precision cuts and blowdries. Newly qualified.' },
]

export default function HairdresserTheme({ tenant }: Props) {
  const [showBooking, setShowBooking] = useState(false)
  const settings = tenant.settings
  const primary = settings?.primaryColor ?? '#BE185D'
  const secondary = settings?.secondaryColor ?? '#831843'
  const accent = settings?.accentColor ?? '#F9A8D4'

  const openingHours = settings?.openingHours as Record<string, { open: string; close: string; enabled: boolean }> | null
  const dayLabels: Record<string, string> = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }

  const testimonials = [
    { name: 'Sophie', text: 'Emma is a magician with colour. My balayage looks incredible and I get compliments everywhere.', rating: 5 },
    { name: 'Chloe', text: 'Absolutely love this salon. The vibe is amazing and Jade totally nailed my highlights.', rating: 5 },
    { name: 'Rachel', text: 'Best haircut I\'ve had in years. Precise, professional, and the whole experience felt really luxurious.', rating: 5 },
  ]

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5" style={{ color: primary }} />
            <span className="font-bold text-gray-900 text-xl tracking-tight">{tenant.businessName}</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <a href="#services" className="hover:text-gray-900 transition-colors">Services</a>
            <a href="#team" className="hover:text-gray-900 transition-colors">Team</a>
            <a href="#gallery" className="hover:text-gray-900 transition-colors">Gallery</a>
            <a href="#hours" className="hover:text-gray-900 transition-colors">Hours</a>
          </div>
          <button
            onClick={() => setShowBooking(true)}
            className="px-5 py-2 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: primary }}
          >
            Book Appointment
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen min-h-[640px] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          {settings?.heroImageUrl ? (
            <Image src={settings.heroImageUrl} alt="Salon interior" fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(to bottom right, ${secondary}, ${primary})` }} />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-lg">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>
              Premium Hair Salon · {settings?.city ?? 'Professional Services'}
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              {settings?.tagline ?? 'Where Style Meets Precision'}
            </h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              {settings?.description?.slice(0, 120) ?? 'Expert stylists. Premium products. Results you\'ll love.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowBooking(true)}
                className="px-7 py-3.5 rounded-full text-white font-semibold text-base shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: primary }}
              >
                Book Your Appointment
              </button>
              <a
                href="#services"
                className="px-7 py-3.5 rounded-full bg-white/10 border border-white/30 text-white font-semibold text-base hover:bg-white/20 transition-colors"
              >
                View Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services — salon menu style */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: primary }}>Services &amp; Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Our Menu</h2>
            <div className="flex justify-center mt-4">
              <div className="h-px w-24 bg-gray-200" />
              <div className="mx-3 -mt-2"><Scissors className="w-4 h-4 text-gray-300" /></div>
              <div className="h-px w-24 bg-gray-200" />
            </div>
          </div>
          <div className="divide-y divide-dashed divide-gray-200">
            {tenant.services.map((service) => (
              <div key={service.id} className="flex items-center justify-between py-5 group">
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{service.name}</h3>
                    <div className="flex-1 border-b border-dotted border-gray-300 mx-2" />
                  </div>
                  {service.description && (
                    <p className="text-gray-500 text-sm mt-0.5">{service.description}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {service.duration} minutes
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(service.price)}</span>
                  <button
                    onClick={() => setShowBooking(true)}
                    className="px-4 py-1.5 rounded-full text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: primary }}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => setShowBooking(true)}
              className="px-8 py-3.5 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: primary }}
            >
              Book Your Appointment
            </button>
          </div>
        </div>
      </section>

      {/* Meet the team */}
      <section id="team" className="py-20" style={{ backgroundColor: `${primary}08` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: primary }}>The Experts</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Meet Your Stylists</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl overflow-hidden shadow-sm text-center">
                <div className="h-48 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primary}20, ${accent}30)` }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: primary }}>
                    {member.name[0]}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                  <p className="text-sm font-medium mb-2" style={{ color: primary }}>{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {settings?.galleryImages && settings.galleryImages.length > 0 && (
        <section id="gallery" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: primary }}>Portfolio</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Our Work</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {settings.galleryImages.map((img, i) => (
                <div key={i} className={`relative overflow-hidden rounded-xl group ${i === 0 ? 'row-span-2' : ''}`} style={{ height: i === 0 ? '400px' : '192px' }}>
                  <Image src={img} alt={`Style ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: primary }}>Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl border-2 border-gray-100">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening hours */}
      {openingHours && (
        <section id="hours" className="py-16 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>When to Find Us</p>
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Opening Hours</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {Object.entries(openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center py-3">
                  <span className="text-gray-300 font-medium capitalize">{dayLabels[day] ?? day}</span>
                  <span className={hours.enabled ? 'text-white font-medium' : 'text-gray-600'}>
                    {hours.enabled ? `${hours.open} – ${hours.close}` : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4" style={{ color: primary }} />
            <span className="font-bold text-gray-900">{tenant.businessName}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {settings?.phone && <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:text-gray-900"><Phone className="w-3.5 h-3.5" />{settings.phone}</a>}
            {settings?.email && <a href={`mailto:${settings.email}`} className="flex items-center gap-1 hover:text-gray-900"><Mail className="w-3.5 h-3.5" />{settings.email}</a>}
            <a href="#" className="flex items-center gap-1 hover:text-gray-900"><Instagram className="w-3.5 h-3.5" />Instagram</a>
          </div>
          <p className="text-gray-400 text-xs">© {new Date().getFullYear()} {tenant.businessName}</p>
        </div>
      </footer>

      {showBooking && (
        <BookingModal
          tenantSlug={tenant.slug}
          services={tenant.services}
          primaryColor={primary}
          onClose={() => setShowBooking(false)}
        />
      )}

      <ChatBot tenantSlug={tenant.slug} businessName={tenant.businessName} primaryColor={primary} />
    </div>
  )
}
