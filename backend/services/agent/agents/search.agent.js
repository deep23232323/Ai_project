import { searchTool } from "../config/tavily.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";


export const searchAgent=async(state) => {
    try {
        
        await checkAgentLimit(state.userId, "search")

        const results=await searchTool.invoke({
            query:state.prompt
        })
    await deductCredits(state.userId,"search")

const context = results.results
    .map(r => `Title: ${r.title}\nContent: ${r.content}`)
    .join("\n\n");

        return {
            ...state,
            searchResults:context,
            images:results.images
        }
        
    } catch (error) {
        return {
        ...state,
        aiResponse:error?.data?.message || "failed to search response ",
        searchResults:[],
        images:[]
    
  }
       
        
    }
    
}