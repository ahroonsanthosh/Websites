'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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
  onUpdate,
}: {
  title: string
  items: MenuItem[]
  onUpdate: (items: MenuItem[]) => void
}) {
  const addItem = () => onUpdate([...items, { name: '', price: '' }])
  const removeItem = (i: number) => onUpdate(items.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: keyof MenuItem, val: string) => {
    const next = [...items]
    next[i] = { ...next[i], [field]: val }
    onUpdate(next)
  }

  return (
    <div className="mb-10">
      <p className="font-sans text-brand-accent text-xs tracking-[0.3em] uppercase mb-4">{title}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              value={item.name}
              onChange={e => updateItem(i, 'name', e.target.value)}
              placeholder="Item name"
              className="flex-1 bg-brand-surface border border-brand-border text-brand-text px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-accent transition-colors"
            />
            <input
              value={item.price}
              onChange={e => updateItem(i, 'price', e.target.value)}
              placeholder="Price"
              className="w-28 bg-brand-surface border border-brand-border text-brand-text px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-accent transition-colors"
            />
            <button
              onClick={() => removeItem(i)}
              className="text-brand-text/30 hover:text-red-400 transition-colors p-1.5"
              aria-label="Remove item"
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="mt-3 flex items-center gap-2 font-sans text-xs text-brand-text/40 hover:text-brand-accent transition-colors tracking-wide"
      >
        <Plus size={13} strokeWidth={1.5} />
        Add item
      </button>
    </div>
  )
}

export default function MenuEditor({ initialMenu }: Props) {
  const [menu, setMenu] = useState(initialMenu)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

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
    setToast('Saved')
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div>
      <CategorySection title="Breakfast — until noon" items={menu.breakfast} onUpdate={updateCategory('breakfast')} />
      <CategorySection title="Lunch" items={menu.lunch} onUpdate={updateCategory('lunch')} />
      <CategorySection title="Drinks" items={menu.drinks} onUpdate={updateCategory('drinks')} />

      <div className="flex items-center gap-4 mt-4">
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
