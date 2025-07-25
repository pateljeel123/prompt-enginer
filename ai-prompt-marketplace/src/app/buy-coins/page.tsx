'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { Coins, Check, Star, ArrowLeft, CreditCard } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const coinPackages = [
  {
    id: 'starter',
    name: 'Starter Pack',
    coins: 20,
    price: 99,
    originalPrice: 120,
    popular: false,
    description: 'Perfect for trying out a few premium prompts',
    features: [
      '20 coins',
      'Access to all prompts',
      'Instant delivery',
      'No expiration'
    ]
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    coins: 50,
    price: 199,
    originalPrice: 250,
    popular: true,
    description: 'Most popular choice for regular users',
    features: [
      '50 coins',
      'Access to all prompts',
      'Instant delivery',
      'No expiration',
      '20% bonus coins'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    coins: 100,
    price: 349,
    originalPrice: 500,
    popular: false,
    description: 'Best value for power users and creators',
    features: [
      '100 coins',
      'Access to all prompts',
      'Instant delivery',
      'No expiration',
      '50% bonus coins',
      'Priority support'
    ]
  }
]

export default function BuyCoinsPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (packageId: string) => {
    if (!user) {
      toast.error('Please sign in to purchase coins')
      router.push('/login')
      return
    }

    try {
      setLoading(packageId)
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw error
      }
    } catch (error: unknown) {
      console.error('Error creating checkout session:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout process')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Buy Coins</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Purchase coins to unlock premium AI prompts and expand your creative toolkit
          </p>
          
          {user && (
            <div className="mt-6 inline-flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="text-lg font-semibold text-yellow-700">
                Current Balance: {userProfile?.coins || 0} coins
              </span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
                pkg.popular ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium">
                  <Star className="w-4 h-4 inline mr-1" />
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 ${pkg.popular ? 'pt-16' : ''}`}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">₹{pkg.price}</span>
                    <span className="text-lg text-gray-500 line-through">₹{pkg.originalPrice}</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-1 text-yellow-600">
                    <Coins className="w-5 h-5" />
                    <span className="text-xl font-bold">{pkg.coins} coins</span>
                  </div>
                  
                  <div className="text-sm text-green-600 font-medium mt-1">
                    Save ₹{pkg.originalPrice - pkg.price}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loading === pkg.id}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    pkg.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                >
                  {loading === pkg.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Purchase Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose Our Coin System?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Expiration</h3>
              <p className="text-gray-600">Your coins never expire. Use them whenever you want.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Access</h3>
              <p className="text-gray-600">Get immediate access to purchased prompts in your dashboard.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Every prompt is tested and optimized for best results.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do coins work?</h3>
              <p className="text-gray-600 text-sm">
                Each prompt has a coin price. Purchase coins and use them to unlock any prompt you want.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do coins expire?</h3>
              <p className="text-gray-600 text-sm">
                No, your coins never expire. You can use them anytime you want.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
              <p className="text-gray-600 text-sm">
                We offer refunds within 7 days of purchase if you haven&apos;t used any coins.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is payment secure?</h3>
              <p className="text-gray-600 text-sm">
                Yes, we use Stripe for secure payment processing. Your data is always protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}