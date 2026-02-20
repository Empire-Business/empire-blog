// API Route: Single Squad Operations
// GET /api/squads/[id] - Get squad by ID
// DELETE /api/squads/[id] - Delete squad

import { NextRequest, NextResponse } from 'next/server';
import { squadOrchestrator, taskOrchestrator, groupTasksByLevel } from '@/lib/orchestrator';
import { squadDb } from '@/lib/db';
import { isDashboardReadOnly, getReadOnlyErrorMessage } from '@/lib/dashboard-access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/squads/[id] - Get squad by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const squad = squadDb.getById(params.id);

    if (!squad) {
      return NextResponse.json(
        { success: false, error: 'Squad not found' },
        { status: 404 }
      );
    }

    // Include tasks organized by level
    const tasks = taskOrchestrator.getAllTasks().filter(t => squad.tasks.includes(t.id));
    const levels = groupTasksByLevel(tasks);

    return NextResponse.json({
      success: true,
      data: {
        ...squad,
        tasksByLevel: levels,
        taskDetails: tasks,
      },
    });
  } catch (error) {
    console.error('Error fetching squad:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch squad' },
      { status: 500 }
    );
  }
}

// DELETE /api/squads/[id] - Delete squad
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (isDashboardReadOnly()) {
      return NextResponse.json(
        { success: false, error: getReadOnlyErrorMessage() },
        { status: 403 }
      );
    }

    // First delete all tasks in the squad
    const squad = squadDb.getById(params.id);
    if (squad) {
      for (const taskId of squad.tasks) {
        taskOrchestrator.deleteTask(taskId);
      }
    }

    const deleted = squadDb.delete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Squad not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Squad deleted',
    });
  } catch (error) {
    console.error('Error deleting squad:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete squad' },
      { status: 500 }
    );
  }
}
