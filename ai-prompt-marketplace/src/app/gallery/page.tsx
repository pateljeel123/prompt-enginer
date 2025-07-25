'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Search, Grid, List, Lock, Coins, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { PromptWithPurchase } from '@/types/database'
import toast from 'react-hot-toast'

const categories = [
  'All',
  'ChatGPT',
  'Midjourney',
  'DALL-E',
  'Marketing',
  'Writing',
  'Business',
  'Creative',
  'Education'
]

export default function GalleryPage() {
  const [prompts, setPrompts] = useState<PromptWithPurchase[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<PromptWithPurchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  
  const { user } = useAuth()

  useEffect(() => {
    fetchPrompts()
  }, [user])

  useEffect(() => {
    filterPrompts()
  }, [prompts, searchTerm, selectedCategory])

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      
      // Fetch all prompts
      const { data: promptsData, error: promptsError } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })

      if (promptsError) throw promptsError

      let promptsWithPurchaseStatus: PromptWithPurchase[] = promptsData || []

      // If user is logged in, check which prompts they've purchased
      if (user) {
        const { data: purchasesData, error: purchasesError } = await supabase
          .from('purchases')
          .select('prompt_id')
          .eq('user_id', user.id)

        if (!purchasesError && purchasesData) {
          const purchasedPromptIds = new Set(purchasesData.map(p => p.prompt_id))
          promptsWithPurchaseStatus = promptsData.map(prompt => ({
            ...prompt,
            is_purchased: purchasedPromptIds.has(prompt.id)
          }))
        }
      }

      setPrompts(promptsWithPurchaseStatus)
    } catch (error) {
      console.error('Error fetching prompts:', error)
      toast.error('Failed to load prompts')
    } finally {
      setLoading(false)
    }
  }

  const filterPrompts = () => {
    let filtered = [...prompts]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory)
    }

    setFilteredPrompts(filtered)
  }

  const getPreviewText = (content: string, preview?: string) => {
    if (preview) return preview
    // Return first 20% of content as preview
    const words = content.split(' ')
    const previewLength = Math.max(Math.floor(words.length * 0.2), 10)
    return words.slice(0, previewLength).join(' ') + '...'
  }

  const PromptCard = ({ prompt }: { prompt: PromptWithPurchase }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {prompt.image_url && (
        <div className="h-48 bg-gray-200 relative">
          <img
            src={prompt.image_url}
            alt={prompt.title}
            className="w-full h-full object-cover"
          />
          {!prompt.is_purchased && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {prompt.title}
          </h3>
          <div className="flex items-center space-x-1 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-1 ml-2">
            <Coins className="w-3 h-3 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700">
              {prompt.price_in_coins}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {prompt.description}
        </p>
        
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{prompt.category}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
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
        
        {!prompt.is_purchased && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 content-blur">
              {getPreviewText(prompt.content, prompt.preview)}
            </p>
          </div>
        )}
        
        <Link
          href={`/prompt/${prompt.id}`}
          className={`block w-full text-center py-2 px-4 rounded-lg font-medium transition-colors ${
            prompt.is_purchased
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {prompt.is_purchased ? 'View Prompt' : 'Unlock Prompt'}
        </Link>
      </div>
    </div>
  )

  const PromptListItem = ({ prompt }: { prompt: PromptWithPurchase }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        {prompt.image_url && (
          <div className="w-24 h-24 bg-gray-200 rounded-lg relative flex-shrink-0">
            <img
              src={prompt.image_url}
              alt={prompt.title}
              className="w-full h-full object-cover rounded-lg"
            />
            {!prompt.is_purchased && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                <Lock className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {prompt.title}
            </h3>
            <div className="flex items-center space-x-1 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-1 ml-4">
              <Coins className="w-3 h-3 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700">
                {prompt.price_in_coins}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {prompt.description}
          </p>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{prompt.category}</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {prompt.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <Link
            href={`/prompt/${prompt.id}`}
            className={`inline-block py-2 px-4 rounded-lg font-medium transition-colors ${
              prompt.is_purchased
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {prompt.is_purchased ? 'View Prompt' : 'Unlock Prompt'}
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prompt Gallery</h1>
          <p className="text-gray-600">Discover premium AI prompts for all your creative needs</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPrompts.length} of {prompts.length} prompts
          </p>
        </div>

        {/* Prompts Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No prompts found matching your criteria.</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredPrompts.map((prompt) => (
              viewMode === 'grid' ? (
                <PromptCard key={prompt.id} prompt={prompt} />
              ) : (
                <PromptListItem key={prompt.id} prompt={prompt} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  )
}