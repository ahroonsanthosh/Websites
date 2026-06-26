"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Save, CheckCircle, Image as ImageIcon } from "lucide-react";

interface GalleryImage { id: string; src: string; alt: string; order: number; }

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/content/gallery")
      .then((r) => r.json())
      .then((d) => { setImages(d.images); setLoading(false); })
      .catch(() => { setError("Failed to load."); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/content/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
      else setError("Save failed.");
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true); setError("");
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/media", { method: "POST", body: fd });
        if (res.ok) {
          const { url } = await res.json();
          const newImg: GalleryImage = {
            id: Date.now().toString(),
            src: url,
            alt: file.name.replace(/\.[^.]+$/, ""),
            order: images.length + 1,
          };
          setImages((prev) => [...prev, newImg]);
        } else {
          const { error: e } = await res.json();
          setError(e || "Upload failed.");
        }
      } catch { setError("Upload error."); }
    }
    setUploading(false);
  };

  const remove = async (img: GalleryImage) => {
    if (!confirm("Delete this image?")) return;
    setImages((prev) => prev.filter((i) => i.id !== img.id));
    if (img.src) await fetch("/api/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: img.src }) });
  };

  const updateAlt = (id: string, alt: string) => {
    setImages((prev) => prev.map((i) => i.id === id ? { ...i, alt } : i));
  };

  if (loading) return <div className="text-white/30 text-sm">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-semibold mb-1">Gallery</h1>
          <p className="text-white/30 text-sm">{images.length} images.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors">
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => handleUpload(e.target.files)} />

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4"><p className="text-red-400 text-sm">{error}</p></div>}

      {/* Upload drop zone */}
      <div
        className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center mb-6 hover:border-orange-500/30 transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
      >
        <ImageIcon className="w-8 h-8 text-white/20 mx-auto mb-3" />
        <p className="text-white/30 text-sm">Drop images here or click to upload</p>
        <p className="text-white/15 text-xs mt-1">JPEG, PNG, WebP, GIF · Max 10MB each</p>
      </div>

      {images.length === 0 ? (
        <p className="text-white/20 text-sm text-center py-8">No images yet. Upload some above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
              <div className="aspect-square bg-white/5 relative">
                {img.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">🖼</div>
                )}
                <button
                  onClick={() => remove(img)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3">
                <input
                  type="text"
                  value={img.alt}
                  onChange={(e) => updateAlt(img.id, e.target.value)}
                  placeholder="Alt text…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
