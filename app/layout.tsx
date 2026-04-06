import type { Metadata } from "next";
import { Inter, Syne, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  variable: "--font-cormorant" 
});

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
      <body className={`${inter.variable} ${syne.variable} ${cormorant.variable} antialiased`}>
        <div id="scroll-progress" />
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
