'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { CheckCircle2, Circle, Clock, ListTodo } from 'lucide-react'

type DashboardStats = {
  totalTasks: number
  pendingTasks: number
  inProgressTasks: number
  completedTasks: number
  overdueTasks: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">
          Welcome back, {user?.name.split(' ')[0]} 👋
        </h1>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-border text-sm font-medium text-text-muted">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon={ListTodo}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending"
          value={stats?.pendingTasks || 0}
          icon={Circle}
          color="bg-amber-500"
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgressTasks || 0}
          icon={Clock}
          color="bg-indigo-500"
        />
        <StatCard
          title="Completed"
          value={stats?.completedTasks || 0}
          icon={CheckCircle2}
          color="bg-green-500"
        />
      </div>

      {stats && stats.overdueTasks > 0 && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-start gap-4">
          <div className="bg-danger/20 p-2 rounded-full text-danger mt-1">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-danger font-semibold">Action Required</h3>
            <p className="text-danger/80 text-sm mt-1">
              You have {stats.overdueTasks} overdue task(s). Please review your tasks and update their status.
            </p>
          </div>
        </div>
      )}

      {/* Placeholder for recent activity or tasks list */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6 h-64 flex flex-col items-center justify-center text-text-muted">
        <ListTodo className="w-12 h-12 mb-4 text-border" />
        <p>No recent activity</p>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-secondary">{value}</h3>
      </div>
      <div className={`${color} bg-opacity-10 p-3 rounded-xl`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  )
}
