let _pushNotificationsEnabled: boolean = true;

export const notificationStore = {
  get: (): boolean => _pushNotificationsEnabled,
  set: (value: boolean): void => {
    _pushNotificationsEnabled = value;
  },
};