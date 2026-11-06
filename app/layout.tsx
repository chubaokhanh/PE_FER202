import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { BookProvider } from "@/context/BookContext";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "ShelfLife",
  description: "Keep track of the books you want to read, are reading, or have finished.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <BookProvider>
            <Header />
            <main>{children}</main>
          </BookProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

