import dotenv from "dotenv";
dotenv.config();

import { QdrantVectorStore } from "@langchain/qdrant";
import { VectorStore } from "@langchain/core/vectorstores";
import { embeddings } from "./embeddings.js";

class MemoryVectorStoreFallback extends VectorStore {
  _vectorstoreType() {
    return "memory";
  }

  constructor(docs, embeddingsInstance) {
    super(embeddingsInstance, {});
    this.docs = docs;
  }

  async similaritySearch(query, k = 5) {
    try {
      const queryVec = await this.embeddings.embedQuery(query);
      const docVecs = await this.embeddings.embedDocuments(this.docs.map(d => d.pageContent));
      
      const scoredDocs = this.docs.map((doc, idx) => {
        const docVec = docVecs[idx];
        let score = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < queryVec.length; i++) {
          score += queryVec[i] * docVec[i];
          normA += queryVec[i] * queryVec[i];
          normB += docVec[i] * docVec[i];
        }
        const sim = score / ((Math.sqrt(normA) * Math.sqrt(normB)) || 1);
        return { doc, score: sim };
      });

      scoredDocs.sort((a, b) => b.score - a.score);
      return scoredDocs.slice(0, k).map(s => s.doc);
    } catch (err) {
      console.warn("Similarity search fallback using keyword matching:", err.message || err);
      const words = (query || "").toLowerCase().split(/\s+/).filter(Boolean);
      const scored = this.docs.map(doc => {
        const text = (doc.pageContent || "").toLowerCase();
        let matches = 0;
        for (const w of words) {
          if (text.includes(w)) matches++;
        }
        return { doc, score: matches };
      });
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, k).map(s => s.doc);
    }
  }
}

export const vectorStore = async (docs, collectionName) => {
  try {
    return await QdrantVectorStore.fromDocuments(
      docs,
      embeddings,
      {
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
        collectionName,
      }
    );
  } catch (err) {
    console.warn("Qdrant store failed, falling back to local memory vector store:", err.message || err);
    return new MemoryVectorStoreFallback(docs, embeddings);
  }
};