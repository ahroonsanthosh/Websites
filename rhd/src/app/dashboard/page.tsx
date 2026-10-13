"use client";

import { useEffect, useState, useCallback } from "react";
import { TREATMENT_LABELS, TreatmentType } from "@/lib/types";

type Intake = {
  id: string;
  treatment: TreatmentType;
  earliest_time: string;
  latest_time: string;
  created_at: string;
  clients: { name: string; phone: string } | null;
};

type Slot = {
  id: string;
  treatment: TreatmentType;
  start_time: string;
  duration_minutes: number;
  status: string;
  stylists: { name: string } | null;
};

type Match = {
  id: string;
  status: string;
  offered_at: string;
  expires_at: string;
  responded_at: string | null;
  cancellation_slots: { treatment: TreatmentType; start_time: string } | null;
  intake_requests: { clients: { name: string; phone: string } | null } | null;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-neutral-100 text-neutral-700",
  open: "bg-neutral-100 text-neutral-700",
  offered: "bg-amber-100 text-amber-800",
  claimed: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-700",
  cancelled: "bg-neutral-100 text-neutral-500",
  declined: "bg-red-100 text-red-700",
  filled: "bg-green-100 text-green-800",
};

function Badge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[status] || "bg-neutral-100"}`}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<{
    salon: { id: string; name: string } | null;
    pendingIntakes: Intake[];
    openSlots: Slot[];
    matches: Match[];
  } | null>(null);
  const [assignSlot, setAssignSlot] = useState("");
  const [assignIntake, setAssignIntake] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignMsg, setAssignMsg] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 10_000);
    return () => clearInterval(id);
  }, [load]);

  async function handleAssign() {
    if (!assignSlot || !assignIntake) return;
    setAssigning(true);
    setAssignMsg(null);
    try {
      const res = await fetch("/api/matches/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: assignSlot, intakeRequestId: assignIntake }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed");
      setAssignMsg("Assigned and texted!");
      setAssignSlot("");
      setAssignIntake("");
      load();
    } catch (err) {
      setAssignMsg(err instanceof Error ? err.message : "Failed to assign");
    } finally {
      setAssigning(false);
    }
  }

  if (!data) {
    return <main className="p-6 text-neutral-500">Loading...</main>;
  }

  const openSlotsOnly = data.openSlots.filter((s) => s.status === "open");

  return (
    <main className="min-h-dvh bg-neutral-50 p-6 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">{data.salon?.name || "Dashboard"}</h1>
        <p className="text-sm text-neutral-500">Live view of intakes, slots, and matches</p>
      </div>

      <section className="bg-white rounded-lg border border-neutral-200 p-4 space-y-3">
        <h2 className="font-semibold">Manual assign (override)</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={assignSlot}
            onChange={(e) => setAssignSlot(e.target.value)}
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 bg-white text-sm"
          >
            <option value="">Select open slot...</option>
            {openSlotsOnly.map((s) => (
              <option key={s.id} value={s.id}>
                {TREATMENT_LABELS[s.treatment]} — {new Date(s.start_time).toLocaleString()}
              </option>
            ))}
          </select>
          <select
            value={assignIntake}
            onChange={(e) => setAssignIntake(e.target.value)}
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 bg-white text-sm"
          >
            <option value="">Select waiting client...</option>
            {data.pendingIntakes.map((i) => (
              <option key={i.id} value={i.id}>
                {i.clients?.name} — {TREATMENT_LABELS[i.treatment]}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssign}
            disabled={assigning || !assignSlot || !assignIntake}
            className="rounded-lg bg-neutral-900 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Assign & text
          </button>
        </div>
        {assignMsg && <p className="text-sm text-neutral-600">{assignMsg}</p>}
      </section>

      <section className="bg-white rounded-lg border border-neutral-200 p-4">
        <h2 className="font-semibold mb-3">
          Pending intakes <span className="text-neutral-400 font-normal">({data.pendingIntakes.length})</span>
        </h2>
        <div className="space-y-2">
          {data.pendingIntakes.length === 0 && <p className="text-sm text-neutral-400">None waiting.</p>}
          {data.pendingIntakes.map((i) => (
            <div key={i.id} className="flex items-center justify-between text-sm border-b border-neutral-100 pb-2 last:border-0">
              <div>
                <span className="font-medium">{i.clients?.name}</span>{" "}
                <span className="text-neutral-500">{i.clients?.phone}</span>
              </div>
              <div className="text-neutral-600">{TREATMENT_LABELS[i.treatment]}</div>
              <div className="text-neutral-400 text-xs">
                {new Date(i.earliest_time).toLocaleDateString()} - {new Date(i.latest_time).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg border border-neutral-200 p-4">
        <h2 className="font-semibold mb-3">
          Open / offered slots <span className="text-neutral-400 font-normal">({data.openSlots.length})</span>
        </h2>
        <div className="space-y-2">
          {data.openSlots.length === 0 && <p className="text-sm text-neutral-400">No open slots.</p>}
          {data.openSlots.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-sm border-b border-neutral-100 pb-2 last:border-0">
              <div>{TREATMENT_LABELS[s.treatment]}</div>
              <div className="text-neutral-500">{new Date(s.start_time).toLocaleString()}</div>
              <div className="text-neutral-400 text-xs">{s.stylists?.name || "Any stylist"}</div>
              <Badge status={s.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg border border-neutral-200 p-4">
        <h2 className="font-semibold mb-3">Recent matches</h2>
        <div className="space-y-2">
          {data.matches.length === 0 && <p className="text-sm text-neutral-400">No matches yet.</p>}
          {data.matches.map((m) => (
            <div key={m.id} className="flex items-center justify-between text-sm border-b border-neutral-100 pb-2 last:border-0">
              <div>
                {m.intake_requests?.clients?.name || "Unknown"} —{" "}
                {m.cancellation_slots ? TREATMENT_LABELS[m.cancellation_slots.treatment] : ""}
              </div>
              <div className="text-neutral-400 text-xs">
                offered {new Date(m.offered_at).toLocaleString()}
              </div>
              <Badge status={m.status} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
