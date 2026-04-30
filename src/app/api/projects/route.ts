import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Fetch projects error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const role = req.headers.get('x-user-role')
    
    // Only Admin can create projects
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin only.' }, { status: 403 })
    }

    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
