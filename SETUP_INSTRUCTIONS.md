# AI Prompt Marketplace - Setup Instructions

## 🚀 Quick Start

The application has been built successfully! Follow these steps to run it locally and set up the required services.

## 1. Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

## 2. Environment Configuration

The `.env.local` file contains placeholder values. You'll need to update these with real credentials:

### Supabase Setup
1. Go to [Supabase](https://supabase.com) and create a new project
2. In your project dashboard, go to Settings > API
3. Copy your project URL and anon key
4. Update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### Database Setup
1. In Supabase, go to SQL Editor
2. Copy the contents of `database-setup.sql` and run it
3. This will create all tables, functions, and security policies

### Stripe Setup
1. Create a [Stripe](https://stripe.com) account
2. Get your API keys from the Stripe dashboard
3. Update `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

### Stripe Webhook Configuration
1. In Stripe dashboard, go to Developers > Webhooks
2. Add endpoint: `http://localhost:3000/api/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Copy the webhook secret to your `.env.local`

## 3. Run the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 4. Testing the Application

### With Real Services (Recommended)
1. Set up Supabase and Stripe as described above
2. Create test prompts in your Supabase database
3. Test the full purchase flow with Stripe test cards

### With Mock Data (Quick Testing)
The application will work with placeholder data, but payment and authentication features will not function.

## 5. Key Features to Test

### 🏠 Landing Page (`/`)
- Hero section with call-to-action
- Features showcase
- Categories preview
- Testimonials and footer

### 🔐 Authentication (`/login`)
- Sign up with email/password
- Sign in with existing account
- Google OAuth (if configured in Supabase)

### 🎨 Prompt Gallery (`/gallery`)
- Browse all available prompts
- Search functionality
- Category filtering
- Preview prompts before purchase

### 📄 Prompt Details (`/prompt/[id]`)
- View prompt preview (blurred)
- Purchase with coins
- Copy full content after purchase
- Anti-copy protection measures

### 👤 User Dashboard (`/dashboard`)
- View coin balance
- Access purchased prompts
- Copy purchased prompt content

### 💰 Buy Coins (`/buy-coins`)
- Select coin packages
- Stripe checkout integration
- Payment success confirmation

## 6. Sample Data

To test the application, add some sample prompts to your Supabase database:

```sql
INSERT INTO prompts (title, description, preview_content, full_content, price, category, tags, created_by) VALUES
('Creative Writing Assistant', 'A powerful prompt for generating creative stories and narratives', 'Write a compelling story about...', 'Write a compelling story about [TOPIC] that includes [CHARACTER] who must overcome [CHALLENGE]. Make it engaging with vivid descriptions and emotional depth. Include dialogue and show character development throughout the narrative.', 5, 'writing', ARRAY['creative', 'storytelling', 'narrative'], 'admin'),
('Professional Email Generator', 'Generate professional emails for any business situation', 'Compose a professional email...', 'Compose a professional email for [SITUATION] addressing [RECIPIENT]. The tone should be [TONE - formal/friendly/urgent]. Include [KEY_POINTS] and end with an appropriate call-to-action. Ensure the email is concise, clear, and achieves the desired outcome.', 3, 'business', ARRAY['email', 'professional', 'communication'], 'admin'),
('Social Media Content Creator', 'Create engaging social media posts that drive engagement', 'Create an engaging social media post...', 'Create an engaging social media post for [PLATFORM] about [TOPIC]. The post should be [TONE] and include relevant hashtags. Target audience: [AUDIENCE]. Include a strong hook, valuable content, and a clear call-to-action. Optimize for maximum engagement and reach.', 4, 'marketing', ARRAY['social-media', 'content', 'engagement'], 'admin');
```

## 7. Production Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update webhook URL to your production domain

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 8. Security Notes

- Never commit real API keys to version control
- Use environment variables for all sensitive data
- Enable Row Level Security (RLS) in Supabase
- Test webhook endpoints in production

## 9. Troubleshooting

### Common Issues
1. **Build errors**: Ensure all environment variables are set
2. **Authentication not working**: Check Supabase configuration
3. **Payments failing**: Verify Stripe keys and webhook setup
4. **Database errors**: Ensure SQL schema is properly applied

### Getting Help
- Check the browser console for error messages
- Review Supabase logs for database issues
- Check Stripe dashboard for payment problems

## 🎉 You're Ready!

Your AI Prompt Marketplace is now ready to use. Start by creating an account, adding some test prompts, and exploring all the features!