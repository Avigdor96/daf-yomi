import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/components/session-provider";
import { ServiceWorkerRegister } from "@/components/sw-register";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "הש\"ס שלי - מעקב דף יומי",
  description: "אפליקציה לניהול ומעקב אחר לימוד דף יומי",
  manifest: "/manifest.json",
  themeColor: "#d4a853",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "הש\"ס שלי",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SessionProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <ServiceWorkerRegister />
        </SessionProvider>
      </body>
    </html>
  );
}
