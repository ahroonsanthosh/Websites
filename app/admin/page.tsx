"use client";

import { useState, useEffect, useCallback } from "react";

const ADMIN_PASSWORD = "uncles2025";
const GITHUB_OWNER = "ahroonsanthosh";
const GITHUB_REPO = "Uncles";
const CONTENT_PATH = "content/content.json";
const BRANCH = "claude/rotisserie-deli-website-dxo9mp";

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
  const [token, setToken] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [fileSha, setFileSha] = useState("");
  const [tab, setTab] = useState<Tab>("menu");
  const [activeMenuCat, setActiveMenuCat] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; msg: string }>({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gh_admin_token");
    if (saved) setToken(saved);
  }, []);

  const fetchContent = useCallback(async (ghToken: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}?ref=${BRANCH}`,
        { headers: { Authorization: `token ${ghToken}`, Accept: "application/vnd.github+json" } }
      );
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const data = await res.json();
      setFileSha(data.sha);
      const decoded = JSON.parse(atob(data.content.replace(/\n/g, "")));
      setContent(decoded);
      setActiveMenuCat(decoded.menu.categories[0]);
    } catch (e: unknown) {
      setStatus({ type: "error", msg: e instanceof Error ? e.message : "Failed to load content" });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      if (token) fetchContent(token);
    } else {
      setStatus({ type: "error", msg: "Incorrect password" });
    }
  };

  const handleTokenSave = () => {
    localStorage.setItem("gh_admin_token", token);
    fetchContent(token);
  };

  const handleSave = async () => {
    if (!content || !token) return;
    setSaving(true);
    setStatus({ type: "", msg: "" });
    try {
      const body = JSON.stringify(content, null, 2);
      const encoded = btoa(unescape(encodeURIComponent(body)));
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}`,
        {
          method: "PUT",
          headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "cms: update site content",
            content: encoded,
            sha: fileSha,
            branch: BRANCH,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Save failed");
      }
      const data = await res.json();
      setFileSha(data.content.sha);
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
            <div className="w-12 h-12 rounded-full bg-[#E8622A] flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl" style={{ fontFamily: "serif" }}>U</span>
            </div>
            <h1 className="text-[#FDF6EB] text-xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
              Uncle&apos;s Admin
            </h1>
            <p className="text-[#FDF6EB]/40 text-xs mt-1">Content Management</p>
          </div>
          <div>
            <label className="block text-[#FDF6EB]/60 text-xs uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FDF6EB]/10 border border-[#FDF6EB]/20 rounded-xl px-4 py-3 text-[#FDF6EB] text-sm outline-none focus:border-[#E8622A] transition-colors"
              placeholder="Enter admin password"
            />
          </div>
          {status.type === "error" && (
            <p className="text-red-400 text-sm text-center">{status.msg}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-[#E8622A] text-white rounded-xl text-sm font-semibold hover:bg-[#F4A61D] transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#1A0C05] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-[#FDF6EB]/5 border border-[#FDF6EB]/10 rounded-2xl p-8 space-y-5">
          <h2 className="text-[#FDF6EB] text-lg font-bold text-center" style={{ fontFamily: "Georgia, serif" }}>
            Connect GitHub
          </h2>
          <p className="text-[#FDF6EB]/50 text-xs leading-relaxed">
            To load and save content, enter a GitHub Personal Access Token with <strong>repo</strong> scope.{" "}
            <a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank" rel="noopener noreferrer" className="text-[#E8622A] underline">
              Create one here →
            </a>
          </p>
          <div>
            <label className="block text-[#FDF6EB]/60 text-xs uppercase tracking-widest mb-2">GitHub Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-[#FDF6EB]/10 border border-[#FDF6EB]/20 rounded-xl px-4 py-3 text-[#FDF6EB] text-sm outline-none focus:border-[#E8622A] transition-colors"
              placeholder="ghp_..."
            />
          </div>
          {loading && <p className="text-[#FDF6EB]/40 text-xs text-center">Loading content…</p>}
          {status.type === "error" && <p className="text-red-400 text-sm">{status.msg}</p>}
          <button
            onClick={handleTokenSave}
            disabled={!token || loading}
            className="w-full py-3 bg-[#E8622A] text-white rounded-xl text-sm font-semibold hover:bg-[#F4A61D] transition-colors disabled:opacity-50"
          >
            {loading ? "Loading…" : "Connect & Load"}
          </button>
        </div>
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

  const input = "w-full bg-[#FDF6EB]/10 border border-[#FDF6EB]/20 rounded-xl px-4 py-2.5 text-[#FDF6EB] text-sm outline-none focus:border-[#E8622A] transition-colors";
  const label = "block text-[#FDF6EB]/50 text-[10px] uppercase tracking-widest mb-1.5";

  return (
    <div className="min-h-screen bg-[#1A0C05] text-[#FDF6EB]">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#0D0602]/95 backdrop-blur border-b border-[#FDF6EB]/10 px-5 md:px-10 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#E8622A] flex items-center justify-center">
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
            className="px-5 py-2 bg-[#E8622A] text-white text-xs font-semibold rounded-full hover:bg-[#F4A61D] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save & Deploy"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-10 py-8">
        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-8 pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${
                tab === t.id
                  ? "bg-[#E8622A] text-white"
                  : "bg-[#FDF6EB]/10 text-[#FDF6EB]/50 hover:bg-[#FDF6EB]/15"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── MENU TAB ── */}
        {tab === "menu" && (
          <div className="space-y-6">
            <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
              {content.menu.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveMenuCat(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs transition-all ${
                    activeMenuCat === cat ? "bg-[#FDF6EB]/20 text-[#FDF6EB]" : "text-[#FDF6EB]/40 hover:text-[#FDF6EB]/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {(content.menu.items[activeMenuCat] ?? []).map((item, i) => (
              <div key={i} className="bg-[#FDF6EB]/5 border border-[#FDF6EB]/10 rounded-2xl p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={label}>Name</label>
                    <input
                      className={input}
                      value={item.name}
                      onChange={(e) => {
                        const updated = { ...content };
                        updated.menu.items[activeMenuCat][i].name = e.target.value;
                        setContent(updated);
                      }}
                    />
                  </div>
                  <div>
                    <label className={label}>Price</label>
                    <input
                      className={input}
                      value={item.price}
                      onChange={(e) => {
                        const updated = { ...content };
                        updated.menu.items[activeMenuCat][i].price = e.target.value;
                        setContent(updated);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className={label}>Description</label>
                  <input
                    className={input}
                    value={item.description}
                    onChange={(e) => {
                      const updated = { ...content };
                      updated.menu.items[activeMenuCat][i].description = e.target.value;
                      setContent(updated);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-40">
                    <label className={label}>Badge (optional)</label>
                    <input
                      className={input}
                      value={item.tag}
                      placeholder="e.g. Fan Fave"
                      onChange={(e) => {
                        const updated = { ...content };
                        updated.menu.items[activeMenuCat][i].tag = e.target.value;
                        setContent(updated);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const updated = { ...content };
                      updated.menu.items[activeMenuCat] = updated.menu.items[activeMenuCat].filter((_, j) => j !== i);
                      setContent(updated);
                    }}
                    className="text-red-400/60 hover:text-red-400 text-xs mt-4 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const updated = { ...content };
                if (!updated.menu.items[activeMenuCat]) updated.menu.items[activeMenuCat] = [];
                updated.menu.items[activeMenuCat].push({ name: "", description: "", price: "€0.00", tag: "" });
                setContent(updated);
              }}
              className="w-full py-3 border border-dashed border-[#FDF6EB]/20 rounded-2xl text-[#FDF6EB]/40 hover:text-[#FDF6EB]/70 hover:border-[#FDF6EB]/40 text-sm transition-all"
            >
              + Add Item to {activeMenuCat}
            </button>
            <div>
              <label className={label}>Menu footer note</label>
              <input
                className={input}
                value={content.menu.note}
                onChange={(e) => setContent({ ...content, menu: { ...content.menu, note: e.target.value } })}
              />
            </div>
          </div>
        )}

        {/* ── HOURS TAB ── */}
        {tab === "hours" && (
          <div className="space-y-3">
            {content.hours.map((h, i) => (
              <div key={h.day} className="bg-[#FDF6EB]/5 border border-[#FDF6EB]/10 rounded-xl p-4 flex items-center gap-4">
                <span className="w-28 font-semibold text-sm shrink-0">{h.day}</span>
                <label className="flex items-center gap-2 shrink-0">
                  <input
                    type="checkbox"
                    checked={h.closed}
                    onChange={(e) => {
                      const updated = { ...content };
                      updated.hours[i].closed = e.target.checked;
                      if (e.target.checked) updated.hours[i].time = "Closed";
                      setContent(updated);
                    }}
                    className="accent-[#E8622A]"
                  />
                  <span className="text-xs text-[#FDF6EB]/50">Closed</span>
                </label>
                {!h.closed && (
                  <input
                    className={`${input} flex-1`}
                    value={h.time}
                    placeholder="9:00 – 17:30"
                    onChange={(e) => {
                      const updated = { ...content };
                      updated.hours[i].time = e.target.value;
                      setContent(updated);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── ABOUT TAB ── */}
        {tab === "about" && (
          <div className="space-y-6">
            <div>
              <label className={label}>Heading</label>
              <input
                className={input}
                value={content.about.heading}
                onChange={(e) => setContent({ ...content, about: { ...content.about, heading: e.target.value } })}
              />
            </div>
            {content.about.paragraphs.map((p, i) => (
              <div key={i}>
                <label className={label}>Paragraph {i + 1}</label>
                <textarea
                  className={`${input} resize-y min-h-[80px]`}
                  value={p}
                  onChange={(e) => {
                    const updated = { ...content };
                    updated.about.paragraphs[i] = e.target.value;
                    setContent(updated);
                  }}
                />
              </div>
            ))}
            <div>
              <label className={label}>Stats</label>
              <div className="grid grid-cols-3 gap-3">
                {content.about.stats.map((s, i) => (
                  <div key={i} className="bg-[#FDF6EB]/5 rounded-xl p-3 space-y-2">
                    <input
                      className={input}
                      value={s.value}
                      placeholder="Value"
                      onChange={(e) => {
                        const updated = { ...content };
                        updated.about.stats[i].value = e.target.value;
                        setContent(updated);
                      }}
                    />
                    <input
                      className={input}
                      value={s.label}
                      placeholder="Label"
                      onChange={(e) => {
                        const updated = { ...content };
                        updated.about.stats[i].label = e.target.value;
                        setContent(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BUSINESS TAB ── */}
        {tab === "business" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {([
                ["Business Name", "name"],
                ["Tagline", "tagline"],
                ["Instagram Handle", "instagram"],
                ["Phone", "phone"],
              ] as const).map(([lbl, key]) => (
                <div key={key}>
                  <label className={label}>{lbl}</label>
                  <input
                    className={input}
                    value={content.business[key]}
                    onChange={(e) => setContent({ ...content, business: { ...content.business, [key]: e.target.value } })}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-[#FDF6EB]/50 text-[10px] uppercase tracking-widest">Address</p>
              {(["line1", "line2", "city", "eircode", "country"] as const).map((k) => (
                <div key={k}>
                  <label className={label}>{k}</label>
                  <input
                    className={input}
                    value={content.business.address[k]}
                    onChange={(e) =>
                      setContent({ ...content, business: { ...content.business, address: { ...content.business.address, [k]: e.target.value } } })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GALLERY TAB ── */}
        {tab === "gallery" && (
          <div className="space-y-4">
            {content.gallery.map((photo, i) => (
              <div key={i} className="bg-[#FDF6EB]/5 border border-[#FDF6EB]/10 rounded-xl p-4 flex gap-4 items-start">
                <img src={photo.src} alt={photo.alt} className="w-20 h-20 object-cover rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div>
                    <label className={label}>Image URL</label>
                    <input
                      className={input}
                      value={photo.src}
                      onChange={(e) => {
                        const updated = { ...content };
                        updated.gallery[i].src = e.target.value;
                        setContent(updated);
                      }}
                    />
                  </div>
                  <div>
                    <label className={label}>Alt text</label>
                    <input
                      className={input}
                      value={photo.alt}
                      onChange={(e) => {
                        const updated = { ...content };
                        updated.gallery[i].alt = e.target.value;
                        setContent(updated);
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    const updated = { ...content };
                    updated.gallery = updated.gallery.filter((_, j) => j !== i);
                    setContent(updated);
                  }}
                  className="text-red-400/60 hover:text-red-400 text-xs mt-1 transition-colors shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => setContent({ ...content, gallery: [...content.gallery, { src: "", alt: "" }] })}
              className="w-full py-3 border border-dashed border-[#FDF6EB]/20 rounded-2xl text-[#FDF6EB]/40 hover:text-[#FDF6EB]/70 hover:border-[#FDF6EB]/40 text-sm transition-all"
            >
              + Add Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
