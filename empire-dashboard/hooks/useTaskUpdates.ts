// Hook for SSE (Server-Sent Events) Real-time Updates
// Connects to /api/tasks/events and updates the store

import { useEffect, useRef, useCallback } from 'react';
import { useTaskStore } from '@/stores/tasks';
import type { TaskEvent, Task, SquadExecution, TaskLog } from '@/lib/types';

export function useTaskUpdates() {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setTaskFromEvent = useTaskStore((state) => state.setTaskFromEvent);
  const setSquadFromEvent = useTaskStore((state) => state.setSquadFromEvent);
  const addLog = useTaskStore((state) => state.addLog);
  const setSseConnected = useTaskStore((state) => state.setSseConnected);

  const connect = useCallback(() => {
    // Don't reconnect if already connected
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    const eventSource = new EventSource('/api/tasks/events/');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('[SSE] Connected to task updates');
      setSseConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const taskEvent: TaskEvent = JSON.parse(event.data);

        switch (taskEvent.type) {
          case 'task:created':
          case 'task:updated':
          case 'task:started':
          case 'task:completed':
          case 'task:failed':
            setTaskFromEvent(taskEvent.payload as Task);
            break;

          case 'task:log':
            addLog(taskEvent.payload as TaskLog);
            break;

          case 'squad:created':
          case 'squad:started':
          case 'squad:updated':
          case 'squad:completed':
            setSquadFromEvent(taskEvent.payload as SquadExecution);
            break;
        }
      } catch (error) {
        console.error('[SSE] Error parsing event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('[SSE] Connection error:', error);
      setSseConnected(false);
      eventSource.close();

      // Attempt to reconnect after 3 seconds
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('[SSE] Attempting to reconnect...');
        connect();
      }, 3000);
    };
  }, [setTaskFromEvent, setSquadFromEvent, addLog, setSseConnected]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setSseConnected(false);
  }, [setSseConnected]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connect,
    disconnect,
    isConnected: useTaskStore((state) => state.sseConnected),
  };
}

// Hook for task actions with optimistic updates
export function useTaskActions() {
  const store = useTaskStore();

  const startTaskWithOptimisticUpdate = async (taskId: string) => {
    // Optimistically update UI
    const task = store.getTaskById(taskId);
    if (task) {
      store.setTaskFromEvent({
        ...task,
        status: 'running',
        startedAt: new Date(),
      });
    }

    // Make API call
    return store.startTask(taskId);
  };

  const completeTaskWithOptimisticUpdate = async (taskId: string, output?: string) => {
    const task = store.getTaskById(taskId);
    if (task) {
      store.setTaskFromEvent({
        ...task,
        status: 'completed',
        progress: 100,
        completedAt: new Date(),
        output,
      });
    }

    return store.completeTask(taskId, output);
  };

  const failTaskWithOptimisticUpdate = async (taskId: string, error: string) => {
    const task = store.getTaskById(taskId);
    if (task) {
      store.setTaskFromEvent({
        ...task,
        status: 'failed',
        error,
      });
    }

    return store.failTask(taskId, error);
  };

  return {
    ...store,
    startTaskOptimistic: startTaskWithOptimisticUpdate,
    completeTaskOptimistic: completeTaskWithOptimisticUpdate,
    failTaskOptimistic: failTaskWithOptimisticUpdate,
  };
}
