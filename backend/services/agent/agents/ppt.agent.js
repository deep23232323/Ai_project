import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";
import { generatePpt } from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const pptAgent = async (state) => {
  try {
    const llm = await getModel("ppt");
    
const prompt = `You are a professional presentation designer.
 
Return ONLY valid JSON. No markdown, no explanation, no code block.
 
Format:
{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "layout": "bullets",          // one of: bullets | twoColumn | stat | quote | chart | section
      "title": "",
      "points": ["", "", "", ""]              // required if layout = bullets
    },
    {
      "layout": "twoColumn",
      "title": "",
      "columns": [
        { "heading": "", "points": ["", ""] },
        { "heading": "", "points": ["", ""] }
      ]
    },
    {
      "layout": "stat",
      "title": "",
      "stats": [ { "value": "", "label": "" } ]   // 2-4 items
    },
    {
      "layout": "quote",
      "quote": "",
      "source": ""
    },
    {
      "layout": "chart",
      "title": "",
      "chart": {
        "type": "bar",              // bar | pie | line
        "categories": ["", ""],
        "series": [ { "name": "", "values": [0,0] } ]
      }
    },
    {
      "layout": "section",
      "title": "",
      "subtitle": ""
    }
  ]
}
 
Rules:
- Generate exactly 6 content slides, choosing whichever layouts best fit the content
  (don't use "bullets" for every slide — vary it based on what the content calls for).
- Use "stat" only when there are real numbers/metrics to show.
- Use "chart" only when there is comparable numeric data across categories.
- Each "bullets" slide: 4-6 concise points.
- Return ONLY JSON.
 
Topic:
${state.prompt}`

    const res = await llm.invoke(prompt);

    const data = JSON.parse(res.content);
    await deductCredits(state.userId,"ppt")

    const ppt = await generatePpt(data);
    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });

    const filename = `ppt-${Date.now()}.pptx`;

    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );

    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `
# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 10 minutes._`,
    };
  } catch (error) {
    console.log(error);
    return {
        ...state,
        aiResponse:"Failed to generate PPT"
    }
  }
};
