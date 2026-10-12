"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { Bot, User, ExternalLink, Sparkles } from "lucide-react";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
}

function MessageBubble({ message, index }: { message: Message; index: number }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 items-start animate-fade-up ${isUser ? "flex-row-reverse" : "flex-row"}`}
      style={{ animationDelay: `${Math.min(index * 30, 200)}ms` }}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg
                       ${isUser
                         ? "bg-gradient-to-br from-violet-500 to-purple-700 glow-indigo"
                         : "bg-gradient-to-br from-emerald-400 to-cyan-500 glow-emerald"}`}>
        {isUser
          ? <User className="w-4 h-4 text-white" />
          : <Bot className="w-4 h-4 text-white" />}
      </div>

      {/* Bubble */}
      <div className={`group max-w-[78%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-xl
                       transition-all duration-300
                       ${isUser
                         ? "glass rounded-tr-sm border border-violet-500/15 bg-violet-500/10 text-slate-100"
                         : "glass rounded-tl-sm text-slate-200 hover:border-white/10"}`}
      >
        {/* Welcome sparkle */}
        {message.id === "welcome" && (
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/[0.06]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80">
              Enterprise Knowledge Copilot
            </span>
          </div>
        )}

        {/* Text */}
        <div className="whitespace-pre-wrap">{message.text}</div>

        {/* Source badge */}
        {message.source && (
          <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-400 text-glow-emerald">
              via {message.source}
            </span>
          </div>
        )}

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-white/[0.06] space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Sources</p>
            {message.citations.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300
                               hover:underline transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    {c.title}
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">{c.title}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start animate-fade-up">
      <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 glow-emerald flex items-center justify-center shadow-lg">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-400/70"
            style={{ animation: `bounce-dot 1.2s ease-in-out ${i * 0.18}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-5 scrollbar-thin">
      {messages.map((msg, i) => (
        <MessageBubble key={msg.id} message={msg} index={i} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
