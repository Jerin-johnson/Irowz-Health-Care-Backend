export interface CreateLabOrderInput {
  appointmentId: string;
  action: "Hospital" | "Outside";
  clinicalReason?: string;

  tests: {
    id: string;
    name: string;
    category: string;
  }[];
}

// export interface UploadLabTestResultInput {
//   orderId: string;
//   appointmentId: string;
//   testName: string;
//   fileBuffer: Buffer;
//   mimeType: string;
// }
