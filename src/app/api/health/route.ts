import { NextResponse } from 'next/server';
import { isDatabaseEnabled } from '@/lib/env';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, 'ok' | 'error' | 'skipped'> = {
    app: 'ok',
    database: 'skipped',
  };

  if (isDatabaseEnabled()) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch {
      checks.database = 'error';
    }
  }

  const healthy = Object.values(checks).every((v) => v === 'ok' || v === 'skipped');

  return NextResponse.json(
    { status: healthy ? 'healthy' : 'degraded', checks, timestamp: new Date().toISOString() },
    { status: healthy ? 200 : 503 },
  );
}
