import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { assignments: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(departments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const department = await prisma.department.create({
      data: {
        name: json.name,
        description: json.description || null,
      },
    })
    return NextResponse.json(department)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 })
  }
}
