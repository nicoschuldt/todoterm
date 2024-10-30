import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToDo Term",
  description: "A terminal-inspired task and time tracking application",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-black text-green-500 font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
