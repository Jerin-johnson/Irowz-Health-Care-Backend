import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { createAgent } from "langchain";
import { AiMessage } from "../types/ai.types";
import { MedicalKnowledgeService } from "../knowledge/knowledge.service";
import { ToolFactory } from "../tools/factory/tool.factory";
import { SYSTEM_PROMPT } from "../prompts/prompts";

interface AgentInput {
  question: string;
  userId: string;
  lastMessages?: AiMessage[];
}

interface AgentResult {
  messages: Array<HumanMessage | AIMessage>;
}

export class HealthcareAgent {
  private _model: ChatGoogleGenerativeAI;
  private _knowledgeService: MedicalKnowledgeService;
  private _initPromise: Promise<void> | null = null;

  constructor(private _toolFactory: ToolFactory) {
    this._model = new ChatGoogleGenerativeAI({
      model: process.env.GOOGLE_MODEL || "gemini-1.5-flash",
      apiKey: process.env.GOOGLE_API_KEY!,
      temperature: 0.7,
    });

    this._knowledgeService = new MedicalKnowledgeService();
    this._initPromise = this._knowledgeService.initialize();
  }

  private isSimpleGreeting(query: string): boolean {
    const greetings =
      /^(hi|hai|hello|hey|good morning|good evening|good afternoon|thanks|thank you|bye|goodbye)$/i;
    return greetings.test(query.trim());
  }

  private needsKnowledge(query: string): boolean {
    const lowerQuery = query.trim().toLowerCase();

    // Skip for greetings, short queries, booking actions
    if (this.isSimpleGreeting(lowerQuery) || lowerQuery.length < 10) {
      return false;
    }

    const actionPatterns = [
      /book|appointment|slot|schedule/i,
      /search|find|show me|list/i,
      /available|availability/i,
      /lock|unlock|cancel/i,
    ];

    if (actionPatterns.some((p) => p.test(lowerQuery))) {
      return false;
    }

    const knowledgePatterns = [
      /what (is|are) (the )?symptoms? of/i,
      /which (doctor|specialist|specialty)/i,
      /what does .+ treat/i,
    ];

    return knowledgePatterns.some((pattern) => pattern.test(lowerQuery));
  }

  async run(input: AgentInput): Promise<string> {
    const startTime = Date.now();

    try {
      if (this.isSimpleGreeting(input.question)) {
        const messages = [
          new SystemMessage("You are HealthAI, a friendly healthcare assistant. Be brief."),
          new HumanMessage(input.question),
        ];

        const result = await this._model.invoke(messages);
        console.log(` Greeting: ${Date.now() - startTime}ms`);
        return result.content as string;
      }

      await this._initPromise;

      let knowledgeContext = "";
      if (this.needsKnowledge(input.question)) {
        knowledgeContext = await this._knowledgeService.retrieve(input.question);
      }

      const tools = this._toolFactory.build(input.userId);

      const formattedPrompt = knowledgeContext
        ? `${SYSTEM_PROMPT}\n\nRelevant Info: ${knowledgeContext.substring(0, 200)}`
        : SYSTEM_PROMPT;

      const agent = createAgent({
        model: this._model,
        tools,
        systemPrompt: formattedPrompt,
      });

      const messages: (HumanMessage | AIMessage)[] = [];
      if (input.lastMessages && input.lastMessages.length > 0) {
        const recent = input.lastMessages.slice(-8);
        console.log("the recent");
        messages.push(
          ...recent.map((m) =>
            m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
          )
        );
      }
      messages.push(new HumanMessage(input.question));

      const result = await Promise.race<AgentResult>([
        agent.invoke({ messages }) as Promise<AgentResult>,
        new Promise<AgentResult>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 90000)
        ),
      ]);

      const lastMessage = result.messages[result.messages.length - 1];
      const response = lastMessage.content as string;

      console.log(`Total: ${Date.now() - startTime}ms`);

      console.log("the response", response);
      return response;
    } catch (error: any) {
      console.error(`Error (${Date.now() - startTime}ms):`, error.message);

      if (error.message?.includes("Timeout")) {
        return "I'm taking too long to process this. Could you try asking in a simpler way?";
      }

      return "Sorry, something went wrong. Please try again.";
    }
  }
}
