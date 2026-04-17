import * as Notifications from "expo-notifications";
import {
  NewTaskPayload,
  NewTaskResponse,
} from "../types/taskModal.types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const requestNotificationPermission =
  async (): Promise<boolean> => {
    const { status } =
      await Notifications.getPermissionsAsync();

    let finalStatus = status;

    if (status !== "granted") {
      const permissionResult =
        await Notifications.requestPermissionsAsync();

      finalStatus = permissionResult.status;
    }

    return finalStatus === "granted";
  };

const scheduleTaskNotification = async (
  title: string,
  reminderTime: Date
) => {
  const hasPermission =
    await requestNotificationPermission();

  if (!hasPermission) return;

  if (reminderTime <= new Date()) {
    const nextReminder = new Date(reminderTime);
    nextReminder.setDate(nextReminder.getDate() + 1);
    reminderTime = nextReminder;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Task Reminder",
      body: title,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderTime,
    },
  });
};

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const submitNewTask = async (
  payload: NewTaskPayload
): Promise<NewTaskResponse> => {
  if (
    payload.alarmEnabled &&
    payload.reminderTime
  ) {
    await scheduleTaskNotification(
      payload.title,
      payload.reminderTime
    );
  }

  const newTask = {
    id: Date.now(),
    title: payload.title.trim(),
    type: payload.category,
    time: payload.reminderTime
      ? payload.reminderTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : getCurrentTime(),
    completed: false,
    priority: payload.priority,
    notes: payload.notes,
    reminderTime:
      payload.reminderTime?.toISOString(),
  };

  return {
    success: true,
    taskId: newTask.id,
    message: "Task added successfully",
    task: newTask,
  };
};