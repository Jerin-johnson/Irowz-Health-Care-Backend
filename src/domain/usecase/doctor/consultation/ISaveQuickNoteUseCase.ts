export interface ISaveQuickNoteUseCase {
  execute(appointmentId: string, note: string): Promise<{ message: string }>;
}
