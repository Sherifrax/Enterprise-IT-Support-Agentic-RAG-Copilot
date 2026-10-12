"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Database, GitBranch, Menu, ShieldCheck, Sparkles, X } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ChatArea from "@/components/ChatArea";
import Composer from "@/components/Composer";
import TracePanel from "@/components/TracePanel";
import UploadModal from "@/components/UploadModal";

function KnowledgeScene() {
  return (
    <div className="scene" aria-label="Illustration of a question moving through private knowledge, evidence grading, and a grounded answer" role="img">
      <div className="scene-grid" />
      <div className="scene-orbit scene-orbit-one" />
      <div className="scene-orbit scene-orbit-two" />
      <div className="scene-card scene-card-back"><span>01 / QUESTION</span><strong>How do I connect<br />to the VPN?</strong><i>↗</i></div>
      <div className="scene-card scene-card-mid"><span>02 / RETRIEVE + GRADE</span><strong>Private knowledge<br />comes first.</strong><div className="scene-card-bars"><b /><b /><b /></div></div>
      <div className="scene-card scene-card-front"><span>03 / GROUNDED ANSWER</span><div className="scene-card-check">✓</div><strong>Evidence found.</strong><small>Company handbook · 2 sources</small></div>
      <div className="scene-tag scene-tag-left"><Database size={14} /> PRIVATE KB</div>
      <div className="scene-tag scene-tag-right"><GitBranch size={14} /> CONDITIONAL ROUTING</div>
      <div className="scene-coordinate">N / R — 001<br />AGENT SYSTEM</div>
    </div>
  );
}

const workflow = [
  { n: "01", title: "Route", detail: "Understand the request" },
  { n: "02", title: "Retrieve", detail: "Search private documents" },
  { n: "03", title: "Grade", detail: "Check evidence quality" },
  { n: "04", title: "Resolve", detail: "Answer or search the web" },
];

export default function Home() {
  const { messages, trace, sourceUsed, isLoading, sendMessage } = useChat();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);
  const scrollToDemo = () => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="site-shell">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="NovaRetail home"><span className="brand-mark"><span /><span /><span /><span /></span><span>nova<span className="brand-light">retail</span><small> / LAB</small></span></a>
        <nav className={mobileMenuOpen ? "nav-links nav-links-open" : "nav-links"} aria-label="Main navigation">
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</a>
          <a href="#demo" onClick={() => setMobileMenuOpen(false)}>Live workspace</a>
          <button onClick={() => { setUploadOpen(true); setMobileMenuOpen(false); }}>Add a document <ArrowRight size={15} /></button>
        </nav>
        <button className="mobile-menu" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button>
      </header>
      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-square" /> FIELD ENGINEERING PROJECT <span className="eyebrow-rule" /> 001</div>
            <h1 id="hero-title">Support answers<br />with <em>receipts.</em></h1>
            <p className="hero-lede">An agentic IT copilot that searches company knowledge, tests the evidence, and shows its path to every answer.</p>
            <div className="hero-actions"><button className="button-primary" onClick={scrollToDemo}>Explore the live workspace <ArrowRight size={18} /></button><a href="#how-it-works" className="text-link">See the system <ArrowDownRight size={17} /></a></div>
            <div className="hero-meta"><span><ShieldCheck size={15} /> Private knowledge first</span><span><Sparkles size={15} /> Web fallback when needed</span></div>
          </div>
          <KnowledgeScene />
          <div className="hero-side-label">AN INTERACTIVE RAG SYSTEM / 2026</div>
        </section>
        <section className="process-strip" id="how-it-works" aria-labelledby="process-title">
          <div className="section-kicker"><span>THE DECISION PATH</span><h2 id="process-title">One question. A visible chain of reasoning.</h2></div>
          <div className="process-steps">{workflow.map((step) => <div className="process-step" key={step.n}><span className="process-number">{step.n}</span><div><strong>{step.title}</strong><span>{step.detail}</span></div><ArrowRight size={17} aria-hidden="true" /></div>)}</div>
        </section>
        <section className="workspace-section" id="demo" aria-labelledby="workspace-title">
          <div className="workspace-heading"><div><div className="eyebrow eyebrow-dark"><span className="eyebrow-square" /> INTERACTIVE DEMO / NOVARETAIL</div><h2 id="workspace-title">Put the agent to work<span>.</span></h2><p>Ask a real support question, then inspect how the answer was reached.</p></div><div className="workspace-live"><span /> WORKSPACE / DEMO</div></div>
          <div className="workspace-frame">
            <div className="workspace-topbar"><div className="workspace-brand"><span className="workspace-brand-icon">N</span><div><strong>Knowledge copilot</strong><small>NovaRetail IT / Agentic RAG</small></div></div><div className="workspace-top-actions"><span className="workspace-status"><span /> Ask to run</span><button onClick={() => setTraceOpen(!traceOpen)} className="trace-toggle" aria-expanded={traceOpen} aria-controls="agent-trace">{traceOpen ? "Hide" : "View"} trace <GitBranch size={14} /></button></div></div>
            <div className="workspace-content"><div className="chat-column"><ChatArea messages={messages} isLoading={isLoading} /><Composer onSend={sendMessage} isLoading={isLoading} /></div><div id="agent-trace" className={traceOpen ? "trace-column trace-column-open" : "trace-column"}><TracePanel trace={trace} sourceUsed={sourceUsed} /></div></div>
          </div>
          <p className="workspace-note">DEMO SYSTEM <span>↗</span> Answers depend on the connected knowledge base and service availability.</p>
        </section>
        <section className="build-section" aria-labelledby="build-title"><div className="build-copy"><span>BEHIND THE INTERFACE / 02</span><h2 id="build-title">The engine behind<br /><em>the answer.</em></h2><p>A conditional workflow connects private search, evidence checks, and a current information fallback through one API.</p><a href="https://github.com/Sherifrax/NovaRetail" target="_blank" rel="noopener noreferrer">Explore the source <ArrowUpRight size={17} /></a></div><div className="build-stack"><div><span>01 / ORCHESTRATE</span><strong>LangGraph</strong><small>Route, grade, retry</small></div><div><span>02 / RETRIEVE</span><strong>Pinecone + OpenAI</strong><small>Private document search</small></div><div><span>03 / EXPAND</span><strong>Tavily</strong><small>Web fallback for weak evidence</small></div><div><span>04 / DELIVER</span><strong>FastAPI</strong><small>Answers, citations, trace</small></div></div></section>
      </main>
      <footer className="site-footer"><div className="brand brand-footer"><span className="brand-mark"><span /><span /><span /><span /></span><span>nova<span className="brand-light">retail</span><small> / LAB</small></span></div><span>Built to make the agent&apos;s decisions visible.</span><a href="#top">Back to top ↑</a></footer>
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
