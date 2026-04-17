import { CommentsPageData } from "../types/comment";

export const getCommentsData = async (
  postId: number
): Promise<CommentsPageData> => {
  const mockComments: Record<
    number,
    CommentsPageData
  > = {
    1: {
      originalPost: {
        id: 1,
        initial: "A",
        avatarColor: "#6366F1",
        name: "Alex M.",
        badge: "Sport",
        text: "Completed my workout streak today 🔥",
      },
      comments: [
        {
          id: 1,
          initial: "P",
          avatarColor: "#F59E0B",
          name: "Pera L.",
          text: "Amazing work!",
          time: "1h ago",
        },
        {
          id: 2,
          initial: "S",
          avatarColor: "#22C55E",
          name: "Sarah K.",
          text: "Keep going 💪",
          time: "45m ago",
        },
      ],
    },

    2: {
      originalPost: {
        id: 2,
        initial: "S",
        avatarColor: "#22C55E",
        name: "Sarah K.",
        badge: "Work",
        text: "Finished my Q2 proposal today ✨",
      },
      comments: [
        {
          id: 1,
          initial: "A",
          avatarColor: "#6366F1",
          name: "Alex M.",
          text: "Well done 👏",
          time: "2h ago",
        },
        {
          id: 2,
          initial: "P",
          avatarColor: "#F59E0B",
          name: "Pera L.",
          text: "Proud of you!",
          time: "1h ago",
        },
      ],
    },
  };

  return (
  mockComments[postId] ?? {
    originalPost: {
      id: postId,
      initial: "Y",
      avatarColor: "#6366F1",
      name: "You",
      badge: "Work",
      text: "Your new post",
    },
    comments: [],
  }
);
};