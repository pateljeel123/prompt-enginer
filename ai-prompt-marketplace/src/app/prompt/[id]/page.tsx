'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Lock, Unlock, Coins, Tag, Copy, Check, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { PromptWithPurchase } from '@/types/database'
import toast from 'react-hot-toast'

export default function PromptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, userProfile, refreshUserProfile } = useAuth()
  
  const [prompt, setPrompt] = useState<PromptWithPurchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPrompt()
    }
  }, [params.id, user])

  const fetchPrompt = async () => {
    try {
      setLoading(true)
      
      // Fetch prompt details
      const { data: promptData, error: promptError } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (promptError) throw promptError

      const promptWithPurchaseStatus: PromptWithPurchase = {
        ...promptData,
        is_purchased: false
      }

      // Check if user has purchased this prompt
      if (user) {
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('prompt_id', params.id)
          .single()

        if (!purchaseError && purchaseData) {
          promptWithPurchaseStatus.is_purchased = true
        }
      }

      setPrompt(promptWithPurchaseStatus)
    } catch (error) {
      console.error('Error fetching prompt:', error)
      toast.error('Failed to load prompt')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please sign in to purchase prompts')
      router.push('/login')
      return
    }

    if (!userProfile || userProfile.coins < (prompt?.price_in_coins || 0)) {
      toast.error('Insufficient coins. Please buy more coins.')
      router.push('/buy-coins')
      return
    }

    try {
      setPurchasing(true)

      // Start transaction
      const { error } = await supabase.rpc('purchase_prompt', {
        p_user_id: user.id,
        p_prompt_id: params.id,
        p_cost: prompt?.price_in_coins || 0
      })

      if (error) throw error

      toast.success('Prompt purchased successfully!')
      await refreshUserProfile()
      await fetchPrompt() // Refresh prompt to show purchased status
    } catch (error: unknown) {
      console.error('Error purchasing prompt:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to purchase prompt')
    } finally {
      setPurchasing(false)
    }
  }

  const handleCopy = async () => {
    if (!prompt?.is_purchased) return

    try {
      const watermarkedContent = `${prompt.content}\n\n---\nPurchased by: ${user?.email}\nPrompt ID: ${prompt.id}\nAI Prompt Marketplace - All rights reserved`
      
      await navigator.clipboard.writeText(watermarkedContent)
      setCopied(true)
      toast.success('Prompt copied to clipboard!')
      
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy prompt')
    }
  }

  const getPreviewText = (content: string, preview?: string) => {
    if (preview) return preview
    // Return first 20% of content as preview
    const words = content.split(' ')
    const previewLength = Math.max(Math.floor(words.length * 0.2), 10)
    return words.slice(0, previewLength).join(' ') + '...'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Prompt Not Found</h1>
            <p className="text-gray-600 mb-8">The prompt you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/gallery" className="btn-primary">
              Browse Prompts
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/gallery" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{prompt.title}</h1>
                <p className="text-gray-600 text-lg">{prompt.description}</p>
              </div>
              
              <div className="ml-6 text-right">
                <div className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 mb-4">
                  <Coins className="w-5 h-5 text-yellow-600" />
                  <span className="text-lg font-bold text-yellow-700">
                    {prompt.price_in_coins} coins
                  </span>
                </div>
                
                {prompt.is_purchased ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Unlock className="w-5 h-5" />
                    <span className="font-medium">Purchased</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Lock className="w-5 h-5" />
                    <span className="font-medium">Locked</span>
                  </div>
                )}
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{prompt.category}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          {prompt.image_url && (
            <div className="relative">
              <img
                src={prompt.image_url}
                alt={prompt.title}
                className="w-full h-64 object-cover"
              />
              {!prompt.is_purchased && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Lock className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-lg font-medium">Purchase to view full image</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Prompt Content</h2>
            
            {prompt.is_purchased ? (
              <div className="space-y-4">
                <div 
                  className="bg-gray-50 rounded-lg p-6 font-mono text-sm leading-relaxed no-select"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-green-600">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Protected Content</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-gray-800">
                    {prompt.content}
                  </pre>
                  <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                    <p>Purchased by: {user?.email}</p>
                    <p>Prompt ID: {prompt.id}</p>
                    <p>© AI Prompt Marketplace - All rights reserved</p>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-900">Anti-Copy Protection</h3>
                      <p className="text-sm text-green-700 mt-1">
                        This content is watermarked with your account information and protected against unauthorized sharing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 relative">
                  <div className="content-blur">
                    <pre className="whitespace-pre-wrap text-gray-600 font-mono text-sm leading-relaxed">
                      {getPreviewText(prompt.content, prompt.preview)}
                    </pre>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    Unlock Full Prompt
                  </h3>
                  <p className="text-blue-700 mb-6">
                    Purchase this prompt to access the complete content and start creating amazing results.
                  </p>
                  
                  {user ? (
                    <div className="space-y-4">
                      <div className="text-sm text-blue-600">
                        Your balance: {userProfile?.coins || 0} coins
                      </div>
                      <button
                        onClick={handlePurchase}
                        disabled={purchasing || (userProfile?.coins || 0) < prompt.price_in_coins}
                        className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {purchasing ? 'Processing...' : `Unlock for ${prompt.price_in_coins} coins`}
                      </button>
                      {(userProfile?.coins || 0) < prompt.price_in_coins && (
                        <div>
                          <p className="text-sm text-red-600 mb-2">Insufficient coins</p>
                          <Link href="/buy-coins" className="btn-secondary">
                            Buy More Coins
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-blue-600">Sign in to purchase this prompt</p>
                      <Link href="/login" className="btn-primary text-lg px-8 py-3 inline-block">
                        Sign In to Purchase
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Prompts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Prompts</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-center">
              <Link href="/gallery" className="text-blue-600 hover:text-blue-700 font-medium">
                Browse more prompts in the gallery →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}