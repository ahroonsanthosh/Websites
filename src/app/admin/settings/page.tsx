"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle } from "lucide-react";

interface SettingsContent {
  instagram: string;
  instagram_url: string;
  announcement_banner: string;
  announcement_active: boolean;
  contact_email: string;
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsContent>({
    instagram: "",
    instagram_url: "",
    announcement_banner: "",
    announcement_active: true,
    contact_email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/content/settings")
      .then((r) => r.json())
      .then((d) => { setForm(d); setLoading(false); })
      .catch(() => { setError("Failed to load."); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/content/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
      else setError("Save failed.");
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-white/30 text-sm">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-white/30 text-sm">Social links, announcement banner, and contact info.</p>
      </div>

      <div className="space-y-5">
        {/* Announcement */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-medium text-sm">Announcement Banner</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-white/40 text-xs">{form.announcement_active ? "Active" : "Hidden"}</span>
              <div
                onClick={() => setForm({ ...form, announcement_active: !form.announcement_active })}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${form.announcement_active ? "bg-orange-500" : "bg-white/10"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.announcement_active ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </label>
          </div>
          <textarea
            rows={2}
            value={form.announcement_banner}
            onChange={(e) => setForm({ ...form, announcement_banner: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 resize-none"
          />
        </div>

        {/* Social */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
          <h2 className="text-white font-medium text-sm">Social Media</h2>
          <div>
            <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Instagram Handle</label>
            <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Instagram URL</label>
            <input type="url" value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50" />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5">
          <h2 className="text-white font-medium text-sm mb-4">Contact</h2>
          <div>
            <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Email Address</label>
            <input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50" />
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
