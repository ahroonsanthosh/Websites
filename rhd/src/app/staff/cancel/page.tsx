"use client";

import { useEffect, useState, FormEvent } from "react";
import { TREATMENT_TYPES, TREATMENT_LABELS, TreatmentType } from "@/lib/types";

type Stylist = { id: string; name: string };
type Salon = { id: string; name: string; slug: string };

export default function StaffCancelPage() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [treatment, setTreatment] = useState<TreatmentType>("haircut");
  const [startTime, setStartTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [stylistId, setStylistId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/staff/context")
      .then((r) => r.json())
      .then((data) => {
        setSalon(data.salon || null);
        setStylists(data.stylists || []);
      });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/cancellations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonSlug: salon?.slug,
          treatment,
          startTime: new Date(startTime).toISOString(),
          durationMinutes: Number(durationMinutes),
          stylistId: stylistId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setMessage(
        data.matched
          ? "Slot logged and a client has been texted!"
          : "Slot logged. No matching client waiting right now — it'll stay open."
      );
      setStartTime("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh flex justify-center p-6 bg-neutral-50">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-5 py-6">
        <div>
          <h1 className="text-xl font-semibold">Log a cancellation</h1>
          {salon && <p className="text-sm text-neutral-500 mt-1">{salon.name}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Treatment</label>
          <select
            value={treatment}
            onChange={(e) => setTreatment(e.target.value as TreatmentType)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 bg-white"
          >
            {TREATMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {TREATMENT_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Slot time</label>
          <input
            required
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Duration (minutes)</label>
          <input
            required
            type="number"
            min={5}
            step={5}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Stylist (optional)</label>
          <select
            value={stylistId}
            onChange={(e) => setStylistId(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 bg-white"
          >
            <option value="">Any stylist</option>
            {stylists.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={submitting || !salon}
          className="w-full rounded-lg bg-neutral-900 text-white py-3 font-medium disabled:opacity-50"
        >
          {submitting ? "Logging..." : "Log cancellation"}
        </button>
      </form>
    </main>
  );
}
