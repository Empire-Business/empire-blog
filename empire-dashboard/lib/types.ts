// Task-Oriented System Types for Empire Vibe Coding Dashboard

export type AgentType = 'PM' | 'ARCHITECT' | 'DEVELOPER' | 'REVIEWER' | 'QA' | 'SECURITY' | 'DESIGNER' | 'DATA';

export type TaskStatus = 'pending' | 'ready' | 'running' | 'blocked' | 'completed' | 'failed';

export type SquadType = 'feature' | 'bug' | 'performance' | 'security' | 'design';

export type SquadStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';

export type LogLevel = 'info' | 'success' | 'warning' | 'error';

// Single log entry for task execution
export interface TaskLog {
  id: string;
  taskId: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
}

// Core Task interface with DAG support
export interface Task {
  id: string;
  subject: string;
  description: string;
  activeForm: string;
  status: TaskStatus;
  agent: AgentType;

  // DAG dependencies
  blockedBy: string[];  // IDs of tasks that must complete first
  blocks: string[];     // IDs of tasks this task blocks

  // DAG level (0 = no dependencies, can execute immediately)
  level: number;

  // Terminal prompt for execution
  terminalPrompt: string;

  // Metadata
  protocol?: string;    // Related protocol file
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;

  // Progress tracking
  progress: number;     // 0-100

  // Output and error handling
  output?: string;
  error?: string;
}

