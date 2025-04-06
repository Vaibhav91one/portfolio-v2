import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "@/components/ui/Cursor";
import { Head } from "next/document";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaibhav Tomar | Developer ",
  description:
    "I'm a full-stack developer crafting intuitive, performant web experiences with a focus on clean code, modern tools, and creative design. Portfolio, projects, and contact.",
  keywords: [
    "Full-Stack Developer",
    "React Developer",
    "Next.js Portfolio",
    "Web Developer",
    "JavaScript",
    "TypeScript",
    "Frontend Engineer",
    "Developer Portfolio",
  ],
  openGraph: {
    title: "Vaibhav Tomar | Developer",
    description:
      "Explore my portfolio, learn about my work, and get in touch for opportunities. I build modern, fast, and user-focused websites using React, Next.js, and more.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased hide-scrollbar`}
      >
        <CursorProvider>{children}</CursorProvider>
      </body>
    </html>
  );
}
