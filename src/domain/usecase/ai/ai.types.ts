import { AiMessage } from "../../../ai/types/ai.types";

export interface IAiUseCase {
  processChat(userId: string, question: string, prevMessages: AiMessage[]): Promise<string>;
}
