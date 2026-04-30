import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const role = req.headers.get('x-user-role')
    const userId = req.headers.get('x-user-id')

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    const assigneeId = searchParams.get('assigneeId')

    const where: any = {}
    if (projectId) where.projectId = projectId
    
    if (role === 'ADMIN') {
      if (assigneeId) where.assigneeId = assigneeId
    } else {
      where.assigneeId = userId // Members only see their tasks
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const role = req.headers.get('x-user-role')
    
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin only.' }, { status: 403 })
    }

    const { title, description, status, dueDate, projectId, assigneeId } = await req.json()

    if (!title || !projectId) {
      return NextResponse.json({ error: 'Title and projectId are required' }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null,
      },
      include: {
        assignee: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
