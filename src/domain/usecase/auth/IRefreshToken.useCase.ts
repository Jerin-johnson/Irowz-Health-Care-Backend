export interface IRefreshTokenUseCase {
  execute(token: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      userId: string;
      role: string;
      name?: string;
      email?: string;
      hospitalId?: string;
      patientId?: string;
      doctorId?: string;
      forcePasswordReset: boolean;
    };
  }>;
}
