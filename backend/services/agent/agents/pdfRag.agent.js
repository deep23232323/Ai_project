import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import { vectorStore } from "../config/vectordb.js";
import { getModel } from "../config/llmModels.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";
import { convertToProtocolEvent } from "@langchain/langgraph";

export const pdfRag = async (state) => {
  try {
    console.log("entered pdfRag agent")
    await checkAgentLimit(state.userId, "pdf")

    const buffer = fs.readFileSync(state.file.path);
    console.log("pdf buffer read successfully")
    const pdf = new PDFParse({ data: buffer });

    const result = await pdf.getText();
    const text = result.text;
    console.log(text)

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await splitter.createDocuments([text]);

    const collectionName = `pdf-${Date.now()}`;
    console.log("collectionName", collectionName)
    const store = await vectorStore(docs, collectionName);
    console.log(store)

    const relevantDocument = await store.similaritySearch(state.prompt, 5);
    const context = relevantDocument.map((d) => d.pageContent).join("\n\n");

    const llm = await getModel("pdfRag");

    const messages = [
      new SystemMessage(`You are SadikAi PDF Assistant.

Rules:
- Answer ONLY from the uploaded PDF.
- Never make up information.
- If the answer is not present in the PDF, reply:
"I couldn't find this information in the uploaded PDF."
- Use Markdown formatting.
`),
      new HumanMessage(`
    Context:${context}
    Question:${state.prompt}
    `),
    ];

    const response = await llm.invoke(messages);
    await deductCredits(state.userId, "pdf");
    

    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
     return {
        ...state,
        aiResponse:error?.data?.message || "failed to analyze pdf "
    
  }
  } finally {
    fs.unlinkSync(state.file.path);
  }
};