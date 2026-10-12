"use client";

import { Network, CheckCircle2, Clock, GitBranch, Activity } from "lucide-react";

interface TracePanelProps {
  trace: string[];
  sourceUsed: string;
}

const SOURCE_STYLES: Record<string, { color: string; dot: string; label: string }> = {
  "Running…": { color: "text-amber-400", dot: "bg-amber-400", label: "Running" },
  "Error":    { color: "text-red-400",   dot: "bg-red-400",   label: "Error" },
  "—":        { color: "text-slate-600", dot: "bg-slate-700", label: "Idle" },
};

export default function TracePanel({ trace, sourceUsed }: TracePanelProps) {
  const style = SOURCE_STYLES[sourceUsed] ?? { color: "text-emerald-400", dot: "bg-emerald-400", label: sourceUsed };
  const isDone = !["Running…", "—", "Error"].includes(sourceUsed);
  const isRunning = sourceUsed === "Running…";

  return (
    <aside className="relative flex flex-col glass-strong border-l border-white/[0.06] p-6 overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/08 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="relative">
            <Network className="w-4 h-4 text-indigo-400" />
            {isRunning && (
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          <h2 className="font-bold text-sm text-white tracking-tight">Agent Trace</h2>
          {isRunning && (
            <div className="ml-auto">
              <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
            </div>
          )}
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Live LangGraph decision steps
        </p>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>

      {/* Steps */}
      <div className="relative flex-1 overflow-y-auto scrollbar-thin space-y-2.5 pb-4">
        {trace.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="w-10 h-10 rounded-2xl glass-card flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">No request yet</p>
              <p className="text-[10px] text-slate-700 mt-0.5">Send a message to see the agent think</p>
            </div>
          </div>
        ) : (
          trace.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 px-3 py-3 rounded-xl glass-card
                         hover:border-white/10 transition-all duration-200 animate-slide-right"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Step icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isRunning && i === trace.length - 1 ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/60" />
                )}
              </div>

              {/* Step number + text */}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-slate-600 mb-0.5 font-mono">
                  STEP {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed break-words">{item}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Source box */}
      <div className="relative mt-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-4" />
        <div className={`rounded-xl glass-card p-4 transition-all duration-500
                         ${isDone ? "border-emerald-500/20 bg-emerald-500/[0.04]" : ""}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Final Source</p>
            {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot} ${isRunning ? "animate-ping" : ""}`} />
            <span className={`text-sm font-bold ${style.color}`}>{sourceUsed}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
