"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, CheckCircle, GripVertical, Star } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  featured: boolean;
  available: boolean;
  badge: string;
  emoji: string;
}

interface MenuContent {
  categories: string[];
  items: MenuItem[];
}

const EMOJIS = ["🍗", "🌯", "🥪", "🥗", "🍟", "🔥", "📦", "🍖", "🧀", "🌶️"];

export default function AdminMenuPage() {
  const [data, setData] = useState<MenuContent>({ categories: [], items: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content/menu")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Failed to load."); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/content/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
      else setError("Save failed.");
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  const addItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: "New Item",
      category: data.categories[0] || "Mains",
      description: "",
      price: "€0.00",
      featured: false,
      available: true,
      badge: "",
      emoji: "🍗",
    };
    setData({ ...data, items: [...data.items, newItem] });
    setEditing(newItem.id);
  };

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    setData({
      ...data,
      items: data.items.map((item) => item.id === id ? { ...item, ...updates } : item),
    });
  };

  const deleteItem = (id: string) => {
    if (!confirm("Delete this item?")) return;
    setData({ ...data, items: data.items.filter((i) => i.id !== id) });
    if (editing === id) setEditing(null);
  };

  if (loading) return <div className="text-white/30 text-sm">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-semibold mb-1">Menu Items</h1>
          <p className="text-white/30 text-sm">{data.items.length} items across {data.categories.length} categories.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addItem}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-sans font-medium rounded-xl px-4 py-2.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-sans font-semibold rounded-xl px-4 py-2.5 transition-colors"
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save All"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {data.items.map((item) => (
          <div key={item.id} className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
            {/* Collapsed row */}
            <div
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/2 transition-colors"
              onClick={() => setEditing(editing === item.id ? null : item.id)}
            >
              <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-sans font-medium text-sm">{item.name}</span>
                  {item.featured && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                  {!item.available && <span className="text-[10px] text-white/30 uppercase tracking-widest">Unavailable</span>}
                </div>
                <span className="text-white/30 text-xs">{item.category}</span>
              </div>
              <span className="text-orange-400 font-sans font-semibold text-sm">{item.price}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                className="text-white/20 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Expanded editor */}
            {editing === item.id && (
              <div className="border-t border-white/5 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Price</label>
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, { price: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Category</label>
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item.id, { category: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50"
                  >
                    {data.categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Emoji</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => updateItem(item.id, { emoji: e })}
                        className={`text-xl w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${item.emoji === e ? "bg-orange-500/20 border border-orange-500/40" : "bg-white/5 hover:bg-white/10"}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Badge</label>
                  <input
                    type="text"
                    value={item.badge}
                    placeholder="e.g. Popular, New"
                    onChange={(e) => updateItem(item.id, { badge: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.featured}
                      onChange={(e) => updateItem(item.id, { featured: e.target.checked })}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-white/50 text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={(e) => updateItem(item.id, { available: e.target.checked })}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-white/50 text-sm">Available</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
