// Zustand Store for Task Dashboard
// Manages all client-side state for the dashboard

import { create } from 'zustand';
import type {
  Task,
  SquadExecution,
  TaskLog,
  TaskStatus,
  AgentType,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '@/lib/types';

// API helper
const api = {
  async getTasks(params?: { status?: string; agent?: string; squadId?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.agent) query.set('agent', params.agent);
    if (params?.squadId) query.set('squadId', params.squadId);

    const res = await fetch(`/api/tasks?${query}`);
    return res.json();
  },

  async createTask(data: CreateTaskRequest) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateTask(id: string, data: UpdateTaskRequest & { action?: string; log?: any }) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteTask(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getSquads() {
    const res = await fetch('/api/squads');
    return res.json();
  },

  async createSquad(data: any) {
    const res = await fetch('/api/squads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async startSquad(squadId: string) {
    const res = await fetch('/api/squads/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ squadId }),
    });
    return res.json();
  },

  async deleteSquad(id: string) {
    const res = await fetch(`/api/squads/${id}`, { method: 'DELETE' });
    return res.json();
  },
};

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}

function toOptionalDate(value: unknown): Date | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return toDate(value);
}

function normalizeTask(task: Task): Task {
  return {
    ...task,
    createdAt: toDate(task.createdAt),
    updatedAt: toDate(task.updatedAt),
    startedAt: toOptionalDate(task.startedAt),
    completedAt: toOptionalDate(task.completedAt),
  };
}

function normalizeSquad(squad: SquadExecution): SquadExecution {
  return {
    ...squad,
    createdAt: toDate(squad.createdAt),
    updatedAt: toDate(squad.updatedAt),
    startedAt: toOptionalDate(squad.startedAt),
    completedAt: toOptionalDate(squad.completedAt),
  };
}

function normalizeTaskLog(log: TaskLog): TaskLog {
  return {
    ...log,
    timestamp: toDate(log.timestamp),
  };
}

// Store interface
interface TaskStore {
  // State
  tasks: Task[];
  squads: SquadExecution[];
  logs: TaskLog[];
  selectedTaskId: string | null;
  selectedSquadId: string | null;
  isLoading: boolean;
  error: string | null;
  sseConnected: boolean;

  // Actions - Tasks
  fetchTasks: () => Promise<void>;
  createTask: (task: CreateTaskRequest) => Promise<Task | null>;
  updateTask: (id: string, updates: UpdateTaskRequest) => Promise<Task | null>;
  startTask: (id: string) => Promise<Task | null>;
  completeTask: (id: string, output?: string) => Promise<Task | null>;
  failTask: (id: string, error: string) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<void>;

  // Actions - Squads
  fetchSquads: () => Promise<void>;
  createSquad: (data: any) => Promise<SquadExecution | null>;
  startSquad: (squadId: string) => Promise<void>;
  deleteSquad: (id: string) => Promise<void>;

  // Actions - Selection
  selectTask: (id: string | null) => void;
  selectSquad: (id: string | null) => void;

  // Actions - Real-time updates
  setTaskFromEvent: (task: Task) => void;
  setSquadFromEvent: (squad: SquadExecution) => void;
  addLog: (log: TaskLog) => void;
  setSseConnected: (connected: boolean) => void;

  // Computed getters
  getTaskById: (id: string) => Task | undefined;
  getSquadById: (id: string) => SquadExecution | undefined;
  getTasksByLevel: () => Map<number, Task[]>;
  getReadyTasks: () => Task[];
  getBlockedTasks: () => Task[];
  getRunningTasks: () => Task[];
  getCompletedTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: [],
  squads: [],
  logs: [],
  selectedTaskId: null,
  selectedSquadId: null,
  isLoading: false,
  error: null,
  sseConnected: false,

