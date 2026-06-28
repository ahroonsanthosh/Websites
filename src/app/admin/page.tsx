'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
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
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-5">
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <h1 className="font-display text-brand-text text-5xl font-bold mb-2">
            Happy Days
          </h1>
          <span className="tag tag-orange mx-auto">Admin Panel</span>
        </div>

        <div className="bg-brand-surface rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block font-sans text-brand-muted text-xs font-semibold tracking-widest uppercase mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border text-brand-text rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-accent transition-colors"
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="font-sans text-red-500 text-xs font-semibold">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-accent text-white rounded-full font-sans text-sm font-bold tracking-wide py-3.5 hover:bg-brand-text transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center">
          <a href="/" className="font-sans text-brand-muted text-xs hover:text-brand-accent transition-colors">
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  )
}
