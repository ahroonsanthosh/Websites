"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle } from "lucide-react";

interface SeoContent { title: string; description: string; og_image: string; keywords: string; }

export default function AdminSeoPage() {
  const [form, setForm] = useState<SeoContent>({ title: "", description: "", og_image: "", keywords: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/content/seo")
      .then((r) => r.json())
      .then((d) => { setForm(d); setLoading(false); })
      .catch(() => { setError("Failed to load."); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/content/seo", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
      else setError("Save failed.");
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-white/30 text-sm">Loading…</div>;

  const charCount = form.description.length;
  const titleCount = form.title.length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold mb-1">SEO Settings</h1>
        <p className="text-white/30 text-sm">Control how your site appears in search engines.</p>
      </div>

      <div className="space-y-5">
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-white/40 text-[10px] uppercase tracking-widest">Page Title</label>
              <span className={`text-[10px] ${titleCount > 60 ? "text-red-400" : "text-white/20"}`}>{titleCount}/60</span>
            </div>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-white/40 text-[10px] uppercase tracking-widest">Meta Description</label>
              <span className={`text-[10px] ${charCount > 160 ? "text-red-400" : "text-white/20"}`}>{charCount}/160</span>
            </div>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 resize-none" />
          </div>
          <div>
            <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Keywords</label>
            <input type="text" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              placeholder="comma, separated, keywords"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50" />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">Search Preview</p>
          <div className="bg-white rounded-xl p-4">
            <p className="text-blue-700 text-base font-medium leading-tight mb-0.5 truncate">{form.title || "Page Title"}</p>
            <p className="text-green-700 text-xs mb-1">hansumrotisserie.ie</p>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{form.description || "Page description…"}</p>
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3"><p className="text-red-400 text-sm">{error}</p></div>}

        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl px-6 py-3 transition-colors">
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
