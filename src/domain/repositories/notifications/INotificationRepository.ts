import { ObjectId } from "mongoose";

export interface INotificationRepository {
  create(data: {
    userId: string | ObjectId;
    title: string;
    message: string;
    type: string;
    metadata?: any;
  }): Promise<any>;

  getUserNotifications(userId: string): Promise<any>;

  markAllAsRead(userId: string): Promise<any>;
}
