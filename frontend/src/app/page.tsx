"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import Composer from "@/components/Composer";
import TracePanel from "@/components/TracePanel";
import UploadModal from "@/components/UploadModal";
import { Bot, Zap, Wifi, Menu, X } from "lucide-react";

// Load canvas background client-side only (no SSR)
const NeuralBackground = dynamic(() => import("@/components/NeuralBackground"), { ssr: false });

export default function Home() {
  const { messages, trace, sourceUsed, isLoading, sendMessage } = useChat();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden">

      {/* ── Animated neural background ── */}
      <NeuralBackground />

      {/* ── Radial gradient overlays ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Top-left emerald bloom */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full
                        bg-gradient-radial from-emerald-500/8 to-transparent blur-3xl" />
        {/* Bottom-right indigo bloom */}
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full
                        bg-gradient-radial from-indigo-600/6 to-transparent blur-3xl" />
        {/* Center cyan accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[800px] h-[400px] rounded-full
                        bg-gradient-radial from-cyan-500/3 to-transparent blur-3xl" />
        {/* Vignette */}
        <div className="absolute inset-0"
             style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(4,6,8,0.7) 100%)" }} />
      </div>

      {/* ── 3-Column layout ── */}
      <div className="relative flex w-full h-full" style={{ zIndex: 2 }}>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── LEFT: Sidebar ── */}
        <div className={`
          fixed lg:relative top-0 left-0 h-full z-50 lg:z-auto
          w-[260px] flex-shrink-0 transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <Sidebar onOpenUpload={() => { setUploadOpen(true); setSidebarOpen(false); }} />
        </div>

        {/* ── CENTER: Chat ── */}
        <main className="flex flex-col flex-1 min-w-0">
          {/* Top bar */}
          <header className="flex items-center justify-between px-5 lg:px-8 h-[60px] flex-shrink-0
                             glass-strong border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg
                           glass-card text-slate-500 hover:text-white transition-colors"
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

              {/* Title with pulse */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
                </div>
                <span className="text-sm font-semibold text-slate-200 hidden sm:block">
                  Enterprise Knowledge Copilot
                </span>
                <span className="text-sm font-semibold text-slate-200 sm:hidden">
                  Knowledge Copilot
                </span>
              </div>
            </div>

            {/* Right badges */}
            <div className="flex items-center gap-2">
              <div className="status-badge glass-card border border-white/[0.07] text-slate-400">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Live</span>
              </div>
              <div className="status-badge glass-card border border-white/[0.07] text-slate-400">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Agentic RAG</span>
              </div>
              <div className="status-badge glass-card border border-white/[0.07] text-slate-400">
                <Bot className="w-3 h-3 text-indigo-400" />
                <span className="hidden sm:inline">LangGraph</span>
              </div>
              {/* Mobile trace toggle */}
              <button
                onClick={() => setTraceOpen(!traceOpen)}
                className="xl:hidden status-badge glass-card border border-white/[0.07] text-slate-400
                           hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                Trace
              </button>
            </div>
          </header>

          {/* Messages */}
          <ChatArea messages={messages} isLoading={isLoading} />

          {/* Composer */}
          <Composer onSend={sendMessage} isLoading={isLoading} />
        </main>

        {/* ── RIGHT: Trace panel ── */}
        <div className={`
          fixed xl:relative top-0 right-0 h-full z-50 xl:z-auto
          w-[280px] flex-shrink-0 transition-transform duration-300 ease-out
          ${traceOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"}
        `}>
          {traceOpen && (
            <div className="xl:hidden absolute top-4 left-4 z-10">
              <button
                onClick={() => setTraceOpen(false)}
                className="w-7 h-7 glass-card rounded-lg flex items-center justify-center
                           text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <TracePanel trace={trace} sourceUsed={sourceUsed} />
        </div>
      </div>

      {/* ── Upload modal ── */}
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
