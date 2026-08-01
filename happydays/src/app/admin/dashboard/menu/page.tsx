import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import MenuEditor from './MenuEditor'
import { getSiteData } from '@/lib/content'

export default async function MenuPage() {
  const cookieStore = cookies()
  if (cookieStore.get('hd-admin')?.value !== '1') {
    redirect('/admin')
  }

  const data = await getSiteData()

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 sm:py-10 max-w-4xl">
        <h2 className="font-display text-brand-text text-3xl sm:text-4xl font-bold mb-2">Menu Editor</h2>
        <p className="font-sans text-brand-muted text-sm mb-10">Add, edit, or remove menu items. Changes apply immediately.</p>
        <MenuEditor initialMenu={data.menu} />
      </main>
    </div>
  )
}
