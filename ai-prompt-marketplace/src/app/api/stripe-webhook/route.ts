import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: unknown) {
      console.error('Webhook signature verification failed:', err instanceof Error ? err.message : 'Unknown error')
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        // Extract metadata
        const { userId, packageId, coins } = session.metadata!
        const coinsToAdd = parseInt(coins)

        try {
          // Update user's coin balance in Supabase
          const { data: currentUser, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('coins')
            .eq('id', userId)
            .single()

          if (fetchError) {
            console.error('Error fetching user:', fetchError)
            throw fetchError
          }

          const newCoinBalance = (currentUser?.coins || 0) + coinsToAdd

          const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ coins: newCoinBalance })
            .eq('id', userId)

          if (updateError) {
            console.error('Error updating user coins:', updateError)
            throw updateError
          }

          console.log(`Successfully added ${coinsToAdd} coins to user ${userId}. New balance: ${newCoinBalance}`)

          // Optionally, log the transaction
          const { error: logError } = await supabaseAdmin
            .from('coin_transactions')
            .insert({
              user_id: userId,
              amount: coinsToAdd,
              type: 'purchase',
              stripe_session_id: session.id,
              package_id: packageId,
              created_at: new Date().toISOString()
            })

          if (logError) {
            console.error('Error logging transaction:', logError)
            // Don't throw here as the main transaction succeeded
          }

        } catch (error) {
          console.error('Error processing payment:', error)
          // In a production app, you might want to implement retry logic
          // or alert admins about failed payment processing
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}