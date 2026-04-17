export type TaskPriority =
  | "Low"
  | "Medium"
  | "High";

export interface Task {
  id: number;
  title: string;
  type:
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
  time: string;
  completed: boolean;
  priority: TaskPriority;
  notes?: string;
}

export interface Motivation {
  quote: string;
  author: string;
}

export interface HomeStats {
  completedTasks: number;
  totalTasks: number;
}

export interface HomeData {
  title: string;
  motivation: Motivation;
  stats: HomeStats;
  inProgressTasks: Task[];
  completedTasksList: Task[];
}