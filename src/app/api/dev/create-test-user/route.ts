import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'test-user@example.com',
        name: 'Test User',
      },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating test user:', error);

    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { ok: false, error: 'Failed to create test user', details: message },
      { status: 500 }
    );
  }
}