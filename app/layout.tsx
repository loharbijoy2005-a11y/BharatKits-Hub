import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "OmniKits | All-in-One Daily Web Utility Suite",
  description: "Complete, client-side, offline-capable productivity suite. No backend, no tracking, zero database storage. Your data never leaves your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans antialiased text-slate-800 dark:text-slate-200">
        {children}
      </body>
    </html>
  );
}
