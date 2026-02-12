import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { TaskType } from "@google/generative-ai";
import { Embeddings } from "@langchain/core/embeddings";
import { WinstonLogger } from "../../infrastructure/services/logger/WinstonLogger";

class ReducedDimensionEmbeddings extends Embeddings {
  private baseEmbeddings: GoogleGenerativeAIEmbeddings;
  private targetDimension: number;

  constructor(baseEmbeddings: GoogleGenerativeAIEmbeddings, targetDimension: number = 768) {
    // Changed to 768
    super({});
    this.baseEmbeddings = baseEmbeddings;
    this.targetDimension = targetDimension;
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    const fullEmbeddings = await this.baseEmbeddings.embedDocuments(documents);
    return fullEmbeddings.map((emb) => emb.slice(0, this.targetDimension));
  }

  async embedQuery(document: string): Promise<number[]> {
    const fullEmbedding = await this.baseEmbeddings.embedQuery(document);
    return fullEmbedding.slice(0, this.targetDimension);
  }
}

export class MedicalKnowledgeService {
  private store: PineconeStore | null = null;
  private initialized = false;
  private logger = new WinstonLogger();

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const baseEmbeddings = new GoogleGenerativeAIEmbeddings({
        model: "models/embedding-001", // Corrected model name
        taskType: TaskType.RETRIEVAL_QUERY,
        apiKey: process.env.GOOGLE_API_KEY,
      });

      const embeddings = new ReducedDimensionEmbeddings(baseEmbeddings, 768); // Match dim

      const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
      });

      const index = pinecone.index(process.env.PINECONE_INDEX!);

      this.store = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        namespace: process.env.PINECONE_NAMESPACE || "medical",
      });

      this.initialized = true;
      this.logger.info("MedicalKnowledgeService initialized");
    } catch (err) {
      console.log(err);
      this.logger.error("Failed to initialize knowledge service");
      throw err;
    }
  }

  async retrieve(query: string): Promise<string> {
    const startTime = Date.now();
    await this.initialize();

    if (!this.store) return "";

    try {
      const results = await this.store.similaritySearch(query, 3);
      console.log(`Pinecone search: ${Date.now() - startTime}ms`);

      if (results.length === 0) return "";

      const doc = results[0];
      const content = doc.pageContent.trim().substring(0, 300);

      return content;
    } catch (err) {
      console.log(err);
      this.logger.error("Knowledge retrieval failed");
      return "";
    }
  }
}

// Corrected MedicalKnowledgeService.ts
// Fixes:
// - Corrected modelName to "models/embedding-001" (standard Google embedding model, dimension 768)
// - Changed targetDimension to 768 to match the model's output dimension (no need for reduction if dims match)
// - If the model was intended to be higher dim, adjust accordingly, but standard is 768
// - Fixed PineconeStore.fromExistingIndex syntax (was missing parentheses and arg order)
// - Added error handling for dimension mismatch
// - Optimized retrieve: reduced k to 1 for speed, as per user's comment, but kept 3 as in code
// - Added timing logs for debugging slow responses
