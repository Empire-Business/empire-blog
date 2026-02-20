// Task Orchestrator with DAG Engine
// Manages task dependencies and parallel execution

import type { Task, SquadExecution, TaskStatus, AgentType } from './types';
import { taskDb, squadDb, logDb } from './db';
import {
  emitTaskUpdated,
  emitTaskStarted,
  emitTaskCompleted,
  emitTaskFailed,
  emitTaskLog,
  emitSquadStarted,
  emitSquadUpdated,
  emitSquadCompleted,
} from './events';
import { generateTerminalPrompt } from './prompts';

// DAG Level Calculator
export function calculateTaskLevel(task: Task, allTasks: Task[], memo: Map<string, number> = new Map()): number {
  // Check memo first
  if (memo.has(task.id)) {
    return memo.get(task.id)!;
  }

  // No dependencies = level 0
  if (task.blockedBy.length === 0) {
    memo.set(task.id, 0);
    return 0;
  }

  // Calculate max level of dependencies
  let maxDepLevel = 0;
  for (const depId of task.blockedBy) {
    const depTask = allTasks.find(t => t.id === depId);
    if (depTask) {
      const depLevel = calculateTaskLevel(depTask, allTasks, memo);
      maxDepLevel = Math.max(maxDepLevel, depLevel);
    }
  }

  const level = maxDepLevel + 1;
  memo.set(task.id, level);
  return level;
}

// Group tasks by their dependency level
export function groupTasksByLevel(tasks: Task[]): Task[][] {
  if (tasks.length === 0) return [];

  // Calculate levels for all tasks
  const memo = new Map<string, number>();
  const taskLevels = new Map<string, number>();

  for (const task of tasks) {
    const level = calculateTaskLevel(task, tasks, memo);
    taskLevels.set(task.id, level);
  }

  // Find max level
  const maxLevel = Math.max(...taskLevels.values());

  // Group by level
  const levels: Task[][] = Array.from({ length: maxLevel + 1 }, () => []);

  for (const task of tasks) {
    const level = taskLevels.get(task.id)!;
    levels[level].push(task);
  }

  return levels;
}

// Find tasks ready to execute (all dependencies completed)
export function findReadyTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => {
    if (task.status !== 'pending') return false;

    // Check all dependencies are completed
    return task.blockedBy.every(depId => {
      const depTask = tasks.find(t => t.id === depId);
      return depTask?.status === 'completed';
    });
  });
}

// Check if a task is blocked
export function isTaskBlocked(task: Task, allTasks: Task[]): boolean {
  if (task.blockedBy.length === 0) return false;

  return task.blockedBy.some(depId => {
    const depTask = allTasks.find(t => t.id === depId);
    return !depTask || depTask.status !== 'completed';
  });
}

