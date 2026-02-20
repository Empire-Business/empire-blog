// Squad Status Component
// Shows squad progress and controls

'use client';

import { Play, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useTaskStore } from '@/stores/tasks';
import type { SquadExecution, SquadType } from '@/lib/types';
import { ProgressBar } from './ProgressBar';

interface SquadStatusProps {
  squad: SquadExecution & { taskDetails?: any[]; tasksByLevel?: any[] };
  onSelect?: () => void;
  isSelected?: boolean;
}

const squadTypeLabels: Record<SquadType, string> = {
  feature: 'Feature',
  bug: 'Bug Fix',
  performance: 'Performance',
  security: 'Security',
  design: 'Design',
};

const squadTypeColors: Record<SquadType, string> = {
  feature: 'bg-blue-500',
  bug: 'bg-red-500',
  performance: 'bg-yellow-500',
  security: 'bg-purple-500',
  design: 'bg-pink-500',
};

export function SquadStatus({ squad, onSelect, isSelected }: SquadStatusProps) {
  const statusIcon =
    squad.status === 'completed' ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : squad.status === 'failed' ? (
      <XCircle className="w-5 h-5 text-red-500" />
    ) : squad.status === 'running' ? (
      <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
    ) : (
      <Play className="w-5 h-5 text-gray-400" />
    );

  const completedTasks = squad.taskDetails?.filter((t: any) => t.status === 'completed').length || 0;
  const totalTasks = squad.tasks.length;

  return (
    <div
      className={`bg-white rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {statusIcon}
              <h3 className="font-semibold text-gray-900">{squad.name}</h3>
              <span
                className={`px-2 py-0.5 text-xs text-white rounded ${
                  squadTypeColors[squad.type]
                }`}
              >
                {squadTypeLabels[squad.type]}
              </span>
            </div>
            {squad.description && (
              <p className="text-sm text-gray-500">{squad.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">
            {completedTasks}/{totalTasks} tasks
          </span>
        </div>

        <ProgressBar
          progress={squad.progress}
          status={
            squad.status === 'completed'
              ? 'completed'
              : squad.status === 'failed'
              ? 'failed'
              : squad.status === 'running'
              ? 'running'
              : 'pending'
          }
          size="md"
          showLabel={true}
        />

        {/* Level indicators */}
        <div className="flex items-center gap-1">
          {Array.from({ length: squad.totalLevels }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded ${
                i < squad.currentLevel
                  ? 'bg-green-400'
                  : i === squad.currentLevel && squad.status === 'running'
                  ? 'bg-yellow-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Level {squad.currentLevel + 1} of {squad.totalLevels}</span>
          <span>{squad.progress}% complete</span>
        </div>
      </div>

      {/* Stats */}
      {squad.taskDetails && (
        <div className="px-4 pb-4 grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-gray-50 rounded">
            <p className="text-lg font-semibold text-gray-900">
              {squad.taskDetails.filter((t: any) => t.status === 'pending').length}
            </p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="p-2 bg-yellow-50 rounded">
            <p className="text-lg font-semibold text-yellow-600">
              {squad.taskDetails.filter((t: any) => t.status === 'running').length}
            </p>
            <p className="text-xs text-gray-500">Running</p>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <p className="text-lg font-semibold text-green-600">
              {squad.taskDetails.filter((t: any) => t.status === 'completed').length}
            </p>
            <p className="text-xs text-gray-500">Done</p>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <p className="text-lg font-semibold text-red-600">
              {squad.taskDetails.filter((t: any) => t.status === 'failed').length}
            </p>
            <p className="text-xs text-gray-500">Failed</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Squad List Component
export function SquadList() {
  const squads = useTaskStore((state) => state.squads);
  const selectedSquadId = useTaskStore((state) => state.selectedSquadId);
  const selectSquad = useTaskStore((state) => state.selectSquad);

  if (squads.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="mb-2">No squads available</p>
        <p className="text-sm">Read-only dashboard. If you expected squads, verify API/backend connection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {squads.map((squad) => (
        <SquadStatus
          key={squad.id}
          squad={squad as any}
          isSelected={selectedSquadId === squad.id}
          onSelect={() => selectSquad(squad.id)}
        />
      ))}
    </div>
  );
}
