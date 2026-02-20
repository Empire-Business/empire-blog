// Log Feed Component
// Real-time feed of task logs

'use client';

import { useRef, useEffect } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useTaskStore } from '@/stores/tasks';
import type { TaskLog, LogLevel } from '@/lib/types';

const logIcons: Record<LogLevel, React.ReactNode> = {
  info: <Info className="w-4 h-4 text-blue-500" />,
  success: <CheckCircle className="w-4 h-4 text-green-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
  error: <XCircle className="w-4 h-4 text-red-500" />,
};

const logColors: Record<LogLevel, string> = {
  info: 'bg-blue-50 border-blue-200',
  success: 'bg-green-50 border-green-200',
  warning: 'bg-yellow-50 border-yellow-200',
  error: 'bg-red-50 border-red-200',
};

interface LogFeedProps {
  maxLogs?: number;
  showTaskName?: boolean;
}

export function LogFeed({ maxLogs = 50, showTaskName = true }: LogFeedProps) {
  const logs = useTaskStore((state) => state.logs);
  const tasks = useTaskStore((state) => state.tasks);
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [logs]);

  const displayedLogs = logs.slice(-maxLogs);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTaskSubject = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    return task?.subject || 'Unknown Task';
  };

  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        <p className="text-sm">No logs yet. Activity will appear here.</p>
      </div>
    );
  }

  return (
    <div
      ref={feedRef}
      className="h-64 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded-lg"
    >
      {displayedLogs.map((log) => (
        <div
          key={log.id}
          className={`flex items-start gap-2 p-2 rounded border ${logColors[log.level]}`}
        >
          <div className="flex-shrink-0 mt-0.5">{logIcons[log.level]}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-0.5">
              <span className="font-mono">{formatTime(log.timestamp)}</span>
              {showTaskName && (
                <span className="truncate font-medium">
                  [{getTaskSubject(log.taskId)}]
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700">{log.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
