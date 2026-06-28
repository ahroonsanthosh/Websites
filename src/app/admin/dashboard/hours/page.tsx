import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import HoursEditor from './HoursEditor'
import { getSiteData } from '@/lib/content'

export default async function HoursPage() {
  const cookieStore = cookies()
  if (cookieStore.get('hd-admin')?.value !== '1') {
    redirect('/admin')
  }

  const data = await getSiteData()

  return (
    <div className="min-h-screen bg-brand-bg flex">
      <AdminSidebar />
      <main className="flex-1 p-10">
        <h2 className="font-display text-brand-text text-3xl font-light mb-2">Opening Hours</h2>
        <p className="font-sans text-brand-text/40 text-sm mb-10">Set open/close times or mark days as closed.</p>
        <HoursEditor initialHours={data.hours} />
      </main>
    </div>
  )
}