  // Fetch all tasks
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await api.getTasks();
      if (result.success) {
        set({ tasks: result.data.map(normalizeTask), isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch tasks. Check API/backend availability.', isLoading: false });
    }
  },

  // Create task
  createTask: async (taskData) => {
    try {
      const result = await api.createTask(taskData);
      if (result.success) {
        const createdTask = normalizeTask(result.data);
        set((state) => ({ tasks: [...state.tasks, createdTask] }));
        return createdTask;
      }
      set({ error: result.error });
      return null;
    } catch (error) {
      set({ error: 'Failed to create task' });
      return null;
    }
  },

  // Update task
  updateTask: async (id, updates) => {
    try {
      const result = await api.updateTask(id, updates);
      if (result.success) {
        const updatedTask = normalizeTask(result.data);
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        }));
        return updatedTask;
      }
      set({ error: result.error });
      return null;
    } catch (error) {
      set({ error: 'Failed to update task' });
      return null;
    }
  },

  // Start task
  startTask: async (id) => {
    return get().updateTask(id, { action: 'start' } as any);
  },

  // Complete task
  completeTask: async (id, output) => {
    return get().updateTask(id, { action: 'complete', output } as any);
  },

  // Fail task
  failTask: async (id, error) => {
    return get().updateTask(id, { action: 'fail', error } as any);
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      const result = await api.deleteTask(id);
      if (result.success) {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete task' });
    }
  },

  // Fetch all squads
  fetchSquads: async () => {
    try {
      const result = await api.getSquads();
      if (result.success) {
        set({ squads: result.data.map(normalizeSquad) });
      }
    } catch (error) {
      set({ error: 'Failed to fetch squads. Check API/backend availability.' });
    }
  },

  // Create squad
  createSquad: async (data) => {
    try {
      const result = await api.createSquad(data);
      if (result.success) {
        const createdSquad = normalizeSquad(result.data);
        set((state) => ({ squads: [...state.squads, createdSquad] }));
        return createdSquad;
      }
      set({ error: result.error });
      return null;
    } catch (error) {
      set({ error: 'Failed to create squad' });
      return null;
    }
  },

  // Start squad
  startSquad: async (squadId) => {
    try {
      const result = await api.startSquad(squadId);
      if (result.success) {
        // Refresh tasks to get updated status
        await get().fetchTasks();
        await get().fetchSquads();
      }
    } catch (error) {
      set({ error: 'Failed to start squad' });
    }
  },

  // Delete squad
  deleteSquad: async (id) => {
    try {
      const result = await api.deleteSquad(id);
      if (result.success) {
        set((state) => ({
          squads: state.squads.filter((s) => s.id !== id),
          selectedSquadId: state.selectedSquadId === id ? null : state.selectedSquadId,
          // Also remove tasks from this squad
          tasks: state.tasks.filter((t) => !state.squads.find((s) => s.id === id)?.tasks.includes(t.id)),
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete squad' });
    }
  },

  // Selection
  selectTask: (id) => set({ selectedTaskId: id }),
  selectSquad: (id) => set({ selectedSquadId: id }),

  // Real-time updates
  setTaskFromEvent: (task) => {
    const normalizedTask = normalizeTask(task);
    set((state) => {
      const exists = state.tasks.find((t) => t.id === normalizedTask.id);
      if (exists) {
        return {
          tasks: state.tasks.map((t) => (t.id === normalizedTask.id ? normalizedTask : t)),
        };
      }
      return { tasks: [...state.tasks, normalizedTask] };
    });
  },

  setSquadFromEvent: (squad) => {
    const normalizedSquad = normalizeSquad(squad);
    set((state) => {
      const exists = state.squads.find((s) => s.id === normalizedSquad.id);
      if (exists) {
        return {
          squads: state.squads.map((s) => (s.id === normalizedSquad.id ? normalizedSquad : s)),
        };
      }
      return { squads: [...state.squads, normalizedSquad] };
    });
  },

  addLog: (log) => {
    const normalizedLog = normalizeTaskLog(log);
    set((state) => ({
      logs: [...state.logs.slice(-99), normalizedLog], // Keep last 100 logs
    }));
  },

  setSseConnected: (connected) => set({ sseConnected: connected }),

  // Computed getters
  getTaskById: (id) => get().tasks.find((t) => t.id === id),

  getSquadById: (id) => get().squads.find((s) => s.id === id),

  getTasksByLevel: () => {
    const tasks = get().tasks;
    const levels = new Map<number, Task[]>();

    for (const task of tasks) {
      const level = task.level;
      if (!levels.has(level)) {
        levels.set(level, []);
      }
      levels.get(level)!.push(task);
    }

    // Sort tasks within each level
    for (const [level, levelTasks] of levels) {
      levels.set(
        level,
        levelTasks.sort((a: Task, b: Task) => a.createdAt.getTime() - b.createdAt.getTime())
      );
    }

    return levels;
  },

  getReadyTasks: () => {
    return get().tasks.filter((t) => t.status === 'pending');
  },

  getBlockedTasks: () => {
    return get().tasks.filter((t) => t.status === 'blocked');
  },

  getRunningTasks: () => {
    return get().tasks.filter((t) => t.status === 'running');
  },

  getCompletedTasks: () => {
    return get().tasks.filter((t) => t.status === 'completed');
  },
}));

export { api };
