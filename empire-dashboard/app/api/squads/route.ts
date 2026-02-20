// API Route: Squads CRUD
// GET /api/squads - List all squads
// POST /api/squads - Create a new squad

import { NextRequest, NextResponse } from 'next/server';
import { squadOrchestrator, taskOrchestrator, groupTasksByLevel } from '@/lib/orchestrator';
import { squadDb } from '@/lib/db';
import { emitSquadCreated } from '@/lib/events';
import { isDashboardReadOnly, getReadOnlyErrorMessage } from '@/lib/dashboard-access';
import type { CreateSquadRequest, AgentType, SquadType } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/squads - List all squads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let squads = squadDb.getAll();

    // Filter by status
    if (status) {
      squads = squads.filter(s => s.status === status);
    }

    // Filter by type
    if (type) {
      squads = squads.filter(s => s.type === type);
    }

    // Include tasks organized by level
    const squadsWithTasks = squads.map(squad => {
      const tasks = taskOrchestrator.getAllTasks().filter(t => squad.tasks.includes(t.id));
      const levels = groupTasksByLevel(tasks);

      return {
        ...squad,
        tasksByLevel: levels,
        taskDetails: tasks,
      };
    });

    return NextResponse.json({
      success: true,
      data: squadsWithTasks,
      count: squads.length,
    });
  } catch (error) {
    console.error('Error fetching squads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch squads' },
      { status: 500 }
    );
  }
}

// POST /api/squads - Create a new squad
export async function POST(request: NextRequest) {
  try {
    if (isDashboardReadOnly()) {
      return NextResponse.json(
        { success: false, error: getReadOnlyErrorMessage() },
        { status: 403 }
      );
    }

    const body: CreateSquadRequest & {
      context?: { projectName?: string; featureName?: string };
    } = await request.json();

    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const validSquadTypes: SquadType[] = ['feature', 'bug', 'performance', 'security', 'design'];
    if (!validSquadTypes.includes(body.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid squad type. Must be one of: ${validSquadTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.taskTemplates) || body.taskTemplates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: non-empty taskTemplates' },
        { status: 400 }
      );
    }

    const taskTemplates = body.taskTemplates as Array<(typeof body.taskTemplates)[number] & { level?: number }>;
    const validAgents: AgentType[] = ['PM', 'ARCHITECT', 'DEVELOPER', 'REVIEWER', 'QA', 'SECURITY', 'DESIGNER', 'DATA'];
    for (const task of taskTemplates) {
      if (!task.subject?.trim() || !task.description?.trim() || !task.activeForm?.trim() || !task.agent) {
        return NextResponse.json(
          {
            success: false,
            error: 'Each task template must include subject, description, activeForm, and agent',
          },
          { status: 400 }
        );
      }

      if (!validAgents.includes(task.agent)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid task agent "${task.agent}". Must be one of: ${validAgents.join(', ')}`,
          },
          { status: 400 }
        );
      }

      if (task.level !== undefined && (!Number.isInteger(task.level) || task.level < 0)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Task level must be a non-negative integer when provided',
          },
          { status: 400 }
        );
      }
    }

    // Build DAG levels. Without explicit level, tasks run in parallel at level 0.
    const templatesByLevel = new Map<number, typeof taskTemplates>();
    for (const template of taskTemplates) {
      const level = template.level ?? 0;
      const existing = templatesByLevel.get(level);
      if (existing) {
        existing.push(template);
      } else {
        templatesByLevel.set(level, [template]);
      }
    }

    const levels = Array.from(templatesByLevel.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([level, templates]) => ({
        name: `Level ${level}`,
        parallel: true,
        tasks: templates.map(({ level: _ignoredLevel, ...template }) => template),
      }));

    const squad = squadOrchestrator.createSquadFromTemplate({
      name,
      type: body.type,
      description: body.description,
      levels,
    }, body.context);

    emitSquadCreated(squad);

    return NextResponse.json({
      success: true,
      data: squad,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating squad:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create squad' },
      { status: 500 }
    );
  }
}
