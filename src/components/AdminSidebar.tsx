'use client'

import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, UtensilsCrossed, Clock, FileText, Image, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/admin/dashboard/hours', label: 'Hours', icon: Clock },
  { href: '/admin/dashboard/about', label: 'About', icon: FileText },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  return (
    <aside className="w-56 shrink-0 bg-brand-surface border-r border-brand-border min-h-screen flex flex-col">
      <div className="px-6 py-8 border-b border-brand-border">
        <h1 className="font-display text-brand-text text-xl font-light tracking-wide">Happy Days</h1>
        <p className="font-sans text-brand-text/30 text-[10px] tracking-[0.3em] uppercase mt-1">Admin</p>
      </div>

      <nav className="flex-1 py-4" aria-label="Admin navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <a
              key={href}
              href={href}
              className={`admin-sidebar-link flex items-center gap-3 px-6 py-3 font-sans text-sm transition-colors ${
                active ? 'text-brand-accent bg-brand-accent/8' : 'text-brand-text/50'
              }`}
            >
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </a>
          )
        })}
      </nav>

      <div className="p-4 border-t border-brand-border">
        <button
          onClick={handleLogout}
          className="admin-sidebar-link w-full flex items-center gap-3 px-2 py-2 font-sans text-sm text-brand-text/40 hover:text-red-400 transition-colors"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
