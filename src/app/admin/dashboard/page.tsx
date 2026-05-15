'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { formatDate, slugify, tenantTypeLabel } from '@/lib/utils'
import {
  Building2, Plus, LogOut, ExternalLink, ToggleLeft, ToggleRight, Loader2,
  Shield, Users, BookOpen, TrendingUp, X, Check
} from 'lucide-react'

interface Tenant {
  id: string
  slug: string
  businessName: string
  type: string
  status: string
  createdAt: string
  _count: { bookings: number; customers: number }
}

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)
  const router = useRouter()

  // New tenant form
  const [form, setForm] = useState({
    businessName: '',
    slug: '',
    type: 'WINDOW_CLEANER',
    adminEmail: '',
    adminName: '',
    adminPassword: '',
  })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => { fetchTenants() }, [])

  async function fetchTenants() {
    setLoading(true)
    const res = await fetch('/api/tenants')
    if (res.status === 403) { router.push('/admin/login'); return }
    if (res.ok) setTenants(await res.json())
    setLoading(false)
  }

  async function toggleTenant(tenant: Tenant) {
    setToggling(tenant.id)
    const newStatus = tenant.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const res = await fetch(`/api/tenants/${tenant.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setTenants((prev) => prev.map((t) => t.id === tenant.id ? { ...t, status: newStatus } : t))
    }
    setToggling(null)
  }

  async function createTenant() {
    if (!form.businessName || !form.slug || !form.adminEmail || !form.adminPassword) {
      setCreateError('All fields are required')
      return
    }
    setCreating(true)
    setCreateError('')
    const res = await fetch('/api/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setCreating(false)
    if (res.ok) {
      const tenant = await res.json()
      setTenants((prev) => [tenant, ...prev])
      setShowNew(false)
      setForm({ businessName: '', slug: '', type: 'WINDOW_CLEANER', adminEmail: '', adminName: '', adminPassword: '' })
    } else {
      const data = await res.json()
      setCreateError(data.error ?? 'Failed to create tenant')
    }
  }

  const activeTenants = tenants.filter((t) => t.status === 'ACTIVE').length
  const totalBookings = tenants.reduce((sum, t) => sum + t._count.bookings, 0)
  const totalCustomers = tenants.reduce((sum, t) => sum + t._count.customers, 0)

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">BookRight</p>
            <p className="text-xs text-gray-500">Platform Admin</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Building2 className="w-5 h-5" />, label: 'Total Tenants', value: tenants.length, color: 'text-blue-400' },
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Active Tenants', value: activeTenants, color: 'text-green-400' },
            { icon: <BookOpen className="w-5 h-5" />, label: 'Total Bookings', value: totalBookings, color: 'text-purple-400' },
            { icon: <Users className="w-5 h-5" />, label: 'Total Customers', value: totalCustomers, color: 'text-amber-400' },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className={`mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tenants */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white">Tenants</h2>
            <button
              onClick={() => setShowNew(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> New Tenant
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-500" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Business</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Type</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Slug</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Bookings</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Customers</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Created</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{tenant.businessName}</p>
                      </td>
                      <td className="px-4 py-4 text-gray-400">{tenantTypeLabel(tenant.type)}</td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">/{tenant.slug}</span>
                      </td>
                      <td className="px-4 py-4 text-gray-300">{tenant._count.bookings}</td>
                      <td className="px-4 py-4 text-gray-300">{tenant._count.customers}</td>
                      <td className="px-4 py-4 text-gray-400">{formatDate(tenant.createdAt)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${tenant.status === 'ACTIVE' ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'ACTIVE' ? 'bg-green-400' : 'bg-gray-600'}`} />
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${tenant.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            title="View site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => toggleTenant(tenant)}
                            disabled={toggling === tenant.id}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                            title={tenant.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          >
                            {toggling === tenant.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : tenant.status === 'ACTIVE' ? (
                              <ToggleRight className="w-4 h-4 text-green-400" />
                            ) : (
                              <ToggleLeft className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tenants.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-gray-600 text-sm">No tenants yet — create the first one</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* New tenant modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="font-bold text-white">New Tenant</h3>
              <button onClick={() => setShowNew(false)} className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value, slug: slugify(e.target.value) }))}
                  placeholder="e.g. Bright Windows"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    placeholder="bright-windows"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Business Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="WINDOW_CLEANER">Window Cleaner</option>
                  <option value="HAIRDRESSER">Hairdresser / Salon</option>
                  <option value="PERSONAL_TRAINER">Personal Trainer</option>
                  <option value="PLUMBER">Plumber</option>
                </select>
              </div>
              <div className="border-t border-gray-800 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Admin User</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Admin name"
                    value={form.adminName}
                    onChange={(e) => setForm((f) => ({ ...f, adminName: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                  />
                  <input
                    type="email"
                    placeholder="Admin email"
                    value={form.adminEmail}
                    onChange={(e) => setForm((f) => ({ ...f, adminEmail: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                  />
                  <input
                    type="password"
                    placeholder="Admin password"
                    value={form.adminPassword}
                    onChange={(e) => setForm((f) => ({ ...f, adminPassword: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
                  />
                </div>
              </div>
              {createError && <p className="text-red-400 text-sm">{createError}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button
                  onClick={createTenant}
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Create Tenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
