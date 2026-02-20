// API Route: Tasks CRUD
// GET /api/tasks - List all tasks
// POST /api/tasks - Create a new task

import { NextRequest, NextResponse } from 'next/server';
import { taskOrchestrator } from '@/lib/orchestrator';
import { taskDb } from '@/lib/db';
import { emitTaskCreated } from '@/lib/events';
import { isDashboardReadOnly, getReadOnlyErrorMessage } from '@/lib/dashboard-access';
import type { CreateTaskRequest, AgentType } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/tasks - List all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const agent = searchParams.get('agent');
    const squadId = searchParams.get('squadId');

    let tasks;

    if (status) {
      tasks = taskDb.getByStatus(status as any);
    } else if (squadId) {
      tasks = taskDb.getBySquad(squadId);
    } else {
      tasks = taskDb.getAll();
    }

    // Filter by agent if specified
    if (agent) {
      tasks = tasks.filter(t => t.agent === agent);
    }

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    if (isDashboardReadOnly()) {
      return NextResponse.json(
        { success: false, error: getReadOnlyErrorMessage() },
        { status: 403 }
      );
    }

    const body: CreateTaskRequest = await request.json();

    // Validate required fields
    if (!body.subject || !body.description || !body.activeForm || !body.agent) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: subject, description, activeForm, agent' },
        { status: 400 }
      );
    }

    // Validate agent type
    const validAgents: AgentType[] = ['PM', 'ARCHITECT', 'DEVELOPER', 'REVIEWER', 'QA', 'SECURITY', 'DESIGNER', 'DATA'];
    if (!validAgents.includes(body.agent)) {
      return NextResponse.json(
        { success: false, error: `Invalid agent. Must be one of: ${validAgents.join(', ')}` },
        { status: 400 }
      );
    }

    // Create task via orchestrator
    const task = taskOrchestrator.createTask({
      subject: body.subject,
      description: body.description,
      activeForm: body.activeForm,
      agent: body.agent,
      blockedBy: body.blockedBy || [],
      protocol: body.protocol,
      terminalPrompt: body.terminalPrompt,
    });

    // Emit creation event
    emitTaskCreated(task);

    return NextResponse.json({
      success: true,
      data: task,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks - Delete all tasks (for cleanup)
export async function DELETE() {
  try {
    if (isDashboardReadOnly()) {
      return NextResponse.json(
        { success: false, error: getReadOnlyErrorMessage() },
        { status: 403 }
      );
    }

    taskDb.deleteAll();
    return NextResponse.json({
      success: true,
      message: 'All tasks deleted',
    });
  } catch (error) {
    console.error('Error deleting tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tasks' },
      { status: 500 }
    );
  }
}
