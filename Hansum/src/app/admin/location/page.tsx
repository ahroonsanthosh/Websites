"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle } from "lucide-react";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

interface Hours { open: string; close: string; closed: boolean; }
interface LocationContent {
  name: string;
  address_line1: string;
  address_line2: string;
  google_maps_url: string;
  map_query: string;
  hours: Record<string, Hours>;
}

export default function AdminLocationPage() {
  const [form, setForm] = useState<LocationContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/content/location")
      .then((r) => r.json())
      .then((d) => { setForm(d); setLoading(false); })
      .catch(() => { setError("Failed to load."); setLoading(false); });
  }, []);

  const save = async () => {
    if (!form) return;
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/content/location", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
      else setError("Save failed.");
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  const updateHours = (day: string, field: keyof Hours, value: string | boolean) => {
    if (!form) return;
    setForm({ ...form, hours: { ...form.hours, [day]: { ...form.hours[day], [field]: value } } });
  };

  if (loading || !form) return <div className="text-white/30 text-sm">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold mb-1">Location & Hours</h1>
        <p className="text-white/30 text-sm">Update your address and opening times.</p>
      </div>

      <div className="space-y-5">
        {/* Address */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
          <h2 className="text-white font-medium text-sm">Address</h2>
          {[
            { key: "address_line1" as const, label: "Line 1", hint: "" },
            { key: "address_line2" as const, label: "Line 2", hint: "" },
            { key: "map_query" as const, label: "Map Location", hint: "What the map pin searches for, e.g. \"Marina Market, Cork\"" },
            { key: "google_maps_url" as const, label: "Google Maps URL", hint: "Link opened by the directions button" },
          ].map(({ key, label, hint }) => (
            <div key={key}>
              <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1.5">{label}</label>
              {hint && <p className="text-white/20 text-[11px] mb-1.5">{hint}</p>}
              <input
                type="text"
                value={form[key] ?? ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
          ))}
        </div>

        {/* Hours */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5">
          <h2 className="text-white font-medium text-sm mb-4">Opening Hours</h2>
          <div className="space-y-3">
            {DAYS.map((day) => {
              const h = form.hours[day] || { open: "12:00 PM", close: "8:00 PM", closed: false };
              return (
                <div key={day} className="flex items-center gap-3 flex-wrap">
                  <span className="text-white/50 text-sm w-24 flex-shrink-0">{day}</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={h.closed}
                      onChange={(e) => updateHours(day, "closed", e.target.checked)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-white/40 text-xs">Closed</span>
                  </label>
                  {!h.closed && (
                    <>
                      <input
                        type="text"
                        value={h.open}
                        onChange={(e) => updateHours(day, "open", e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs w-24 focus:outline-none focus:border-orange-500/50"
                      />
                      <span className="text-white/20 text-xs">–</span>
                      <input
                        type="text"
                        value={h.close}
                        onChange={(e) => updateHours(day, "close", e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs w-24 focus:outline-none focus:border-orange-500/50"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl px-6 py-3 transition-colors"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
