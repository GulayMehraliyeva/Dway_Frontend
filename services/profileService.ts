import { ProfileData } from "../types/profile";

export const getProfileData = async (): Promise<ProfileData> => {
  return {
    user: {
      name: "Alex",
      avatarLetter: "A",
      memberSince: "April 2025",
    },

    stats: {
      tasksDone: 20,
      dayStreak: 7,
      completion: 64,
    },

    achievements: {
      first: "First Task",
      second: "10 Done",
      third: "20 Club",
    },

    notifications: {
      pushNotifications: true,
      alarmSound: "Standard alarm sound",
    },

    appearance: {
      theme: "System",
      language: "English",
    },

    partners: {
      headspace: {
        title: "Headspace",
        badge: "3 Months Free",
        subtitle: "Mindfulness & Focus",
        description:
          "3 months of Headspace Plus free when you complete your first 30 tasks",
      },

      coursera: {
        title: "Coursera",
        badge: "30% off",
        subtitle: "Online Learning",
        description:
          "3 months of Headspace Plus free when you complete your first 30 tasks",
      },
    },
  };
};

export const updateAlarmSound = async (
  sound: string
): Promise<boolean> => true;

export const updateTheme = async (
  theme: string
): Promise<boolean> => true;

export const updateLanguage = async (
  language: string
): Promise<boolean> => true;

export const updatePushNotifications = async (
  enabled: boolean
): Promise<boolean> => true;