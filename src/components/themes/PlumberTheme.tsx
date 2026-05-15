'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Shield, Clock, Star, Phone, Mail, MapPin, CheckCircle, AlertCircle, Wrench, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import ChatBot from '@/components/ChatBot'
import BookingModal from '@/components/BookingModal'
import { TenantWithSettings } from '@/types'

interface Props {
  tenant: TenantWithSettings
}

const FAQS: { q: string; a: string | ((s: any) => string) }[] = [
  { q: 'Do you cover emergency callouts at weekends?', a: 'Yes — we offer emergency callouts 24/7, 365 days a year. Weekend and out-of-hours rates apply for emergency work.' },
  { q: 'Are you Gas Safe registered?', a: 'Absolutely. All our engineers are fully Gas Safe registered and our certificates are available on request.' },
  { q: 'How quickly can you respond to an emergency?', a: 'We aim to be with you within 2 hours for emergency callouts in our coverage area.' },
  { q: 'Do you provide a written quote before starting work?', a: 'Yes, always. We will give you a clear written quote before any work begins. No surprises.' },
  { q: 'What areas do you cover?', a: (s: any) => `We cover ${s?.city ?? 'our local area'} and a 15-mile radius. Call us to check if you're within our coverage area.` },
]

export default function PlumberTheme({ tenant }: Props) {
  const [showBooking, setShowBooking] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const settings = tenant.settings
  const primary = settings?.primaryColor ?? '#1D4ED8'
  const secondary = settings?.secondaryColor ?? '#1E3A8A'
  const accent = settings?.accentColor ?? '#F97316'

  const testimonials = [
    { name: 'Mark T.', text: 'Arrived within the hour for an emergency. Fixed the problem quickly and cleanly. Would not hesitate to call again.', rating: 5 },
    { name: 'Linda B.', text: 'Annual boiler service done professionally. Thorough check, certificate issued on the day. Very happy.', rating: 5 },
    { name: 'Peter J.', text: 'Cleared a blocked drain that had been causing issues for months. Reasonable price, no mess left behind.', rating: 5 },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Emergency banner */}
      <div className="bg-red-600 py-2 px-4 text-center text-white text-sm font-semibold">
        <span className="inline-flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          24/7 Emergency Callouts Available —{' '}
          {settings?.phone ? (
            <a href={`tel:${settings.phone}`} className="underline hover:no-underline font-bold">
              Call Now: {settings.phone}
            </a>
          ) : (
            'Call Us Now'
          )}
        </span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: primary }}>
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">{tenant.businessName}</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <a href="#services" className="hover:text-gray-900 transition-colors">Services</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold text-sm transition-colors hover:bg-gray-50"
                style={{ borderColor: primary, color: primary }}
              >
                <Phone className="w-4 h-4" /> {settings.phone}
              </a>
            )}
            <button
              onClick={() => setShowBooking(true)}
              className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Book Online
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {settings?.heroImageUrl ? (
            <Image src={settings.heroImageUrl} alt="Plumbing work" fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
          )}
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, rgba(30,58,138,0.92), rgba(29,78,216,0.7) 50%, rgba(29,78,216,0.4) 100%)` }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl">
            <div className="flex flex-wrap gap-2 mb-6">
              {['Gas Safe Registered', '15 Years Experience', 'Fully Insured'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1 bg-white/10 border border-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3 text-green-400" /> {badge}
                </span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              {settings?.tagline ?? 'Fast, Reliable, Fixed Right First Time'}
            </h1>
            <p className="text-white/70 text-lg mb-8">
              Professional plumbing and heating services{settings?.city ? ` in ${settings.city}` : ''}. Available 24/7 for emergencies.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={settings?.phone ? `tel:${settings.phone}` : '#contact'}
                className="px-6 py-3.5 rounded-lg font-bold text-white text-base shadow-lg flex items-center gap-2"
                style={{ backgroundColor: '#DC2626' }}
              >
                <Phone className="w-4 h-4" /> Emergency Call
              </a>
              <button
                onClick={() => setShowBooking(true)}
                className="px-6 py-3.5 rounded-lg font-bold text-white text-base shadow-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: accent }}
              >
                Book Online
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-6 h-6" />, title: 'Gas Safe Registered', sub: 'Registration available on request' },
              { icon: <Clock className="w-6 h-6" />, title: '24/7 Emergency', sub: 'Always available when you need us' },
              { icon: <CheckCircle className="w-6 h-6" />, title: 'Fixed Price Quotes', sub: 'No hidden charges, ever' },
              { icon: <Star className="w-6 h-6" />, title: '5-Star Rated', sub: '200+ verified reviews' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primary}15`, color: primary }}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Our Services</h2>
            <p className="text-gray-500 text-lg max-w-lg mx-auto">Transparent pricing. No surprises. All work guaranteed.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tenant.services.map((service, i) => (
              <div
                key={service.id}
                className={`rounded-2xl p-6 border-2 transition-all hover:shadow-md ${i === 1 ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white hover:border-blue-200'}`}
              >
                {i === 1 && (
                  <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full mb-3">
                    <AlertCircle className="w-3 h-3" /> Emergency
                  </span>
                )}
                <h3 className="font-bold text-gray-900 text-lg mb-2">{service.name}</h3>
                {service.description && (
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{service.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900">
                      {formatCurrency(service.price)}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> from {service.duration} mins
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBooking(true)}
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold"
                    style={{ backgroundColor: i === 1 ? '#DC2626' : accent }}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {settings?.galleryImages && settings.galleryImages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Recent Work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {settings.galleryImages.slice(0, 3).map((img, i) => (
                <div key={i} className="relative h-56 rounded-xl overflow-hidden">
                  <Image src={img} alt={`Work ${i + 1}`} fill className="object-cover" />
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
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Trusted by Homeowners</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center py-5 text-left"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 flex-shrink-0 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-400" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="pb-5">
                    <p className="text-gray-600 leading-relaxed">
                      {typeof faq.a === 'function' ? faq.a(settings) : faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="contact" className="py-12" style={{ backgroundColor: primary }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-5 h-5 text-white" />
                <span className="font-bold text-white text-lg">{tenant.businessName}</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{settings?.description}</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Contact Us</h4>
              <div className="space-y-2">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors font-medium">
                    <Phone className="w-4 h-4" /> {settings.phone}
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
                    <Mail className="w-4 h-4" /> {settings.email}
                  </a>
                )}
                {settings?.address && (
                  <p className="flex items-center gap-2 text-white/60 text-sm">
                    <MapPin className="w-4 h-4" /> {settings.address}{settings.city ? `, ${settings.city}` : ''}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Need a Plumber?</h4>
              <p className="text-white/60 text-sm mb-4">Book online or call for emergencies. Available 24/7.</p>
              <button
                onClick={() => setShowBooking(true)}
                className="px-5 py-2.5 rounded-lg font-bold text-sm text-white shadow-lg"
                style={{ backgroundColor: accent }}
              >
                Book Online
              </button>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-white/30 text-xs">© {new Date().getFullYear()} {tenant.businessName}. All rights reserved. Gas Safe registered.</p>
          </div>
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
