import { HealthcareAgent } from "../ai/agents/healthcare.agent";
import { ToolFactory } from "../ai/tools/factory/tool.factory";
import { AiUseCase } from "../applications/usecases/ai/ai.use-case";
import { AiController } from "../presentation/controllers/ai/ai.controller";
import { AiRoutes } from "../presentation/routes/ai.routes";

const toolFactory = new ToolFactory();
const healthcareAgent = new HealthcareAgent(toolFactory);

const aiUseCase = new AiUseCase(healthcareAgent);
const aiController = new AiController(aiUseCase);
export const aiRoutes = new AiRoutes(aiController);
