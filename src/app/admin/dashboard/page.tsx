import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { getSiteData } from '@/lib/content'

export default async function Dashboard() {
  const cookieStore = cookies()
  if (cookieStore.get('hd-admin')?.value !== '1') {
    redirect('/admin')
  }

  const data = await getSiteData()

  return (
    <div className="min-h-screen bg-brand-bg flex">
      <AdminSidebar />
      <main className="flex-1 p-10">
        <h2 className="font-display text-brand-text text-3xl font-light mb-2">Dashboard</h2>
        <p className="font-sans text-brand-text/40 text-sm mb-10">Overview of your site content.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Menu Items', value: data.menu.breakfast.length + data.menu.lunch.length + data.menu.drinks.length },
            { label: 'Open Days', value: data.hours.filter(h => !h.closed).length },
            { label: 'Gallery Images', value: 8 },
          ].map(stat => (
            <div key={stat.label} className="bg-brand-surface border border-brand-border p-6">
              <p className="font-sans text-brand-text/40 text-xs tracking-[0.3em] uppercase mb-3">{stat.label}</p>
              <p className="font-display text-brand-accent text-5xl font-light">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          <a href="/admin/dashboard/menu" className="block bg-brand-surface border border-brand-border p-6 hover:border-brand-accent transition-colors group">
            <p className="font-sans text-brand-accent text-xs tracking-[0.3em] uppercase mb-2 group-hover:text-brand-accent">Edit Menu →</p>
            <p className="font-sans text-brand-text/50 text-sm">Update prices, add or remove dishes</p>
          </a>
          <a href="/admin/dashboard/hours" className="block bg-brand-surface border border-brand-border p-6 hover:border-brand-accent transition-colors group">
            <p className="font-sans text-brand-accent text-xs tracking-[0.3em] uppercase mb-2">Edit Hours →</p>
            <p className="font-sans text-brand-text/50 text-sm">Change opening times or mark days closed</p>
          </a>
          <a href="/admin/dashboard/about" className="block bg-brand-surface border border-brand-border p-6 hover:border-brand-accent transition-colors group">
            <p className="font-sans text-brand-accent text-xs tracking-[0.3em] uppercase mb-2">Edit About Text →</p>
            <p className="font-sans text-brand-text/50 text-sm">Update the story section copy</p>
          </a>
        </div>
      </main>
    </div>
  )
}
