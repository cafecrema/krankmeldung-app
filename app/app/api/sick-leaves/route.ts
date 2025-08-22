
interface SickLeave {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const currentYear = new Date().getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)
    const endOfYear = new Date(currentYear, 11, 31)

    const sickLeaves = await prisma.sickLeave.findMany({
      where: {
        userId: session.user.id,
        startDate: {
          gte: startOfYear,
          lte: endOfYear,
        }
      },
      include: {
        projects: true
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    // Update status based on current date
    const now = new Date()
    const updatedSickLeaves = sickLeaves.map(leave => ({
      ...leave,
      status: leave.endDate < now ? 'expired' : 'active'
    }))

    return NextResponse.json(updatedSickLeaves)
  } catch (error) {
    console.error('Error fetching sick leaves:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Krankmeldungen' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const {
      startDate,
      endDate,
      customerInfoType,
      substituteName,
      customerContact,
      tasks,
      ccRecipients,
      projects
    } = await request.json()

    if (!startDate || !endDate || !customerInfoType) {
      return NextResponse.json(
        { error: 'Startdatum, Enddatum und Kundeninformation sind erforderlich' },
        { status: 400 }
      )
    }

    const sickLeave = await prisma.sickLeave.create({
      data: {
        userId: session.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        customerInfoType,
        substituteName,
        customerContact,
        tasks,
        ccRecipients: ccRecipients || [],
        projects: {
          create: projects?.map((project: any) => ({
            customer: project.customer,
            project: project.project
          })) || []
        }
      },
      include: {
        projects: true,
        user: true
      }
    })

    return NextResponse.json({
      message: 'Krankmeldung erfolgreich erstellt',
      sickLeave
    })
  } catch (error) {
    console.error('Error creating sick leave:', error)
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Krankmeldung' },
      { status: 500 }
    )
  }
}
