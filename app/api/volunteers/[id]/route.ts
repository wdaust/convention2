import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: params.id },
      include: {
        assignments: {
          include: {
            department: true
          }
        }
      }
    })

    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 })
    }

    return NextResponse.json(volunteer)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch volunteer' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json()
    const volunteer = await prisma.volunteer.update({
      where: { id: params.id },
      data: {
        firstName: json.firstName,
        lastName: json.lastName,
        email: json.email || null,
        phone: json.phone || null,
      },
    })
    return NextResponse.json(volunteer)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update volunteer' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.volunteer.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete volunteer' }, { status: 500 })
  }
}
