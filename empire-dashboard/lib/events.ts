// Event Emitter for SSE and Real-time Updates
// This module provides a centralized event system for the dashboard

import { EventEmitter } from 'events';
import type { TaskEvent, TaskEventType, Task, SquadExecution, TaskLog } from './types';

// Global event emitter instance
class TaskEventEmitter extends EventEmitter {
  private static instance: TaskEventEmitter;

  private constructor() {
    super();
    // Increase max listeners for many concurrent connections
    this.setMaxListeners(100);
  }

  static getInstance(): TaskEventEmitter {
    if (!TaskEventEmitter.instance) {
      TaskEventEmitter.instance = new TaskEventEmitter();
    }
    return TaskEventEmitter.instance;
  }

  // Emit a task event
  emitTaskEvent(type: TaskEventType, payload: Task | SquadExecution | TaskLog): void {
    const event: TaskEvent = {
      type,
      timestamp: new Date(),
      payload,
    };
    this.emit('task-event', event);
    this.emit(type, event); // Also emit specific event type
  }

  // Subscribe to all task events
  onTaskEvent(callback: (event: TaskEvent) => void): () => void {
    this.on('task-event', callback);
    return () => this.off('task-event', callback);
  }

  // Subscribe to specific event type
  onEventType(type: TaskEventType, callback: (event: TaskEvent) => void): () => void {
    this.on(type, callback);
    return () => this.off(type, callback);
  }

  // Format event for SSE
  formatSSE(event: TaskEvent): string {
    return `data: ${JSON.stringify(event)}\n\n`;
  }
}

// Export singleton instance
export const taskEvents = TaskEventEmitter.getInstance();

// Helper functions for common events
export function emitTaskCreated(task: Task): void {
  taskEvents.emitTaskEvent('task:created', task);
}

export function emitTaskUpdated(task: Task): void {
  taskEvents.emitTaskEvent('task:updated', task);
}

export function emitTaskStarted(task: Task): void {
  taskEvents.emitTaskEvent('task:started', task);
}

export function emitTaskCompleted(task: Task): void {
  taskEvents.emitTaskEvent('task:completed', task);
}

export function emitTaskFailed(task: Task): void {
  taskEvents.emitTaskEvent('task:failed', task);
}

export function emitTaskLog(log: TaskLog): void {
  taskEvents.emitTaskEvent('task:log', log);
}

export function emitSquadCreated(squad: SquadExecution): void {
  taskEvents.emitTaskEvent('squad:created', squad);
}

export function emitSquadStarted(squad: SquadExecution): void {
  taskEvents.emitTaskEvent('squad:started', squad);
}

export function emitSquadUpdated(squad: SquadExecution): void {
  taskEvents.emitTaskEvent('squad:updated', squad);
}

export function emitSquadCompleted(squad: SquadExecution): void {
  taskEvents.emitTaskEvent('squad:completed', squad);
}

// SSE stream creator for Next.js API routes
export function createSSEStream(controller: ReadableStreamDefaultController): void {
  const encoder = new TextEncoder();

  const sendEvent = (event: TaskEvent) => {
    const data = taskEvents.formatSSE(event);
    controller.enqueue(encoder.encode(data));
  };

  // Send initial connection message
  controller.enqueue(encoder.encode(': connected\n\n'));

  // Subscribe to all task events
  const unsubscribe = taskEvents.onTaskEvent(sendEvent);

  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    try {
      controller.enqueue(encoder.encode(': heartbeat\n\n'));
    } catch {
      clearInterval(heartbeat);
      unsubscribe();
    }
  }, 30000);

  // Cleanup on close
  const cleanup = () => {
    clearInterval(heartbeat);
    unsubscribe();
  };

  // Return cleanup function
  (controller as ReadableStreamDefaultController & { cleanup?: () => void }).cleanup = cleanup;
}

export { TaskEventEmitter };
