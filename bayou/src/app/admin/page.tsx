"use client";

import { useEffect, useState, useCallback } from "react";

type ContentData = {
  site: {
    name: string;
    tagline: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    instagram: string;
    logo: string;
  };
  hours: Array<{
    day: string;
    status: "open" | "closed";
    open: string;
    close: string;
  }>;
  hero: {
    heading: string;
    subheading: string;
    cta: string;
    image: string;
  };
  about: {
    heading: string;
    body: string;
    image: string;
  };
  menu: {
    heading: string;
    subheading: string;
    images: string[];
  };
  gallery: {
    heading: string;
    images: string[];
  };
};

type Section = "site" | "hours" | "hero" | "about" | "menu" | "gallery";

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: "site", label: "Site Info", icon: "◎" },
  { id: "hero", label: "Hero", icon: "◈" },
  { id: "about", label: "About", icon: "◉" },
  { id: "menu", label: "Menu", icon: "◐" },
  { id: "gallery", label: "Gallery", icon: "◑" },
  { id: "hours", label: "Hours", icon: "◷" },
];

function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-medium text-[#8A7A6A] tracking-widest uppercase mb-2">
        {label}
      </label>
      {multiline ? (
        <textarea
          className="admin-field resize-y min-h-[80px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className="admin-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function ImageListEditor({
  images,
  onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  return (
    <div className="space-y-3">
      {images.map((url, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1">
            <input
              type="url"
              className="admin-field"
              value={url}
              placeholder="Image URL"
              onChange={(e) => {
                const next = [...images];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
          </div>
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="w-12 h-12 object-cover rounded flex-shrink-0 border border-[var(--border)]" />
          )}
          <button
            onClick={() => onChange(images.filter((_, j) => j !== i))}
            className="text-red-400 hover:text-red-600 text-xl leading-none flex-shrink-0 mt-1"
            title="Remove"
            type="button"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...images, ""])}
        className="text-xs tracking-widest uppercase text-[var(--terracotta)] hover:text-[var(--dark-brown)] transition-colors duration-200 flex items-center gap-1.5"
      >
        + Add Image
      </button>
    </div>
  );
}

export default function AdminPage() {
  const [data, setData] = useState<ContentData | null>(null);
  const [active, setActive] = useState<Section>("site");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => setData(d));
  }, []);

  const update = useCallback((updater: (prev: ContentData) => ContentData) => {
    setData((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
    setDirty(true);
  }, []);

  const save = async () => {
    if (!data) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setDirty(false);
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--warm-white)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--terracotta)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-[var(--font-sans)] text-[var(--muted)] text-sm">Loading CMS…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--warm-white)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--dark-brown)] text-[var(--cream)] flex-shrink-0 md:min-h-screen">
        <div className="p-6 border-b border-[rgba(245,239,224,0.1)]">
          <p className="font-[var(--font-serif)] text-2xl font-light">Bayou</p>
          <p className="font-[var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-[var(--terracotta)] mt-1">
            Content Manager
          </p>
        </div>

        <nav className="p-4 space-y-1" aria-label="CMS sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-[var(--font-sans)] text-sm ${
                active === s.id
                  ? "bg-[var(--terracotta)] text-white"
                  : "text-[rgba(245,239,224,0.6)] hover:text-[var(--cream)] hover:bg-[rgba(245,239,224,0.06)]"
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-4">
          <a
            href="/"
            target="_blank"
            className="block w-full text-center py-2.5 border border-[rgba(245,239,224,0.15)] text-[rgba(245,239,224,0.5)] hover:text-[var(--cream)] rounded font-[var(--font-sans)] text-xs tracking-widest uppercase transition-colors duration-200"
          >
            View Site ↗
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 max-w-3xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-[var(--font-serif)] text-3xl font-light text-[var(--charcoal)]">
              {SECTIONS.find((s) => s.id === active)?.label}
            </h1>
            {dirty && (
              <p className="font-[var(--font-sans)] text-xs text-[var(--terracotta)] mt-1">
                Unsaved changes
              </p>
            )}
          </div>
          <button
            onClick={save}
            disabled={status === "saving" || !dirty}
            className={`px-6 py-2.5 font-[var(--font-sans)] text-xs tracking-widest uppercase rounded transition-all duration-200 ${
              status === "saved"
                ? "bg-[var(--sage)] text-white"
                : status === "error"
                ? "bg-red-500 text-white"
                : dirty
                ? "bg-[var(--terracotta)] text-white hover:bg-[var(--dark-brown)]"
                : "bg-[var(--cream)] text-[var(--muted)] cursor-not-allowed"
            }`}
          >
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : status === "error" ? "Error" : "Save Changes"}
          </button>
        </div>

        {/* Sections */}
        {active === "site" && (
          <div>
            <Field label="Café Name" value={data.site.name} onChange={(v) => update((d) => ({ ...d, site: { ...d.site, name: v } }))} />
            <Field label="Tagline" value={data.site.tagline} onChange={(v) => update((d) => ({ ...d, site: { ...d.site, tagline: v } }))} multiline />
            <Field label="Meta Description" value={data.site.description} onChange={(v) => update((d) => ({ ...d, site: { ...d.site, description: v } }))} multiline />
            <Field label="Address" value={data.site.address} onChange={(v) => update((d) => ({ ...d, site: { ...d.site, address: v } }))} />
            <Field label="Phone" value={data.site.phone} type="tel" onChange={(v) => update((d) => ({ ...d, site: { ...d.site, phone: v } }))} />
            <Field label="Email" value={data.site.email || ""} type="email" onChange={(v) => update((d) => ({ ...d, site: { ...d.site, email: v } }))} />
            <Field label="Instagram URL" value={data.site.instagram || ""} type="url" onChange={(v) => update((d) => ({ ...d, site: { ...d.site, instagram: v } }))} />
            <Field label="Logo URL" value={data.site.logo || ""} type="url" onChange={(v) => update((d) => ({ ...d, site: { ...d.site, logo: v } }))} />
          </div>
        )}

        {active === "hero" && (
          <div>
            <Field label="Main Heading" value={data.hero.heading} onChange={(v) => update((d) => ({ ...d, hero: { ...d.hero, heading: v } }))} />
            <Field label="Sub Heading" value={data.hero.subheading} onChange={(v) => update((d) => ({ ...d, hero: { ...d.hero, subheading: v } }))} />
            <Field label="CTA Button Text" value={data.hero.cta} onChange={(v) => update((d) => ({ ...d, hero: { ...d.hero, cta: v } }))} />
            <Field label="Hero Image URL" value={data.hero.image} type="url" onChange={(v) => update((d) => ({ ...d, hero: { ...d.hero, image: v } }))} />
            {data.hero.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.hero.image} alt="Hero preview" className="w-full h-40 object-cover rounded mt-2 border border-[var(--border)]" />
            )}
          </div>
        )}

        {active === "about" && (
          <div>
            <Field label="Heading" value={data.about.heading} onChange={(v) => update((d) => ({ ...d, about: { ...d.about, heading: v } }))} />
            <Field label="Body Text" value={data.about.body} onChange={(v) => update((d) => ({ ...d, about: { ...d.about, body: v } }))} multiline />
            <Field label="Image URL" value={data.about.image} type="url" onChange={(v) => update((d) => ({ ...d, about: { ...d.about, image: v } }))} />
            {data.about.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.about.image} alt="About preview" className="w-full h-40 object-cover rounded mt-2 border border-[var(--border)]" />
            )}
          </div>
        )}

        {active === "menu" && (
          <div>
            <Field label="Section Heading" value={data.menu.heading} onChange={(v) => update((d) => ({ ...d, menu: { ...d.menu, heading: v } }))} />
            <Field label="Sub Heading" value={data.menu.subheading} onChange={(v) => update((d) => ({ ...d, menu: { ...d.menu, subheading: v } }))} />
            <div className="mb-2">
              <label className="block text-xs font-medium text-[#8A7A6A] tracking-widest uppercase mb-3">
                Menu Images
              </label>
              <ImageListEditor
                images={data.menu.images}
                onChange={(imgs) => update((d) => ({ ...d, menu: { ...d.menu, images: imgs } }))}
              />
            </div>
          </div>
        )}

        {active === "gallery" && (
          <div>
            <Field label="Section Heading" value={data.gallery.heading} onChange={(v) => update((d) => ({ ...d, gallery: { ...d.gallery, heading: v } }))} />
            <div className="mb-2">
              <label className="block text-xs font-medium text-[#8A7A6A] tracking-widest uppercase mb-3">
                Gallery Images
              </label>
              <ImageListEditor
                images={data.gallery.images}
                onChange={(imgs) => update((d) => ({ ...d, gallery: { ...d.gallery, images: imgs } }))}
              />
            </div>
          </div>
        )}

        {active === "hours" && (
          <div className="space-y-4">
            {data.hours.map((entry, i) => (
              <div
                key={entry.day}
                className="grid grid-cols-[1fr_auto_1fr_1fr] gap-3 items-center p-4 bg-white border border-[var(--border)] rounded-lg"
              >
                <p className="font-[var(--font-serif)] text-lg font-light text-[var(--charcoal)]">
                  {entry.day}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    update((d) => {
                      const next = [...d.hours];
                      next[i] = {
                        ...next[i],
                        status: next[i].status === "open" ? "closed" : "open",
                      };
                      return { ...d, hours: next };
                    })
                  }
                  className={`px-3 py-1 rounded-full text-xs font-[var(--font-sans)] tracking-widest uppercase transition-colors duration-200 ${
                    entry.status === "open"
                      ? "bg-[rgba(122,140,110,0.15)] text-[var(--forest)]"
                      : "bg-[rgba(138,122,106,0.1)] text-[var(--muted)]"
                  }`}
                >
                  {entry.status}
                </button>
                {entry.status === "open" ? (
                  <>
                    <input
                      type="time"
                      className="admin-field"
                      value={entry.open}
                      onChange={(e) =>
                        update((d) => {
                          const next = [...d.hours];
                          next[i] = { ...next[i], open: e.target.value };
                          return { ...d, hours: next };
                        })
                      }
                    />
                    <input
                      type="time"
                      className="admin-field"
                      value={entry.close}
                      onChange={(e) =>
                        update((d) => {
                          const next = [...d.hours];
                          next[i] = { ...next[i], close: e.target.value };
                          return { ...d, hours: next };
                        })
                      }
                    />
                  </>
                ) : (
                  <div className="col-span-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
