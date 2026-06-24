import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TEST_USER_ID = 'cmql6t5jd0002m0te7ny4ic9w';

export async function GET() {
  try {
    const incomes = await prisma.income.findMany({
      where: { userId: TEST_USER_ID },
      orderBy: { receivedAt: 'desc' },
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, incomes });
  } catch (error: unknown) {
    console.error('Error fetching incomes:', error);

    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { ok: false, error: 'Failed to fetch incomes', details: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, amount, currency, receivedAt, notes } = body;

    if (!projectId) {
      return NextResponse.json(
        { ok: false, error: 'projectId es obligatorio' },
        { status: 400 }
      );
    }

    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return NextResponse.json(
        { ok: false, error: 'amount es obligatorio y debe ser numérico' },
        { status: 400 }
      );
    }

    const income = await prisma.income.create({
      data: {
        userId: TEST_USER_ID,
        projectId,
        amount: Number(amount),
        currency: currency || 'USD',
        receivedAt: receivedAt ? new Date(receivedAt) : new Date(),
        notes: notes || null,
      },
    });

    return NextResponse.json({ ok: true, income }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating income:', error);

    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { ok: false, error: 'Failed to create income', details: message },
      { status: 500 }
    );
  }
}