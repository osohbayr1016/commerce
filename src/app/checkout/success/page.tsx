import { Suspense } from "react";
import Footer from "@/components/Footer/Footer";
import MainNav from "@/components/Header/MainNav";
import CheckoutSuccessClient from "./CheckoutSuccessClient";

export default function CheckoutSuccessPage() {
  return (
    <>
      <MainNav />
      <div className="min-h-screen bg-gray-50 py-8">
        <Suspense
          fallback={
            <div className="max-w-xl mx-auto px-4 py-8 animate-pulse h-64 bg-gray-200 rounded-lg" />
          }
        >
          <CheckoutSuccessClient />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
