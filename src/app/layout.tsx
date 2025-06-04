import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/next';
import Footer from "@/components/custom/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',  
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins', 
})

export const metadata: Metadata = {
  title: "Roomie Finder",
  description: "Find your suitable roomate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} bg-[#fbf9f1] antialiased`}
      >
        <Navbar />
        <Toaster />
        <main className="max-w-7xl mx-auto">{children}</main>
        <Footer/>
        <Analytics />
      </body>
    </html>
  );
}
