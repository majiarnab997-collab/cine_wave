import { Notification } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/demoData';
import { storage } from './storage';

const NOTIFICATIONS_KEY = 'user_notifications';

function initNotifications() {
  if (!storage.get<Notification[] | null>(NOTIFICATIONS_KEY, null)) {
    storage.set(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
  }
}

initNotifications();

export const notificationService = {
  getNotifications(userId: string): Notification[] {
    const list = storage.get<Notification[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    return list.filter(n => n.userId === userId || n.userId === 'all');
  },

  getUnreadCount(userId: string): number {
    return this.getNotifications(userId).filter(n => !n.read).length;
  },

  markAsRead(id: string): void {
    const list = storage.get<Notification[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    const idx = list.findIndex(n => n.id === id);
    if (idx >= 0) {
      list[idx].read = true;
      storage.set(NOTIFICATIONS_KEY, list);
    }
  },

  markAllAsRead(userId: string): void {
    const list = storage.get<Notification[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    const updated = list.map(n => (n.userId === userId || n.userId === 'all' ? { ...n, read: true } : n));
    storage.set(NOTIFICATIONS_KEY, updated);
  },

  addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
    const list = storage.get<Notification[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: 'Just now'
    };
    list.unshift(newNotif);
    storage.set(NOTIFICATIONS_KEY, list);
    return newNotif;
  }
};
