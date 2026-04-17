export interface ActivityPost {
  id: number;
  name: string;
  time: string;
  content: string;
  badge: string;
  avatarColor: string;
  initial: string;
  likes: number;
  comments: number;
}
export interface Challenge {
  id: number;
  title: string;
  subtitle: string;
  progress: number;
  participants: string;
  type: "streak" | "task" | "category";
}