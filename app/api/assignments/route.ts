import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        volunteer: true,
        department: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(assignments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const assignment = await prisma.assignment.create({
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
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 })
  }
}
