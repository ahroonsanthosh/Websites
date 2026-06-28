import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { getSiteData } from '@/lib/content'
import { UtensilsCrossed, Clock, Image, ArrowRight } from 'lucide-react'

export default async function Dashboard() {
  const cookieStore = cookies()
  if (cookieStore.get('hd-admin')?.value !== '1') redirect('/admin')

  const data = await getSiteData()
  const totalItems = data.menu.breakfast.length + data.menu.lunch.length + data.menu.drinks.length
  const openDays = data.hours.filter(h => !h.closed).length

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 sm:py-10 max-w-4xl">
        <div className="mb-8">
          <h2 className="font-display text-brand-text text-3xl sm:text-4xl font-bold mb-1">Dashboard</h2>
          <p className="font-sans text-brand-muted text-sm">Manage your site content below.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            { label: 'Menu Items', value: totalItems, color: 'text-brand-accent' },
            { label: 'Open Days',  value: openDays,   color: 'text-brand-green' },
            { label: 'Photos',     value: 8,           color: 'text-brand-accent' },
          ].map(s => (
            <div key={s.label} className="bg-brand-surface rounded-2xl p-4 sm:p-6">
              <p className="font-sans text-brand-muted text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-2">{s.label}</p>
              <p className={`font-display ${s.color} text-4xl sm:text-5xl font-bold`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { href: '/admin/dashboard/menu',  title: 'Edit Menu',   desc: 'Update prices, add or remove dishes',     icon: UtensilsCrossed, tag: 'tag-orange' },
            { href: '/admin/dashboard/hours', title: 'Edit Hours',  desc: 'Change opening times or mark days closed', icon: Clock,           tag: 'tag-green' },
            { href: '/admin/dashboard/about', title: 'Edit About',  desc: 'Update the story section copy',           icon: Image,           tag: 'tag-orange' },
          ].map(({ href, title, desc, icon: Icon, tag }) => (
            <a
              key={href}
              href={href}
              className="group flex items-start gap-4 bg-brand-surface rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center shrink-0">
                <Icon size={18} strokeWidth={2} className="text-brand-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-brand-text font-bold text-sm mb-0.5">{title}</p>
                <p className="font-sans text-brand-muted text-xs leading-relaxed">{desc}</p>
              </div>
              <ArrowRight size={16} strokeWidth={2} className="text-brand-border group-hover:text-brand-accent transition-colors mt-0.5 shrink-0" />
            </a>
          ))}
        </div>

        {/* View site link */}
        <div className="mt-8 pt-6 border-t border-brand-border">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-brand-muted text-sm hover:text-brand-accent transition-colors flex items-center gap-2"
          >
            <ArrowRight size={14} strokeWidth={2} />
            View live site
          </a>
        </div>
      </main>
    </div>
  )
}
