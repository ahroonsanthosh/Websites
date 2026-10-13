"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TREATMENT_LABELS, TreatmentType } from "@/lib/types";

type MatchInfo = {
  status: "offered" | "claimed" | "expired" | "declined";
  expiresAt: string;
  slot: { treatment: TreatmentType; start_time: string; duration_minutes: number } | null;
};

export default function ClaimPage() {
  const params = useParams<{ token: string }>();
  const [info, setInfo] = useState<MatchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [result, setResult] = useState<"claimed" | "failed" | null>(null);

  useEffect(() => {
    fetch(`/api/claim/${params.token}`)
      .then((r) => r.json())
      .then((data) => setInfo(data))
      .finally(() => setLoading(false));
  }, [params.token]);

  async function handleClaim() {
    setClaiming(true);
    try {
      const res = await fetch(`/api/claim/${params.token}`, { method: "POST" });
      if (res.ok) {
        setResult("claimed");
      } else {
        setResult("failed");
      }
    } finally {
      setClaiming(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center p-6 bg-neutral-50">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  if (!info || info.status === "expired" || result === "failed") {
    return (
      <main className="min-h-dvh flex items-center justify-center p-6 bg-neutral-50">
        <div className="max-w-sm w-full text-center space-y-3">
          <div className="text-4xl">⏰</div>
          <h1 className="text-xl font-semibold">This offer has expired</h1>
          <p className="text-neutral-600">
            Sorry, this slot is no longer available — it&apos;s either been
            claimed or the 15 minute window passed.
          </p>
        </div>
      </main>
    );
  }

  if (info.status === "claimed" || result === "claimed") {
    return (
      <main className="min-h-dvh flex items-center justify-center p-6 bg-neutral-50">
        <div className="max-w-sm w-full text-center space-y-3">
          <div className="text-4xl">🎉</div>
          <h1 className="text-xl font-semibold">You&apos;re booked in!</h1>
          <p className="text-neutral-600">
            The salon will see you at your new appointment time. See you
            soon!
          </p>
        </div>
      </main>
    );
  }

  const slot = info.slot;
  const treatmentLabel = slot ? TREATMENT_LABELS[slot.treatment] : "";
  const startTime = slot ? new Date(slot.start_time).toLocaleString() : "";

  return (
    <main className="min-h-dvh flex items-center justify-center p-6 bg-neutral-50">
      <div className="max-w-sm w-full space-y-5 text-center">
        <div className="text-4xl">✨</div>
        <h1 className="text-xl font-semibold">A slot just opened up!</h1>
        {slot && (
          <div className="bg-white rounded-lg border border-neutral-200 p-4 text-left space-y-1">
            <p><span className="font-medium">Treatment:</span> {treatmentLabel}</p>
            <p><span className="font-medium">Time:</span> {startTime}</p>
            <p><span className="font-medium">Duration:</span> {slot.duration_minutes} min</p>
          </div>
        )}
        <p className="text-sm text-neutral-500">
          This offer expires 15 minutes after it was sent. Claim it now to
          lock it in.
        </p>
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="w-full rounded-lg bg-neutral-900 text-white py-3 text-base font-medium disabled:opacity-50"
        >
          {claiming ? "Claiming..." : "Claim this slot"}
        </button>
      </div>
    </main>
  );
}
