import * as Notifications from "expo-notifications";
import {
  NewTaskPayload,
  NewTaskResponse,
} from "../types/taskModal.types";

// ─── Notification handler (call once at app root too if needed) ───────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Permission helper ────────────────────────────────────────────────────────
const requestNotificationPermission = async (): Promise<boolean> => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const { status: newStatus } = await Notifications.requestPermissionsAsync();
  return newStatus === "granted";
};

// ─── Period → days until deadline ────────────────────────────────────────────
const periodToDays: Record<string, number> = {
  Daily:   1,
  Weekly:  7,
  Monthly: 30,
  Yearly:  365,
};

/**
 * Schedules one notification per day at `reminderTime` (hour:minute) until
 * the deadline (reminderTime + periodToDays days).  Uses DATE triggers so
 * each notification is a separate scheduled entry – this works on both iOS
 * and Android without needing a custom calendar trigger.
 *
 * On Android, expo-notifications repeating trigger is limited to a fixed
 * interval; using individual DATE triggers gives us the "stop on deadline"
 * behaviour we need.
 */
const scheduleRepeatingNotifications = async (
  title: string,
  reminderTime: Date,
  period: string
) => {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const days = periodToDays[period] ?? 1;

  // Cancel any existing notifications for this task title to avoid duplicates
  // (in production you'd want to store notification IDs per task)
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const existing = scheduled.filter((n) => n.content.body === title);
  for (const n of existing) {
    await Notifications.cancelScheduledNotificationAsync(n.identifier);
  }

  const baseTime = new Date(reminderTime);
  // Make sure the first reminder is in the future
  if (baseTime <= new Date()) {
    baseTime.setDate(baseTime.getDate() + 1);
  }

  for (let day = 0; day < days; day++) {
    const triggerDate = new Date(baseTime);
    triggerDate.setDate(triggerDate.getDate() + day);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Reminder 🔔",
        body: title,
        sound: true,
        data: { taskTitle: title, period },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  }
};

// ─── Current-time helper ──────────────────────────────────────────────────────
const getCurrentTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

// ─── Deadline calculator ──────────────────────────────────────────────────────
const calculateDeadline = (reminderTime: Date, period: string): Date => {
  const days = periodToDays[period] ?? 1;
  const deadline = new Date(reminderTime);
  deadline.setDate(deadline.getDate() + days);
  return deadline;
};

// ─── Main export ──────────────────────────────────────────────────────────────
export const submitNewTask = async (
  payload: NewTaskPayload
): Promise<NewTaskResponse> => {
  const { title, notes, category, priority, period, reminderTime, pushNotificationsEnabled } = payload;

  // Only schedule notifications if the user has push notifications enabled in profile
  if (pushNotificationsEnabled && reminderTime) {
    await scheduleRepeatingNotifications(title, reminderTime, period ?? "Daily");
  }

  const deadline = reminderTime
    ? calculateDeadline(reminderTime, period ?? "Daily")
    : undefined;

  const timeLabel = reminderTime
    ? reminderTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : getCurrentTime();

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    type: category,
    time: timeLabel,
    completed: false,
    priority,
    notes,
    period: period ?? "Daily",
    reminderTime: reminderTime?.toISOString(),
    deadline: deadline?.toISOString(),
  };

  return {
    success: true,
    taskId: newTask.id,
    message: "Task added successfully",
    task: newTask,
  };
};