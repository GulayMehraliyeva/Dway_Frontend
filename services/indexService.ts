import { HomeData, Task } from "../types/index";

export const getHomeData = async (): Promise<HomeData> => {
  const inProgressTasks: Task[] = [
  {
    id: 1,
    title: "Review Q2 project proposal",
    type: "work",
    time: "22:18",
    completed: false,
    priority: "High",
    notes: "Check budget and timeline before submission.",
    period: "Daily", // ✅ added
  },
  {
    id: 2,
    title: "Gym training session",
    type: "sport",
    time: "18:00",
    completed: false,
    priority: "Medium",
    notes: "Leg day and 20 min cardio.",
    period: "Weekly", // ✅ added
  },
  {
    id: 3,
    title: "Finish client email",
    type: "work",
    time: "21:00",
    completed: false,
    priority: "Low",
    notes: "Mention updated pricing and delivery timeline.",
    period: "Monthly", // ✅ added
  },
];

const completedTasksList: Task[] = [
  {
    id: 4,
    title: "Morning walk",
    type: "health",
    time: "08:00",
    completed: true,
    priority: "Low",
    notes: "30 minutes around the park.",
    period: "Daily", // ✅ added
  },
];

  return {
    title: "Daily",
    motivation: {
      quote:
        "You don’t have to be great to start, but you have to start to be great.",
      author: "Zig Ziglar",
    },
    stats: {
      completedTasks: completedTasksList.length,
      totalTasks:
        inProgressTasks.length + completedTasksList.length,
    },
    inProgressTasks,
    completedTasksList,
  };
};

