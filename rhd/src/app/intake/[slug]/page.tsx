"use client";

import { useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import { TREATMENT_TYPES, TREATMENT_LABELS, TreatmentType } from "@/lib/types";

export default function IntakePage() {
  const params = useParams<{ slug: string }>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [treatment, setTreatment] = useState<TreatmentType>("haircut");
  const [earliestTime, setEarliestTime] = useState("");
  const [latestTime, setLatestTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonSlug: params.slug,
          name,
          phone,
          treatment,
          earliestTime: new Date(earliestTime).toISOString(),
          latestTime: new Date(latestTime).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="min-h-dvh flex items-center justify-center p-6 bg-neutral-50">
        <div className="max-w-sm w-full text-center space-y-3">
          <div className="text-4xl">✅</div>
          <h1 className="text-xl font-semibold">You&apos;re on the list!</h1>
          <p className="text-neutral-600">
            We&apos;ll text you the moment a matching slot opens up. Keep your
            phone handy — offers expire after 15 minutes.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex justify-center p-6 bg-neutral-50">
      <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-5 py-6">
        <div>
          <h1 className="text-xl font-semibold">Join the cancellation list</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Tell us what you want and when you&apos;re free. We&apos;ll text
            you if a slot opens up.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Your name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base"
            placeholder="Jane Smith"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Phone number</label>
          <input
            required
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base"
            placeholder="07123 456789"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Treatment</label>
          <select
            value={treatment}
            onChange={(e) => setTreatment(e.target.value as TreatmentType)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base bg-white"
          >
            {TREATMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {TREATMENT_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Earliest I can come in</label>
          <input
            required
            type="datetime-local"
            value={earliestTime}
            onChange={(e) => setEarliestTime(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Latest I can come in</label>
          <input
            required
            type="datetime-local"
            value={latestTime}
            onChange={(e) => setLatestTime(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-neutral-900 text-white py-3 text-base font-medium disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Join the list"}
        </button>
      </form>
    </main>
  );
}
