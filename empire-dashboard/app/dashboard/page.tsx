// Dashboard Page
// Main task-oriented dashboard with real-time updates

'use client';

import { useEffect, useState } from 'react';
import {
  RefreshCw,
  Wifi,
  WifiOff,
  LayoutGrid,
  GitBranch,
  Activity,
  Zap,
  Eye,
} from 'lucide-react';
import { useTaskStore } from '@/stores/tasks';
import { useTaskUpdates } from '@/hooks/useTaskUpdates';
import {
  TaskBoard,
  DAGView,
  SquadList,
  LogFeed,
  TerminalPrompt,
  ProgressBar,
} from '@/components/dashboard';
import type { Task } from '@/lib/types';

type ViewMode = 'board' | 'dag' | 'logs';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Connect to SSE for real-time updates
  const { isConnected } = useTaskUpdates();

  // Get store methods and state
  const {
    tasks,
    selectedSquadId,
    isLoading,
    error,
    fetchTasks,
    fetchSquads,
  } = useTaskStore();

  // Initial data fetch
  useEffect(() => {
    fetchTasks();
    fetchSquads();
  }, [fetchTasks, fetchSquads]);

  // Calculate overall progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const runningTasks = tasks.filter((t) => t.status === 'running').length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-500" />
            Task Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Consulta em tempo real da orquestração de tarefas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
            <Eye className="w-4 h-4" />
            <span>Read-only</span>
          </div>

          {/* Connection status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-green-700">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-red-700">Offline</span>
              </>
            )}
          </div>

          {/* Refresh button */}
          <button
            onClick={() => {
              fetchTasks();
              fetchSquads();
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Running</p>
          <p className="text-2xl font-bold text-yellow-600">{runningTasks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Progress</p>
          <div className="mt-1">
            <ProgressBar
              progress={overallProgress}
              status={overallProgress === 100 ? 'completed' : 'running'}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Squads */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Squads</h2>
          </div>
          <SquadList />
        </div>

        {/* Right column - Task Board / DAG / Logs */}
        <div className="lg:col-span-2 space-y-4">
          {/* View mode tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'board'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Board
            </button>
            <button
              onClick={() => setViewMode('dag')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'dag'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              DAG
            </button>
            <button
              onClick={() => setViewMode('logs')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'logs'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              Logs
            </button>
          </div>

          {/* View content */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {viewMode === 'board' && (
              <TaskBoard
                squadId={selectedSquadId || undefined}
                onSelectTask={(task) => setSelectedTask(task)}
                selectedTaskId={selectedTask?.id}
              />
            )}

            {viewMode === 'dag' && (
              <DAGView
                squadId={selectedSquadId || undefined}
                onSelectTask={(task) => setSelectedTask(task)}
                selectedTaskId={selectedTask?.id}
              />
            )}

            {viewMode === 'logs' && <LogFeed />}
          </div>
        </div>
      </div>

      {/* Selected Task Panel */}
      {selectedTask && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
          <div className="container mx-auto flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{selectedTask.subject}</h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <TerminalPrompt task={selectedTask} format="full" showHeader={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
