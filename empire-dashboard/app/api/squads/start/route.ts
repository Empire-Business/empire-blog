// API Route: Start Squad Execution
// POST /api/squads/start - Start executing a squad

import { NextRequest, NextResponse } from 'next/server';
import { squadOrchestrator, taskOrchestrator, groupTasksByLevel } from '@/lib/orchestrator';
import { squadDb } from '@/lib/db';
import { isDashboardReadOnly, getReadOnlyErrorMessage } from '@/lib/dashboard-access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/squads/start - Start squad execution
export async function POST(request: NextRequest) {
  try {
    if (isDashboardReadOnly()) {
      return NextResponse.json(
        { success: false, error: getReadOnlyErrorMessage() },
        { status: 403 }
      );
    }

    const body: { squadId: string } = await request.json();

    if (!body.squadId) {
      return NextResponse.json(
        { success: false, error: 'Missing squadId' },
        { status: 400 }
      );
    }

    const squad = squadDb.getById(body.squadId);
    if (!squad) {
      return NextResponse.json(
        { success: false, error: 'Squad not found' },
        { status: 404 }
      );
    }

    // Start the squad
    const updated = squadOrchestrator.startSquad(body.squadId);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to start squad. It may already be running.' },
        { status: 400 }
      );
    }

    // Get tasks by level for response
    const tasks = taskOrchestrator.getAllTasks().filter(t => squad.tasks.includes(t.id));
    const levels = groupTasksByLevel(tasks);

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        tasksByLevel: levels,
        message: `Squad "${squad.name}" started. ${levels[0]?.length || 0} tasks running in parallel.`,
      },
    });
  } catch (error) {
    console.error('Error starting squad:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start squad' },
      { status: 500 }
    );
  }
}
