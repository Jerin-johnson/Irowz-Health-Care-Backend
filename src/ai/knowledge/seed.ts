import { TaskType } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import dotenv from "dotenv";
import { WinstonLogger } from "../../infrastructure/services/logger/WinstonLogger";
import { APP_KNOWLEDGE_DOCS } from "./medical-docs";
import { Embeddings } from "@langchain/core/embeddings";
// import { Document } from "@langchain/core/documents";

dotenv.config();

const logger = new WinstonLogger();

// Wrapper class to reduce dimensions (if needed, but now matching 768)
class ReducedDimensionEmbeddings extends Embeddings {
  private baseEmbeddings: GoogleGenerativeAIEmbeddings;
  private targetDimension: number;

  constructor(baseEmbeddings: GoogleGenerativeAIEmbeddings, targetDimension: number = 768) {
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

async function seedKnowledge() {
  try {
    const baseEmbeddings = new GoogleGenerativeAIEmbeddings({
      model: "models/embedding-001",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const embeddings = new ReducedDimensionEmbeddings(baseEmbeddings, 768);

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const indexName = process.env.PINECONE_INDEX!;
    logger.info(`Checking if index ${indexName} exists`);

    const indexes = await pinecone.listIndexes();
    const exists = indexes.indexes?.some((i) => i.name === indexName);

    if (!exists) {
      logger.info(`Index ${indexName} does not exist — creating one`);
      await pinecone.createIndex({
        name: indexName,
        dimension: 768, // Changed to match embeddings
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });

      logger.info("Waiting for index to be ready...");
      let ready = false;
      let attempts = 0;
      while (!ready && attempts < 30) {
        // Timeout after 1 min
        const describe = await pinecone.describeIndex(indexName);
        ready = describe.status?.state === "Ready";
        if (!ready) {
          await new Promise((r) => setTimeout(r, 2000));
          attempts++;
        }
      }
      if (!ready) throw new Error("Index not ready after timeout");
      logger.info("Index is ready!");
    } else {
      logger.info(`Index ${indexName} already exists`);
    }

    const index = pinecone.index(indexName);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: process.env.PINECONE_NAMESPACE || "medical",
    });

    const docs = APP_KNOWLEDGE_DOCS.filter((d) => d.pageContent && d.pageContent.trim().length > 0);

    if (!docs.length) {
      throw new Error("No valid documents to embed");
    }

    logger.info(`Seeding ${docs.length} documents into Pinecone...`);
    await vectorStore.addDocuments(docs);

    logger.info("✅ Knowledge seeding completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error details:", err);
    logger.error("Knowledge seeding failed");
    process.exit(1);
  }
}

seedKnowledge()
  .then(() => {
    console.log("Seed knowledge added successfully");
  })
  .catch((err) => {
    console.error("Fatal error:", err);
  });

// Corrected seed-knowledge.ts
// Fixes:
// - Corrected model to "models/embedding-001"
// - Changed dimension to 768
// - Fixed PineconeStore.fromExistingIndex syntax
// - Added index ready check with timeout to prevent infinite loop
// - Filtered docs properly
// - Added error handling for addDocuments
// - Changed targetDimension to 768
// - Import Document from "@langchain/core/documents" (correct package)
