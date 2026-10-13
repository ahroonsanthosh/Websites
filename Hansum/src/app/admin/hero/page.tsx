"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle } from "lucide-react";

interface HeroContent {
  headline: string;
  subheadline: string;
  cta_primary: string;
  cta_primary_link: string;
  cta_secondary: string;
  cta_secondary_link: string;
  badge: string;
}

export default function AdminHeroPage() {
  const [form, setForm] = useState<HeroContent>({
    headline: "",
    subheadline: "",
    cta_primary: "",
    cta_primary_link: "",
    cta_secondary: "",
    cta_secondary_link: "",
    badge: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/content/hero")
      .then((r) => r.json())
      .then((data) => { setForm(data); setLoading(false); })
      .catch(() => { setError("Failed to load content."); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/content/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError("Failed to save.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const fields: Array<{ key: keyof HeroContent; label: string; hint?: string; multiline?: boolean }> = [
    { key: "headline", label: "Headline", hint: "Main hero headline", multiline: true },
    { key: "subheadline", label: "Subheadline", hint: "Supporting text below headline", multiline: true },
    { key: "badge", label: "Badge Text", hint: "Small label shown above headline" },
    { key: "cta_primary", label: "Primary Button Text" },
    { key: "cta_primary_link", label: "Primary Button Link", hint: "e.g. #menu" },
    { key: "cta_secondary", label: "Secondary Button Text" },
    { key: "cta_secondary_link", label: "Secondary Button Link", hint: "e.g. #location" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold mb-1">Hero Section</h1>
        <p className="text-white/30 text-sm">Edit the main headline and call-to-action buttons.</p>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm">Loading…</div>
      ) : (
        <div className="space-y-5">
          {fields.map(({ key, label, hint, multiline }) => (
            <div key={key} className="bg-[#141414] border border-white/5 rounded-2xl p-5">
              <label className="block text-white/50 text-xs font-sans uppercase tracking-widest mb-1.5">
                {label}
              </label>
              {hint && <p className="text-white/20 text-xs font-sans mb-2">{hint}</p>}
              {multiline ? (
                <textarea
                  rows={3}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-colors"
                />
              )}
            </div>
          ))}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-sans font-semibold text-sm rounded-xl px-6 py-3 transition-colors"
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
