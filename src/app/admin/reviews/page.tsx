"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, CheckCircle, Star } from "lucide-react";

interface Review { id: string; name: string; text: string; rating: number; date: string; }

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/content/reviews")
      .then((r) => r.json())
      .then((d) => { setReviews(d.reviews); setLoading(false); })
      .catch(() => { setError("Failed to load."); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/content/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
      else setError("Save failed.");
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  const add = () => {
    setReviews([...reviews, { id: Date.now().toString(), name: "", text: "", rating: 5, date: new Date().toISOString().split("T")[0] }]);
  };

  const update = (id: string, patch: Partial<Review>) => {
    setReviews(reviews.map((r) => r.id === id ? { ...r, ...patch } : r));
  };

  const remove = (id: string) => {
    if (!confirm("Delete this review?")) return;
    setReviews(reviews.filter((r) => r.id !== id));
  };

  if (loading) return <div className="text-white/30 text-sm">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-semibold mb-1">Reviews</h1>
          <p className="text-white/30 text-sm">{reviews.length} reviews.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={add} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors">
            <Plus className="w-4 h-4" /> Add
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors">
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save All"}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4"><p className="text-red-400 text-sm">{error}</p></div>}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => update(review.id, { rating: n })}>
                    <Star className={`w-4 h-4 ${n <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`} />
                  </button>
                ))}
              </div>
              <button onClick={() => remove(review.id)} className="text-white/20 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1">Name</label>
                <input type="text" value={review.name} onChange={(e) => update(review.id, { name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50" />
              </div>
              <div>
                <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1">Date</label>
                <input type="date" value={review.date} onChange={(e) => update(review.id, { date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50" />
              </div>
            </div>
            <div>
              <label className="block text-white/40 text-[10px] uppercase tracking-widest mb-1">Review Text</label>
              <textarea rows={3} value={review.text} onChange={(e) => update(review.id, { text: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 resize-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
