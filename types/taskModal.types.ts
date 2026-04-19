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

export type TaskPriority = "Low" | "Medium" | "High";

export type TaskPeriod =
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Yearly";

export type TaskFilterPeriod =
  | "All"
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Yearly";

export interface NewTaskPayload {
  title: string;
  notes?: string;
  category: TaskCategory;
  priority: TaskPriority;
  period: TaskPeriod;
  reminderTime?: Date;
  pushNotificationsEnabled: boolean;
}

export interface CreatedTask {
  id: number;
  title: string;
  type: TaskCategory;
  time: string;
  completed: boolean;
  priority: TaskPriority;
  notes?: string;
  period: TaskPeriod;
  reminderTime?: string;
  deadline?: string;
}

export interface NewTaskResponse {
  success: boolean;
  taskId: number;
  message: string;
  task: CreatedTask;
}