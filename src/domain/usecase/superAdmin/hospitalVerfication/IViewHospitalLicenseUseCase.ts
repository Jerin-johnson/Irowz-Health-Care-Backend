export interface IViewHospitalLicenseUseCase {
  execute(input: { verificationId: string; requesterUserId?: string }): Promise<{
    signedUrl: string;
  }>;
}
