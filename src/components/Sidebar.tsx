'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, CheckSquare, Settings } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-secondary text-white min-h-screen">
      <div className="flex items-center justify-center h-16 border-b border-white/10">
        <span className="text-xl font-bold tracking-wider text-white">Ethara<span className="text-primary">.Ai</span></span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
