'use client'

import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, UtensilsCrossed, Clock, FileText, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard',        label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/menu',   label: 'Menu',      icon: UtensilsCrossed },
  { href: '/admin/dashboard/hours',  label: 'Hours',     icon: Clock },
  { href: '/admin/dashboard/about',  label: 'About',     icon: FileText },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  return (
    <aside className="w-full md:w-60 shrink-0 bg-brand-text flex flex-col md:min-h-screen">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-sans text-white/40 text-[10px] font-bold tracking-[0.25em] uppercase mb-1">Admin</p>
        <h1 className="font-display text-white text-2xl font-bold">Happy Days</h1>
      </div>

      {/* Nav */}
      <nav className="flex md:flex-col flex-row overflow-x-auto md:overflow-visible flex-1 md:py-3 px-2 md:px-3 gap-1" aria-label="Admin navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-sans text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                active
                  ? 'bg-brand-accent text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/8'
              }`}
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </a>
          )
        })}
      </nav>

      <div className="hidden md:block p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl font-sans text-sm font-medium text-white/40 hover:text-red-400 hover:bg-white/5 transition-all duration-150"
        >
          <LogOut size={15} strokeWidth={2} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
