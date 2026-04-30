'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      setUser(data.user)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary">Welcome Back</h2>
          <p className="text-text-muted mt-2">Login to your account</p>
        </div>

        {error && (
          <div className="bg-danger/10 text-danger p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="admin@ethara.ai"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70 flex justify-center"
          >
            {loading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-muted">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </div>
      </div>
    </div>
  )
}
