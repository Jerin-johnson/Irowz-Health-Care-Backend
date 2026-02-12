export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentInput {
  question: string;
  userId: string;
  lastMessages?: AiMessage[];
}

export interface ToolContext {
  userId: string;
}

export interface Location {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
}
