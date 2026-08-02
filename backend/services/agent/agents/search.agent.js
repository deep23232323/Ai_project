import { searchTool } from "../config/tavily.js";

export const searchAgent=async(state) => {
    try {
        
        const results=await searchTool.invoke({
            query:state.prompt
        })

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
            searchResults:[],
            images:[]
        }
        
    }
    
}