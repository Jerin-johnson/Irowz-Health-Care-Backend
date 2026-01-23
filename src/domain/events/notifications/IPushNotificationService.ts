export interface IPushNotificationService {
  send(data: { userId: string; title: string; body: string }): Promise<void>;
}