// Task Orchestrator class
export class TaskOrchestrator {
  private tasks: Map<string, Task> = new Map();
  private runningTasks: Set<string> = new Set();
  private isExecuting: boolean = false;

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const allTasks = taskDb.getAll();
    for (const task of allTasks) {
      this.tasks.set(task.id, task);
    }
  }

  // Create a new task
  createTask(params: {
    subject: string;
    description: string;
    activeForm: string;
    agent: AgentType;
    blockedBy?: string[];
    protocol?: string;
    terminalPrompt?: string;
  }): Task {
    // Generate terminal prompt if not provided
    const terminalPrompt = params.terminalPrompt || generateTerminalPrompt({
      agent: params.agent,
      subject: params.subject,
      description: params.description,
      protocol: params.protocol,
    });

    // Calculate level based on dependencies
    const allTasks = Array.from(this.tasks.values());
    const tempTask: Task = {
      id: 'temp',
      subject: params.subject,
      description: params.description,
      activeForm: params.activeForm,
      status: 'pending',
      agent: params.agent,
      blockedBy: params.blockedBy || [],
      blocks: [],
      level: 0,
      terminalPrompt,
      protocol: params.protocol,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
    };

    const level = calculateTaskLevel(tempTask, allTasks);

    // Determine initial status
    const status: TaskStatus = params.blockedBy && params.blockedBy.length > 0 ? 'blocked' : 'pending';

    // Create task in database
    const task = taskDb.create({
      ...tempTask,
      level,
      status,
    });

    // Update blocks arrays for dependencies
    if (params.blockedBy) {
      for (const depId of params.blockedBy) {
        const depTask = this.tasks.get(depId);
        if (depTask) {
          const newBlocks = [...depTask.blocks, task.id];
          taskDb.update(depId, { blocks: newBlocks });
        }
      }
    }

    // Add to local cache
    this.tasks.set(task.id, task);

    // Emit event
    emitTaskUpdated(task);

    return task;
  }

  // Update a task
  updateTask(id: string, updates: Partial<Task>): Task | null {
    const task = taskDb.update(id, updates);
    if (task) {
      this.tasks.set(task.id, task);
      emitTaskUpdated(task);

      // If task completed, check for unblocked tasks
      if (updates.status === 'completed') {
        this.checkUnblockedTasks();
      }
    }
    return task;
  }

  // Check and update status of blocked tasks
  private checkUnblockedTasks(): void {
    for (const [id, task] of this.tasks) {
      if (task.status === 'blocked') {
        const allTasks = Array.from(this.tasks.values());
        if (!isTaskBlocked(task, allTasks)) {
          this.updateTask(id, { status: 'pending' });
        }
      }
    }
  }

  // Start executing a task
  startTask(id: string): Task | null {
    const task = this.tasks.get(id);
    if (!task || task.status === 'running' || task.status === 'completed') {
      return null;
    }

    // Check if blocked
    const allTasks = Array.from(this.tasks.values());
    if (isTaskBlocked(task, allTasks)) {
      return null;
    }

    // Update status
    const updated = this.updateTask(id, {
      status: 'running',
      startedAt: new Date(),
    });

    if (updated) {
      this.runningTasks.add(id);
      emitTaskStarted(updated);
      logDb.create(id, 'info', `Task started: ${task.subject}`);
    }

    return updated;
  }

  // Complete a task
  completeTask(id: string, output?: string): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updated = this.updateTask(id, {
      status: 'completed',
      progress: 100,
      completedAt: new Date(),
      output,
    });

    if (updated) {
      this.runningTasks.delete(id);
      emitTaskCompleted(updated);
      logDb.create(id, 'success', `Task completed: ${task.subject}`);
    }

    return updated;
  }

  // Fail a task
  failTask(id: string, error: string): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updated = this.updateTask(id, {
      status: 'failed',
      error,
    });

    if (updated) {
      this.runningTasks.delete(id);
      emitTaskFailed(updated);
      logDb.create(id, 'error', `Task failed: ${task.subject} - ${error}`);
    }

    return updated;
  }

  // Add log to task
  addTaskLog(id: string, level: 'info' | 'success' | 'warning' | 'error', message: string): void {
    const log = logDb.create(id, level, message);
    emitTaskLog(log);
  }

  // Update task progress
  updateProgress(id: string, progress: number): Task | null {
    return this.updateTask(id, { progress: Math.min(100, Math.max(0, progress)) });
  }

  // Get all tasks
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  // Get task by ID
  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  // Get tasks by level
  getTasksByLevel(level: number): Task[] {
    return Array.from(this.tasks.values()).filter(t => t.level === level);
  }

  // Get ready tasks
  getReadyTasks(): Task[] {
    return findReadyTasks(Array.from(this.tasks.values()));
  }

  // Delete a task
  deleteTask(id: string): boolean {
    // Remove from blocks arrays of other tasks
    const task = this.tasks.get(id);
    if (task) {
      for (const depId of task.blockedBy) {
        const depTask = this.tasks.get(depId);
        if (depTask) {
          const newBlocks = depTask.blocks.filter(bid => bid !== id);
          taskDb.update(depId, { blocks: newBlocks });
        }
      }
    }

    this.tasks.delete(id);
    this.runningTasks.delete(id);
    logDb.deleteByTask(id);
    return taskDb.delete(id);
  }

  // Get DAG structure for visualization
  getDAGStructure(): { nodes: Task[]; levels: Task[][] } {
    const tasks = Array.from(this.tasks.values());
    const levels = groupTasksByLevel(tasks);
    return { nodes: tasks, levels };
  }
}

// Squad Orchestrator
export class SquadOrchestrator {
  private taskOrchestrator: TaskOrchestrator;

  constructor(taskOrchestrator: TaskOrchestrator) {
    this.taskOrchestrator = taskOrchestrator;
  }