// Squad execution state
export interface SquadExecution {
  id: string;
  name: string;
  description?: string;
  type: SquadType;
  tasks: string[];      // Task IDs in this squad
  status: SquadStatus;
  currentLevel: number;
  totalLevels: number;
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Project state for the orchestrator
export interface ProjectState {
  tasks: Map<string, Task>;
  squads: Map<string, SquadExecution>;
  executionQueue: string[];  // Task IDs ready to run
  runningTasks: Set<string>; // Task IDs currently running
}

// API request/response types
export interface CreateTaskRequest {
  subject: string;
  description: string;
  activeForm: string;
  agent: AgentType;
  blockedBy?: string[];
  protocol?: string;
  terminalPrompt?: string;
}

export interface UpdateTaskRequest {
  status?: TaskStatus;
  progress?: number;
  output?: string;
  error?: string;
  terminalPrompt?: string;
}

export interface CreateSquadRequest {
  name: string;
  description?: string;
  type: SquadType;
  taskTemplates: Array<Omit<CreateTaskRequest, 'blockedBy'> & { level?: number }>;
}

// Event types for SSE
export type TaskEventType =
  | 'task:created'
  | 'task:updated'
  | 'task:started'
  | 'task:completed'
  | 'task:failed'
  | 'task:log'
  | 'squad:created'
  | 'squad:started'
  | 'squad:updated'
  | 'squad:completed';

export interface TaskEvent {
  type: TaskEventType;
  timestamp: Date;
  payload: Task | SquadExecution | TaskLog;
}

// DAG node for visualization
export interface DAGNode {
  id: string;
  type: 'task';
  data: Task;
  position: { x: number; y: number };
}

export interface DAGEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

// Dashboard state
export interface DashboardState {
  tasks: Task[];
  squads: SquadExecution[];
  selectedTaskId: string | null;
  selectedSquadId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: () => Promise<void>;
  fetchSquads: () => Promise<void>;
  createTask: (task: CreateTaskRequest) => Promise<Task>;
  updateTask: (id: string, updates: UpdateTaskRequest) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  startSquad: (squadId: string) => Promise<void>;
  selectTask: (id: string | null) => void;
  selectSquad: (id: string | null) => void;
}

// Squad templates with pre-defined DAGs
export interface SquadTemplate {
  name: string;
  type: SquadType;
  description: string;
  levels: Array<{
    name: string;
    parallel: boolean;
    tasks: Array<{
      agent: AgentType;
      subjectTemplate: string;
      descriptionTemplate: string;
      protocol: string;
    }>;
  }>;
}

// Pre-defined squad templates
export const SQUAD_TEMPLATES: SquadTemplate[] = [
  {
    name: 'Feature Squad',
    type: 'feature',
    description: 'Desenvolvimento completo de nova funcionalidade com execução paralela',
    levels: [
      {
        name: 'Planejamento',
        parallel: true,
        tasks: [
          {
            agent: 'ARCHITECT',
            subjectTemplate: 'Definir arquitetura técnica',
            descriptionTemplate: 'Analisar requisitos e definir estrutura técnica do projeto',
            protocol: '22-ARQUITETURA.md',
          },
          {
            agent: 'DESIGNER',
            subjectTemplate: 'Definir UI/UX',
            descriptionTemplate: 'Criar design system e interfaces de usuário',
            protocol: '09-DESIGN.md',
          },
          {
            agent: 'DATA',
            subjectTemplate: 'Analisar requisitos de dados',
            descriptionTemplate: 'Modelar estrutura de dados e definir schemas',
            protocol: '22-ARQUITETURA.md',
          },
        ],
      },
      {
        name: 'Implementação',
        parallel: false,
        tasks: [
          {
            agent: 'DEVELOPER',
            subjectTemplate: 'Implementar código',
            descriptionTemplate: 'Desenvolver a funcionalidade conforme especificações',
            protocol: '01-DESENVOLVER.md',
          },
        ],
      },
      {
        name: 'Validação',
        parallel: true,
        tasks: [
          {
            agent: 'REVIEWER',
            subjectTemplate: 'Code review',
            descriptionTemplate: 'Revisar código implementado',
            protocol: '07-QUALIDADE.md',
          },
          {
            agent: 'QA',
            subjectTemplate: 'Testar funcionalidade',
            descriptionTemplate: 'Executar testes e validar comportamento',
            protocol: '07-QUALIDADE.md',
          },
          {
            agent: 'SECURITY',
            subjectTemplate: 'Auditoria de segurança',
            descriptionTemplate: 'Verificar vulnerabilidades e boas práticas',
            protocol: '06-SEGURANCA.md',
          },
        ],
      },
    ],
  },
  {
    name: 'Bug Squad',
    type: 'bug',
    description: 'Investigação e correção de bugs',
    levels: [
      {
        name: 'Investigação',
        parallel: false,
        tasks: [
          {
            agent: 'DEVELOPER',
            subjectTemplate: 'Investigar e corrigir bug',
            descriptionTemplate: 'Analisar, identificar e corrigir o problema',
            protocol: '02-BUGS.md',
          },
        ],
      },
      {
        name: 'Validação',
        parallel: true,
        tasks: [
          {
            agent: 'QA',
            subjectTemplate: 'Validar correção',
            descriptionTemplate: 'Verificar se o bug foi corrigido corretamente',
            protocol: '07-QUALIDADE.md',
          },
          {
            agent: 'SECURITY',
            subjectTemplate: 'Verificar vulnerabilidades',
            descriptionTemplate: 'Checar se correção não introduziu problemas de segurança',
            protocol: '06-SEGURANCA.md',
          },
        ],
      },
    ],
  },
  {
    name: 'Performance Squad',
    type: 'performance',
    description: 'Otimização de performance',
    levels: [
      {
        name: 'Análise',
        parallel: true,
        tasks: [
          {
            agent: 'DATA',
            subjectTemplate: 'Analisar gargalos de dados',
            descriptionTemplate: 'Identificar problemas de performance em queries e dados',
            protocol: '22-ARQUITETURA.md',
          },
          {
            agent: 'ARCHITECT',
            subjectTemplate: 'Analisar arquitetura',
            descriptionTemplate: 'Identificar gargalos arquiteturais',
            protocol: '22-ARQUITETURA.md',
          },
        ],
      },
      {
        name: 'Otimização',
        parallel: false,
        tasks: [
          {
            agent: 'DEVELOPER',
            subjectTemplate: 'Implementar otimizações',
            descriptionTemplate: 'Aplicar melhorias de performance identificadas',
            protocol: '01-DESENVOLVER.md',
          },
        ],
      },
      {
        name: 'Validação',
        parallel: false,
        tasks: [
          {
            agent: 'QA',
            subjectTemplate: 'Validar melhorias',
            descriptionTemplate: 'Medir e validar ganhos de performance',
            protocol: '07-QUALIDADE.md',
          },
        ],
      },
    ],
  },
];
