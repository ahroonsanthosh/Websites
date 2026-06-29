"use client";

import { useState, useEffect, useCallback } from "react";

type SiteContent = {
  business: {
    name: string;
    tagline: string;
    address: { line1: string; line2: string; city: string; eircode: string; country: string };
    instagram: string;
    phone: string;
    mapsUrl: string;
    mapsEmbed: string;
  };
  hours: { day: string; time: string; closed: boolean }[];
  about: {
    heading: string;
    paragraphs: string[];
    stats: { value: string; label: string }[];
    images: { src: string; alt: string }[];
  };
  menu: {
    note: string;
    categories: string[];
    items: Record<string, { name: string; description: string; price: string; tag: string }[]>;
  };
  gallery: { src: string; alt: string }[];
};

type Tab = "business" | "hours" | "about" | "menu" | "gallery";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [fileSha, setFileSha] = useState("");
  const [tab, setTab] = useState<Tab>("menu");
  const [activeMenuCat, setActiveMenuCat] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; msg: string }>({ type: "", msg: "" });

  const fetchContent = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms", { headers: { "x-admin-password": pw } });
      if (res.status === 401) { setStatus({ type: "error", msg: "Incorrect password" }); return; }
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const { content: data, sha } = await res.json();
      setFileSha(sha);
      setContent(data);
      setActiveMenuCat(data.menu.categories[0]);
      setAuthed(true);
    } catch (e: unknown) {
      setStatus({ type: "error", msg: e instanceof Error ? e.message : "Failed to load" });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    fetchContent(password);
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setStatus({ type: "", msg: "" });
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "x-admin-password": password, "Content-Type": "application/json" },
        body: JSON.stringify({ content, sha: fileSha }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Save failed"); }
      const { sha } = await res.json();
      setFileSha(sha);
      setStatus({ type: "success", msg: "Saved! Site will redeploy in ~2 minutes." });
    } catch (e: unknown) {
      setStatus({ type: "error", msg: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#1A0C05] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#FDF6EB]/5 border border-[#FDF6EB]/10 rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#EE1C1C] flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl" style={{ fontFamily: "serif" }}>U</span>
            </div>
            <h1 className="text-[#FDF6EB] text-xl font-bold" style={{ fontFamily: "Georgia, serif" }}>Uncle&apos;s Admin</h1>
            <p className="text-[#FDF6EB]/40 text-xs mt-1">Content Management</p>
          </div>
          <div>
            <label className="block text-[#FDF6EB]/60 text-xs uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FDF6EB]/10 border border-[#FDF6EB]/20 rounded-xl px-4 py-3 text-[#FDF6EB] text-sm outline-none focus:border-[#EE1C1C] transition-colors"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {status.type === "error" && <p className="text-red-400 text-sm text-center">{status.msg}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#EE1C1C] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "menu", label: "Menu" },
    { id: "hours", label: "Hours" },
    { id: "about", label: "About" },
    { id: "business", label: "Business" },
    { id: "gallery", label: "Gallery" },
  ];

  const inp = "w-full bg-[#FDF6EB]/10 border border-[#FDF6EB]/20 rounded-xl px-4 py-2.5 text-[#FDF6EB] text-sm outline-none focus:border-[#EE1C1C] transition-colors";
  const lbl = "block text-[#FDF6EB]/50 text-[10px] uppercase tracking-widest mb-1.5";

  return (
    <div className="min-h-screen bg-[#1A0C05] text-[#FDF6EB]">
      <div className="sticky top-0 z-50 bg-[#0D0602]/95 backdrop-blur border-b border-[#FDF6EB]/10 px-5 md:px-10 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#EE1C1C] flex items-center justify-center">
            <span className="text-white text-xs font-bold">U</span>
          </div>
          <span className="text-sm font-semibold" style={{ fontFamily: "Georgia, serif" }}>Uncle&apos;s Admin</span>
        </div>
        <div className="flex items-center gap-3">
          {status.type && (
            <span className={`text-xs px-3 py-1 rounded-full ${status.type === "success" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
              {status.msg}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-[#EE1C1C] text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save & Deploy"}
          </button>
          <button
            onClick={() => { setAuthed(false); setContent(null); setPassword(""); setStatus({ type: "", msg: "" }); }}
            className="px-4 py-2 bg-[#FDF6EB]/10 text-[#FDF6EB]/50 text-xs font-semibold rounded-full hover:bg-[#FDF6EB]/20 hover:text-[#FDF6EB] transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-10 py-8">
        <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-8 pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${
                tab === t.id ? "bg-[#EE1C1C] text-white" : "bg-[#FDF6EB]/10 text-[#FDF6EB]/50 hover:bg-[#FDF6EB]/15"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {content && tab === "menu" && (
          <div className="space-y-6">
            <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
              {content.menu.categories.map((cat) => (
                <button key={cat} onClick={() => setActiveMenuCat(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs transition-all ${activeMenuCat === cat ? "bg-[#FDF6EB]/20 text-[#FDF6EB]" : "text-[#FDF6EB]/40 hover:text-[#FDF6EB]/70"}`}>
                  {cat}
                </button>
              ))}
            </div>
            {(content.menu.items[activeMenuCat] ?? []).map((item, i) => (
              <div key={i} className="bg-[#FDF6EB]/5 border border-[#FDF6EB]/10 rounded-2xl p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={lbl}>Name</label>
                    <input className={inp} value={item.name} onChange={(e) => { const u = { ...content }; u.menu.items[activeMenuCat][i].name = e.target.value; setContent(u); }} /></div>
                  <div><label className={lbl}>Price</label>
                    <input className={inp} value={item.price} onChange={(e) => { const u = { ...content }; u.menu.items[activeMenuCat][i].price = e.target.value; setContent(u); }} /></div>
                </div>
                <div><label className={lbl}>Description</label>
                  <input className={inp} value={item.description} onChange={(e) => { const u = { ...content }; u.menu.items[activeMenuCat][i].description = e.target.value; setContent(u); }} /></div>
                <div className="flex items-center justify-between">
                  <div className="w-40"><label className={lbl}>Badge (optional)</label>
                    <input className={inp} value={item.tag} placeholder="e.g. Fan Fave" onChange={(e) => { const u = { ...content }; u.menu.items[activeMenuCat][i].tag = e.target.value; setContent(u); }} /></div>
                  <button onClick={() => { const u = { ...content }; u.menu.items[activeMenuCat] = u.menu.items[activeMenuCat].filter((_, j) => j !== i); setContent(u); }}
                    className="text-red-400/60 hover:text-red-400 text-xs mt-4 transition-colors">Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => { const u = { ...content }; if (!u.menu.items[activeMenuCat]) u.menu.items[activeMenuCat] = []; u.menu.items[activeMenuCat].push({ name: "", description: "", price: "€0.00", tag: "" }); setContent(u); }}
              className="w-full py-3 border border-dashed border-[#FDF6EB]/20 rounded-2xl text-[#FDF6EB]/40 hover:text-[#FDF6EB]/70 hover:border-[#FDF6EB]/40 text-sm transition-all">
              + Add Item to {activeMenuCat}
            </button>
            <div><label className={lbl}>Menu footer note</label>
              <input className={inp} value={content.menu.note} onChange={(e) => setContent({ ...content, menu: { ...content.menu, note: e.target.value } })} /></div>
          </div>
        )}

        {content && tab === "hours" && (
          <div className="space-y-3">
            {content.hours.map((h, i) => (
              <div key={h.day} className="bg-[#FDF6EB]/5 border border-[#FDF6EB]/10 rounded-xl p-4 flex items-center gap-4">
                <span className="w-28 font-semibold text-sm shrink-0">{h.day}</span>
                <label className="flex items-center gap-2 shrink-0">
                  <input type="checkbox" checked={h.closed} className="accent-[#EE1C1C]"
                    onChange={(e) => { const u = { ...content }; u.hours[i].closed = e.target.checked; if (e.target.checked) u.hours[i].time = "Closed"; setContent(u); }} />
                  <span className="text-xs text-[#FDF6EB]/50">Closed</span>
                </label>
                {!h.closed && <input className={`${inp} flex-1`} value={h.time} placeholder="9:00 – 17:30"
                  onChange={(e) => { const u = { ...content }; u.hours[i].time = e.target.value; setContent(u); }} />}
              </div>
            ))}
          </div>
        )}

        {content && tab === "about" && (
          <div className="space-y-6">
            <div><label className={lbl}>Heading</label>
              <input className={inp} value={content.about.heading} onChange={(e) => setContent({ ...content, about: { ...content.about, heading: e.target.value } })} /></div>
            {content.about.paragraphs.map((p, i) => (
              <div key={i}><label className={lbl}>Paragraph {i + 1}</label>
                <textarea className={`${inp} resize-y min-h-[80px]`} value={p}
                  onChange={(e) => { const u = { ...content }; u.about.paragraphs[i] = e.target.value; setContent(u); }} /></div>
            ))}
            <div><label className={lbl}>Stats</label>
              <div className="grid grid-cols-3 gap-3">
                {content.about.stats.map((s, i) => (
                  <div key={i} className="bg-[#FDF6EB]/5 rounded-xl p-3 space-y-2">
                    <input className={inp} value={s.value} placeholder="Value" onChange={(e) => { const u = { ...content }; u.about.stats[i].value = e.target.value; setContent(u); }} />
                    <input className={inp} value={s.label} placeholder="Label" onChange={(e) => { const u = { ...content }; u.about.stats[i].label = e.target.value; setContent(u); }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {content && tab === "business" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {([ ["Business Name", "name"], ["Tagline", "tagline"], ["Instagram Handle", "instagram"], ["Phone", "phone"] ] as const).map(([l, key]) => (
                <div key={key}><label className={lbl}>{l}</label>
                  <input className={inp} value={content.business[key]} onChange={(e) => setContent({ ...content, business: { ...content.business, [key]: e.target.value } })} /></div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-[#FDF6EB]/50 text-[10px] uppercase tracking-widest">Address</p>
              {(["line1", "line2", "city", "eircode", "country"] as const).map((k) => (
                <div key={k}><label className={lbl}>{k}</label>
                  <input className={inp} value={content.business.address[k]}
                    onChange={(e) => setContent({ ...content, business: { ...content.business, address: { ...content.business.address, [k]: e.target.value } } })} /></div>
              ))}
            </div>
          </div>
        )}

        {content && tab === "gallery" && (
          <div className="space-y-4">
            {content.gallery.map((photo, i) => (
              <div key={i} className="bg-[#FDF6EB]/5 border border-[#FDF6EB]/10 rounded-xl p-4 flex gap-4 items-start">
                <img src={photo.src} alt={photo.alt} className="w-20 h-20 object-cover rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div><label className={lbl}>Image URL</label>
                    <input className={inp} value={photo.src} onChange={(e) => { const u = { ...content }; u.gallery[i].src = e.target.value; setContent(u); }} /></div>
                  <div><label className={lbl}>Alt text</label>
                    <input className={inp} value={photo.alt} onChange={(e) => { const u = { ...content }; u.gallery[i].alt = e.target.value; setContent(u); }} /></div>
                </div>
                <button onClick={() => { const u = { ...content }; u.gallery = u.gallery.filter((_, j) => j !== i); setContent(u); }}
                  className="text-red-400/60 hover:text-red-400 text-xs mt-1 transition-colors shrink-0">Remove</button>
              </div>
            ))}
            <button onClick={() => setContent({ ...content, gallery: [...content.gallery, { src: "", alt: "" }] })}
              className="w-full py-3 border border-dashed border-[#FDF6EB]/20 rounded-2xl text-[#FDF6EB]/40 hover:text-[#FDF6EB]/70 hover:border-[#FDF6EB]/40 text-sm transition-all">
              + Add Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
