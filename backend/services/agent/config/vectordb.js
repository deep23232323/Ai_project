import dotenv from "dotenv";
dotenv.config();

import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings.js";

export const vectorStore = async (docs, collectionName) => {
  console.log("QDRANT_URL:", process.env.QDRANT_URL);
  console.log("QDRANT_API_KEY exists:", !!process.env.QDRANT_API_KEY);

  return await QdrantVectorStore.fromDocuments(
    docs,
    embeddings,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName,
    }
  );
};