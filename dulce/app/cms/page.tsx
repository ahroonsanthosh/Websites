"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Lock, Eye, EyeOff, Plus, Trash2, Check, AlertCircle } from "lucide-react";

type Hour = { day: string; open: string; close: string };
type Content = {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  hours: Hour[];
  social: { instagram: string; facebook: string };
};

const CMS_PASSWORD_KEY = "dulce_cms_pw";

export default function CmsPage() {
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<"info" | "hours" | "social">("info");

  useEffect(() => {
    const pw = localStorage.getItem(CMS_PASSWORD_KEY);
    if (pw) {
      setSavedPassword(pw);
      fetchContent(pw);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContent = useCallback(async (pw: string) => {
    setError(null);
    try {
      const res = await fetch("/api/cms", {
        headers: { "x-cms-password": pw },
      });
      if (!res.ok) throw new Error("Wrong password");
      const data = await res.json();
      setContent(data);
      localStorage.setItem(CMS_PASSWORD_KEY, pw);
      setSavedPassword(pw);
    } catch (e) {
      setError(String(e));
      setSavedPassword(null);
      localStorage.removeItem(CMS_PASSWORD_KEY);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContent(password);
  };

  const handleSave = async () => {
    if (!content || !savedPassword) return;
    setSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "x-cms-password": savedPassword, "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Content, value: unknown) => {
    setContent((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const updateHour = (i: number, key: keyof Hour, value: string) => {
    if (!content) return;
    const hours = [...content.hours];
    hours[i] = { ...hours[i], [key]: value };
    updateField("hours", hours);
  };

  if (!savedPassword) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <Lock size={18} className="text-amber-500" />
            <h1 className="font-serif text-2xl text-amber-100">Dulce CMS</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-stone-500 hover:text-stone-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-amber-50 font-medium transition-colors"
            >
              Enter
            </button>
          </form>
          <p className="text-stone-700 text-xs mt-6 text-center">
            Dulce Bun House · Content Management
          </p>
        </motion.div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sections = [
    { id: "info" as const, label: "Basic Info" },
    { id: "hours" as const, label: "Hours" },
    { id: "social" as const, label: "Social" },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-stone-950/95 backdrop-blur border-b border-stone-800/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg text-amber-100">Dulce CMS</span>
          <span className="text-stone-600 text-xs">·</span>
          <span className="text-stone-500 text-xs">Content Editor</span>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-400 text-sm flex items-center gap-1.5"
              >
                <Check size={14} /> Saved
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-sm transition-colors"
          >
            <Save size={14} />
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(CMS_PASSWORD_KEY);
              setSavedPassword(null);
              setContent(null);
            }}
            className="text-stone-600 hover:text-stone-400 text-xs"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Section tabs */}
        <div className="flex gap-1 mb-8 bg-stone-900/50 rounded-xl p-1 w-fit">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`relative px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                activeSection === s.id ? "text-amber-200" : "text-stone-500 hover:text-stone-300"
              }`}
            >
              {activeSection === s.id && (
                <motion.span
                  layoutId="cms-tab"
                  className="absolute inset-0 rounded-lg bg-stone-800"
                />
              )}
              <span className="relative z-10">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Basic Info */}
        {activeSection === "info" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {(
              [
                { key: "name", label: "Café Name" },
                { key: "tagline", label: "Tagline" },
                { key: "description", label: "Description" },
                { key: "address", label: "Address" },
                { key: "phone", label: "Phone" },
              ] as { key: keyof Content; label: string }[]
            ).map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs text-stone-500 uppercase tracking-widest mb-2 block">
                  {label}
                </label>
                {key === "description" ? (
                  <textarea
                    value={String(content[key])}
                    onChange={(e) => updateField(key, e.target.value)}
                    rows={3}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-600 transition-colors resize-none text-sm"
                  />
                ) : (
                  <input
                    type="text"
                    value={String(content[key])}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-600 transition-colors text-sm"
                  />
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Hours */}
        {activeSection === "hours" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {content.hours.map((hour, i) => (
              <div key={hour.day} className="grid grid-cols-3 gap-3 items-center py-2 border-b border-stone-800/30">
                <span className="text-stone-300 text-sm font-light">{hour.day}</span>
                <input
                  type="text"
                  value={hour.open}
                  onChange={(e) => updateHour(i, "open", e.target.value)}
                  placeholder="Open"
                  className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-600 transition-colors"
                />
                <input
                  type="text"
                  value={hour.close}
                  onChange={(e) => updateHour(i, "close", e.target.value)}
                  placeholder="Close"
                  className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Social */}
        {activeSection === "social" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {(["instagram", "facebook"] as const).map((platform) => (
              <div key={platform}>
                <label className="text-xs text-stone-500 uppercase tracking-widest mb-2 block capitalize">
                  {platform} URL
                </label>
                <input
                  type="url"
                  value={content.social[platform]}
                  onChange={(e) =>
                    updateField("social", { ...content.social, [platform]: e.target.value })
                  }
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-600 transition-colors text-sm"
                />
              </div>
            ))}
          </motion.div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Preview link */}
        <div className="mt-12 pt-8 border-t border-stone-800/30">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-600 hover:text-amber-400 text-sm transition-colors"
          >
            ↗ Preview live site
          </a>
        </div>
      </div>
    </div>
  );
}
