import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DTS - Delivery Tracking System",
  description: "Delivery Tracking System for logistics management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
