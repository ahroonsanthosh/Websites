'use client'

import { useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { MenuItem } from '@/lib/content'

interface Props {
  initialMenu: {
    breakfast: MenuItem[]
    lunch: MenuItem[]
    drinks: MenuItem[]
  }
}

type Category = 'breakfast' | 'lunch' | 'drinks'

function CategorySection({
  title,
  items,
  tag,
  onUpdate,
}: {
  title: string
  items: MenuItem[]
  tag: string
  onUpdate: (items: MenuItem[]) => void
}) {
  const addItem    = () => onUpdate([...items, { name: '', price: '' }])
  const removeItem = (i: number) => onUpdate(items.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: keyof MenuItem, val: string) => {
    const next = [...items]
    next[i] = { ...next[i], [field]: val }
    onUpdate(next)
  }

  return (
    <div className="bg-brand-surface rounded-2xl p-5 sm:p-6">
      <span className={`tag ${tag} mb-5 block w-fit`}>{title}</span>

      <div className="space-y-2 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={item.name}
              onChange={e => updateItem(i, 'name', e.target.value)}
              placeholder="Item name"
              className="flex-1 bg-brand-bg border border-brand-border text-brand-text rounded-xl px-3.5 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-accent transition-colors"
            />
            <input
              value={item.price}
              onChange={e => updateItem(i, 'price', e.target.value)}
              placeholder="€0"
              className="w-20 bg-brand-bg border border-brand-border text-brand-text rounded-xl px-3 py-2.5 font-sans text-sm text-center focus:outline-none focus:border-brand-accent transition-colors"
            />
            <button
              onClick={() => removeItem(i)}
              className="p-2 text-brand-border hover:text-red-400 transition-colors rounded-lg"
              aria-label="Remove item"
            >
              <Trash2 size={15} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-1.5 font-sans text-xs font-semibold text-brand-muted hover:text-brand-accent transition-colors py-1"
      >
        <Plus size={13} strokeWidth={2.5} />
        Add item
      </button>
    </div>
  )
}

export default function MenuEditor({ initialMenu }: Props) {
  const [menu, setMenu]   = useState(initialMenu)
  const [saving, setSaving] = useState(false)
  const [toast, setToast]   = useState('')

  const updateCategory = (cat: Category) => (items: MenuItem[]) =>
    setMenu(prev => ({ ...prev, [cat]: items }))

  async function handleSave() {
    setSaving(true)
    const current = await fetch('/api/content').then(r => r.json())
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...current, menu }),
    })
    setSaving(false)
    setToast('Saved!')
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="space-y-4">
      <CategorySection title="Breakfast" tag="tag-orange" items={menu.breakfast} onUpdate={updateCategory('breakfast')} />
      <CategorySection title="Lunch"     tag="tag-green"  items={menu.lunch}     onUpdate={updateCategory('lunch')} />
      <CategorySection title="Drinks"    tag="tag-orange" items={menu.drinks}     onUpdate={updateCategory('drinks')} />

      <div className="flex items-center gap-4 pt-2">
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
