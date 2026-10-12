"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Sparkles, Keyboard } from "lucide-react";

const EXAMPLES = [
  "How do I connect to the company VPN?",
  "What is our password reset policy?",
  "What is the latest Microsoft Teams outage guidance?",
];

interface ComposerProps {
  onSend: (question: string) => void;
  isLoading: boolean;
}

export default function Composer({ onSend, isLoading }: ComposerProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const submit = () => {
    const q = value.trim();
    if (!q || isLoading) return;
    onSend(q);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="px-8 pb-6 pt-3 space-y-3">
      {/* Example chips */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => onSend(ex)}
            disabled={isLoading}
            className="group flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-medium
                       glass-card border border-white/[0.07] text-slate-500
                       hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/[0.06]
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            <Sparkles className="w-3 h-3 text-amber-400/60 group-hover:text-amber-400 transition-colors" />
            {ex}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className={`relative rounded-2xl transition-all duration-300
                       ${focused
                         ? "neon-border shadow-lg shadow-emerald-500/10"
                         : "border border-white/[0.07]"}
                       glass`}>

        {/* Animated top border */}
        {focused && (
          <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
        )}

        <div className="flex items-end gap-3 p-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={isLoading}
            rows={1}
            placeholder="Ask an IT support question…"
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200
                       placeholder-slate-600 resize-none py-2 px-2 leading-relaxed
                       disabled:opacity-40 disabled:cursor-not-allowed font-[inherit]"
          />

          {/* Send button */}
          <button
            onClick={submit}
            disabled={!value.trim() || isLoading}
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl
                       bg-gradient-to-br from-emerald-400 to-cyan-500
                       hover:from-emerald-300 hover:to-cyan-400
                       disabled:opacity-20 disabled:cursor-not-allowed
                       transition-all duration-200
                       shadow-lg shadow-emerald-500/30
                       hover:shadow-xl hover:shadow-emerald-500/40
                       hover:scale-105 active:scale-95
                       animate-pulse-glow"
            style={{ animationPlayState: value.trim() && !isLoading ? "running" : "paused" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Bottom hint */}
        <div className="flex items-center justify-between px-5 pb-3 pt-0">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
            <Keyboard className="w-3 h-3" />
            <span>Enter to send · Shift+Enter new line</span>
          </div>
          <span className={`text-[10px] tabular-nums transition-colors ${value.length > 2700 ? "text-amber-500" : "text-slate-700"}`}>
            {value.length}/3000
          </span>
        </div>
      </div>
    </div>
  );
}
