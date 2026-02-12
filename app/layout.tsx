import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as alternative to Roboto
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VEDA Beauty",
  description: "Best wholesale prices for cosmetics",
};

import { AuthProvider } from "@/context/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-veda-background min-h-screen flex flex-col`}
        style={{ backgroundColor: '#FDDDE6' }}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-sm text-gray-400">© 2024 VEDA Beauty. All rights reserved.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
