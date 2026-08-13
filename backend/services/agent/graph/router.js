import { getModel } from "../config/llmModels.js";
import { agent } from "../controllers/agent.controller.js";

export const router = async (state) => {
  if(state.agent && state.agent!=="auto"){
    return {
      ...state,
      agent:state.agent
    }
  }

  if (state.file.mimetype === "application/pdf") {
    return {
        ...state,
        agent: "pdfRag"
    };
}

if (state.file.mimetype.startsWith("image/")) {
    return {
        ...state,
        agent: "imageAnalyzer"
    };
}


  const llm = getModel("router");

  const prompt = `You are an intent classifier that routes user requests to the correct agent.

Available agents:

- chat
  Use for:
  - General conversation
  - Explanations
  - Learning concepts
  - Q&A
  - Advice
  - Brainstorming

- search
  Use for:
  - Current events
  - Latest news
  - Recent developments
  - Internet lookup
  - Live or time-sensitive information

- coding
  Use for:
  - Writing code
  - Debugging
  - Code review
  - Software architecture
  - APIs
  - Programming questions
  - Building applications

- pdf
  Use for:
  - Generating PDFs
  - Editing PDFs
  - Questions about PDF documents
  - Extracting or summarizing PDF content

- ppt
  Use for:
  - Generating PowerPoint presentations
  - Editing presentations
  - Questions about slides or PPT files

- vision
  Use for:
  - Creating images
  - Generating illustrations
  - Image editing
  - Image analysis

Rules:
1. Choose the single best matching agent.
2. Return exactly one word.
3. Do not explain your choice.
4. Do not output punctuation, markdown, or extra text.
5. Valid outputs are only:
   - chat
   - search
   - coding
   - pdf
   - ppt
   - vision

User Query:
${state.prompt}

    `;



  const response = await llm.invoke(prompt);

  return {
    ...state,
    agent: response.content.trim().toLowerCase(),
  };
};
