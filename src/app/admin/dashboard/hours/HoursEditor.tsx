'use client'

import { useState } from 'react'
import { HourEntry } from '@/lib/content'

interface Props {
  initialHours: HourEntry[]
}

export default function HoursEditor({ initialHours }: Props) {
  const [hours, setHours] = useState(initialHours)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const update = (i: number, field: keyof HourEntry, value: string | boolean) => {
    const next = [...hours]
    next[i] = { ...next[i], [field]: value }
    setHours(next)
  }

  async function handleSave() {
    setSaving(true)
    const current = await fetch('/api/content').then(r => r.json())
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...current, hours }),
    })
    setSaving(false)
    setToast('Saved')
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="max-w-lg">
      <div className="space-y-3 mb-8">
        {hours.map((entry, i) => (
          <div key={entry.day} className="flex items-center gap-4 bg-brand-surface border border-brand-border px-4 py-3">
            <span className="font-sans text-brand-text/70 text-sm w-24 shrink-0">{entry.day}</span>

            <label className="flex items-center gap-2 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={!entry.closed}
                onChange={e => update(i, 'closed', !e.target.checked)}
                className="accent-[#C8A96E]"
              />
              <span className="font-sans text-brand-text/50 text-xs tracking-wide">Open</span>
            </label>

            {!entry.closed && (
              <>
                <input
                  type="time"
                  value={entry.open || ''}
                  onChange={e => update(i, 'open', e.target.value)}
                  className="bg-brand-bg border border-brand-border text-brand-text px-2 py-1 font-sans text-xs focus:outline-none focus:border-brand-accent w-24"
                />
                <span className="text-brand-text/30 text-xs">–</span>
                <input
                  type="time"
                  value={entry.close || ''}
                  onChange={e => update(i, 'close', e.target.value)}
                  className="bg-brand-bg border border-brand-border text-brand-text px-2 py-1 font-sans text-xs focus:outline-none focus:border-brand-accent w-24"
                />
              </>
            )}
            {entry.closed && (
              <span className="font-sans text-brand-text/25 text-xs tracking-wide italic">Closed</span>
            )}
          </div>
        ))}
      </div>

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
