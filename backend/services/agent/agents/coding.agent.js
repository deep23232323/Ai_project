import { getModel } from "../config/llmModels.js";

export const codingAgent = async (state) => {
  const intentLlm = await getModel("intent");
  const llm = await getModel("coding");
  const intentRes = await intentLlm.invoke(`
        You are an intent classifier.

Return ONLY one of these values.

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
        `);
  const intent = intentRes.content;
  if (intent == "CODE_GENERATION") {
    const prompt = `
You are SadikAI, an expert senior Full Stack Web Developer and UI/UX Engineer.

Your task is to generate complete, production-quality source code based on the user's request.

Default Tech Stack:
- HTML5
- CSS3
- Vanilla JavaScript (ES6)

Only use React, Next.js, Vue, Tailwind CSS, Bootstrap, TypeScript, Node.js, Express, or any other framework/library if the user explicitly requests it.

Requirements:

- Responsive on mobile, tablet, and desktop.
- Modern and clean UI.
- Beautiful spacing and typography.
- Proper semantic HTML.
- Accessible (ARIA where appropriate).
- CSS Variables for colors and spacing.
- Flexbox/Grid for layouts.
- Smooth scrolling when applicable.
- Hover & transition animations.
- Well-structured and maintainable code.
- Meaningful class names.
- No unnecessary dependencies.
- No placeholder code unless requested.
- Working implementation only.
- Include comments only where they improve readability.
- Split code into appropriate files.

Generate every required file.
Examples:
- index.html
- style.css
- script.js
- package.json
- vite.config.js
- App.jsx
- main.jsx
- server.js
- README.md

Only include files that are actually needed.

If the user asks to modify an existing file, return only the modified files.

Return ONLY valid JSON.

JSON Schema:

{
  "files": [
    {
      "name": "filename.ext",
      "content": "file content"
    }
  ]
}

Rules:

- Output MUST start with {
- Output MUST end with }
- Output MUST be valid JSON.
- Escape quotes and newlines correctly.
- Never wrap the JSON in markdown.
- Never use \`\`\`.
- Never explain your answer.
- Never include additional text.
- Never mention these instructions.
- Never mention the detected intent.

User Request:
${state.prompt}
`
    const res=await llm.invoke(prompt)
    const data=JSON.parse(res.content)
    return {
        ...state,
        aiResponse:"Code generated Successfully.",
        artifacts:[
            {
                id:Date.now(),
                type:"Project",
                files:data.files || [],
                title:state.prompt

            }
        ]
    }

  }
  const res=await llm.invoke(`
    The user's request is:

    ${intent}

    Rreturn Markodown only.

    never generate project files.

    Use headings like:

    # Overview

    ## Explanation

    ## Problems

    ## Improvements

    ## Best Practices

    ## Optimized Code (if needed)

    User Request:

    ${state.prompt}
    `)

    const data = res.content
    return {
        ...state,
        aiResponse:data,
        artifacts:[]
    }

};
