import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono, Orbitron, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Lex-Contrast | Multi-Agent Legal Intelligence",
  description: "Thematic-contrast analysis for complex legal document sets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${syne.variable} ${orbitron.variable} ${jakarta.variable} ${jetbrains.variable} antialiased`}>
        <div id="scroll-progress" />
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