  // Create a squad from a template
  createSquadFromTemplate(template: {
    name: string;
    type: 'feature' | 'bug' | 'performance' | 'security' | 'design';
    description?: string;
    levels: Array<{
      name: string;
      parallel: boolean;
      tasks: Array<{
        agent: AgentType;
        subject: string;
        description: string;
        protocol?: string;
      }>;
    }>;
  }, context?: { projectName?: string; featureName?: string }): SquadExecution {
    const tasks: string[] = [];
    const levelTaskIds: string[][] = [];
    let previousLevelIds: string[] = [];

    // Create tasks for each level
    for (const level of template.levels) {
      const currentLevelIds: string[] = [];

      for (const taskTemplate of level.tasks) {
        // Replace placeholders in subject/description
        let subject = taskTemplate.subject;
        let description = taskTemplate.description;

        if (context) {
          subject = subject.replace('{featureName}', context.featureName || 'feature');
          description = description.replace('{featureName}', context.featureName || 'feature');
          description = description.replace('{projectName}', context.projectName || 'project');
        }

        // Tasks always depend on previous level. Non-parallel levels also chain tasks within the same level.
        const blockedBy = [...previousLevelIds];
        if (!level.parallel && currentLevelIds.length > 0) {
          blockedBy.push(currentLevelIds[currentLevelIds.length - 1]);
        }

        const task = this.taskOrchestrator.createTask({
          subject,
          description,
          activeForm: `Executando: ${subject}`,
          agent: taskTemplate.agent,
          blockedBy,
          protocol: taskTemplate.protocol,
        });

        tasks.push(task.id);
        currentLevelIds.push(task.id);
      }

      levelTaskIds.push(currentLevelIds);
      previousLevelIds = currentLevelIds;
    }

    // Recalculate levels properly
    const allTasks = this.taskOrchestrator.getAllTasks();
    const memo = new Map<string, number>();

    for (let i = 0; i < levelTaskIds.length; i++) {
      for (const taskId of levelTaskIds[i]) {
        const task = this.taskOrchestrator.getTask(taskId);
        if (task) {
          const correctLevel = calculateTaskLevel(task, allTasks, memo);
          taskDb.update(taskId, { level: correctLevel });
        }
      }
    }

    // Create squad
    const squad = squadDb.create({
      name: template.name,
      description: template.description,
      type: template.type,
      tasks,
      status: 'idle',
      currentLevel: 0,
      totalLevels: template.levels.length,
      progress: 0,
    });

    emitSquadUpdated(squad);
    return squad;
  }

  // Start squad execution
  startSquad(squadId: string): SquadExecution | null {
    const squad = squadDb.getById(squadId);
    if (!squad || squad.status === 'running' || squad.status === 'completed') return null;

    // Update squad status
    const updated = squadDb.update(squadId, {
      status: 'running',
      startedAt: squad.startedAt || new Date(),
    });

    if (updated) {
      emitSquadStarted(updated);
      emitSquadUpdated(updated);
      return this.reconcileSquadExecution(squadId);
    }

    return null;
  }

  // Update squad progress
  updateSquadProgress(squadId: string): SquadExecution | null {
    const squad = squadDb.getById(squadId);
    if (!squad) return null;

    const tasks = this.taskOrchestrator.getAllTasks().filter(t => squad.tasks.includes(t.id));
    if (tasks.length === 0) {
      const emptySquad = squadDb.update(squadId, {
        progress: 0,
        currentLevel: 0,
      });

      if (emptySquad) {
        emitSquadUpdated(emptySquad);
      }
      return emptySquad;
    }

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    // Find current level
    const levels = groupTasksByLevel(tasks);
    let currentLevel = 0;

    for (let i = 0; i < levels.length; i++) {
      const levelComplete = levels[i].every(t => t.status === 'completed');
      if (!levelComplete) {
        currentLevel = i;
        break;
      }
      currentLevel = i + 1;
    }

    // Check if squad is complete
    const allComplete = tasks.every(t => t.status === 'completed');
    const anyFailed = tasks.some(t => t.status === 'failed');

    if (allComplete) {
      currentLevel = Math.max(0, levels.length - 1);
    }

    let status = squad.status;
    if (allComplete) {
      status = 'completed';
    } else if (anyFailed) {
      status = 'failed';
    }

    const updated = squadDb.update(squadId, {
      progress,
      currentLevel,
      status,
      completedAt: allComplete ? new Date() : undefined,
    });

    if (updated) {
      emitSquadUpdated(updated);

      if (allComplete) {
        emitSquadCompleted(updated);
      }
    }

    return updated;
  }

  // Reconcile a squad after any task status change
  reconcileSquadExecution(squadId: string): SquadExecution | null {
    const squad = squadDb.getById(squadId);
    if (!squad) return null;

    if (squad.status === 'running') {
      const squadTasks = this.taskOrchestrator
        .getAllTasks()
        .filter(task => squad.tasks.includes(task.id));
      const readyTasks = findReadyTasks(squadTasks);

      for (const task of readyTasks) {
        this.taskOrchestrator.startTask(task.id);
      }
    }

    return this.updateSquadProgress(squadId);
  }

  // Reconcile all squads impacted by a task change
  syncSquadsForTask(taskId: string): SquadExecution[] {
    const impactedSquads = squadDb.getAll().filter(squad => squad.tasks.includes(taskId));
    const updated: SquadExecution[] = [];

    for (const squad of impactedSquads) {
      const reconciled = this.reconcileSquadExecution(squad.id);
      if (reconciled) {
        updated.push(reconciled);
      }
    }

    return updated;
  }

  // Get squad tasks organized by level
  getSquadTasksByLevel(squadId: string): Task[][] {
    const squad = squadDb.getById(squadId);
    if (!squad) return [];

    const tasks = this.taskOrchestrator.getAllTasks().filter(t => squad.tasks.includes(t.id));
    return groupTasksByLevel(tasks);
  }
}

// Export singleton instances
export const taskOrchestrator = new TaskOrchestrator();
export const squadOrchestrator = new SquadOrchestrator(taskOrchestrator);
