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
  title: "Imperium Deals",
  description: "Track Warhammer 40k product prices and find the best deals.",
  icons: {
    icon: './favicon.ico', // Path to your favicon in the public directory
  },
  openGraph: {
    title: "Imperium Deals",
    description: "Track Warhammer 40k product prices and find the best deals.",
    // url: "https://imperiumdeals.com", // Replace with your actual domain
    siteName: "Imperium Deals",
    // images: [
    //   {
    //     url: "https://imperiumdeals.com/og-image.jpg", // Replace with your OpenGraph image URL
    //     width: 1200,
    //     height: 630,
    //     alt: "Imperium Deals",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add a favicon link (optional if you're using the metadata icons property) */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}