// SQLite Database for Task-Oriented System
// Uses better-sqlite3 for synchronous, high-performance SQLite operations

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';
import type { Task, TaskLog, SquadExecution, TaskStatus, SquadStatus, AgentType, SquadType, LogLevel } from './types';

function isWritableDirectory(dir: string): boolean {
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function resolveDbDirectory(): string {
  const requestedDir = process.env.DASHBOARD_DATA_DIR?.trim();
  const candidateDirs = [
    requestedDir,
    path.join(process.cwd(), 'data'),
    path.join(os.tmpdir(), 'empire-vibe-coding', 'dashboard-data'),
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidateDirs) {
    if (isWritableDirectory(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `No writable directory available for dashboard SQLite database. Tried: ${candidateDirs.join(', ')}`
  );
}

// Database path
const DB_DIR = resolveDbDirectory();
const DB_PATH = path.join(DB_DIR, 'tasks.db');

// Initialize database
const db = new Database(DB_PATH);

type SqliteErrorLike = {
  code?: string;
  message?: string;
};

function isSqliteBusyError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const maybeError = error as SqliteErrorLike;
  const code = maybeError.code || '';
  const message = maybeError.message || '';
  return code === 'SQLITE_BUSY' || /database is locked/i.test(message);
}

function tryPragma(pragma: string): void {
  try {
    db.pragma(pragma);
  } catch (error) {
    if (isSqliteBusyError(error)) {
      console.warn(`[db] Skipping pragma "${pragma}" due to SQLITE_BUSY`);
      return;
    }
    throw error;
  }
}

function withBusyRetry(run: () => void, label: string): void {
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      run();
      return;
    } catch (error) {
      if (!isSqliteBusyError(error) || attempt === maxAttempts) {
        throw error;
      }
      console.warn(`[db] ${label} busy (attempt ${attempt}/${maxAttempts}), retrying...`);
    }
  }
}

// Busy timeout helps concurrent route module initialization during build/runtime.
tryPragma('busy_timeout = 5000');

// Enable WAL mode for better concurrency. If locked, keep default mode to avoid build failure.
tryPragma('journal_mode = WAL');

