import "./globals.css";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/lib/themeContext";
import { LanguageProvider } from "@/lib/languageContext";
import { APP_CONFIG } from "@/lib/config";
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0E7C86",
};

export const metadata = {
  title: `${APP_CONFIG.name} — Интерактивный сервис подбора услуг`,
  description: APP_CONFIG.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased min-h-screen flex flex-col justify-between overflow-x-hidden">
        <LanguageProvider>
          <ThemeProvider>
            <div>
              <Header />
              <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
                {children}
              </main>
            </div>
            <Footer />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
