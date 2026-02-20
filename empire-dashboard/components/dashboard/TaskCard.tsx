// Task Card Component
// Displays individual task with status, progress, and terminal prompt

'use client';

import { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Pause,
  Copy,
  Check,
  Play,
  ExternalLink,
} from 'lucide-react';
import type { Task, TaskStatus, AgentType } from '@/lib/types';
import { ProgressBar } from './ProgressBar';

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  pending: <Clock className="w-4 h-4 text-gray-500" />,
  ready: <Play className="w-4 h-4 text-blue-500" />,
  running: <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />,
  blocked: <Pause className="w-4 h-4 text-red-400" />,
  completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  failed: <XCircle className="w-4 h-4 text-red-600" />,
};

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  ready: 'Ready',
  running: 'Running',
  blocked: 'Blocked',
  completed: 'Completed',
  failed: 'Failed',
};

const agentColors: Record<AgentType, string> = {
  PM: 'bg-purple-100 text-purple-800 border-purple-200',
  ARCHITECT: 'bg-blue-100 text-blue-800 border-blue-200',
  DEVELOPER: 'bg-green-100 text-green-800 border-green-200',
  REVIEWER: 'bg-orange-100 text-orange-800 border-orange-200',
  QA: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  SECURITY: 'bg-red-100 text-red-800 border-red-200',
  DESIGNER: 'bg-pink-100 text-pink-800 border-pink-200',
  DATA: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

interface TaskCardProps {
  task: Task;
  onStart?: () => void;
  onComplete?: () => void;
  onFail?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
  showPrompt?: boolean;
}

export function TaskCard({
  task,
  onStart,
  onComplete,
  onFail,
  onSelect,
  isSelected = false,
  showPrompt = true,
}: TaskCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopyPrompt = async () => {
    if (task.terminalPrompt) {
      await navigator.clipboard.writeText(task.terminalPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canStart = task.status === 'pending' || task.status === 'ready';
  const canComplete = task.status === 'running';
  const canFail = task.status === 'running';

  return (
    <div
      className={`bg-white rounded-lg border transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {statusIcons[task.status]}
              <span className="text-sm font-medium text-gray-900 truncate">
                {task.subject}
              </span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded border ${
                agentColors[task.agent]
              }`}
            >
              {task.agent}
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded ${
                task.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : task.status === 'failed'
                  ? 'bg-red-100 text-red-700'
                  : task.status === 'running'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {statusLabels[task.status]}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-2 bg-gray-50">
        <ProgressBar progress={task.progress} status={task.status} size="sm" />
      </div>

      {/* Actions */}
      <div className="px-4 py-2 flex items-center gap-2 border-t border-gray-100">
        {canStart && onStart && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
          >
            Start
          </button>
        )}
        {canComplete && onComplete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
            className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
          >
            Complete
          </button>
        )}
        {canFail && onFail && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFail();
            }}
            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
          >
            Fail
          </button>
        )}

        {task.protocol && (
          <a
            href={`/docs/PROTOCOLOS/${task.protocol}`}
            className="ml-auto text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-3 h-3" />
            Protocol
          </a>
        )}
      </div>

      {/* Terminal Prompt (expandable) */}
      {showPrompt && task.terminalPrompt && (
        <div className="border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-500 hover:bg-gray-50"
          >
            <span>Terminal Prompt</span>
            <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
          </button>

          {isExpanded && (
            <div className="px-4 pb-4">
              <div className="relative">
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                  {task.terminalPrompt}
                </pre>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyPrompt();
                  }}
                  className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {task.error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{task.error}</p>
          </div>
        </div>
      )}

      {/* Blocked info */}
      {task.status === 'blocked' && task.blockedBy.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Waiting for: {task.blockedBy.length} task(s)
          </p>
        </div>
      )}
    </div>
  );
}
