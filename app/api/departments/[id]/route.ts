import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        assignments: {
          include: {
            volunteer: true
          }
        }
      }
    })

    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }

    return NextResponse.json(department)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch department' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json()
    const department = await prisma.department.update({
      where: { id: params.id },
      data: {
        name: json.name,
        description: json.description || null,
      },
    })
    return NextResponse.json(department)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update department' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.department.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 })
  }
}
