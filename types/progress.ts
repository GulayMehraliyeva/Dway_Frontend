export interface CategoryItem {
  name: string;
  value: number;
  completed: number;
  total: number;
}

export interface InsightItem {
  id: number;
  text: string;
  type: "increase" | "star" | "warning";
}

export interface ProgressData {
  progress: number;
  done: number;
  remaining: number;
  total: number;

  categories: CategoryItem[];
  insights: InsightItem[];
}