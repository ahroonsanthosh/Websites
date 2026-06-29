'use client';
import { useState, useEffect } from 'react';
import type { SiteContent, MenuCategory, MenuItem, HoursEntry } from '@/types/content';

const SECTIONS = ['Site Info', 'Hero', 'About', 'Menu', 'Hours'] as const;
type Section = typeof SECTIONS[number];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('Site Info');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authed) {
      fetch('/api/content')
        .then((r) => r.json())
        .then(setContent)
        .catch(() => setError('Failed to load content'));
    }
  }, [authed]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      setAuthed(true);
      setAuthError('');
    } else {
      setAuthError('Please enter a password');
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Failed to save');
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const updateSite = (key: keyof SiteContent['site'], value: string) => {
    if (!content) return;
    setContent({ ...content, site: { ...content.site, [key]: value } });
  };

  const updateHero = (key: keyof SiteContent['hero'], value: string) => {
    if (!content) return;
    setContent({ ...content, hero: { ...content.hero, [key]: value } });
  };

  const updateAbout = (key: keyof SiteContent['about'], value: string) => {
    if (!content) return;
    setContent({ ...content, about: { ...content.about, [key]: value } });
  };

  const updateHours = (index: number, field: keyof HoursEntry, value: string | boolean) => {
    if (!content) return;
    const days = [...content.hours.days];
    days[index] = { ...days[index], [field]: value };
    setContent({ ...content, hours: { days } });
  };

  const updateMenuItem = (catIndex: number, itemIndex: number, field: keyof MenuItem, value: string) => {
    if (!content) return;
    const categories = content.menu.categories.map((cat, ci) => {
      if (ci !== catIndex) return cat;
      const items = cat.items.map((item, ii) =>
        ii === itemIndex ? { ...item, [field]: value } : item
      );
      return { ...cat, items };
    });
    setContent({ ...content, menu: { categories } });
  };

  const addMenuItem = (catIndex: number) => {
    if (!content) return;
    const categories = content.menu.categories.map((cat, ci) => {
      if (ci !== catIndex) return cat;
      const newItem: MenuItem = { id: `item-${Date.now()}`, name: 'New Item', price: '€0.00', description: '' };
      return { ...cat, items: [...cat.items, newItem] };
    });
    setContent({ ...content, menu: { categories } });
  };

  const removeMenuItem = (catIndex: number, itemIndex: number) => {
    if (!content) return;
    const categories = content.menu.categories.map((cat, ci) => {
      if (ci !== catIndex) return cat;
      return { ...cat, items: cat.items.filter((_, ii) => ii !== itemIndex) };
    });
    setContent({ ...content, menu: { categories } });
  };

  const input = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-amber-500 transition-colors';
  const label = 'block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide';
  const btn = 'px-4 py-2 text-xs font-medium uppercase tracking-widest rounded-lg transition-colors';

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 font-serif">LOKA CMS</h1>
          <p className="text-gray-500 text-sm mb-6">Enter your admin password to continue.</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="pw" className={label}>Password</label>
              <input
                id="pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={input}
                placeholder="••••••••"
                autoFocus
              />
              {authError && <p className="text-red-500 text-xs mt-1">{authError}</p>}
            </div>
            <button type="submit" className={`${btn} w-full bg-amber-700 text-white hover:bg-amber-800`}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">{error || 'Loading…'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-lg text-gray-900">LOKA</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">Content Manager</span>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-green-600 text-xs font-medium">✓ Saved</span>}
            {error && <span className="text-red-500 text-xs">{error}</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`${btn} bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50`}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <a href="/" target="_blank" className={`${btn} border border-gray-200 text-gray-600 hover:bg-gray-50`}>
              View Site ↗
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-44 shrink-0">
          <nav className="space-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeSection === s
                    ? 'bg-amber-50 text-amber-800 font-medium'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {s}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">

          {activeSection === 'Site Info' && (
            <section className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Site Information</h2>
              {(Object.keys(content.site) as Array<keyof SiteContent['site']>).map((key) => (
                <div key={key}>
                  <label className={label}>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input type="text" value={content.site[key]} onChange={(e) => updateSite(key, e.target.value)} className={input} />
                </div>
              ))}
            </section>
          )}

          {activeSection === 'Hero' && (
            <section className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Hero Section</h2>
              {(Object.keys(content.hero) as Array<keyof SiteContent['hero']>).map((key) => (
                <div key={key}>
                  <label className={label}>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input type="text" value={content.hero[key]} onChange={(e) => updateHero(key, e.target.value)} className={input} />
                </div>
              ))}
            </section>
          )}

          {activeSection === 'About' && (
            <section className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-6">About Section</h2>
              {(Object.keys(content.about) as Array<keyof SiteContent['about']>).map((key) => (
                <div key={key}>
                  <label className={label}>{key.replace(/([A-Z])/g, ' $1')}</label>
                  {(key === 'body1' || key === 'body2') ? (
                    <textarea rows={3} value={content.about[key]} onChange={(e) => updateAbout(key, e.target.value)} className={`${input} resize-none`} />
                  ) : (
                    <input type="text" value={content.about[key]} onChange={(e) => updateAbout(key, e.target.value)} className={input} />
                  )}
                </div>
              ))}
            </section>
          )}

          {activeSection === 'Menu' && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Menu Items</h2>
              <div className="space-y-10">
                {content.menu.categories.map((cat: MenuCategory, ci: number) => (
                  <div key={cat.id}>
                    <h3 className="font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">{cat.name}</h3>
                    <div className="space-y-3">
                      {cat.items.map((item: MenuItem, ii: number) => (
                        <div key={item.id} className="flex gap-2 items-start p-3 rounded-lg border border-gray-100">
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <input
                              placeholder="Name"
                              value={item.name}
                              onChange={(e) => updateMenuItem(ci, ii, 'name', e.target.value)}
                              className={`${input} col-span-2`}
                            />
                            <input
                              placeholder="Price"
                              value={item.price}
                              onChange={(e) => updateMenuItem(ci, ii, 'price', e.target.value)}
                              className={input}
                            />
                            <input
                              placeholder="Description (optional)"
                              value={item.description ?? ''}
                              onChange={(e) => updateMenuItem(ci, ii, 'description', e.target.value)}
                              className={`${input} col-span-3`}
                            />
                          </div>
                          <button
                            onClick={() => removeMenuItem(ci, ii)}
                            className="mt-1 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                            aria-label="Remove item"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => addMenuItem(ci)}
                      className={`${btn} mt-4 border border-dashed border-amber-300 text-amber-700 hover:bg-amber-50`}
                    >
                      + Add Item
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'Hours' && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Opening Hours</h2>
              <div className="space-y-3">
                {content.hours.days.map((entry: HoursEntry, i: number) => (
                  <div key={entry.day} className="flex items-center gap-4">
                    <span className="w-24 text-sm font-medium text-gray-700 shrink-0">{entry.day}</span>
                    <input
                      value={entry.hours}
                      onChange={(e) => updateHours(i, 'hours', e.target.value)}
                      className={`${input} flex-1`}
                      disabled={entry.closed}
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
                      <input
                        type="checkbox"
                        checked={entry.closed}
                        onChange={(e) => updateHours(i, 'closed', e.target.checked)}
                        className="rounded"
                      />
                      Closed
                    </label>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
