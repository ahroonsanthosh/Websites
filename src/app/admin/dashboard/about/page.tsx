import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import AboutEditor from './AboutEditor'
import { getSiteData } from '@/lib/content'

export default async function AboutPage() {
  const cookieStore = cookies()
  if (cookieStore.get('hd-admin')?.value !== '1') {
    redirect('/admin')
  }

  const data = await getSiteData()

  return (
    <div className="min-h-screen bg-brand-bg flex">
      <AdminSidebar />
      <main className="flex-1 p-10">
        <h2 className="font-display text-brand-text text-3xl font-light mb-2">About Text</h2>
        <p className="font-sans text-brand-text/40 text-sm mb-10">Edit the story paragraph that appears in the About section.</p>
        <AboutEditor initialAbout={data.about} />
      </main>
    </div>
  )
}
