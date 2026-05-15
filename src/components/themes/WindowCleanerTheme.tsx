'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckCircle, Shield, Clock, Star, Phone, Mail, MapPin, Droplets, Building2, Home, Wind } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import ChatBot from '@/components/ChatBot'
import BookingModal from '@/components/BookingModal'
import { TenantWithSettings } from '@/types'

interface Props {
  tenant: TenantWithSettings
}

export default function WindowCleanerTheme({ tenant }: Props) {
  const [showBooking, setShowBooking] = useState(false)
  const settings = tenant.settings
  const primary = settings?.primaryColor ?? '#0EA5E9'
  const secondary = settings?.secondaryColor ?? '#0369A1'

  const serviceIcons: Record<string, React.ReactNode> = {
    default: <Droplets className="w-6 h-6" />,
    'commercial': <Building2 className="w-6 h-6" />,
    'residential': <Home className="w-6 h-6" />,
    'conservatory': <Wind className="w-6 h-6" />,
  }

  function getIcon(name: string) {
    const key = Object.keys(serviceIcons).find((k) => name.toLowerCase().includes(k)) ?? 'default'
    return serviceIcons[key]
  }

  const testimonials = [
    { name: 'Sarah M.', location: 'Edgbaston', text: 'Absolutely brilliant service. Windows have never looked so clean — streak-free every single time.', rating: 5 },
    { name: 'James C.', location: 'Solihull', text: 'Turned up exactly when they said, did a thorough job, and left no mess. Highly recommended.', rating: 5 },
    { name: 'Helen F.', location: 'Harborne', text: 'Best window cleaner we\'ve had in years. The conservatory roof clean was outstanding.', rating: 5 },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: primary }}>
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">{tenant.businessName}</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <a href="#services" className="hover:text-gray-900 transition-colors">Services</a>
            <a href="#gallery" className="hover:text-gray-900 transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
          <button
            onClick={() => setShowBooking(true)}
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: primary }}
          >
            Book Now
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          {settings?.heroImageUrl ? (
            <Image src={settings.heroImageUrl} alt="Clean windows" fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white text-sm mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Now taking bookings
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              {settings?.tagline ?? 'Crystal Clear Results, Every Time'}
            </h1>
            {settings?.city && (
              <p className="text-white/80 text-lg mb-8">
                Professional window cleaning in {settings.city} & surrounding areas
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowBooking(true)}
                className="px-6 py-3.5 rounded-xl text-white font-bold text-base shadow-lg transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: primary }}
              >
                Book Online →
              </button>
              <a
                href="#services"
                className="px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold text-base hover:bg-white/20 transition-colors"
              >
                See Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-gray-900 py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Shield className="w-5 h-5" />, text: 'Fully Insured' },
              { icon: <Clock className="w-5 h-5" />, text: 'Same-Day Available' },
              { icon: <CheckCircle className="w-5 h-5" />, text: 'Streak-Free Guarantee' },
              { icon: <Star className="w-5 h-5" />, text: '200+ Happy Customers' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 justify-center sm:justify-start">
                <span style={{ color: primary }}>{item.icon}</span>
                <span className="text-white text-sm font-medium">{item.text}</span>
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
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Competitive prices, professional results. Every job fully insured.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tenant.services.map((service) => (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-sky-200 hover:shadow-lg transition-all duration-200"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{ backgroundColor: `${primary}15`, color: primary }}
                >
                  {getIcon(service.name)}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{service.name}</h3>
                {service.description && (
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{service.description}</p>
                )}
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-2xl font-extrabold" style={{ color: primary }}>
                      {formatCurrency(service.price)}
                    </p>
                    <p className="text-xs text-gray-400">{service.duration} mins</p>
                  </div>
                  <button
                    onClick={() => setShowBooking(true)}
                    className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: primary }}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ backgroundColor: `${primary}08` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 text-lg">Three simple steps to sparkling clean windows</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Book Online', desc: 'Pick your service, choose a time that suits you, and we\'ll confirm within the hour.' },
              { step: '02', title: 'We Turn Up', desc: 'Our fully insured team arrives on time with all equipment needed for the job.' },
              { step: '03', title: 'Sparkling Clean', desc: 'Streak-free results guaranteed. If you\'re not happy, we\'ll come back and fix it.' },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 shadow-sm">
                <div
                  className="text-5xl font-black mb-4 opacity-10 absolute top-4 right-6"
                  style={{ color: primary }}
                >
                  {item.step}
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4"
                  style={{ backgroundColor: primary }}
                >
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
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
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Our Work</h2>
              <p className="text-gray-500 text-lg">See the difference we make</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {settings.galleryImages.slice(0, 3).map((img, i) => (
                <div key={i} className="relative h-64 rounded-2xl overflow-hidden group">
                  <Image src={img} alt={`Gallery image ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready for Crystal Clear Windows?</h2>
          <p className="text-white/80 text-lg mb-8">Book online in 60 seconds. No call required.</p>
          <button
            onClick={() => setShowBooking(true)}
            className="px-8 py-4 bg-white rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-105"
            style={{ color: primary }}
          >
            Book Your Clean Today →
          </button>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="contact" className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: primary }}>
                  <Droplets className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-white">{tenant.businessName}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{settings?.description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Contact</h4>
              <div className="space-y-2">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                    <Phone className="w-4 h-4" /> {settings.phone}
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                    <Mail className="w-4 h-4" /> {settings.email}
                  </a>
                )}
                {settings?.address && (
                  <p className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4" /> {settings.address}{settings?.city ? `, ${settings.city}` : ''}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Book Online</h4>
              <p className="text-gray-400 text-sm mb-4">Ready to get your windows sparkling? Book in 60 seconds.</p>
              <button
                onClick={() => setShowBooking(true)}
                className="px-4 py-2 rounded-lg text-white text-sm font-semibold"
                style={{ backgroundColor: primary }}
              >
                Book Now
              </button>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-600 text-xs">© {new Date().getFullYear()} {tenant.businessName}. All rights reserved.</p>
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

      <ChatBot
        tenantSlug={tenant.slug}
        businessName={tenant.businessName}
        primaryColor={primary}
      />
    </div>
  )
}
