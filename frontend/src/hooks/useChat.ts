"use client";

import { useState, useRef, useCallback } from "react";
import { Message, ChatResponse } from "@/types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [trace, setTrace] = useState<string[]>([]);
  const [sourceUsed, setSourceUsed] = useState<string>("—");
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim() || isLoading) return;
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", text: question }]);
    setTrace(["Running LangGraph workflow..."]);
    setSourceUsed("Running…");
    setIsLoading(true);
    abortRef.current = new AbortController();
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }), signal: abortRef.current.signal });
      const data: ChatResponse = await res.json();
      if (!res.ok) throw new Error((data as unknown as { detail?: string }).detail ?? "Request failed");
      setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: "assistant", text: data.answer, source: data.source_used, citations: data.citations ?? [] }]);
      setTrace(data.trace ?? []);
      setSourceUsed(data.source_used);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const errorText = err instanceof Error ? err.message : "Unknown error";
      setMessages((prev) => [...prev, { id: `error-${Date.now()}`, role: "assistant", text: `Error: ${errorText}` }]);
      setTrace(["Request failed"]);
      setSourceUsed("Error");
    } finally { setIsLoading(false); }
  }, [isLoading]);

  return { messages, trace, sourceUsed, isLoading, sendMessage };
}
