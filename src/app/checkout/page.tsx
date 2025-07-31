"use client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate USD equivalent (approximate rate: 1 USD = 138 ETB)
  const etbTotal = cart.total + 50;
  const usdTotal = (etbTotal / 138).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred');
      setIsLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : `Pay $${usdTotal}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && cart.total > 0) {
      createPaymentIntent();
    }
  }, [user, cart.total]);

  const createPaymentIntent = async () => {
    try {
      setLoadingPayment(true);
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: cart.total + 50, // Add delivery fee
          currency: "etb", // Send ETB amount, will be converted to USD
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    } finally {
      setLoadingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200">
        <div className="text-2xl font-semibold text-orange-700">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white/90 rounded-2xl shadow-xl p-12 border border-orange-200 text-center">
            <h1 className="text-3xl font-bold text-orange-700 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart before checkout.</p>
            <button
              onClick={() => router.push("/menu")}
              className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-700 text-center mb-8">
            Checkout
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-700 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-black">ETB {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-bold text-black">ETB {cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-bold text-black">ETB 50.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-orange-700">
                  <span>Total:</span>
                  <div className="text-right">
                    <div>ETB {(cart.total + 50).toFixed(2)}</div>
                    <div className="text-sm text-gray-600">≈ ${((cart.total + 50) / 138).toFixed(2)} USD</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-700 mb-6">Payment</h2>
              
              {loadingPayment ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-700 mx-auto mb-4"></div>
                  <p className="text-gray-600">Setting up payment...</p>
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-600">Failed to initialize payment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 