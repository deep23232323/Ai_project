import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  Paperclip,
  Presentation,
  Send,
  Zap,
} from "lucide-react";
import { useState } from "react";
import sendMessage from "../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { addMessages, setArtifacts } from "../redux/messageSlice";
import { createConversation } from "../features/createConversation";
import {
  addConversation,
  setConversationTitle,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { updateConversation } from "../features/updateConversation";

function ChatInput() {
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const [valuee, setValuee] = useState("");
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    const message = valuee.trim();

    if (!message) return;

    setValuee(""); // Clear immediately

    let conversation = selectedConversation;

    if (!selectedConversation) {
      const conv = await createConversation();
      dispatch(setSelectedConversation(conv));
      dispatch(addConversation(conv));
      conversation = conv;
    }

    if (conversation.title === "New Chat") {
      await updateConversation({
        id: conversation._id,
        title: message,
      });

      dispatch(
        setConversationTitle({
          conversationId: conversation._id,
          title: message.slice(0, 40),
        }),
      );
    }

    dispatch(addMessages({ role: "user", content: message }));

    const payload = {
      prompt: message,
      conversationId: conversation._id,
      agent: selectedAgent.toLowerCase(),
    };

    try {
      const data = await sendMessage(payload);
      dispatch(setArtifacts(data.artifacts || []));

      dispatch(
        addMessages({
          role: "assistant",
          content: data?.answer,
          images: data?.images,
        }),
      );
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding",
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },
    {
      id: "image",
      icon: ImageIcon,
      label: "Image",
    },
    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
  ];
  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent, i) => {
            const isActive = selectedAgent === agent.label;
            const Icon = agent.icon;
            return (
              <div
                key={i}
                onClick={() => setSelectedAgent(agent.label)}
                className={`
                cursor-pointer
                flex-shrink-0
                inline-flex
                items-center
                gap-1.5
                px-3
                py-2
                rounded-full
                text-xs
                font-medium
                border
                transition-all
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                    : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
                }`}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-white" : "text-slate-500"}
                />

                {agent.label}
              </div>
            );
          })}
        </div>

        <textarea
          placeholder="Ask Anything..."
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          disabled={false}
          rows={3}
          value={valuee}
          onChange={(e) => setValuee(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600
    hover:text-slate-400 hover:bg-white/[0.05]
    border border-transparent hover:border-white/[0.06]
    transition-all duration-150 bg-transparent cursor-pointer"
            >
              <Paperclip size={16} />
            </button>

            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600
    hover:text-slate-400 hover:bg-white/[0.05]
    border border-transparent hover:border-white/[0.06]
    transition-all duration-150 bg-transparent cursor-pointer"
            >
              <Mic size={16} />
            </button>
          </div>
          <button
            disabled={!valuee.trim()}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none transition-all duration-150 ${
              valuee.trim()
                ? "bg-gradient-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white cursor-pointer"
                : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
            }`}
          >
            {/* Icon */}
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
