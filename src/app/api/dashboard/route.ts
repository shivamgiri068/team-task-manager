import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const role = req.headers.get('x-user-role')
    const userId = req.headers.get('x-user-id')

    let totalTasks = 0
    let pendingTasks = 0
    let inProgressTasks = 0
    let completedTasks = 0
    let overdueTasks = 0
    
    const now = new Date()

    if (role === 'ADMIN') {
      // Admin sees everything
      const tasks = await prisma.task.findMany()
      
      totalTasks = tasks.length
      pendingTasks = tasks.filter(t => t.status === 'TODO').length
      inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length
      completedTasks = tasks.filter(t => t.status === 'DONE').length
      overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'DONE').length
      
    } else {
      // Member sees their assigned tasks
      const tasks = await prisma.task.findMany({
        where: { assigneeId: userId }
      })
      
      totalTasks = tasks.length
      pendingTasks = tasks.filter(t => t.status === 'TODO').length
      inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length
      completedTasks = tasks.filter(t => t.status === 'DONE').length
      overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'DONE').length
    }

    return NextResponse.json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks
    })
  } catch (error) {
    console.error('Dashboard fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
