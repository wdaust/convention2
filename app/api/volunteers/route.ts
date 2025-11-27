import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: {
        _count: {
          select: { assignments: true }
        }
      },
      orderBy: {
        lastName: 'asc'
      }
    })
    return NextResponse.json(volunteers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch volunteers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const volunteer = await prisma.volunteer.create({
      data: {
        firstName: json.firstName,
        lastName: json.lastName,
        email: json.email || null,
        phone: json.phone || null,
      },
    })
    return NextResponse.json(volunteer)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create volunteer' }, { status: 500 })
  }
}
