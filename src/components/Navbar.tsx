'use client'

import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

export default function Navbar() {
  const { user, setUser } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/login')
  }

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-surface border-b border-border shadow-sm">
      <div className="flex items-center">
        {/* Placeholder for future breadcrumbs or mobile menu */}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-semibold text-text-main leading-tight">{user.name}</span>
                <span className="text-xs text-text-muted leading-tight">{user.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-text-muted" />
          </div>
        )}
      </div>
    </header>
  )
}
