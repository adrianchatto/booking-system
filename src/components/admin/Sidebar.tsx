'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  BookOpen,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  slug: string
  businessName: string
}

export default function Sidebar({ slug, businessName }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { href: `/${slug}/admin/dashboard`, icon: LayoutDashboard, label: 'Overview' },
    { href: `/${slug}/admin/dashboard/bookings`, icon: BookOpen, label: 'Bookings' },
    { href: `/${slug}/admin/dashboard/calendar`, icon: CalendarDays, label: 'Calendar' },
    { href: `/${slug}/admin/dashboard/customers`, icon: Users, label: 'Customers' },
    { href: `/${slug}/admin/dashboard/settings`, icon: Settings, label: 'Settings & CMS' },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {businessName[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">{businessName}</p>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-4 h-4', active ? 'text-blue-600' : 'text-gray-400')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <Link
          href={`/${slug}`}
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-gray-400" />
          View Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: `/${slug}/admin/login` })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            {businessName[0]}
          </div>
          <span className="font-semibold text-gray-900 text-sm">{businessName}</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-14 bottom-0 w-64 bg-white">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
