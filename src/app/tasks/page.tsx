'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { CheckSquare, Clock, CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  dueDate: string | null
  project: { id: string, name: string }
  assignee: { id: string, name: string } | null
}

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        setTasks(await res.json())
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div>Loading tasks...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">My Tasks</h1>
        <p className="text-text-muted mt-1">Overview of all tasks {user?.role === 'ADMIN' ? 'across all projects' : 'assigned to you'}</p>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-border p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-indigo-50 p-4 rounded-full mb-4">
            <CheckSquare className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-bold text-secondary mb-2">No tasks found</h3>
          <p className="text-text-muted">You're all caught up! There are no tasks available right now.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="py-3 px-4 font-semibold text-sm text-secondary">Task</th>
                  <th className="py-3 px-4 font-semibold text-sm text-secondary">Project</th>
                  <th className="py-3 px-4 font-semibold text-sm text-secondary">Status</th>
                  <th className="py-3 px-4 font-semibold text-sm text-secondary">Due Date</th>
                  {user?.role === 'ADMIN' && <th className="py-3 px-4 font-semibold text-sm text-secondary">Assignee</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks.map(task => {
                  const isAssignee = task.assignee?.id === user?.id
                  const canEditStatus = user?.role === 'ADMIN' || isAssignee
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE'

                  return (
                    <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-secondary">{task.title}</div>
                        {task.description && <div className="text-xs text-text-muted truncate max-w-xs">{task.description}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/projects/${task.project.id}`} className="text-sm text-primary hover:underline font-medium">
                          {task.project.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        {canEditStatus ? (
                          <select 
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            className={`text-xs font-medium rounded-md px-2 py-1 border-none focus:ring-0 cursor-pointer ${
                              task.status === 'TODO' ? 'bg-amber-100 text-amber-700' :
                              task.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-700' :
                              'bg-green-100 text-green-700'
                            }`}
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                          </select>
                        ) : (
                          <span className={`text-xs font-medium rounded-md px-2 py-1 ${
                            task.status === 'TODO' ? 'bg-amber-100 text-amber-700' :
                            task.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {task.dueDate ? (
                          <span className={`flex items-center gap-1 ${isOverdue ? 'text-danger font-medium' : 'text-text-muted'}`}>
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      {user?.role === 'ADMIN' && (
                        <td className="py-3 px-4 text-sm text-text-muted">
                          {task.assignee?.name || 'Unassigned'}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
