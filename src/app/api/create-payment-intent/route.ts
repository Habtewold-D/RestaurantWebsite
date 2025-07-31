import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd' } = await request.json();

    console.log('Creating payment intent for:', { amount, currency });

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    // Convert ETB to USD (approximate rate: 1 USD = 138 ETB)
    let finalAmount = amount;
    let finalCurrency = currency;
    
    if (currency === 'etb') {
      finalAmount = amount / 138; // Convert ETB to USD
      finalCurrency = 'usd';
    }

    // Ensure minimum amount (Stripe requires at least 50 cents)
    if (finalAmount < 0.5) {
      return NextResponse.json(
        { error: 'Amount too small. Minimum order is $0.50' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Convert to cents
      currency: finalCurrency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        order_type: 'restaurant_order',
        original_amount_etb: currency === 'etb' ? amount.toString() : undefined,
      },
    });

    console.log('Payment intent created:', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 