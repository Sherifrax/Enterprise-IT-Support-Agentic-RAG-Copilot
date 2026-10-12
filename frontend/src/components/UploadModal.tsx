"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { IngestResponse } from "@/types";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

type UploadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: IngestResponse }
  | { status: "error"; message: string };

export default function UploadModal({ open, onClose }: UploadModalProps) {
  const [adminKey, setAdminKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => setFile(f), []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const upload = async () => {
    if (!file) return;
    setState({ status: "loading" });
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "X-Admin-Key": adminKey },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Upload failed");
      setState({ status: "success", data });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  const reset = () => {
    setFile(null);
    setState({ status: "idle" });
    setAdminKey("");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Decorative glow behind modal */}
      <div className="absolute pointer-events-none w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative w-full max-w-[500px] rounded-2xl glass-strong shadow-2xl animate-scale-in overflow-hidden">
        {/* Top neon line */}
        <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Ingest Company Document</h2>
              <p className="text-[10px] text-slate-600 mt-0.5">RAG Knowledge Base</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl glass-card flex items-center justify-center
                       text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Upload PDF, TXT, Markdown, or DOCX. The document is automatically chunked, embedded via
            <span className="text-emerald-400/80"> text-embedding-3-small</span>, and indexed into
            <span className="text-indigo-400/80"> Pinecone</span>.
          </p>

          {/* Admin key */}
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">
              <ShieldCheck className="w-3 h-3" />
              Admin API Key
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key to authorize"
              className="w-full px-4 py-3 rounded-xl glass-card border border-white/[0.07] text-sm text-slate-200
                         placeholder-slate-700 outline-none font-[inherit]
                         focus:border-emerald-500/30 focus:shadow-lg focus:shadow-emerald-500/10 transition-all"
            />
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl py-10 cursor-pointer
                        border-2 border-dashed transition-all duration-300
                        ${dragging
                          ? "border-emerald-400/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                          : "border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.02]"}`}
          >
            {dragging && (
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 animate-pulse" />
            )}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                             ${dragging ? "bg-emerald-500/20 glow-emerald" : "glass-card"}`}>
              <Upload className={`w-5 h-5 transition-colors ${dragging ? "text-emerald-400" : "text-slate-500"}`} />
            </div>
            {file ? (
              <div className="text-center">
                <p className="text-sm font-semibold text-emerald-400">{file.name}</p>
                <p className="text-xs text-slate-600 mt-1">{(file.size / 1024).toFixed(1)} KB · Ready to index</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">Drop file here or click to browse</p>
                <p className="text-xs text-slate-600 mt-1">.pdf · .txt · .md · .docx</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.docx"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>

          {/* Status messages */}
          {state.status === "success" && (
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] animate-fade-up">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-300">Successfully indexed!</p>
                <p className="text-xs text-emerald-500 mt-0.5">
                  <strong>{state.data.file}</strong> — {state.data.chunks} chunks · {state.data.ids_created} vectors created
                </p>
              </div>
            </div>
          )}
          {state.status === "error" && (
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-red-500/20 bg-red-500/[0.07] animate-fade-up">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{state.message}</p>
            </div>
          )}

          {/* Action button */}
          {state.status === "success" ? (
            <button
              onClick={reset}
              className="w-full py-3 rounded-xl glass-card border border-white/[0.1] text-sm font-semibold
                         text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              Index Another Document
            </button>
          ) : (
            <button
              onClick={upload}
              disabled={!file || state.status === "loading"}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold
                         bg-gradient-to-r from-emerald-500 to-cyan-500
                         hover:from-emerald-400 hover:to-cyan-400
                         disabled:opacity-20 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-xl shadow-emerald-500/20
                         hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99]"
            >
              {state.status === "loading"
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Indexing into Pinecone…</>
                : <><Upload className="w-4 h-4" /> Index Document</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
