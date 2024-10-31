import type { Metadata } from "next";
import "./globals.css";
import { appleII } from './_lib/fonts'

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
    <html lang="en" className={`${appleII.variable}`}>
      <body>{children}</body>
    </html>
  );
}
