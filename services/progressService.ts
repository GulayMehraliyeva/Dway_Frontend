import { ProgressData } from "../types/progress";

export type ProgressPeriod =
  | "Weekly"
  | "Monthly"
  | "Yearly";

export const getProgressData = async (
  period: ProgressPeriod
): Promise<ProgressData> => {
  const mockData: Record<ProgressPeriod, ProgressData> = {
    Weekly: {
      progress: 67,
      done: 10,
      remaining: 5,
      total: 15,

      categories: [
        {
          name: "Sport",
          value: 100,
          completed: 2,
          total: 2,
        },
        {
          name: "Personal",
          value: 100,
          completed: 1,
          total: 1,
        },
        {
          name: "Social",
          value: 100,
          completed: 1,
          total: 1,
        },
        {
          name: "Home",
          value: 100,
          completed: 2,
          total: 2,
        },
        {
          name: "Health",
          value: 70,
          completed: 7,
          total: 10,
        },
        {
          name: "Learning",
          value: 0,
          completed: 0,
          total: 3,
        },
      ],

      insights: [
        {
          id: 1,
          text: "Lorem ipsum dolor sit amet consectetur. Aenean non non tristique sed proin.",
          type: "increase",
        },
        {
          id: 2,
          text: "Lorem ipsum dolor sit amet consectetur. Aliquet lacus consectetur ultrices.",
          type: "star",
        },
        {
          id: 3,
          text: "Lorem ipsum dolor sit amet consectetur. Aenean non non tristique sed proin.",
          type: "warning",
        },
      ],
    },

    Monthly: {
      progress: 45,
      done: 27,
      remaining: 33,
      total: 60,

      categories: [
        {
          name: "Work",
          value: 70,
          completed: 14,
          total: 20,
        },
        {
          name: "Health",
          value: 55,
          completed: 6,
          total: 11,
        },
        {
          name: "Sport",
          value: 40,
          completed: 4,
          total: 10,
        },
        {
          name: "Finance",
          value: 80,
          completed: 4,
          total: 5,
        },
        {
          name: "Creative",
          value: 20,
          completed: 1,
          total: 5,
        },
        {
          name: "Other",
          value: 30,
          completed: 3,
          total: 10,
        },
      ],

      insights: [
        {
          id: 1,
          text: "You are consistent in Work tasks this month, but Creative goals are lagging behind.",
          type: "increase",
        },
        {
          id: 2,
          text: "Finance has one of your highest completion rates this month.",
          type: "star",
        },
        {
          id: 3,
          text: "Sport activity has dropped compared with your weekly trend.",
          type: "warning",
        },
      ],
    },

    Yearly: {
      progress: 82,
      done: 148,
      remaining: 32,
      total: 180,

      categories: [
        {
          name: "Work",
          value: 88,
          completed: 44,
          total: 50,
        },
        {
          name: "Health",
          value: 76,
          completed: 38,
          total: 50,
        },
        {
          name: "Learning",
          value: 90,
          completed: 27,
          total: 30,
        },
        {
          name: "Home",
          value: 80,
          completed: 16,
          total: 20,
        },
        {
          name: "Social",
          value: 70,
          completed: 14,
          total: 20,
        },
        {
          name: "Personal",
          value: 50,
          completed: 10,
          total: 20,
        },
      ],

      insights: [
        {
          id: 1,
          text: "Your yearly completion is strong, with Learning and Work showing the best consistency.",
          type: "increase",
        },
        {
          id: 2,
          text: "Learning is your top-performing category this year.",
          type: "star",
        },
        {
          id: 3,
          text: "Personal goals are improving, but they still trail your other categories.",
          type: "warning",
        },
      ],
    },
  };

  return mockData[period];
};