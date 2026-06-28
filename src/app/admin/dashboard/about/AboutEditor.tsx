'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

interface Props {
  initialAbout: string
}

export default function AboutEditor({ initialAbout }: Props) {
  const [text, setText]     = useState(initialAbout)
  const [saving, setSaving] = useState(false)
  const [toast, setToast]   = useState('')

  async function handleSave() {
    setSaving(true)
    const current = await fetch('/api/content').then(r => r.json())
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...current, about: text }),
    })
    setSaving(false)
    setToast('Saved!')
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="max-w-xl">
      <div className="bg-brand-surface rounded-2xl p-5 sm:p-6 mb-4">
        <span className="tag tag-orange mb-4 block w-fit">About Text</span>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={7}
          className="w-full bg-brand-bg border border-brand-border text-brand-text rounded-xl px-4 py-3 font-sans text-sm leading-relaxed focus:outline-none focus:border-brand-accent transition-colors resize-none"
          placeholder="Write the about section text here…"
        />
        <p className="font-sans text-brand-muted text-xs mt-2">{text.length} characters</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-accent text-white rounded-full font-sans text-sm font-bold tracking-wide px-6 py-3 hover:bg-brand-text transition-colors disabled:opacity-50"
        >
          <Save size={14} strokeWidth={2.5} />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {toast && <span className="font-sans text-brand-green text-sm font-semibold">{toast}</span>}
      </div>
    </div>
  )
}
