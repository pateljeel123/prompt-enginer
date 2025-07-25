'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { Coins, Download, Copy, Check, Calendar, Tag, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PromptWithPurchase } from '@/types/database'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [purchasedPrompts, setPurchasedPrompts] = useState<PromptWithPurchase[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    
    if (user) {
      fetchPurchasedPrompts()
    }
  }, [user, authLoading])

  const fetchPurchasedPrompts = async () => {
    try {
      setLoading(true)
      
      // Fetch user's purchases with prompt details
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          prompts (*)
        `)
        .eq('user_id', user?.id)
        .order('purchased_at', { ascending: false })

      if (error) throw error

      const promptsWithPurchaseInfo = data?.map(purchase => ({
        ...purchase.prompts,
        is_purchased: true,
        purchased_at: purchase.purchased_at
      })) || []

      setPurchasedPrompts(promptsWithPurchaseInfo)
    } catch (error) {
      console.error('Error fetching purchased prompts:', error)
      toast.error('Failed to load your prompts')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPrompt = async (prompt: PromptWithPurchase) => {
    try {
      const watermarkedContent = `${prompt.content}\n\n---\nPurchased by: ${user?.email}\nPrompt ID: ${prompt.id}\nAI Prompt Marketplace - All rights reserved`
      
      await navigator.clipboard.writeText(watermarkedContent)
      setCopiedPromptId(prompt.id)
      toast.success('Prompt copied to clipboard!')
      
      setTimeout(() => setCopiedPromptId(null), 2000)
    } catch (error) {
      toast.error('Failed to copy prompt')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your purchased prompts and account</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Coin Balance</p>
                <p className="text-2xl font-bold text-gray-900">{userProfile?.coins || 0}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/buy-coins" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Buy more coins →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Purchased Prompts</p>
                <p className="text-2xl font-bold text-gray-900">{purchasedPrompts.length}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/gallery" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Browse more →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-lg font-bold text-gray-900">
                  {user?.created_at ? formatDate(user.created_at) : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Prompts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">My Purchased Prompts</h2>
          </div>

          {purchasedPrompts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts purchased yet</h3>
              <p className="text-gray-600 mb-6">
                Start building your prompt library by browsing our marketplace
              </p>
              <Link href="/gallery" className="btn-primary">
                Browse Prompts
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {purchasedPrompts.map((prompt) => (
                <div key={prompt.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {prompt.image_url && (
                          <img
                            src={prompt.image_url}
                            alt={prompt.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {prompt.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {prompt.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Tag className="w-4 h-4" />
                              <span>{prompt.category}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Purchased {formatDate(prompt.purchased_at || '')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Coins className="w-4 h-4" />
                              <span>{prompt.price_in_coins} coins</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {prompt.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {prompt.tags.length > 3 && (
                              <span className="text-xs text-gray-500">+{prompt.tags.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleCopyPrompt(prompt)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {copiedPromptId === prompt.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="text-sm">
                          {copiedPromptId === prompt.id ? 'Copied!' : 'Copy'}
                        </span>
                      </button>
                      
                      <Link
                        href={`/prompt/${prompt.id}`}
                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Need More Coins?</h3>
            <p className="text-blue-100 mb-4">
              Purchase coin packages to unlock more premium prompts
            </p>
            <Link href="/buy-coins" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block">
              Buy Coins
            </Link>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Discover New Prompts</h3>
            <p className="text-purple-100 mb-4">
              Explore our growing collection of AI prompts
            </p>
            <Link href="/gallery" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block">
              Browse Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}