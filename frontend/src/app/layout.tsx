import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaRetail Lab — Support answers with receipts",
  description:
    "Enterprise IT support powered by an Agentic RAG pipeline. Private company knowledge first, external web fallback when evidence is weak.",
  keywords: ["IT support", "RAG", "LangGraph", "enterprise", "knowledge base"],
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
