import type { Metadata } from "next";
import { Cairo, Inter, Noto_Sans_Arabic, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import UpdateManager from "@/components/ui/UpdateManager";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "دار الرحمن | %s",
    default: "دار الرحمن - تحفيظ القرآن الكريم",
  },
  description:
    "دار الرحمن لتحفيظ القرآن الكريم - تعليم قرآني متميز مع متابعة شخصية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${notoSansArabic.variable} ${cairo.variable} ${geistMono.variable} font-arabic antialiased`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <UpdateManager />
            {children}
            <Toaster position="top-center" />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
