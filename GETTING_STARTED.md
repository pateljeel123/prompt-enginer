# Getting Started with AI Prompt Marketplace

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
The application is pre-configured with placeholder environment variables in `.env.local`. For development testing, these placeholders will allow the app to run, but you'll need real credentials for full functionality.

**Current placeholder configuration:**
- Supabase: Uses placeholder URLs and keys
- Stripe: Uses placeholder test keys
- App URL: Set to `http://localhost:3000`

### 3. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🗄️ Database Setup (Required for Full Functionality)

To enable all features, you'll need to set up a Supabase database:

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Run the Database Setup:**
   - Copy the contents of `database-setup.sql`
   - Go to your Supabase dashboard → SQL Editor
   - Paste and execute the SQL script

3. **Update Environment Variables:**
   ```bash
   # Replace placeholders in .env.local with your real values
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## 💳 Stripe Setup (For Payment Testing)

1. **Create a Stripe Account:**
   - Go to [stripe.com](https://stripe.com)
   - Get your test API keys

2. **Update Stripe Environment Variables:**
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

3. **Set up Webhook Endpoint:**
   - In Stripe Dashboard → Webhooks
   - Add endpoint: `http://localhost:3000/api/stripe-webhook`
   - Listen for: `checkout.session.completed`

## 🧪 Feature Testing Guide

### 1. Landing Page (`/`)
- ✅ Hero section with call-to-action
- ✅ Features showcase
- ✅ Categories grid
- ✅ Testimonials
- ✅ Footer with links

### 2. Authentication (`/login`)
- ✅ Sign up form
- ✅ Sign in form
- ✅ Form validation
- ⚠️ Requires Supabase setup for functionality

### 3. Prompt Gallery (`/gallery`)
- ✅ Grid layout of prompts
- ✅ Search functionality
- ✅ Category filtering
- ✅ Price display
- ✅ Purchase indicators
- ⚠️ Requires database with sample prompts

### 4. Prompt Details (`/prompt/[id]`)
- ✅ Full prompt information
- ✅ Preview vs full content
- ✅ Purchase button
- ✅ Anti-copy protection
- ✅ Watermarking for purchased content
- ⚠️ Requires authentication and database

### 5. User Dashboard (`/dashboard`)
- ✅ Coin balance display
- ✅ Purchased prompts grid
- ✅ Copy functionality for owned prompts
- ⚠️ Protected route - requires authentication

### 6. Coin Purchase (`/buy-coins`)
- ✅ Coin package selection
- ✅ Stripe integration
- ✅ Payment flow
- ⚠️ Requires Stripe setup

### 7. Payment Success (`/payment-success`)
- ✅ Success confirmation
- ✅ Coin balance update
- ✅ Navigation options

## 🔒 Security Features Implemented

- **Route Protection:** Middleware protects authenticated routes
- **Row Level Security:** Database-level access control
- **Anti-Copy Measures:** CSS and JavaScript protection
- **Watermarking:** Server-side content protection
- **Input Validation:** Form validation and sanitization

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 UI Components

Built with:
- **Tailwind CSS:** Utility-first styling
- **Custom Components:** Reusable UI elements
- **Lucide Icons:** Modern icon set
- **Toast Notifications:** User feedback system

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Update `.env.local` with production values:
- Use production Supabase project
- Use live Stripe keys
- Set correct `NEXT_PUBLIC_APP_URL`

### Recommended Hosting
- **Vercel:** Seamless Next.js deployment
- **Netlify:** Alternative hosting option
- **Railway/Render:** Full-stack deployment

## 🛠️ Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📋 Sample Data

To test the application with sample data, you can insert some prompts into your database:

```sql
-- Insert sample prompts (run in Supabase SQL Editor)
INSERT INTO prompts (title, description, category, preview_content, full_content, price, tags, created_by) VALUES
('ChatGPT Marketing Copy', 'Professional marketing copy generator', 'chatgpt', 'Write compelling marketing copy for...', 'Write compelling marketing copy for [PRODUCT] targeting [AUDIENCE]. Include emotional triggers, clear benefits, and a strong call-to-action. Focus on [KEY_BENEFIT] and address common objections.', 5, ARRAY['marketing', 'copywriting', 'business'], '00000000-0000-0000-0000-000000000000'),
('Midjourney Portrait Style', 'Create stunning portrait photography', 'midjourney', 'Portrait of [SUBJECT] in...', 'Portrait of [SUBJECT] in professional studio lighting, 85mm lens, shallow depth of field, soft natural lighting, high resolution, photorealistic, detailed facial features, professional headshot style --ar 3:4 --v 6', 8, ARRAY['portrait', 'photography', 'professional'], '00000000-0000-0000-0000-000000000000'),
('Claude Code Review', 'Comprehensive code review assistant', 'claude', 'Please review this code for...', 'Please review this code for best practices, security vulnerabilities, performance optimizations, and maintainability. Provide specific suggestions for improvement and explain the reasoning behind each recommendation. Code: [CODE_SNIPPET]', 10, ARRAY['programming', 'review', 'optimization'], '00000000-0000-0000-0000-000000000000');
```

## 🆘 Troubleshooting

### Common Issues:

1. **Build Errors:**
   - Ensure all environment variables are set
   - Check for TypeScript errors: `npm run type-check`

2. **Database Connection:**
   - Verify Supabase URL and keys
   - Check if database setup SQL was executed

3. **Authentication Issues:**
   - Confirm Supabase Auth is enabled
   - Check browser console for errors

4. **Payment Testing:**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Ensure webhook endpoint is configured

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify environment variables
3. Ensure database setup is complete
4. Test with sample data

---

**🎉 Congratulations! Your AI Prompt Marketplace is ready to go!**