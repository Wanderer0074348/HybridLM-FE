import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HybridLM - Intelligent Query Routing",
  description: "Experience the power of hybrid LLM routing with real-time visualization",
  keywords: ["AI", "LLM", "SLM", "Query Routing", "Machine Learning"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
