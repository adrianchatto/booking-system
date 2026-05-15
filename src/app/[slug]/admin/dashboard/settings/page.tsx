'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import { Loader2, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { DAY_LABELS, DAYS_OF_WEEK } from '@/lib/utils'

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number | string
  active: boolean
}

interface OpeningDay {
  open: string
  close: string
  enabled: boolean
}

interface Settings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  tagline: string
  description: string
  phone: string
  email: string
  address: string
  city: string
  heroImageUrl: string
  galleryImages: string[]
  openingHours: Record<string, OpeningDay>
}

const defaultOpeningHours: Record<string, OpeningDay> = {
  mon: { open: '09:00', close: '17:00', enabled: true },
  tue: { open: '09:00', close: '17:00', enabled: true },
  wed: { open: '09:00', close: '17:00', enabled: true },
  thu: { open: '09:00', close: '17:00', enabled: true },
  fri: { open: '09:00', close: '17:00', enabled: true },
  sat: { open: '09:00', close: '13:00', enabled: false },
  sun: { open: '00:00', close: '00:00', enabled: false },
}

export default function SettingsPage() {
  const { slug } = useParams() as { slug: string }
  const [tenantId, setTenantId] = useState('')
  const [businessName, setBusinessName] = useState(slug)
  const [settings, setSettings] = useState<Settings>({
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#F59E0B',
    tagline: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    heroImageUrl: '',
    galleryImages: [''],
    openingHours: defaultOpeningHours,
  })
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newService, setNewService] = useState({ name: '', description: '', duration: 60, price: '' })
  const [addingService, setAddingService] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const [tRes, sRes] = await Promise.all([
      fetch(`/api/tenants?slug=${slug}`).catch(() => null),
      fetch(`/api/services?tenantSlug=${slug}`),
    ])

    // Get tenant via session
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    if (session?.user?.tenantId) {
      setTenantId(session.user.tenantId)
      const tenantRes = await fetch(`/api/tenants/${session.user.tenantId}`)
      if (tenantRes.ok) {
        const tenant = await tenantRes.json()
        setBusinessName(tenant.businessName)
        if (tenant.settings) {
          setSettings({
            primaryColor: tenant.settings.primaryColor ?? '#3B82F6',
            secondaryColor: tenant.settings.secondaryColor ?? '#1E40AF',
            accentColor: tenant.settings.accentColor ?? '#F59E0B',
            tagline: tenant.settings.tagline ?? '',
            description: tenant.settings.description ?? '',
            phone: tenant.settings.phone ?? '',
            email: tenant.settings.email ?? '',
            address: tenant.settings.address ?? '',
            city: tenant.settings.city ?? '',
            heroImageUrl: tenant.settings.heroImageUrl ?? '',
            galleryImages: tenant.settings.galleryImages?.length ? tenant.settings.galleryImages : [''],
            openingHours: (tenant.settings.openingHours as Record<string, OpeningDay>) ?? defaultOpeningHours,
          })
        }
      }
    }

    if (sRes.ok) setServices(await sRes.json())
    setLoading(false)
  }

  async function handleSave() {
    if (!tenantId) return
    setSaving(true)
    const res = await fetch(`/api/tenants/${tenantId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName,
        settings: {
          ...settings,
          galleryImages: settings.galleryImages.filter(Boolean),
        },
      }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  async function handleAddService() {
    if (!newService.name || !newService.price) return
    setAddingService(true)
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newService),
    })
    if (res.ok) {
      const svc = await res.json()
      setServices((prev) => [...prev, svc])
      setNewService({ name: '', description: '', duration: 60, price: '' })
    }
    setAddingService(false)
  }

  async function handleRemoveService(id: string) {
    const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' })
    if (res.ok) setServices((prev) => prev.filter((s) => s.id !== id))
  }

  function updateGalleryImage(index: number, value: string) {
    const updated = [...settings.galleryImages]
    updated[index] = value
    setSettings((s) => ({ ...s, galleryImages: updated }))
  }

  function updateHours(day: string, field: keyof OpeningDay, value: string | boolean) {
    setSettings((s) => ({
      ...s,
      openingHours: {
        ...s.openingHours,
        [day]: { ...s.openingHours[day], [field]: value },
      },
    }))
  }

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar slug={slug} businessName={slug} />
      <main className="flex-1 pt-14 md:pt-0 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </main>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar slug={slug} businessName={businessName} />
      <main className="flex-1 pt-14 md:pt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings & CMS</h1>
              <p className="text-gray-500 text-sm mt-1">Customise your website and manage your services</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>

          {/* Business details */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">Business Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Business Name</label>
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tagline</label>
                <input type="text" value={settings.tagline} onChange={(e) => setSettings((s) => ({ ...s, tagline: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea value={settings.description} onChange={(e) => setSettings((s) => ({ ...s, description: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                <input type="tel" value={settings.phone} onChange={(e) => setSettings((s) => ({ ...s, phone: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                <input type="email" value={settings.email} onChange={(e) => setSettings((s) => ({ ...s, email: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Address</label>
                <input type="text" value={settings.address} onChange={(e) => setSettings((s) => ({ ...s, address: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City</label>
                <input type="text" value={settings.city} onChange={(e) => setSettings((s) => ({ ...s, city: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>

          {/* Brand colours */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">Brand Colours</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'primaryColor', label: 'Primary' },
                { key: 'secondaryColor', label: 'Secondary' },
                { key: 'accentColor', label: 'Accent' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(settings as any)[key]}
                      onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={(settings as any)[key]}
                      onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="h-3 rounded-full mt-2" style={{ backgroundColor: (settings as any)[key] }} />
                </div>
              ))}
            </div>
          </section>

          {/* Images */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">Images</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Hero Image URL</label>
                <input type="url" value={settings.heroImageUrl} onChange={(e) => setSettings((s) => ({ ...s, heroImageUrl: e.target.value }))} placeholder="https://images.unsplash.com/..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Gallery Images</label>
                <div className="space-y-2">
                  {settings.galleryImages.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateGalleryImage(i, e.target.value)}
                        placeholder={`Gallery image ${i + 1} URL`}
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {settings.galleryImages.length > 1 && (
                        <button
                          onClick={() => setSettings((s) => ({ ...s, galleryImages: s.galleryImages.filter((_, j) => j !== i) }))}
                          className="p-2.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setSettings((s) => ({ ...s, galleryImages: [...s.galleryImages, ''] }))}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add image
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Opening hours */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">Opening Hours</h2>
            <div className="space-y-3">
              {DAYS_OF_WEEK.map((day) => {
                const hours = settings.openingHours[day] ?? { open: '09:00', close: '17:00', enabled: false }
                return (
                  <div key={day} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-28">
                      <input
                        type="checkbox"
                        checked={hours.enabled}
                        onChange={(e) => updateHours(day, 'enabled', e.target.checked)}
                        className="rounded"
                      />
                      <span className={`text-sm font-medium ${hours.enabled ? 'text-gray-800' : 'text-gray-400'}`}>
                        {DAY_LABELS[day]}
                      </span>
                    </div>
                    {hours.enabled ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateHours(day, 'open', e.target.value)}
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-400 text-sm">to</span>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateHours(day, 'close', e.target.value)}
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Closed</span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Services */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Services</h2>
            <div className="space-y-2 mb-4">
              {services.map((svc) => (
                <div key={svc.id} className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{svc.name}</p>
                    <p className="text-xs text-gray-400">{svc.duration} min · £{Number(svc.price).toFixed(2)}</p>
                  </div>
                  <button onClick={() => handleRemoveService(svc.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {/* Add new service */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Add New Service</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="col-span-2">
                  <input type="text" placeholder="Service name" value={newService.name} onChange={(e) => setNewService((s) => ({ ...s, name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <input type="text" placeholder="Description (optional)" value={newService.description} onChange={(e) => setNewService((s) => ({ ...s, description: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <input type="number" placeholder="Duration (mins)" value={newService.duration} onChange={(e) => setNewService((s) => ({ ...s, duration: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <input type="number" step="0.01" placeholder="Price (£)" value={newService.price} onChange={(e) => setNewService((s) => ({ ...s, price: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button
                onClick={handleAddService}
                disabled={addingService || !newService.name || !newService.price}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg disabled:opacity-40 transition-colors"
              >
                {addingService ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Add Service
              </button>
            </div>
          </section>

          {/* Sticky save button (mobile) */}
          <div className="mt-6 sticky bottom-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Changes Saved!' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
