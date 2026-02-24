import { Request, Response } from "express";
import { AiMessage } from "../../../ai/types/ai.types";
import { HttpStatusCode } from "axios";
import { IAiUseCase } from "../../../domain/usecase/ai/ai.types";

export class AiController {
  constructor(private aiUseCase: IAiUseCase) {}
  chat = async (req: Request, res: Response): Promise<void> => {
    try {
      const { question, prevMessages = [] } = req.body as {
        question: string;
        prevMessages?: AiMessage[];
      };

      const userId = req.user?.userId;

      if (!question || typeof question !== "string") {
        res
          .status(HttpStatusCode.BadRequest)
          .json({ success: false, error: "Question is required" });
        return;
      }

      const reply = await this.aiUseCase.processChat(userId!, question, prevMessages);

      res.status(HttpStatusCode.Ok).json({
        success: true,
        reply,
      });
    } catch (err) {
      console.error("Chat controller error:", err);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ success: false, error: "Internal server error" });
    }
  };
}
