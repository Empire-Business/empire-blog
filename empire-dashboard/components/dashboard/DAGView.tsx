// DAG View Component
// Visual graph of task dependencies by level

'use client';

import { useMemo } from 'react';
import { useTaskStore } from '@/stores/tasks';
import type { Task, TaskStatus } from '@/lib/types';

interface DAGViewProps {
  squadId?: string;
  selectedTaskId?: string | null;
  onSelectTask?: (task: Task) => void;
}

interface PositionedTask {
  task: Task;
  x: number;
  y: number;
}

interface TaskEdge {
  id: string;
  sourceId: string;
  targetId: string;
  d: string;
}

const NODE_WIDTH = 260;
const NODE_HEIGHT = 112;
const HORIZONTAL_GAP = 160;
const VERTICAL_GAP = 44;
const PADDING_X = 48;
const PADDING_Y = 48;

const statusStyles: Record<TaskStatus, { container: string; badge: string; dot: string }> = {
  pending: {
    container: 'border-gray-300 bg-white text-gray-800',
    badge: 'bg-gray-100 text-gray-700',
    dot: 'bg-gray-400',
  },
  ready: {
    container: 'border-blue-300 bg-blue-50 text-blue-900',
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
  running: {
    container: 'border-yellow-300 bg-yellow-50 text-yellow-900',
    badge: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500',
  },
  blocked: {
    container: 'border-red-300 bg-red-50 text-red-900',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
  },
  completed: {
    container: 'border-green-300 bg-green-50 text-green-900',
    badge: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
  failed: {
    container: 'border-rose-300 bg-rose-50 text-rose-900',
    badge: 'bg-rose-100 text-rose-700',
    dot: 'bg-rose-600',
  },
};

const statusOrder: TaskStatus[] = ['pending', 'ready', 'running', 'blocked', 'completed', 'failed'];

function buildPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): string {
  const controlOffset = Math.max(48, (targetX - sourceX) * 0.45);
  const c1x = sourceX + controlOffset;
  const c2x = targetX - controlOffset;
  return `M ${sourceX} ${sourceY} C ${c1x} ${sourceY}, ${c2x} ${targetY}, ${targetX} ${targetY}`;
}

export function DAGView({ squadId, selectedTaskId, onSelectTask }: DAGViewProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const squads = useTaskStore((state) => state.squads);

  const {
    filteredTasks,
    positionedTasks,
    edges,
    width,
    height,
  } = useMemo(() => {
    const selectedSquad = squadId ? squads.find((s) => s.id === squadId) : undefined;
    const selectedTaskIds = selectedSquad ? new Set(selectedSquad.tasks) : null;

    const scopedTasks = selectedTaskIds
      ? tasks.filter((task) => selectedTaskIds.has(task.id))
      : tasks;

    const orderedTasks = [...scopedTasks].sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    const tasksByLevel = new Map<number, Task[]>();
    for (const task of orderedTasks) {
      if (!tasksByLevel.has(task.level)) {
        tasksByLevel.set(task.level, []);
      }
      tasksByLevel.get(task.level)!.push(task);
    }

    const levels = Array.from(tasksByLevel.keys()).sort((a, b) => a - b);
    const maxTasksPerLevel = Math.max(1, ...Array.from(tasksByLevel.values()).map((items) => items.length));
    const contentHeight = Math.max(
      NODE_HEIGHT,
      maxTasksPerLevel * NODE_HEIGHT + (maxTasksPerLevel - 1) * VERTICAL_GAP
    );

    const positioned: PositionedTask[] = [];
    const taskPositionMap = new Map<string, PositionedTask>();

    for (const level of levels) {
      const levelTasks = tasksByLevel.get(level) || [];
      const levelHeight =
        levelTasks.length * NODE_HEIGHT + Math.max(0, levelTasks.length - 1) * VERTICAL_GAP;
      const startY = PADDING_Y + Math.max(0, (contentHeight - levelHeight) / 2);
      const x = PADDING_X + level * (NODE_WIDTH + HORIZONTAL_GAP);

      for (let i = 0; i < levelTasks.length; i++) {
        const y = startY + i * (NODE_HEIGHT + VERTICAL_GAP);
        const positionedTask: PositionedTask = { task: levelTasks[i], x, y };
        positioned.push(positionedTask);
        taskPositionMap.set(levelTasks[i].id, positionedTask);
      }
    }

    const graphEdges: TaskEdge[] = [];
    for (const { task } of positioned) {
      const target = taskPositionMap.get(task.id);
      if (!target) continue;

      for (const depId of task.blockedBy) {
        const source = taskPositionMap.get(depId);
        if (!source) continue;

        const sourceX = source.x + NODE_WIDTH;
        const sourceY = source.y + NODE_HEIGHT / 2;
        const targetX = target.x;
        const targetY = target.y + NODE_HEIGHT / 2;

        graphEdges.push({
          id: `${depId}->${task.id}`,
          sourceId: depId,
          targetId: task.id,
          d: buildPath(sourceX, sourceY, targetX, targetY),
        });
      }
    }

    const graphWidth =
      PADDING_X * 2 + (Math.max(1, levels.length) - 1) * (NODE_WIDTH + HORIZONTAL_GAP) + NODE_WIDTH;
    const graphHeight = PADDING_Y * 2 + contentHeight;

    return {
      filteredTasks: orderedTasks,
      positionedTasks: positioned,
      edges: graphEdges,
      width: graphWidth,
      height: graphHeight,
    };
  }, [tasks, squads, squadId]);

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium">No tasks available</p>
        <p className="text-sm">Select a squad or load tasks to visualize dependencies</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {statusOrder.map((status) => (
          <span
            key={status}
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status].badge}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusStyles[status].dot}`} />
            {status}
          </span>
        ))}
      </div>

      <div className="relative w-full overflow-auto rounded-lg border border-gray-200 bg-gray-50">
        <div className="relative" style={{ width, height }}>
          <svg
            className="absolute inset-0 pointer-events-none"
            width={width}
            height={height}
            aria-hidden="true"
          >
            <defs>
              <marker
                id="dag-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8" />
              </marker>
            </defs>
            {edges.map((edge) => (
              <path
                key={edge.id}
                d={edge.d}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.8"
                markerEnd="url(#dag-arrow)"
              />
            ))}
          </svg>

          {positionedTasks.map(({ task, x, y }) => {
            const styles = statusStyles[task.status];
            const isSelected = selectedTaskId === task.id;

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => onSelectTask?.(task)}
                className={`absolute rounded-xl border p-3 text-left shadow-sm transition-all ${styles.container} ${
                  isSelected ? 'ring-2 ring-blue-400 shadow-md' : 'hover:shadow-md'
                }`}
                style={{
                  left: x,
                  top: y,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wide">{task.agent}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${styles.badge}`}>
                    {task.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold leading-tight line-clamp-2">{task.subject}</p>
                <p className="mt-2 text-xs opacity-80">
                  Level {task.level} {task.blockedBy.length > 0 ? `• blocked by ${task.blockedBy.length}` : ''}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
