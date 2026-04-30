'use client'

import { useEffect, useState, use } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { ArrowLeft, Plus, Clock, CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  dueDate: string | null
  assignee: { id: string, name: string, email: string } | null
}

type ProjectDetail = {
  id: string
  name: string
  description: string | null
  tasks: Task[]
}

type User = {
  id: string
  name: string
  email: string
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user } = useAuth()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')

  useEffect(() => {
    fetchProject()
    if (user?.role === 'ADMIN') {
      fetchUsers()
    }
  }, [resolvedParams.id, user])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${resolvedParams.id}`)
      if (res.ok) {
        const data = await res.json()
        setProject(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        setUsers(await res.json())
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          projectId: resolvedParams.id,
          assigneeId: newTaskAssignee || null,
          dueDate: newTaskDueDate || null,
        }),
      })
      if (res.ok) {
        setShowModal(false)
        setNewTaskTitle('')
        setNewTaskDesc('')
        setNewTaskAssignee('')
        setNewTaskDueDate('')
        fetchProject()
      }
    } catch (error) {
      console.error(error)
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
        fetchProject()
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div>Loading project details...</div>
  if (!project) return <div>Project not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary">{project.name}</h1>
          {project.description && <p className="text-text-muted mt-1">{project.description}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-lg font-semibold text-secondary">Tasks</h2>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO Column */}
        <div className="bg-gray-50/50 rounded-xl p-4 border border-border/50">
          <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
            <Circle className="w-4 h-4 text-amber-500" /> To Do
          </h3>
          <div className="space-y-3">
            {project.tasks.filter(t => t.status === 'TODO').map(task => (
              <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} userRole={user?.role} userId={user?.id} />
            ))}
          </div>
        </div>

        {/* IN_PROGRESS Column */}
        <div className="bg-gray-50/50 rounded-xl p-4 border border-border/50">
          <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" /> In Progress
          </h3>
          <div className="space-y-3">
            {project.tasks.filter(t => t.status === 'IN_PROGRESS').map(task => (
              <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} userRole={user?.role} userId={user?.id} />
            ))}
          </div>
        </div>

        {/* DONE Column */}
        <div className="bg-gray-50/50 rounded-xl p-4 border border-border/50">
          <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> Done
          </h3>
          <div className="space-y-3">
            {project.tasks.filter(t => t.status === 'DONE').map(task => (
              <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} userRole={user?.role} userId={user?.id} />
            ))}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold text-secondary">Create New Task</h3>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g. Design Homepage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Description</label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Assignee</label>
                <select
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function TaskCard({ task, onStatusChange, userRole, userId }: { task: Task, onStatusChange: any, userRole: string | undefined, userId: string | undefined }) {
  const isAssignee = task.assignee?.id === userId
  const canEditStatus = userRole === 'ADMIN' || isAssignee

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-secondary mb-1">{task.title}</h4>
      {task.description && <p className="text-xs text-text-muted mb-3 line-clamp-2">{task.description}</p>}
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border border-dashed">
        <div className="flex items-center gap-2">
          {task.assignee ? (
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary" title={task.assignee.name}>
              {task.assignee.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400" title="Unassigned">
              ?
            </div>
          )}
          {task.dueDate && (
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
              new Date(task.dueDate) < new Date() && task.status !== 'DONE' 
                ? 'bg-danger/10 text-danger' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {canEditStatus && (
          <select 
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="text-xs border-none bg-transparent text-primary font-medium focus:ring-0 cursor-pointer"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        )}
      </div>
    </div>
  )
}
