import { CartItem } from "@/contexts/CartContext";

export type PaymentMethod = "qpay" | "coins";

export interface CheckoutFormValues {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
}

export interface CheckoutFormProps {
  items: CartItem[];
  defaultValues: CheckoutFormValues;
  onSuccess: (orderId: string, paymentMethod: PaymentMethod) => void;
}

