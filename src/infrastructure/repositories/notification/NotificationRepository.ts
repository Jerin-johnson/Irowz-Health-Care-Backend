import { INotificationRepository } from "../../../domain/repositories/notifications/INotificationRepository";
import { NotificationModel } from "../../database/mongo/models/Notification.model";

export class NotificationRepository implements INotificationRepository {
  async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: any;
  }) {
    return NotificationModel.create(data);
  }

  async getUserNotifications(userId: string) {
    return NotificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async markAllAsRead(userId: string) {
    return NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });
  }
}
