"use client";

import { BrainCircuit, ChevronRight, Cpu, Layers, Zap } from "lucide-react";

const WORKFLOW_STEPS = [
  { label: "Route question", icon: "→" },
  { label: "Retrieve private KB", icon: "⬇" },
  { label: "Grade evidence", icon: "✓" },
  { label: "Web fallback if weak", icon: "⟳" },
  { label: "Rewrite & retry", icon: "↺" },
  { label: "Grounded answer", icon: "★" },
];

interface SidebarProps {
  onOpenUpload: () => void;
}

export default function Sidebar({ onOpenUpload }: SidebarProps) {
  return (
    <aside className="relative flex flex-col gap-6 glass-strong p-6 min-h-0 overflow-hidden border-r border-white/[0.06]">
      {/* Decorative corner glow */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand */}
      <div className="relative space-y-4">
        {/* Badge */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 neon-border">
            <BrainCircuit className="w-4.5 h-4.5 text-emerald-400" />
            <div className="absolute inset-0 rounded-xl bg-emerald-500/5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-emerald-400/80 uppercase">FDE Project</div>
            <div className="text-[10px] text-slate-600 tracking-wide">v1.0 · Production</div>
          </div>
        </div>

        <h1 className="text-[22px] font-black leading-tight tracking-tight">
          <span className="text-white">IT Support</span>
          <br />
          <span className="gradient-text">Agentic RAG</span>
        </h1>

        <p className="text-xs text-slate-500 leading-relaxed">
          Private knowledge-first. External web fallback when evidence grades as weak.
        </p>

        {/* Stats row */}
        <div className="flex gap-2 pt-1">
          {[
            { icon: <Cpu className="w-3 h-3" />, label: "GPT-4o" },
            { icon: <Layers className="w-3 h-3" />, label: "Pinecone" },
            { icon: <Zap className="w-3 h-3" />, label: "Tavily" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass-card text-[10px] font-medium text-slate-400"
            >
              <span className="text-emerald-400">{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Workflow */}
      <div className="relative flex-1 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-3 px-1">
          LangGraph Workflow
        </p>
        {WORKFLOW_STEPS.map((step, i) => (
          <div
            key={i}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl
                       hover:bg-white/[0.04] transition-all duration-200 cursor-default"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Step number with connecting line */}
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black
                              bg-emerald-500/10 border border-emerald-500/20 text-emerald-400
                              group-hover:bg-emerald-500/20 group-hover:border-emerald-400/40 transition-all">
                {i + 1}
              </div>
              {i < WORKFLOW_STEPS.length - 1 && (
                <div className="w-px h-3.5 bg-gradient-to-b from-emerald-500/20 to-transparent mt-1" />
              )}
            </div>
            <span className="text-[12px] text-slate-400 group-hover:text-slate-200 transition-colors flex-1">
              {step.label}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Upload button */}
      <button
        onClick={onOpenUpload}
        className="relative group w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl
                   glass-card border border-white/[0.08] text-sm font-semibold text-slate-300
                   hover:border-emerald-500/40 hover:text-emerald-400
                   hover:shadow-lg hover:shadow-emerald-500/10
                   transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <span className="text-emerald-400 text-base">+</span>
        Add Company Document
      </button>
    </aside>
  );
}
