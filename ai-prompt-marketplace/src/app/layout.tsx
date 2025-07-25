import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Prompt Marketplace - Premium AI Prompts for ChatGPT, Midjourney & More",
  description: "Discover and purchase high-quality AI prompts for ChatGPT, Midjourney, DALL-E and other AI tools. Unlock your creativity with our curated collection of premium prompts.",
  keywords: "AI prompts, ChatGPT prompts, Midjourney prompts, DALL-E prompts, AI marketplace, prompt engineering",
  authors: [{ name: "AI Prompt Marketplace" }],
  creator: "AI Prompt Marketplace",
  publisher: "AI Prompt Marketplace",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-prompt-marketplace.com",
    title: "AI Prompt Marketplace - Premium AI Prompts",
    description: "Discover and purchase high-quality AI prompts for ChatGPT, Midjourney, DALL-E and other AI tools.",
    siteName: "AI Prompt Marketplace",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompt Marketplace - Premium AI Prompts",
    description: "Discover and purchase high-quality AI prompts for ChatGPT, Midjourney, DALL-E and other AI tools.",
    creator: "@aipromptmarket",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
