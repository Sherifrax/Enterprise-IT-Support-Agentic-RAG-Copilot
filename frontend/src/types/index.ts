export interface Citation {
  title: string;
  url?: string;
}

export interface ChatResponse {
  answer: string;
  source_used: string;
  trace: string[];
  citations: Citation[];
  rewritten_query: string;
}

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  source?: string;
  citations?: Citation[];
}

export interface IngestResponse {
  message: string;
  file: string;
  chunks: number;
  ids_created: number;
}
