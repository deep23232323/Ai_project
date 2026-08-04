import axios from "axios";
import { getModel } from "../config/llmModels.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";

export const visionAgent=async(state) => {
    try {
        
    const llm=await getModel("image")
    const res = await llm.invoke(`
Create a concise image generation prompt.

Maximum 50 words.

User:
${state.prompt}
`);
const prompt=res.content.trim()

const imageUrl=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
console.log("Requesting:", imageUrl);
const imageRes=await axios.get(imageUrl, {responseType:"arraybuffer"})

const buffer=Buffer.from(imageRes.data)
const filename=`${Date.now()}.png`
await uploadToS3(filename, buffer, "image/png")
const downloadUrl = await getFromS3(filename,24*60*60)

return {
  ...state,
  aiResponse: `
# 🎨 Image Generated Successfully

![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})

⏳ Link expires in 10 minutes.`
}
        
   } catch (err) {
  let errorDetail = err.message;

  if (err.response?.data) {
    const data = err.response.data;
    if (Buffer.isBuffer(data)) {
      errorDetail = data.toString("utf-8");
    } else if (typeof data === "object") {
      errorDetail = JSON.stringify(data);
    } else {
      errorDetail = String(data);
    }
  }

  console.error("Vision Agent Error:", errorDetail);

  return {
    ...state,
    aiResponse: `⚠️ Sorry, I couldn't generate the image right now. The image service returned an error. Please try again in a moment.`
  };
}
}