import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ok: true, clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('Request body:', body);

    const { name, email, type, notes } = body;

    const userId = 'cmql6t5jd0002m0te7ny4ic9w';

    const client = await prisma.client.create({
      data: {
        name,
        email,
        type,
        notes,
        userId,
      },
    });

    return NextResponse.json({ ok: true, client }, { status: 201 });
  } catch (error: unknown) {
    // Para loguear completo:
    console.error('Error creating client (raw):', error);

    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to create client',
        details: message,
      },
      { status: 500 }
    );
  }
}