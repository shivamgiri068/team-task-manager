'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'
import { FolderPlus, FolderKanban, MoreVertical, Trash2, Edit } from 'lucide-react'

type Project = {
  id: string
  name: string
  description: string | null
  createdAt: string
  _count: { tasks: number }
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName, description: newProjectDesc }),
      })
      
      if (res.ok) {
        setShowModal(false)
        setNewProjectName('')
        setNewProjectDesc('')
        fetchProjects()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) fetchProjects()
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div>Loading projects...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Projects</h1>
          <p className="text-text-muted mt-1">Manage your team's projects</p>
        </div>
        
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FolderPlus className="w-5 h-5" />
            New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-border p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <FolderKanban className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-secondary mb-2">No projects found</h3>
          <p className="text-text-muted max-w-sm">
            {user?.role === 'ADMIN' 
              ? "Get started by creating your first project." 
              : "There are no projects available right now. Ask an administrator to create one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="block">
              <div className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  {user?.role === 'ADMIN' && (
                    <button 
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="text-gray-400 hover:text-danger p-1 hidden group-hover:block transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2 truncate" title={project.name}>{project.name}</h3>
                <p className="text-text-muted text-sm mb-6 line-clamp-2 min-h-[40px]">
                  {project.description || "No description provided."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs font-medium text-text-muted bg-gray-100 px-2.5 py-1 rounded-md">
                    {project._count.tasks} Tasks
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold text-secondary">Create New Project</h3>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Description (Optional)</label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  placeholder="What is this project about?"
                  rows={3}
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
