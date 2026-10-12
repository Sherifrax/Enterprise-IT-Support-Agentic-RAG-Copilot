"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { ArrowUpRight, BookOpen, Bot, UserRound } from "lucide-react";

interface ChatAreaProps { messages: Message[]; isLoading: boolean; }

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part);
}

function MessageText({ text, isUser }: { text: string; isUser: boolean }) {
  if (isUser) return <div className="message-text">{text}</div>;
  return <div className="message-text">{text.split("\n").map((line, i) => {
    if (!line.trim()) return <div className="message-spacer" key={i} />;
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    if (bullet) return <div className="message-list-row" key={i}><span className="message-list-number">•</span><span>{inline(bullet[1])}</span></div>;
    const numbered = line.match(/^\s*(\d+)\.\s+(.+)$/);
    if (numbered) return <div className="message-list-row" key={i}><span className="message-list-number">{numbered[1]}.</span><span>{inline(numbered[2])}</span></div>;
    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (heading) return <div className="message-heading" key={i}>{inline(heading[1])}</div>;
    return <div className="message-line" key={i}>{inline(line)}</div>;
  })}</div>;
}

export default function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (messages.length) bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, isLoading]);

  return <div className="chat-area" aria-live="polite">
    {messages.length === 0 && !isLoading ? <div className="chat-empty"><div className="chat-empty-icon"><BookOpen size={25} strokeWidth={1.6} /></div><span className="chat-empty-index">01 / START HERE</span><h3>Your company knowledge,<br /><em>on call.</em></h3><p>Try a question below or ask your own. The agent will show which sources it used and why.</p><div className="chat-empty-decoration"><span /><span /><span /></div></div> : messages.map((message) => <div className={`message ${message.role === "user" ? "message-user" : "message-assistant"}`} key={message.id}><div className="message-avatar">{message.role === "user" ? <UserRound size={16} /> : <Bot size={16} />}</div><div className="message-body"><span className="message-label">{message.role === "user" ? "YOU" : "NOVARETAIL AGENT"}</span><MessageText text={message.text} isUser={message.role === "user"} />{message.source && <div className="message-source"><span className="message-source-dot" /> SOURCE / {message.source}</div>}{message.citations && message.citations.length > 0 && <div className="message-citations"><strong>REFERENCES</strong>{message.citations.map((c, i) => c.url ? <a href={c.url} key={i} target="_blank" rel="noopener noreferrer">{c.title} <ArrowUpRight size={13} /></a> : <span key={i}>{c.title}</span>)}</div>}</div></div>)}
    {isLoading && <div className="message message-assistant"><div className="message-avatar"><Bot size={16} /></div><div className="message-body"><span className="message-label">NOVARETAIL AGENT</span><div className="typing-dots"><span /><span /><span /></div></div></div>}
    <div ref={bottomRef} />
  </div>;
}
