"use client";

import { Activity, Check, GitBranch } from "lucide-react";
interface TracePanelProps { trace: string[]; sourceUsed: string; }

export default function TracePanel({ trace, sourceUsed }: TracePanelProps) {
  const running = sourceUsed === "Running…";
  return <aside className="trace-panel"><div className="trace-head"><div className="trace-head-icon"><GitBranch size={19} /></div><span>TRANSPARENCY LAYER / 01</span><h3>The decision trace<span>.</span></h3><p>Follow the agent from question to source backed answer.</p></div><div className="trace-timeline"><div className="trace-timeline-heading"><span>WORKFLOW LOG</span><Activity size={15} /></div>{trace.length === 0 ? <div className="trace-empty"><span className="trace-empty-line" /><div className="trace-empty-node">01</div><p>Ask a question to see each decision appear here.</p></div> : trace.map((item, i) => <div className="trace-item" key={`${i}-${item}`}><div className="trace-node">{running && i === trace.length - 1 ? <span className="trace-spinner" /> : <Check size={12} />}</div><div><small>STEP {String(i + 1).padStart(2, "0")}</small><p>{item}</p></div></div>)}</div><div className="trace-source"><span>FINAL SOURCE</span><strong>{sourceUsed === "—" ? "Awaiting a question" : sourceUsed}</strong><div className="trace-source-rule" /></div></aside>;
}
