import redis from "../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";

export const getMemory = async (conversationId) => {
    const key = `messages-${conversationId}`;
    const cached = await redis.get(key);
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            console.error("Error parsing cached memory:", e);
        }
    }
    
    const messages = await getMessages(conversationId);
    const validMessages = Array.isArray(messages) ? messages : [];
    await redis.set(key, JSON.stringify(validMessages), "EX", 24 * 60 * 60);

    return validMessages;
};

export const addMessage = async (conversationId, role, content) => {
    const key = `messages-${conversationId}`;
    const rawMessages = await redis.get(key);

    let messages = [];
    if (rawMessages) {
        try {
            const parsed = JSON.parse(rawMessages);
            if (Array.isArray(parsed)) {
                messages = parsed;
            }
        } catch (e) {
            messages = [];
        }
    }

    messages.push({
        role, content
    });

    if (messages.length > 20) {
        messages.shift();
    }

    await redis.set(key, JSON.stringify(messages));
};