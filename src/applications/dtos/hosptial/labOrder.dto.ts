export interface HospitalLabOrderQuery {
  hospitalId: string;
  page: number;
  limit: number;
  status?: "PENDING" | "RESULT_UPLOADED";
}

export interface UploadHospitalLabResultInput {
  orderId: string;
  appointmentId: string;
  testName: string;
  fileBuffer: Buffer;
  mimeType: string;
}
