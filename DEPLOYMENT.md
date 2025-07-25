# AI Prompt Marketplace - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)
- A Stripe account (test mode is fine for development)

### 1. Environment Setup

The application is currently configured with placeholder environment variables. You'll need to replace them with your actual credentials:

#### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your credentials
3. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

#### Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from the Stripe Dashboard
3. Update `.env.local` with your Stripe credentials:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### 2. Database Setup

1. In your Supabase project, go to the SQL Editor
2. Copy and paste the contents of `database-setup.sql`
3. Run the SQL script to create all tables, functions, and policies

### 3. Stripe Webhook Configuration

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Add a new endpoint: `http://localhost:3000/api/stripe-webhook`
3. Select the event: `checkout.session.completed`
4. Copy the webhook signing secret to your `.env.local`

### 4. Running the Application

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🧪 Testing the Features

### 1. Authentication
- Visit `/login` to create an account or sign in
- Test both email/password and Google authentication (if configured)

### 2. Browse Prompts
- Visit `/gallery` to see all available prompts
- Use the search and filter functionality
- Test the category filtering

### 3. Purchase Flow
- Click on any prompt to view details
- Try to purchase a prompt (you'll need coins first)
- Verify the anti-copy protection is working

### 4. Coin System
- Visit `/buy-coins` to purchase coin packages
- Use Stripe's test card: `4242 4242 4242 4242`
- Verify coins are added to your balance after payment

### 5. Dashboard
- Visit `/dashboard` to see your purchased prompts
- Test copying purchased content
- Verify the watermarking system

## 📊 Sample Data

To test the application with sample prompts, you can insert some test data:

```sql
-- Insert sample prompts (run in Supabase SQL Editor)
INSERT INTO prompts (title, description, preview_content, full_content, price, category, tags, image_url, created_by) VALUES
('Creative Writing Assistant', 'Help with creative writing and storytelling', 'You are a creative writing assistant that helps with...', 'You are a creative writing assistant that helps with storytelling, character development, plot creation, and narrative structure. You provide detailed feedback and suggestions to improve creative writing pieces.', 5, 'writing', ARRAY['creative', 'writing', 'storytelling'], 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400', (SELECT id FROM auth.users LIMIT 1)),
('Midjourney Art Prompt', 'Generate stunning AI artwork with this prompt', 'Create a beautiful landscape painting in the style of...', 'Create a beautiful landscape painting in the style of Claude Monet, featuring a serene lake at sunset with water lilies floating on the surface, soft brushstrokes, impressionist technique, warm golden light, peaceful atmosphere, high detail, artistic masterpiece --ar 16:9 --v 6', 8, 'art', ARRAY['midjourney', 'art', 'landscape'], 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400', (SELECT id FROM auth.users LIMIT 1)),
('Business Strategy Consultant', 'Expert business advice and strategy development', 'You are a senior business consultant with expertise in...', 'You are a senior business consultant with expertise in strategic planning, market analysis, financial modeling, and organizational development. You help businesses identify opportunities, solve complex problems, and develop actionable strategies for growth and success.', 12, 'business', ARRAY['business', 'strategy', 'consulting'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', (SELECT id FROM auth.users LIMIT 1));
```

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🌐 Production Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel's dashboard
4. Update the webhook URL to your production domain

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security Checklist

- [ ] Environment variables are properly configured
- [ ] Supabase RLS policies are enabled
- [ ] Stripe webhook endpoint is secured
- [ ] API routes are protected
- [ ] User input is validated
- [ ] Anti-copy measures are implemented

## 📈 Monitoring

Consider setting up:
- Error tracking (Sentry)
- Analytics (Google Analytics, Vercel Analytics)
- Performance monitoring
- Database monitoring in Supabase

## 🆘 Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all environment variables are set
2. **Database Connection**: Check Supabase credentials
3. **Payment Issues**: Verify Stripe configuration
4. **Authentication Problems**: Check Supabase auth settings

### Getting Help

- Check the console for error messages
- Review the Supabase logs
- Verify Stripe webhook events
- Ensure all dependencies are installed

---

Your AI Prompt Marketplace is now ready to launch! 🎉