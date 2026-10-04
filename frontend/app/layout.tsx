import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoAI - Your Personal Crypto Assistant",
  description: "AI-powered crypto assistant with real-time market data. Ask anything, get instant answers with live prices from Binance.",
  openGraph: {
    title: "CryptoAI - Your Personal Crypto Assistant",
    description: "AI-powered crypto assistant with real-time market data",
    url: "https://cryptoai-two.vercel.app",
    siteName: "CryptoAI",
    images: [
      {
        url: "https://cryptoai-two.vercel.app/api/og",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoAI - Your Personal Crypto Assistant",
    description: "AI-powered crypto assistant with real-time market data",
    images: ["https://cryptoai-two.vercel.app/api/og"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

type LayoutProps = {
  children: React.ReactNode;
};
