export type TaskCategory =
  | "work"
  | "health"
  | "sport"
  | "learning"
  | "personal"
  | "finance"
  | "social"
  | "creative"
  | "home"
  | "other";

export type TaskPriority =
  | "Low"
  | "Medium"
  | "High";

export interface NewTaskPayload {
  title: string;
  notes?: string;
  category: TaskCategory;
  priority: TaskPriority;
  alarmEnabled: boolean;
  reminderTime?: Date;
}

export interface CreatedTask {
  id: number;
  title: string;
  type: TaskCategory;
  time: string;
  completed: boolean;
  priority: TaskPriority;
  notes?: string;
  reminderTime?: string;
}

export interface NewTaskResponse {
  success: boolean;
  taskId: number;
  message: string;
  task: CreatedTask;
}