'use client'

import { useState } from 'react'

interface Props {
  initialAbout: string
}

export default function AboutEditor({ initialAbout }: Props) {
  const [text, setText] = useState(initialAbout)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  async function handleSave() {
    setSaving(true)
    const current = await fetch('/api/content').then(r => r.json())
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...current, about: text }),
    })
    setSaving(false)
    setToast('Saved')
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="max-w-xl">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={6}
        className="w-full bg-brand-surface border border-brand-border text-brand-text px-4 py-3 font-sans text-sm leading-relaxed focus:outline-none focus:border-brand-accent transition-colors resize-none mb-4"
        placeholder="Write the about section text here…"
      />
      <p className="font-sans text-brand-text/30 text-xs mb-6">{text.length} characters</p>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-accent text-brand-bg font-sans text-sm tracking-widest uppercase px-7 py-3 hover:bg-brand-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {toast && <span className="font-sans text-brand-accent text-sm">{toast}</span>}
      </div>
    </div>
  )
}
