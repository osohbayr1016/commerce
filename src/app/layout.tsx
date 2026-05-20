import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/ui/ToastContainer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { generateSEO } from "@/lib/seo";
import MobileBottomNav from "@/components/Navigation/MobileBottomNav";
import { ModalProvider } from "@/hooks/useModal";
import { SpinModalProvider } from "@/contexts/SpinModalContext";
import CartDrawerDynamic from "@/components/Cart/CartDrawerDynamic";
import TopLoader from "@/components/ui/TopLoader";
import IntroPreloader from "@/components/ui/IntroPreloader";
import SpeculationRules from "@/components/ui/SpeculationRules";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = generateSEO();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} antialiased font-sans`}
      >
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <ComparisonProvider>
                  <SpinModalProvider>
                    <Suspense fallback={null}>
                      <TopLoader />
                    </Suspense>
                    <IntroPreloader />
                    <SpeculationRules />
                    <div className="min-h-screen pb-16 md:pb-0">{children}</div>
                    <MobileBottomNav />
                    <ModalProvider />
                    <CartDrawerDynamic />
                  </SpinModalProvider>
                </ComparisonProvider>
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
