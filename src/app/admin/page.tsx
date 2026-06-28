'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-brand-text text-4xl font-light tracking-wide mb-2 text-center">
          Happy Days
        </h1>
        <p className="font-sans text-brand-text/40 text-xs tracking-[0.3em] uppercase text-center mb-12">
          Admin Panel
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block font-sans text-brand-text/50 text-xs tracking-[0.25em] uppercase mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border text-brand-text px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="Enter admin password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="font-sans text-red-400 text-xs tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-accent text-brand-bg font-sans text-sm tracking-widest uppercase py-3.5 hover:bg-brand-accent/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center">
          <a href="/" className="font-sans text-brand-text/30 text-xs tracking-wide hover:text-brand-text/60 transition-colors">
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  )
}
