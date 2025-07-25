# AI Prompt Marketplace - Setup Guide

This guide will help you set up and run the AI Prompt Marketplace application locally.

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Stripe account (for payment processing)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the `.env.local` file and update it with your actual credentials:

```bash
cp .env.local .env.local.example
```

Update `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

1. Create a new Supabase project
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `database-setup.sql`
4. Run the SQL script to create tables, functions, and policies

### 4. Configure Stripe Webhooks

1. In your Stripe dashboard, go to Webhooks
2. Add endpoint: `http://localhost:3000/api/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Copy the webhook secret to your `.env.local`

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features to Test

### 1. Authentication
- Visit `/login` to sign up or sign in
- Test with email/password authentication

### 2. Browse Prompts
- Visit `/gallery` to see available prompts
- Use search and filtering features
- Click on prompts to view details

### 3. Purchase System
- Sign in and visit a prompt detail page
- Try purchasing a prompt (requires coins)
- Check your dashboard to see purchased prompts

### 4. Coin System
- Visit `/buy-coins` to purchase coin packages
- Use Stripe test cards for testing:
  - Success: `4242 4242 4242 4242`
  - Declined: `4000 0000 0000 0002`

### 5. Dashboard
- Visit `/dashboard` to see your profile
- View purchased prompts
- Copy prompt content

## Sample Data

To test the application, you can add sample prompts directly in Supabase:

```sql
INSERT INTO prompts (title, description, preview_content, full_content, price, category, tags, author_id) VALUES
('Creative Writing Assistant', 'Help with creative writing and storytelling', 'You are a creative writing assistant...', 'You are a creative writing assistant that helps users develop compelling stories, characters, and narratives. Provide detailed guidance on plot development, character arcs, and writing techniques.', 5, 'Writing', ARRAY['writing', 'creative', 'storytelling'], (SELECT id FROM auth.users LIMIT 1)),
('Code Review Expert', 'Professional code review and optimization', 'You are a senior software engineer...', 'You are a senior software engineer with expertise in code review and optimization. Analyze code for best practices, performance improvements, security vulnerabilities, and maintainability. Provide constructive feedback and suggestions.', 8, 'Programming', ARRAY['coding', 'review', 'optimization'], (SELECT id FROM auth.users LIMIT 1)),
('Marketing Copy Generator', 'Generate compelling marketing content', 'Create engaging marketing copy...', 'Create engaging marketing copy that converts. Focus on understanding the target audience, highlighting key benefits, and using persuasive language. Include headlines, descriptions, and call-to-action suggestions.', 6, 'Marketing', ARRAY['marketing', 'copywriting', 'sales'], (SELECT id FROM auth.users LIMIT 1));
```

## Troubleshooting

### Common Issues

1. **Build Errors**: Make sure all environment variables are set correctly
2. **Database Connection**: Verify Supabase URL and keys
3. **Stripe Integration**: Ensure webhook endpoint is accessible
4. **Authentication Issues**: Check Supabase auth configuration

### Development Tips

- Use `npm run build` to check for build errors
- Check browser console for client-side errors
- Monitor Supabase logs for database issues
- Test Stripe webhooks with ngrok for local development

## Production Deployment

1. Set up production environment variables
2. Configure Stripe webhooks for production domain
3. Set up proper CORS policies in Supabase
4. Deploy to Vercel, Netlify, or your preferred platform

## Security Notes

- Never commit real API keys to version control
- Use environment variables for all sensitive data
- Enable Row Level Security (RLS) in Supabase
- Validate all user inputs on the server side
- Implement rate limiting for API endpoints

## Support

If you encounter issues:
1. Check the console logs
2. Verify environment variables
3. Test database connectivity
4. Review Stripe webhook logs