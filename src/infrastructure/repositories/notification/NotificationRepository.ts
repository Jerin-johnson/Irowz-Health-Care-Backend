import { ObjectId, Types } from "mongoose";
import { INotificationRepository } from "../../../domain/repositories/notifications/INotificationRepository";
import { NotificationModel } from "../../database/mongo/models/Notification.model";

export class NotificationRepository implements INotificationRepository {
  async create(data: {
    userId: string | ObjectId;
    type: string;
    title: string;
    message: string;
    metadata?: any;
  }) {
    const normalizedData = {
      userId: typeof data.userId === "string" ? new Types.ObjectId(data.userId) : data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      metadata: data.metadata,
    };
    const result = new NotificationModel(normalizedData);
    return await result.save();
  }

  async getUserNotifications(userId: string) {
    return NotificationModel.find({ userId, isRead: false }).sort({ createdAt: -1 });
  }

  async markAllAsRead(userId: string) {
    return NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });
  }
}
