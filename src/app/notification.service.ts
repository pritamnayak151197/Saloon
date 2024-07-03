import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Notification {
  notificationId: number;
  message: string;
  timestamp: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  setNotifications(notifications: Notification[]): void {
    this.notificationsSubject.next(notifications);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  markAsRead(notificationId: number): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(notification => 
      notification.notificationId === notificationId ? { ...notification, read: true } : notification
    );
    this.notificationsSubject.next(updatedNotifications);
  }
}
