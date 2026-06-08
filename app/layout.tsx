import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Bank of Mom",
  description: "Your personal savings account",
  manifest: "/bank-of-mom/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bank of Mom",
  },
  icons: {
    apple: "/bank-of-mom/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#15803d" />
      </head>
      <body className="bg-gray-50 min-h-screen antialiased">
        <AuthProvider>
          <Nav />
          <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
