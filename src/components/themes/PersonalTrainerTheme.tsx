'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Zap, Target, Trophy, Phone, Mail, MapPin, TrendingUp, Users, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import ChatBot from '@/components/ChatBot'
import BookingModal from '@/components/BookingModal'
import { TenantWithSettings } from '@/types'

interface Props {
  tenant: TenantWithSettings
}

export default function PersonalTrainerTheme({ tenant }: Props) {
  const [showBooking, setShowBooking] = useState(false)
  const settings = tenant.settings
  const primary = settings?.primaryColor ?? '#DC2626'
  const secondary = settings?.secondaryColor ?? '#7F1D1D'
  const accent = settings?.accentColor ?? '#F97316'

  const stats = [
    { value: '127', label: 'Clients Transformed', icon: <Users className="w-5 h-5" /> },
    { value: '8+', label: 'Years Experience', icon: <Trophy className="w-5 h-5" /> },
    { value: '98%', label: 'Client Satisfaction', icon: <Star className="w-5 h-5" /> },
  ]

  const testimonials = [
    { name: 'Tom B.', result: 'Lost 18kg in 5 months', text: 'Marcus completely changed my approach to fitness. The results speak for themselves.', rating: 5 },
    { name: 'Amy C.', result: 'First 5K in 3 months', text: 'I never thought I\'d run a 5K. Marcus\'s programming was precise and the accountability was everything.', rating: 5 },
    { name: 'Dan M.', result: 'Bench press 100kg+', text: 'Every session is different, always challenging, and always worth it. The best investment I\'ve made.', rating: 5 },
  ]

  const features = [
    { icon: <Target className="w-5 h-5" />, title: 'Personalised Programming', desc: 'Every session built around your goals, fitness level, and schedule.' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Progress Tracking', desc: 'Regular assessments to measure your gains and adjust the plan.' },
    { icon: <Zap className="w-5 h-5" />, title: 'Nutritional Guidance', desc: 'Simple, practical advice on nutrition to support your training.' },
    { icon: <Users className="w-5 h-5" />, title: 'Accountability', desc: 'Check-ins between sessions to keep you on track and motivated.' },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-neutral-950/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: accent }} />
            <span className="font-black text-white text-lg tracking-tight uppercase">{tenant.businessName}</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#results" className="hover:text-white transition-colors">Results</a>
          </div>
          <button
            onClick={() => setShowBooking(true)}
            className="px-4 py-2 rounded-lg text-white text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
            style={{ backgroundColor: primary }}
          >
            Book Session
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen min-h-[640px] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          {settings?.heroImageUrl ? (
            <Image src={settings.heroImageUrl} alt="Training" fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full bg-neutral-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950/90" />
          {/* Accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: accent }}>
                Personal Training · {settings?.city ?? 'Professional Coaching'}
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none uppercase mb-6 tracking-tight">
              {settings?.tagline ?? 'Push Past Your Limits'}
            </h1>
            <p className="text-gray-400 text-lg mb-10">
              Results-driven personal training. No guesswork. No fluff. Just progress.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowBooking(true)}
                className="px-8 py-4 rounded-xl text-white font-black text-base uppercase tracking-wide shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: primary }}
              >
                Start Today →
              </button>
              <a
                href="#services"
                className="px-8 py-4 rounded-xl border-2 text-white font-bold text-base uppercase tracking-wide hover:bg-white/5 transition-colors"
                style={{ borderColor: accent, color: accent }}
              >
                View Pricing
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="absolute bottom-12 left-4 right-4 sm:left-6 sm:right-6">
            <div className="flex gap-6 sm:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-3xl sm:text-4xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: accent }}>Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">Services &amp; Investment</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tenant.services.map((service, i) => (
              <div
                key={service.id}
                className={`relative p-6 rounded-2xl border transition-all group hover:border-opacity-100 ${i === 0 ? 'border-opacity-100' : 'border-opacity-20'}`}
                style={{ borderColor: i === 0 ? accent : 'rgba(255,255,255,0.1)', backgroundColor: i === 0 ? `${accent}10` : 'rgba(255,255,255,0.03)' }}
              >
                {i === 0 && (
                  <span className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: accent }}>
                    Popular
                  </span>
                )}
                <h3 className="text-xl font-black text-white uppercase mb-2">{service.name}</h3>
                {service.description && (
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{service.description}</p>
                )}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-black" style={{ color: i === 0 ? accent : 'white' }}>
                      {formatCurrency(service.price)}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {service.duration} mins
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBooking(true)}
                    className="px-4 py-2 rounded-lg text-white font-bold text-sm uppercase transition-opacity hover:opacity-80"
                    style={{ backgroundColor: i === 0 ? accent : primary }}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: accent }}>Why It Works</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-8">The Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f) => (
                  <div key={f.title} className="p-4 rounded-xl border border-white/10 bg-white/3">
                    <div className="mb-3" style={{ color: accent }}>{f.icon}</div>
                    <h4 className="font-bold text-white mb-1">{f.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div id="about" className="p-8 rounded-2xl bg-neutral-900 border border-white/10">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white mb-6" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
                M
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Marcus Reid</h3>
              <p className="font-medium mb-4" style={{ color: accent }}>Level 4 Personal Trainer · Sports Nutritionist</p>
              <p className="text-gray-400 leading-relaxed">
                {settings?.description ?? 'With 8 years in the industry, I\'ve helped hundreds of clients transform their bodies and mindsets. My approach is no-nonsense: assess where you are, build a plan, track your progress, and adjust. I work with people who are ready to commit.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results / Testimonials */}
      <section id="results" className="py-20 bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: accent }}>Social Proof</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">Real Results</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl bg-neutral-950 border border-white/10">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: accent }}>{t.result}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="text-white font-bold text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: `linear-gradient(135deg, ${secondary}, ${primary})` }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase mb-4">Ready to Start?</h2>
          <p className="text-white/70 text-lg mb-8">Your first session is your turning point. Book it now.</p>
          <button
            onClick={() => setShowBooking(true)}
            className="px-10 py-4 bg-white rounded-xl font-black text-lg uppercase shadow-2xl transition-transform hover:scale-105"
            style={{ color: primary }}
          >
            Book Your Session →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: accent }} />
            <span className="font-black text-white uppercase tracking-tight">{tenant.businessName}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {settings?.phone && <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:text-white transition-colors"><Phone className="w-3.5 h-3.5" />{settings.phone}</a>}
            {settings?.email && <a href={`mailto:${settings.email}`} className="flex items-center gap-1 hover:text-white transition-colors"><Mail className="w-3.5 h-3.5" />{settings.email}</a>}
            {settings?.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{settings.city}</span>}
          </div>
          <p className="text-gray-700 text-xs">© {new Date().getFullYear()} {tenant.businessName}</p>
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
