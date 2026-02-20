// Progress Bar Component
// Shows task progress with color coding

'use client';

interface ProgressBarProps {
  progress: number;
  status: 'pending' | 'ready' | 'running' | 'blocked' | 'completed' | 'failed';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const statusColors = {
  pending: 'bg-gray-400',
  ready: 'bg-blue-500',
  running: 'bg-yellow-500 animate-pulse',
  blocked: 'bg-red-400',
  completed: 'bg-green-500',
  failed: 'bg-red-600',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  progress,
  status,
  size = 'md',
  showLabel = true,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`flex-1 bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} ${statusColors[status]} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-600 min-w-[3rem] text-right">
          {clampedProgress}%
        </span>
      )}
    </div>
  );
}
