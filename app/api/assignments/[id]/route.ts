import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
      include: {
        volunteer: true,
        department: true,
      }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    return NextResponse.json(assignment)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assignment' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json()
    const assignment = await prisma.assignment.update({
      where: { id: params.id },
      data: {
        volunteerId: json.volunteerId,
        departmentId: json.departmentId,
        role: json.role || null,
        startTime: json.startTime ? new Date(json.startTime) : null,
        endTime: json.endTime ? new Date(json.endTime) : null,
        notes: json.notes || null,
      },
      include: {
        volunteer: true,
        department: true,
      }
    })
    return NextResponse.json(assignment)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.assignment.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 })
  }
}
