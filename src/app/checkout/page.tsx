import Footer from "@/components/Footer/Footer";
import MainNav from "@/components/Header/MainNav";
import CheckoutWithErrorBoundary from "./CheckoutWithErrorBoundary";

export default function CheckoutPage() {
  return (
    <>
      <MainNav />
      <CheckoutWithErrorBoundary />
      <Footer />
    </>
  );
}
