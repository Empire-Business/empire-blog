// Task Board Component
// Kanban-style view of tasks organized by level

'use client';

import { useMemo } from 'react';
import { useTaskStore } from '@/stores/tasks';
import { TaskCard } from './TaskCard';
import type { Task } from '@/lib/types';

interface TaskBoardProps {
  squadId?: string;
  onSelectTask?: (task: Task) => void;
  selectedTaskId?: string | null;
}

export function TaskBoard({ squadId, onSelectTask, selectedTaskId }: TaskBoardProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const squads = useTaskStore((state) => state.squads);

  // Filter and organize tasks by level
  const tasksByLevel = useMemo(() => {
    const filteredTasks = squadId
      ? (() => {
          const selectedSquad = squads.find((s) => s.id === squadId);
          if (!selectedSquad) return [];

          const squadTaskIds = new Set(selectedSquad.tasks);
          return tasks.filter((t) => squadTaskIds.has(t.id));
        })()
      : tasks;

    const levels = new Map<number, Task[]>();

    for (const task of filteredTasks) {
      const level = task.level;
      if (!levels.has(level)) {
        levels.set(level, []);
      }
      levels.get(level)!.push(task);
    }

    // Sort tasks within each level by creation time
    for (const [level, levelTasks] of levels) {
      levels.set(
        level,
        levelTasks.sort((a: Task, b: Task) => a.createdAt.getTime() - b.createdAt.getTime())
      );
    }

    // Return as sorted array
    return Array.from(levels.entries()).sort((a, b) => a[0] - b[0]);
  }, [tasks, squads, squadId]);

  // Calculate level status
  const getLevelStatus = (levelTasks: Task[]) => {
    const allComplete = levelTasks.every((t) => t.status === 'completed');
    const anyRunning = levelTasks.some((t) => t.status === 'running');
    const anyFailed = levelTasks.some((t) => t.status === 'failed');
    const allBlocked = levelTasks.every((t) => t.status === 'blocked');

    if (allComplete) return { label: 'Completed', icon: '✅', color: 'text-green-500' };
    if (anyFailed) return { label: 'Failed', icon: '❌', color: 'text-red-500' };
    if (anyRunning) return { label: 'Running', icon: '🔄', color: 'text-yellow-500' };
    if (allBlocked) return { label: 'Blocked', icon: '⏳', color: 'text-gray-400' };
    return { label: 'Ready', icon: '⚡', color: 'text-blue-500' };
  };

  if (tasksByLevel.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <p className="text-lg font-medium">No tasks available</p>
        <p className="text-sm">Read-only dashboard. If you expected tasks, verify API/backend connection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tasksByLevel.map(([level, levelTasks]) => {
        const status = getLevelStatus(levelTasks);
        const completedCount = levelTasks.filter((t) => t.status === 'completed').length;
        const isParallel = levelTasks.length > 1;

        return (
          <div key={level} className="space-y-3">
            {/* Level Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-lg ${status.color}`}>{status.icon}</span>
                <h3 className="text-sm font-semibold text-gray-900">
                  Level {level}
                </h3>
                {isParallel && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                    PARALLEL
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {completedCount}/{levelTasks.length} completed
                </span>
              </div>
            </div>

            {/* Task Cards */}
            <div
              className={`grid gap-4 ${
                isParallel
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 max-w-xl'
              }`}
            >
              {levelTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isSelected={selectedTaskId === task.id}
                  onSelect={() => onSelectTask?.(task)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
