import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-neutral-50 p-6">
      <div className="max-w-sm w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">Salon Cancellation Matching</h1>
        <p className="text-neutral-500 text-sm">
          Fill an intake link with your salon&apos;s slug, e.g.{" "}
          <code className="bg-neutral-100 px-1 rounded">/intake/your-salon</code>
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/staff/cancel" className="rounded-lg bg-neutral-900 text-white py-2.5 text-sm font-medium">
            Log a cancellation (staff)
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-neutral-300 py-2.5 text-sm font-medium">
            View dashboard (staff)
          </Link>
        </div>
      </div>
    </main>
  );
}
