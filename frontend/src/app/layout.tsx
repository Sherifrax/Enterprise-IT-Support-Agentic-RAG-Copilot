import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NovaRetail — IT Support Agentic RAG",
  description:
    "Enterprise IT support powered by an Agentic RAG pipeline. Private company knowledge first, external web fallback when evidence is weak.",
  keywords: ["IT support", "RAG", "LangGraph", "enterprise", "knowledge base"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-[#080c12] text-slate-200">{children}</body>
    </html>
  );
}
