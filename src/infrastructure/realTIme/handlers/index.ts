type RealtimeHandler = (event: any) => Promise<void>;

export const handlers: Record<string, RealtimeHandler> = {};
