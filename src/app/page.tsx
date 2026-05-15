import Link from 'next/link'
import { Calendar, MessageSquare, LayoutDashboard, Users, Zap, CheckCircle, ChevronRight, Star } from 'lucide-react'

const TENANT_DEMOS = [
  { slug: 'bright-windows', name: 'Bright Windows', type: 'Window Cleaning', emoji: '🪟', color: '#0EA5E9', bg: 'from-sky-50 to-white' },
  { slug: 'shear-perfection', name: 'Shear Perfection', type: 'Hair Salon', emoji: '✂️', color: '#BE185D', bg: 'from-pink-50 to-white' },
  { slug: 'peak-performance', name: 'Peak Performance PT', type: 'Personal Training', emoji: '💪', color: '#DC2626', bg: 'from-red-50 to-white' },
  { slug: 'rapidfix-plumbing', name: 'RapidFix Plumbing', type: 'Plumbing', emoji: '🔧', color: '#1D4ED8', bg: 'from-blue-50 to-white' },
]

const FEATURES = [
  { icon: <MessageSquare className="w-6 h-6" />, title: 'AI Booking Chatbot', desc: 'An intelligent assistant handles customer conversations and books appointments automatically — 24/7.' },
  { icon: <LayoutDashboard className="w-6 h-6" />, title: 'Smart Admin Portal', desc: 'Each business gets their own admin dashboard with calendar, bookings, customer records, and CMS.' },
  { icon: <Calendar className="w-6 h-6" />, title: 'Availability Engine', desc: 'Opening hours, service durations, and blocked times kept in sync. No double-bookings, ever.' },
  { icon: <Users className="w-6 h-6" />, title: 'Customer Database', desc: 'Every booking builds a rich customer profile with contact details and booking history.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Instant Setup', desc: 'Spin up a new business on the platform in under 60 seconds from the super-admin dashboard.' },
  { icon: <CheckCircle className="w-6 h-6" />, title: 'Custom Branding', desc: 'Each tenant gets a sharp, industry-specific website they can fully customise — colours, images, copy.' },
]

const PRICING = [
  { name: 'Starter', price: '£29', period: '/mo per tenant', features: ['1 booking type', 'AI chatbot', 'Customer records', 'Calendar management', 'Standard theme'], cta: 'Get started' },
  { name: 'Growth', price: '£59', period: '/mo per tenant', features: ['Unlimited services', 'AI chatbot', 'Customer records', 'Calendar + blocking', 'Custom branding & CMS', 'Email notifications'], cta: 'Most popular', highlight: true },
  { name: 'Platform', price: '£199', period: '/mo', features: ['Unlimited tenants', 'Super admin panel', 'White-label option', 'Custom domain support', 'Priority support', 'API access'], cta: 'Contact us' },
]

export default function PlatformHome() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">BookRight</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Admin Login
            </Link>
            <Link
              href="#demos"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              See Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-blue-700 text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Live booking platform — 4 demo tenants ready
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            The Booking Platform Built for
            <span className="text-blue-600"> Local Businesses</span>
          </h1>
          <p className="text-gray-500 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Give every local service business a sharp website, an AI booking assistant, and a professional admin portal — all under one roof.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#demos"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg transition-colors"
            >
              View Live Demos →
            </Link>
            <Link
              href="/admin/login"
              className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-bold text-base rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Platform Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Demo tenant cards */}
      <section id="demos" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Live Demo Sites</h2>
            <p className="text-gray-500 text-lg">Four complete business websites, each with its own theme, chatbot, and booking system.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TENANT_DEMOS.map((demo) => (
              <Link
                key={demo.slug}
                href={`/${demo.slug}`}
                className={`group relative bg-gradient-to-b ${demo.bg} rounded-2xl border-2 border-gray-100 hover:border-gray-200 p-6 transition-all hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div className="text-4xl mb-4">{demo.emoji}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{demo.name}</h3>
                <p className="text-sm mb-4" style={{ color: demo.color }}>{demo.type}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: demo.color }}>
                    View site <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Each demo has a live AI chatbot — try booking an appointment. Admin at{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/[slug]/admin/login</code>
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Everything a Business Needs</h2>
            <p className="text-gray-500 text-lg">One platform. Every tool. No technical knowledge required.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-100 transition-colors">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 text-lg">From scraping a lead to a live booking website — in minutes.</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-8">
              {[
                { step: '01', title: 'Identify the business', desc: 'Find local businesses that lack a booking system — window cleaners, salons, PTs, tradespeople.' },
                { step: '02', title: 'Spin up their site', desc: 'Log into the platform admin, choose their business type, set a slug — live in 60 seconds.' },
                { step: '03', title: 'Hand over admin access', desc: 'They get a login to their own admin portal where they customise colours, images, and services.' },
                { step: '04', title: 'Customers start booking', desc: 'The AI chatbot handles enquiries and books appointments while they sleep.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 relative">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 relative z-10">
                    {item.step}
                  </div>
                  <div className="pt-2.5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Simple Pricing</h2>
            <p className="text-gray-500 text-lg">No setup fees. Cancel any time.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border-2 ${plan.highlight ? 'border-blue-600 shadow-xl shadow-blue-100' : 'border-gray-100'}`}
              >
                {plan.highlight && (
                  <div className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full mb-3">
                    Most popular
                  </div>
                )}
                <h3 className="font-bold text-gray-900 text-xl mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 text-sm mb-1">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">BookRight</span>
          </div>
          <p className="text-gray-600 text-sm">© {new Date().getFullYear()} BookRight. Built as a proof of concept.</p>
          <Link href="/admin/login" className="text-gray-500 hover:text-white text-sm transition-colors">
            Platform Admin →
          </Link>
        </div>
      </footer>
    </div>
  )
}
