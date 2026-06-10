import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Nav from "@/components/Nav";
import ServiceWorker from "@/components/ServiceWorker";

export const metadata: Metadata = {
  title: "Bank of Mom",
  description: "Your personal savings account",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bank of Mom",
  },
  icons: {
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      { url: "/apple-touch-icon-152.png", sizes: "152x152" },
    ],
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
          <ServiceWorker />
          <Nav />
          <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
