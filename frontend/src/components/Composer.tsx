"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { ArrowUpRight, CornerDownLeft } from "lucide-react";

const EXAMPLES = ["How do I connect to the company VPN?", "What is our password reset policy?", "What is the latest Microsoft Teams outage guidance?"];
interface ComposerProps { onSend: (question: string) => void; isLoading: boolean; }

export default function Composer({ onSend, isLoading }: ComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const el = textareaRef.current; if (el) { el.style.height = "auto"; el.style.height = `${Math.min(el.scrollHeight, 140)}px`; } }, [value]);
  const submit = () => { const q = value.trim(); if (!q || isLoading) return; onSend(q); setValue(""); };
  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } };
  return <div className="composer-wrap"><div className="example-label">TRY A QUESTION <span>↘</span></div><div className="examples">{EXAMPLES.map((ex, i) => <button key={ex} onClick={() => onSend(ex)} disabled={isLoading} type="button"><span>0{i + 1}</span>{ex}<ArrowUpRight size={13} /></button>)}</div><div className="composer"><textarea ref={textareaRef} value={value} onChange={(e) => setValue(e.target.value.slice(0, 3000))} onKeyDown={handleKey} disabled={isLoading} rows={1} aria-label="Ask an IT support question" placeholder="Ask anything about IT support..." /><button onClick={submit} disabled={!value.trim() || isLoading} aria-label="Send question" type="button"><ArrowUpRight size={20} /></button></div><div className="composer-hint"><span><CornerDownLeft size={12} /> Enter to send · Shift + Enter for a new line</span><span>{value.length} / 3000</span></div></div>;
}
