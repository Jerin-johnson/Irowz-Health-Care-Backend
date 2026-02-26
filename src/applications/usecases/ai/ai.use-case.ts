import { HealthcareAgent } from "../../../ai/agents/healthcare.agent";
import { AiMessage } from "../../../ai/types/ai.types";
import { IAiUseCase } from "../../../domain/usecase/ai/ai.types";

export class AiUseCase implements IAiUseCase {
  constructor(private agent: HealthcareAgent) {}
  async processChat(
    userId: string,
    question: string,
    prevMessages: AiMessage[] = []
  ): Promise<string> {
    try {
      const reply = await this.agent.run({
        question,
        userId,
        lastMessages: prevMessages,
      });
      return reply;
    } catch (err) {
      console.error("AiUseCase error:", err);
      return "Sorry, something went wrong. Try again later.";
    }
  }
}
