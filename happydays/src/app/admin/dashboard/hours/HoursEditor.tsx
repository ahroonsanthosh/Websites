'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { HourEntry } from '@/lib/content'

interface Props {
  initialHours: HourEntry[]
}

export default function HoursEditor({ initialHours }: Props) {
  const [hours, setHours]   = useState(initialHours)
  const [saving, setSaving] = useState(false)
  const [toast, setToast]   = useState('')

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
    setToast('Saved!')
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="max-w-lg">
      <div className="space-y-2 mb-6">
        {hours.map((entry, i) => (
          <div
            key={entry.day}
            className={`flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3.5 border transition-colors ${
              entry.closed ? 'bg-brand-surface border-brand-border' : 'bg-brand-surface border-brand-accent/30'
            }`}
          >
            <span className="font-sans text-brand-text font-semibold text-sm w-24 shrink-0">{entry.day}</span>

            {/* Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => update(i, 'closed', entry.closed ? false : true)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  !entry.closed ? 'bg-brand-green' : 'bg-brand-border'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  !entry.closed ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </div>
              <span className={`font-sans text-xs font-semibold ${!entry.closed ? 'text-brand-green' : 'text-brand-muted'}`}>
                {entry.closed ? 'Closed' : 'Open'}
              </span>
            </label>

            {!entry.closed && (
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="time"
                  value={entry.open || ''}
                  onChange={e => update(i, 'open', e.target.value)}
                  className="bg-brand-bg border border-brand-border text-brand-text rounded-xl px-3 py-2 font-sans text-xs font-medium focus:outline-none focus:border-brand-accent w-28"
                />
                <span className="text-brand-muted text-xs font-bold">–</span>
                <input
                  type="time"
                  value={entry.close || ''}
                  onChange={e => update(i, 'close', e.target.value)}
                  className="bg-brand-bg border border-brand-border text-brand-text rounded-xl px-3 py-2 font-sans text-xs font-medium focus:outline-none focus:border-brand-accent w-28"
                />
              </div>
            )}
          </div>
        ))}
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