// Initialize schema
function initializeSchema(): void {
  // Tasks table
  withBusyRetry(() => db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      activeForm TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      agent TEXT NOT NULL,
      blockedBy TEXT NOT NULL DEFAULT '[]',
      blocks TEXT NOT NULL DEFAULT '[]',
      level INTEGER NOT NULL DEFAULT 0,
      terminalPrompt TEXT,
      protocol TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      startedAt TEXT,
      completedAt TEXT,
      progress INTEGER NOT NULL DEFAULT 0,
      output TEXT,
      error TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_agent ON tasks(agent);
    CREATE INDEX IF NOT EXISTS idx_tasks_level ON tasks(level);

    -- Task logs table
    CREATE TABLE IF NOT EXISTS task_logs (
      id TEXT PRIMARY KEY,
      taskId TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_task_logs_taskId ON task_logs(taskId);

    -- Squads table
    CREATE TABLE IF NOT EXISTS squads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      tasks TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'idle',
      currentLevel INTEGER NOT NULL DEFAULT 0,
      totalLevels INTEGER NOT NULL DEFAULT 0,
      progress INTEGER NOT NULL DEFAULT 0,
      startedAt TEXT,
      completedAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_squads_status ON squads(status);
    CREATE INDEX IF NOT EXISTS idx_squads_type ON squads(type);
  `), 'Schema initialization');
}

// Run schema initialization
initializeSchema();

// Helper to generate UUID
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

// Helper to parse JSON fields
function parseJsonField<T>(field: string | null, defaultValue: T): T {
  if (!field) return defaultValue;
  try {
    return JSON.parse(field) as T;
  } catch {
    return defaultValue;
  }
}

// Task CRUD operations
export const taskDb = {
  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const id = generateId();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO tasks (
        id, subject, description, activeForm, status, agent,
        blockedBy, blocks, level, terminalPrompt, protocol,
        createdAt, updatedAt, startedAt, completedAt, progress, output, error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      task.subject,
      task.description,
      task.activeForm,
      task.status,
      task.agent,
      JSON.stringify(task.blockedBy),
      JSON.stringify(task.blocks),
      task.level,
      task.terminalPrompt || null,
      task.protocol || null,
      now,
      now,
      task.startedAt?.toISOString() || null,
      task.completedAt?.toISOString() || null,
      task.progress,
      task.output || null,
      task.error || null
    );

    return this.getById(id)!;
  },

  getById(id: string): Task | null {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    const row = stmt.get(id) as Record<string, unknown> | undefined;

    if (!row) return null;

    return {
      id: row.id as string,
      subject: row.subject as string,
      description: row.description as string,
      activeForm: row.activeForm as string,
      status: row.status as TaskStatus,
      agent: row.agent as AgentType,
      blockedBy: parseJsonField(row.blockedBy as string, []),
      blocks: parseJsonField(row.blocks as string, []),
      level: row.level as number,
      terminalPrompt: row.terminalPrompt as string || '',
      protocol: row.protocol as string || undefined,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
      startedAt: row.startedAt ? new Date(row.startedAt as string) : undefined,
      completedAt: row.completedAt ? new Date(row.completedAt as string) : undefined,
      progress: row.progress as number,
      output: row.output as string || undefined,
      error: row.error as string || undefined,
    };
  },

  getAll(): Task[] {
    const stmt = db.prepare('SELECT * FROM tasks ORDER BY level, createdAt');
    const rows = stmt.all() as Record<string, unknown>[];

    return rows.map(row => ({
      id: row.id as string,
      subject: row.subject as string,
      description: row.description as string,
      activeForm: row.activeForm as string,
      status: row.status as TaskStatus,
      agent: row.agent as AgentType,
      blockedBy: parseJsonField(row.blockedBy as string, []),
      blocks: parseJsonField(row.blocks as string, []),
      level: row.level as number,
      terminalPrompt: row.terminalPrompt as string || '',
      protocol: row.protocol as string || undefined,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
      startedAt: row.startedAt ? new Date(row.startedAt as string) : undefined,
      completedAt: row.completedAt ? new Date(row.completedAt as string) : undefined,
      progress: row.progress as number,
      output: row.output as string || undefined,
      error: row.error as string || undefined,
    }));
  },

  getByStatus(status: TaskStatus): Task[] {
    const stmt = db.prepare('SELECT * FROM tasks WHERE status = ? ORDER BY level, createdAt');
    const rows = stmt.all(status) as Record<string, unknown>[];

    return rows.map(row => this.getById(row.id as string)!);
  },

  getBySquad(squadId: string): Task[] {
    const squad = squadDb.getById(squadId);
    if (!squad) return [];

    return squad.tasks
      .map(taskId => this.getById(taskId))
      .filter((t): t is Task => t !== null);
  },

  update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const fields: string[] = ['updatedAt = ?'];
    const values: unknown[] = [now];

    if (updates.subject !== undefined) {
      fields.push('subject = ?');
      values.push(updates.subject);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.activeForm !== undefined) {
      fields.push('activeForm = ?');
      values.push(updates.activeForm);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.agent !== undefined) {
      fields.push('agent = ?');
      values.push(updates.agent);
    }
    if (updates.blockedBy !== undefined) {
      fields.push('blockedBy = ?');
      values.push(JSON.stringify(updates.blockedBy));
    }
    if (updates.blocks !== undefined) {
      fields.push('blocks = ?');
      values.push(JSON.stringify(updates.blocks));
    }
    if (updates.level !== undefined) {
      fields.push('level = ?');
      values.push(updates.level);
    }
    if (updates.terminalPrompt !== undefined) {
      fields.push('terminalPrompt = ?');
      values.push(updates.terminalPrompt);
    }
    if (updates.protocol !== undefined) {
      fields.push('protocol = ?');
      values.push(updates.protocol);
    }
    if (updates.startedAt !== undefined) {
      fields.push('startedAt = ?');
      values.push(updates.startedAt.toISOString());
    }
    if (updates.completedAt !== undefined) {
      fields.push('completedAt = ?');
      values.push(updates.completedAt.toISOString());
    }
    if (updates.progress !== undefined) {
      fields.push('progress = ?');
      values.push(updates.progress);
    }
    if (updates.output !== undefined) {
      fields.push('output = ?');
      values.push(updates.output);
    }
    if (updates.error !== undefined) {
      fields.push('error = ?');
      values.push(updates.error);
    }

    values.push(id);

    const stmt = db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getById(id);
  },

  delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  deleteAll(): void {
    db.exec('DELETE FROM tasks');
  },
};

// Task Log operations
export const logDb = {
  create(taskId: string, level: LogLevel, message: string): TaskLog {
    const id = generateId();
    const timestamp = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO task_logs (id, taskId, timestamp, level, message)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, taskId, timestamp, level, message);

    return {
      id,
      taskId,
      timestamp: new Date(timestamp),
      level,
      message,
    };
  },

  getByTask(taskId: string): TaskLog[] {
    const stmt = db.prepare('SELECT * FROM task_logs WHERE taskId = ? ORDER BY timestamp');
    const rows = stmt.all(taskId) as Record<string, unknown>[];

    return rows.map(row => ({
      id: row.id as string,
      taskId: row.taskId as string,
      timestamp: new Date(row.timestamp as string),
      level: row.level as LogLevel,
      message: row.message as string,
    }));
  },

  getRecent(limit: number = 50): TaskLog[] {
    const stmt = db.prepare('SELECT * FROM task_logs ORDER BY timestamp DESC LIMIT ?');
    const rows = stmt.all(limit) as Record<string, unknown>[];

    return rows.map(row => ({
      id: row.id as string,
      taskId: row.taskId as string,
      timestamp: new Date(row.timestamp as string),
      level: row.level as LogLevel,
      message: row.message as string,
    })).reverse();
  },

  deleteByTask(taskId: string): void {
    const stmt = db.prepare('DELETE FROM task_logs WHERE taskId = ?');
    stmt.run(taskId);
  },
};

// Squad operations
export const squadDb = {
  create(squad: Omit<SquadExecution, 'id' | 'createdAt' | 'updatedAt'>): SquadExecution {
    const id = generateId();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO squads (
        id, name, description, type, tasks, status,
        currentLevel, totalLevels, progress,
        startedAt, completedAt, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      squad.name,
      squad.description || null,
      squad.type,
      JSON.stringify(squad.tasks),
      squad.status,
      squad.currentLevel,
      squad.totalLevels,
      squad.progress,
      squad.startedAt?.toISOString() || null,
      squad.completedAt?.toISOString() || null,
      now,
      now
    );

    return this.getById(id)!;
  },

  getById(id: string): SquadExecution | null {
    const stmt = db.prepare('SELECT * FROM squads WHERE id = ?');
    const row = stmt.get(id) as Record<string, unknown> | undefined;

    if (!row) return null;

    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string || undefined,
      type: row.type as SquadType,
      tasks: parseJsonField(row.tasks as string, []),
      status: row.status as SquadStatus,
      currentLevel: row.currentLevel as number,
      totalLevels: row.totalLevels as number,
      progress: row.progress as number,
      startedAt: row.startedAt ? new Date(row.startedAt as string) : undefined,
      completedAt: row.completedAt ? new Date(row.completedAt as string) : undefined,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
    };
  },

  getAll(): SquadExecution[] {
    const stmt = db.prepare('SELECT * FROM squads ORDER BY createdAt DESC');
    const rows = stmt.all() as Record<string, unknown>[];

    return rows.map(row => this.getById(row.id as string)!);
  },

  update(id: string, updates: Partial<Omit<SquadExecution, 'id' | 'createdAt'>>): SquadExecution | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const fields: string[] = ['updatedAt = ?'];
    const values: unknown[] = [now];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.type !== undefined) {
      fields.push('type = ?');
      values.push(updates.type);
    }
    if (updates.tasks !== undefined) {
      fields.push('tasks = ?');
      values.push(JSON.stringify(updates.tasks));
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.currentLevel !== undefined) {
      fields.push('currentLevel = ?');
      values.push(updates.currentLevel);
    }
    if (updates.totalLevels !== undefined) {
      fields.push('totalLevels = ?');
      values.push(updates.totalLevels);
    }
    if (updates.progress !== undefined) {
      fields.push('progress = ?');
      values.push(updates.progress);
    }
    if (updates.startedAt !== undefined) {
      fields.push('startedAt = ?');
      values.push(updates.startedAt.toISOString());
    }
    if (updates.completedAt !== undefined) {
      fields.push('completedAt = ?');
      values.push(updates.completedAt.toISOString());
    }

    values.push(id);

    const stmt = db.prepare(`UPDATE squads SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getById(id);
  },

  delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM squads WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },
};

// Export database for cleanup
export function closeDatabase(): void {
  db.close();
}

export { db };
