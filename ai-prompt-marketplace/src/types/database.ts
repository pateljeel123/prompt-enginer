export interface User {
  id: string
  email: string
  coins: number
  created_at?: string
  updated_at?: string
}

export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  preview?: string
  price_in_coins: number
  image_url?: string
  category: string
  tags: string[]
  created_at?: string
  updated_at?: string
}

export interface Purchase {
  id: string
  user_id: string
  prompt_id: string
  purchased_at: string
}

export interface PromptWithPurchase extends Prompt {
  is_purchased?: boolean
  purchased_at?: string
}