// API Route: Single Task Operations
// GET /api/tasks/[id] - Get task by ID
// PATCH /api/tasks/[id] - Update task
// DELETE /api/tasks/[id] - Delete task

import { NextRequest, NextResponse } from 'next/server';
import { taskOrchestrator, squadOrchestrator } from '@/lib/orchestrator';
import { taskDb, logDb } from '@/lib/db';
import { isDashboardReadOnly, getReadOnlyErrorMessage } from '@/lib/dashboard-access';
import type { UpdateTaskRequest } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/tasks/[id] - Get task by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const task = taskDb.getById(params.id);

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Include logs
    const logs = logDb.getByTask(params.id);

    return NextResponse.json({
      success: true,
      data: {
        ...task,
        logs,
      },
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    if (isDashboardReadOnly()) {
      return NextResponse.json(
        { success: false, error: getReadOnlyErrorMessage() },
        { status: 403 }
      );
    }

    const body: UpdateTaskRequest & {
      log?: { level: 'info' | 'success' | 'warning' | 'error'; message: string };
      action?: 'start' | 'complete' | 'fail';
      output?: string;
      error?: string;
    } = await request.json();

    // Check if task exists
    const existing = taskDb.getById(params.id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    let task;

    // Handle action shortcuts
    if (body.action) {
      switch (body.action) {
        case 'start':
          task = taskOrchestrator.startTask(params.id);
          if (!task) {
            return NextResponse.json(
              { success: false, error: 'Cannot start task. It may be blocked or already running.' },
              { status: 400 }
            );
          }
          break;
        case 'complete':
          task = taskOrchestrator.completeTask(params.id, body.output);
          break;
        case 'fail':
          task = taskOrchestrator.failTask(params.id, body.error || 'Task failed');
          break;
      }
    } else {
      // Regular update
      task = taskOrchestrator.updateTask(params.id, body);
    }

    // Add log if provided
    if (body.log) {
      taskOrchestrator.addTaskLog(params.id, body.log.level, body.log.message);
    }

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Failed to update task' },
        { status: 500 }
      );
    }

    // Reconcile squads that include this task (progress update + auto-start next ready tasks)
    squadOrchestrator.syncSquadsForTask(params.id);

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (isDashboardReadOnly()) {
      return NextResponse.json(
        { success: false, error: getReadOnlyErrorMessage() },
        { status: 403 }
      );
    }

    const deleted = taskOrchestrator.deleteTask(params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
