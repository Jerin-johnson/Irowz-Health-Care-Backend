export interface INotificationRepository {
  create(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
    metadata?: any;
  }): Promise<any>;

  getUserNotifications(userId: string): Promise<any>;

  markAllAsRead(userId: string): Promise<any>;
}
