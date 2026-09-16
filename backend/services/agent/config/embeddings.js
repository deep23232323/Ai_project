import dotenv from 'dotenv'
dotenv.config()
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Embeddings } from "@langchain/core/embeddings";

class SmartEmbeddings extends Embeddings {
  constructor() {
    super({});
    this.primary = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", // 768 dimensions
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }

  createFallbackVector(text) {
    const dim = 768;
    const vec = new Float32Array(dim);
    const words = (text || "").toLowerCase().match(/\w+/g) || [];
    for (let i = 0; i < words.length; i++) {
      let hash = 0;
      for (let j = 0; j < words[i].length; j++) {
        hash = ((hash << 5) - hash) + words[i].charCodeAt(j);
        hash |= 0;
      }
      const idx = Math.abs(hash) % dim;
      vec[idx] += 1;
    }
    let norm = 0;
    for (let i = 0; i < dim; i++) norm += vec[i] * vec[i];
    norm = Math.sqrt(norm) || 1;
    return Array.from(vec.map(v => v / norm));
  }

  async embedDocuments(documents) {
    try {
      return await this.primary.embedDocuments(documents);
    } catch (err) {
      console.warn("GoogleGenerativeAIEmbeddings failed, using fallback vectorizer:", err.message || err);
      return documents.map(doc => this.createFallbackVector(doc));
    }
  }

  async embedQuery(document) {
    try {
      return await this.primary.embedQuery(document);
    } catch (err) {
      console.warn("GoogleGenerativeAIEmbeddings query failed, using fallback vectorizer:", err.message || err);
      return this.createFallbackVector(document);
    }
  }
}

export const embeddings = new SmartEmbeddings();