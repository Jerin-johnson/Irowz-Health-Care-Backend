import { INotificationRepository } from "../../../../domain/repositories/notifications/INotificationRepository";

export class GetPatientNotifcationUseCase {
  constructor(private readonly _NotificationRepository: INotificationRepository) {}

  async execute(userId: string) {
    const result = await this._NotificationRepository.getUserNotifications(userId);
    return result;
  }
}
