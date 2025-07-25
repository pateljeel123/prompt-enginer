-- Enable RLS (Row Level Security)
-- This should be done in the Supabase dashboard

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  coins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create prompts table
CREATE TABLE public.prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  preview TEXT,
  price_in_coins INTEGER NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, prompt_id)
);

-- Create coin_transactions table (for tracking purchases)
CREATE TABLE public.coin_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'spent', 'refund')),
  stripe_session_id TEXT,
  package_id TEXT,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle prompt purchases
CREATE OR REPLACE FUNCTION public.purchase_prompt(
  p_user_id UUID,
  p_prompt_id UUID,
  p_cost INTEGER
)
RETURNS VOID AS $$
DECLARE
  current_coins INTEGER;
BEGIN
  -- Get current coin balance
  SELECT coins INTO current_coins
  FROM public.users
  WHERE id = p_user_id;
  
  -- Check if user has enough coins
  IF current_coins < p_cost THEN
    RAISE EXCEPTION 'Insufficient coins. Required: %, Available: %', p_cost, current_coins;
  END IF;
  
  -- Check if prompt is already purchased
  IF EXISTS (
    SELECT 1 FROM public.purchases 
    WHERE user_id = p_user_id AND prompt_id = p_prompt_id
  ) THEN
    RAISE EXCEPTION 'Prompt already purchased';
  END IF;
  
  -- Deduct coins
  UPDATE public.users
  SET coins = coins - p_cost,
      updated_at = now()
  WHERE id = p_user_id;
  
  -- Record purchase
  INSERT INTO public.purchases (user_id, prompt_id)
  VALUES (p_user_id, p_prompt_id);
  
  -- Log transaction
  INSERT INTO public.coin_transactions (user_id, amount, type, prompt_id)
  VALUES (p_user_id, -p_cost, 'spent', p_prompt_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can only see and update their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Everyone can view prompts
CREATE POLICY "Anyone can view prompts" ON public.prompts
  FOR SELECT USING (true);

-- Users can only see their own purchases
CREATE POLICY "Users can view own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON public.coin_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Insert sample prompts
INSERT INTO public.prompts (title, description, content, preview, price_in_coins, image_url, category, tags) VALUES
(
  'ChatGPT Marketing Copy Generator',
  'Generate compelling marketing copy for any product or service with this proven prompt template.',
  'Act as an expert copywriter with 10+ years of experience. Create compelling marketing copy for [PRODUCT/SERVICE]. 

Target audience: [TARGET_AUDIENCE]
Key benefits: [LIST_BENEFITS]
Pain points addressed: [PAIN_POINTS]
Tone: [TONE - professional/casual/urgent/friendly]

Structure your copy with:
1. Attention-grabbing headline
2. Problem identification
3. Solution presentation
4. Benefits and features
5. Social proof elements
6. Strong call-to-action

Make it persuasive, benefit-focused, and optimized for conversions. Include emotional triggers and urgency when appropriate.',
  'Act as an expert copywriter with 10+ years of experience. Create compelling marketing copy for [PRODUCT/SERVICE]...',
  5,
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500',
  'Marketing',
  ARRAY['copywriting', 'marketing', 'sales', 'business']
),
(
  'Midjourney Photorealistic Portrait Prompt',
  'Create stunning photorealistic portraits with this detailed Midjourney prompt template.',
  'A photorealistic portrait of [SUBJECT DESCRIPTION], [AGE] years old, [ETHNICITY], [GENDER], with [HAIR DESCRIPTION] and [EYE COLOR] eyes. [EXPRESSION - smiling/serious/contemplative]. 

Lighting: [LIGHTING TYPE - natural window light/golden hour/studio lighting/dramatic side lighting]
Camera: Shot with [CAMERA - Canon EOS R5/Nikon D850/Sony A7R IV], [LENS - 85mm f/1.4/50mm f/1.2], shallow depth of field
Background: [BACKGROUND - blurred cityscape/natural bokeh/studio backdrop/outdoor setting]
Style: [STYLE - editorial/fashion/corporate/artistic]

Additional details:
- Wearing [CLOTHING DESCRIPTION]
- [POSE/POSITIONING]
- [MOOD/ATMOSPHERE]

--ar 3:4 --v 6 --style raw --stylize 300',
  'A photorealistic portrait of [SUBJECT DESCRIPTION], [AGE] years old, [ETHNICITY], [GENDER], with [HAIR DESCRIPTION]...',
  8,
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
  'Midjourney',
  ARRAY['portrait', 'photography', 'photorealistic', 'midjourney']
),
(
  'ChatGPT Code Review Assistant',
  'Get comprehensive code reviews and improvement suggestions with this developer-focused prompt.',
  'Act as a senior software engineer and code reviewer. Please review the following code and provide detailed feedback:

```[PROGRAMMING_LANGUAGE]
[PASTE_YOUR_CODE_HERE]
```

Please analyze:

1. **Code Quality & Structure**
   - Overall architecture and design patterns
   - Code organization and modularity
   - Naming conventions and readability

2. **Performance & Efficiency**
   - Time and space complexity
   - Potential bottlenecks
   - Optimization opportunities

3. **Security & Best Practices**
   - Security vulnerabilities
   - Industry best practices adherence
   - Error handling and edge cases

4. **Maintainability**
   - Code documentation
   - Testing considerations
   - Future scalability

5. **Specific Improvements**
   - Concrete suggestions with examples
   - Alternative approaches
   - Refactoring recommendations

Provide your feedback in a constructive manner with code examples where helpful.',
  'Act as a senior software engineer and code reviewer. Please review the following code...',
  6,
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500',
  'ChatGPT',
  ARRAY['programming', 'code-review', 'development', 'software-engineering']
),
(
  'DALL-E 3 Product Photography Prompt',
  'Create professional product photos for e-commerce with this detailed DALL-E prompt.',
  'A professional product photography shot of [PRODUCT NAME/DESCRIPTION]. 

Product details:
- [DETAILED PRODUCT DESCRIPTION]
- [COLOR/MATERIAL/SIZE specifications]
- [KEY FEATURES to highlight]

Photography setup:
- Clean, minimalist background in [COLOR - white/grey/gradient]
- Professional studio lighting with soft shadows
- [ANGLE - front view/3/4 angle/overhead/side profile]
- Sharp focus on product with slight background blur

Composition:
- [POSITIONING - centered/rule of thirds/diagonal]
- [PROPS - lifestyle elements/complementary items/none]
- [SCALE - close-up detail/full product/in-use context]

Style: Commercial product photography, high-end e-commerce quality, crisp and clean aesthetic, optimized for online retail

Lighting: Soft box lighting, eliminate harsh shadows, even illumination, highlight product textures and details

--ar 1:1 --v 6 --style raw --stylize 100',
  'A professional product photography shot of [PRODUCT NAME/DESCRIPTION]...',
  7,
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
  'DALL-E',
  ARRAY['product-photography', 'e-commerce', 'commercial', 'dall-e']
),
(
  'ChatGPT Email Marketing Campaign',
  'Create high-converting email marketing campaigns with this comprehensive prompt template.',
  'Create a complete email marketing campaign for [BUSINESS/PRODUCT]. 

Campaign objective: [GOAL - increase sales/build awareness/nurture leads/re-engage customers]
Target audience: [DETAILED AUDIENCE DESCRIPTION]
Campaign duration: [TIMEFRAME]

Create the following emails:

**Email 1: Welcome/Introduction**
- Subject line (A/B test options)
- Warm welcome message
- Set expectations
- Immediate value delivery
- Clear next steps

**Email 2: Value/Educational Content**
- Subject line options
- Helpful tips or insights
- Establish authority
- Soft product mention
- Engagement encouragement

**Email 3: Social Proof/Testimonials**
- Subject line variations
- Customer success stories
- Build trust and credibility
- Address common objections
- Gentle sales approach

**Email 4: Offer/Call-to-Action**
- Compelling subject lines
- Present main offer
- Create urgency/scarcity
- Multiple CTAs
- Risk reversal elements

**Email 5: Follow-up/Last Chance**
- Final opportunity messaging
- Overcome final objections
- Strong urgency
- Clear benefits recap
- Definitive CTA

For each email, include:
- Multiple subject line options
- Preview text
- Email body with proper formatting
- CTA buttons
- P.S. lines where appropriate

Tone: [SPECIFY TONE - professional/friendly/urgent/casual]
Brand voice: [BRAND PERSONALITY]',
  'Create a complete email marketing campaign for [BUSINESS/PRODUCT]...',
  10,
  'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=500',
  'Marketing',
  ARRAY['email-marketing', 'campaigns', 'conversion', 'automation']
);

-- Create indexes for better performance
CREATE INDEX idx_prompts_category ON public.prompts(category);
CREATE INDEX idx_prompts_created_at ON public.prompts(created_at);
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_purchases_prompt_id ON public.purchases(prompt_id);
CREATE INDEX idx_coin_transactions_user_id ON public.coin_transactions(user_id);
CREATE INDEX idx_coin_transactions_created_at ON public.coin_transactions(created_at);