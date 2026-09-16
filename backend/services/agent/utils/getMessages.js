import axios from "axios";

export const getMessages = async (conversation_id) => {
    try {
        const { data } = await axios.get(`${process.env.CHAT_SERVICE}/get-messages/${conversation_id}`);
        if (Array.isArray(data)) return data;
        if (data?.messages && Array.isArray(data.messages)) return data.messages;
        return [];
    } catch (error) {
        console.error("getMessages error:", error?.message || error);
        return [];
    }
};