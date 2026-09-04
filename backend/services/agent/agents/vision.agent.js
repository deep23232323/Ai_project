import axios from "axios";
import { getModel } from "../config/llmModels.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const visionAgent=async(state) => {
    try {

      await checkAgentLimit(state.userId, "image")

        
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
await deductCredits(state.userId,"vidion")

console.log(imageRes)

const buffer=Buffer.from(imageRes.data)
const filename=`${Date.now()}.png`
await uploadToS3(filename, buffer, "image/png")
const downloadUrl = await getFromS3(filename,24*60)

return {
  ...state,
  aiResponse: `
 🎨

![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})

⏳ Link expires in 10 minutes.`
}
        
   } catch (error) {
 return {
        ...state,
        aiResponse:error?.data?.message || "failed to generate image "
    
  }
}
}