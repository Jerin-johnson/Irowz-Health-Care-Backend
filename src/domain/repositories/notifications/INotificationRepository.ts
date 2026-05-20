import { ObjectId, Types } from "mongoose";
import { NotificationMetadata } from "../../../infrastructure/database/mongo/models/Notification.model";

export interface NotificationResponse {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  type: string;
  title: string;
  message: string;

  metadata?: NotificationMetadata;

  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationRepository {
  create(data: {
    userId: string | ObjectId;
    title: string;
    message: string;
    type: string;
    metadata?: NotificationMetadata;
  }): Promise<NotificationResponse>;

  getUserNotifications(userId: string): Promise<NotificationResponse[]>;

  markAllAsRead(userId: string): Promise<{
    acknowledged: boolean;
    modifiedCount: number;
    matchedCount: number;
  }>;
}
