import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TEST_USER_ID = 'cmql6t5jd0002m0te7ny4ic9w'; // mismo user de prueba

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: TEST_USER_ID,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
      },
    });

    return NextResponse.json({ ok: true, projects });
  } catch (error: unknown) {
    console.error('Error fetching projects:', error);

    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { ok: false, error: 'Failed to fetch projects', details: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, clientId, status, rateType, rateAmount, startDate, endDate } =
      body;

    if (!name || !clientId) {
      return NextResponse.json(
        { ok: false, error: 'name y clientId son obligatorios' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        clientId,
        userId: TEST_USER_ID,
        status: status || 'active',
        rateType: rateType || null,
        rateAmount: rateAmount ?? null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating project:', error);

    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { ok: false, error: 'Failed to create project', details: message },
      { status: 500 }
    );
  }
}