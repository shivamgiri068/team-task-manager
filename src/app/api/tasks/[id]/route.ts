import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const role = req.headers.get('x-user-role')
    const userId = req.headers.get('x-user-id')
    
    const { title, description, status, dueDate, assigneeId } = await req.json()

    const existingTask = await prisma.task.findUnique({ where: { id } })
    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Members can only update status of their own assigned tasks
    if (role !== 'ADMIN') {
      if (existingTask.assigneeId !== userId) {
        return NextResponse.json({ error: 'Forbidden. You can only update your assigned tasks.' }, { status: 403 })
      }
      
      // Update only status
      const updatedTask = await prisma.task.update({
        where: { id },
        data: { status }
      })
      return NextResponse.json(updatedTask)
    }

    // Admin can update everything
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || null,
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const role = req.headers.get('x-user-role')

    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
