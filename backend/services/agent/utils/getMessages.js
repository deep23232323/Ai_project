import axios from "axios";

export const getMessages = async(conversation_id) => {
    try {
        const {data} = await axios.get(`${process.env.CHAT_SERVICE}/get-messages/${conversation_id}`)
        return data
    } catch (error) {
        console.log(error)
        return null
        
    }
}