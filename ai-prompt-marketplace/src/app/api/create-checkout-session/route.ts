import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

const coinPackages = {
  starter: { coins: 20, price: 99, name: 'Starter Pack' },
  popular: { coins: 50, price: 199, name: 'Popular Pack' },
  pro: { coins: 100, price: 349, name: 'Pro Pack' }
}

export async function POST(request: NextRequest) {
  try {
    const { packageId, userId } = await request.json()

    if (!packageId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const packageInfo = coinPackages[packageId as keyof typeof coinPackages]
    if (!packageInfo) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${packageInfo.name} - ${packageInfo.coins} Coins`,
              description: `Purchase ${packageInfo.coins} coins for AI Prompt Marketplace`,
              images: [`${process.env.NEXT_PUBLIC_APP_URL}/coin-icon.png`],
            },
            unit_amount: packageInfo.price * 100, // Stripe expects amount in paisa for INR
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/buy-coins?canceled=true`,
      metadata: {
        userId,
        packageId,
        coins: packageInfo.coins.toString(),
      },
      customer_email: undefined, // Let user enter email
      billing_address_collection: 'required',
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: unknown) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}