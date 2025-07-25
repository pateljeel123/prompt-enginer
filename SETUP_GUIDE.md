# AI Prompt Marketplace - Complete Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
The application requires several environment variables. Update `.env.local` with your actual credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup
Execute the SQL script in your Supabase dashboard:
```bash
# Copy the contents of database-setup.sql and run it in Supabase SQL Editor
```

### 4. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to see your marketplace!

---

## 📋 Detailed Setup Instructions

### Step 1: Supabase Configuration

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to initialize

2. **Get Your Credentials**
   - Go to Settings → API
   - Copy your Project URL and anon/public key
   - Copy your service_role key (keep this secret!)

3. **Set Up the Database**
   - Go to SQL Editor in your Supabase dashboard
   - Copy the entire contents of `database-setup.sql`
   - Paste and run the script
   - This will create all tables, functions, and security policies

4. **Configure Authentication**
   - Go to Authentication → Settings
   - Enable Email authentication
   - Optionally enable Google OAuth (configure in providers section)

### Step 2: Stripe Configuration

1. **Create a Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Create an account and get your test keys

2. **Get Your Keys**
   - Go to Developers → API keys
   - Copy your Publishable key and Secret key (test mode)

3. **Set Up Webhooks**
   - Go to Developers → Webhooks
   - Add endpoint: `http://localhost:3000/api/stripe-webhook`
   - Select events: `checkout.session.completed`
   - Copy the webhook signing secret

### Step 3: Application Features Testing

Once running, you can test these features:

#### 🏠 Landing Page (`/`)
- Browse the marketing homepage
- View features and pricing
- Navigate to different sections

#### 🔐 Authentication (`/login`)
- Sign up with email/password
- Sign in with existing account
- Test Google OAuth (if configured)

#### 🖼️ Gallery (`/gallery`)
- Browse all available prompts
- Search prompts by title/description
- Filter by category and AI tool
- View prompt previews

#### 📄 Prompt Details (`/prompt/[id]`)
- View detailed prompt information
- See preview content (blurred if not purchased)
- Purchase prompts with coins
- Copy full content after purchase

#### 💰 Buy Coins (`/buy-coins`)
- View coin packages
- Test Stripe checkout flow
- Verify coin balance updates

#### 📊 Dashboard (`/dashboard`)
- View personal coin balance
- See purchased prompts
- Copy purchased prompt content
- Track purchase history

---

## 🧪 Testing Scenarios

### Test User Journey
1. **Sign Up** → Create account on `/login`
2. **Browse** → Explore prompts in `/gallery`
3. **Buy Coins** → Purchase coins via `/buy-coins`
4. **Purchase Prompt** → Buy a prompt from `/prompt/[id]`
5. **Access Content** → View purchased content in `/dashboard`

### Test Data
The database setup includes sample prompts. You can add more by inserting into the `prompts` table:

```sql
INSERT INTO prompts (title, description, preview_content, full_content, price, category, ai_tool, tags)
VALUES (
  'Your Prompt Title',
  'Detailed description',
  'Preview text...',
  'Full prompt content...',
  10, -- price in coins
  'marketing',
  'chatgpt',
  ARRAY['business', 'copywriting']
);
```

---

## 🔧 Development Commands

```bash
# Start development server
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

---

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure all environment variables are set
   - Check that Supabase URL is valid
   - Verify Stripe keys are correct

2. **Authentication Issues**
   - Check Supabase auth settings
   - Verify redirect URLs in Supabase
   - Ensure RLS policies are enabled

3. **Payment Issues**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Check webhook endpoint is accessible
   - Verify webhook secret matches

4. **Database Issues**
   - Ensure all SQL from `database-setup.sql` was executed
   - Check RLS policies are active
   - Verify user permissions

### Debug Tips
- Check browser console for client-side errors
- Check Supabase logs for database issues
- Check Stripe dashboard for payment logs
- Use `npm run dev` for detailed error messages

---

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Update `NEXT_PUBLIC_APP_URL` to your production URL
4. Update Stripe webhook endpoint to production URL

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_SECRET_KEY=sk_live_your_live_secret
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 📞 Support

If you encounter any issues:
1. Check this setup guide thoroughly
2. Review the README.md for technical details
3. Check the database schema in `database-setup.sql`
4. Verify all environment variables are correctly set

The application is now ready for development and testing! 🎉