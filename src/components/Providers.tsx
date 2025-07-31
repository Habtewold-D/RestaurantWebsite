"use client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { paypalOptions } from "@/lib/paypal";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </PayPalScriptProvider>
  );
} 