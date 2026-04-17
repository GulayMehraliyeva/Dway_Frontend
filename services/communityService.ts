import { ActivityPost, Challenge } from "../types/community";

export const getCommunityData = async (): Promise<{
  posts: ActivityPost[];
  challenges: Challenge[];
}> => {
  return {
    posts: [
      {
        id: 1,
        name: "Alex M.",
        time: "2h ago",
        content:
          "Lorem ipsum dolor sit amet consectetur.",
        badge: "Sport",
        avatarColor: "#6C63FF",
        initial: "A",
        likes: 24,
        comments: 2,
      },
      {
        id: 2,
        name: "Sarah K.",
        time: "2h ago",
        content:
          "Lorem ipsum dolor sit amet consectetur.",
        badge: "Work",
        avatarColor: "#15C82F",
        initial: "S",
        likes: 24,
        comments: 2,
      },
    ],

    challenges: [
      {
        id: 1,
        title: "7-Day Streak",
        subtitle:
          "Complete at least one task every day for 7 days",
        progress: 70,
        participants: "1.243 participants",
        type: "streak",
      },
      {
        id: 2,
        title: "100 Task Club",
        subtitle: "Complete 100 tasks this month",
        progress: 78,
        participants: "1.243 participants",
        type: "task",
      },
      {
        id: 3,
        title: "Category Master",
        subtitle:
          "Complete tasks in all 5 categories in one week",
        progress: 60,
        participants: "1.243 participants",
        type: "category",
      },
    ],
  };
};