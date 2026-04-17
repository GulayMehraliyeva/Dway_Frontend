export interface ProfileData {
  user: {
    name: string;
    avatarLetter: string;
    memberSince: string;
  };

  stats: {
    tasksDone: number;
    dayStreak: number;
    completion: number;
  };

  achievements: {
    first: string;
    second: string;
    third: string;
  };
  
  notifications: {
    pushNotifications: boolean;
    alarmSound: string;
  };

  appearance: {
    theme: string;
    language: string;
  };

  partners: {
    headspace: {
      title: string;
      badge: string;
      subtitle: string;
      description: string;
    };
    coursera: {
      title: string;
      badge: string;
      subtitle: string;
      description: string;
    };
  };
}