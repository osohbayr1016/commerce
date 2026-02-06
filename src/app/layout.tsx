import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/ui/ToastContainer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { generateSEO } from "@/lib/seo";
import MobileBottomNav from "@/components/Navigation/MobileBottomNav";
import { ModalProvider } from "@/hooks/useModal";
import ClientCartDrawer from "@/components/Cart/ClientCartDrawer";
import { SpinModalProvider } from "@/contexts/SpinModalContext";

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

export const metadata: Metadata = generateSEO();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <ComparisonProvider>
                  <SpinModalProvider>
                    <div className="min-h-screen pb-16 md:pb-0">{children}</div>
                    <MobileBottomNav />
                    <ModalProvider />
                    <ClientCartDrawer />
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
