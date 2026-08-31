import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BharatKits | The Ultimate India Citizen & Daily Utility Hub",
  description: "All-in-one digital tools for Indian citizens, cyber cafes, and small businesses. Resize photo/signature for official forms, combine ID cards to A4 PDF, generate UPI QRs, Loan EMIs, and access official government service directories.",
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
