# AI Prompt Marketplace

A modern, full-stack marketplace for premium AI prompts built with Next.js, Supabase, and Stripe. Users can browse, purchase, and manage AI prompts for ChatGPT, Midjourney, DALL-E, and other AI tools using a coin-based system.

## 🚀 Features

### Core Features
- **User Authentication** - Secure signup/login with Supabase Auth
- **Prompt Gallery** - Browse and search premium AI prompts
- **Coin-based Purchasing** - Virtual currency system for transactions
- **Stripe Integration** - Secure payment processing for coin purchases
- **User Dashboard** - Manage purchased prompts and coin balance
- **Anti-copy Protection** - Watermarking and copy protection for purchased content

### Technical Features
- **Modern UI/UX** - Built with Tailwind CSS and Lucide React icons
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags, sitemap, and search engine friendly
- **Real-time Updates** - Live coin balance and purchase status
- **Secure Transactions** - Row-level security with Supabase RLS
- **Type Safety** - Full TypeScript implementation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Payments**: Stripe
- **UI Components**: Lucide React, React Hot Toast
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account
- Git

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-prompt-marketplace
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL script from `database-setup.sql` in the Supabase SQL editor
3. Enable Row Level Security (RLS) in the Supabase dashboard
4. Get your project URL and API keys from the Supabase dashboard

### 4. Stripe Setup

1. Create a Stripe account
2. Get your publishable and secret keys from the Stripe dashboard
3. Set up a webhook endpoint pointing to `/api/stripe-webhook`
4. Add the webhook secret to your environment variables

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📊 Database Schema

The application uses the following main tables:

- **users** - User profiles with coin balances
- **prompts** - AI prompt content and metadata
- **purchases** - User prompt purchases
- **coin_transactions** - Transaction history

See `database-setup.sql` for the complete schema.

## 💳 Coin Packages

The marketplace offers three coin packages:

- **Starter Pack**: 20 coins for ₹99
- **Popular Pack**: 50 coins for ₹199 (Most Popular)
- **Pro Pack**: 100 coins for ₹349

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Anti-copy Protection** - Content watermarking and copy prevention
- **Secure Payments** - Stripe-powered payment processing
- **User Authentication** - Supabase Auth with email verification

## 📱 Pages & Routes

- `/` - Landing page
- `/login` - Authentication (login/signup)
- `/gallery` - Prompt gallery with search and filters
- `/prompt/[id]` - Individual prompt details
- `/dashboard` - User dashboard
- `/buy-coins` - Coin purchase page
- `/payment-success` - Payment confirmation

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Prompts

Prompts can be added directly to the database or through an admin interface (not included in MVP). Each prompt should have:

- Title and description
- Full content and preview (20% of content)
- Price in coins
- Category and tags
- Optional image URL

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.js`
- Customize color scheme in the CSS variables

### Coin Packages
- Update packages in `src/app/buy-coins/page.tsx`
- Modify Stripe prices in `src/app/api/create-checkout-session/route.ts`

### Categories
- Add new categories in `src/app/gallery/page.tsx`
- Update category filters as needed

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify environment variables
   - Check Supabase project status
   - Ensure RLS policies are set correctly

2. **Stripe Webhook Issues**
   - Verify webhook endpoint URL
   - Check webhook secret
   - Ensure webhook is active in Stripe dashboard

3. **Build Errors**
   - Clear `.next` folder and rebuild
   - Check for TypeScript errors
   - Verify all dependencies are installed

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions:
- Email: support@aipromptmarketplace.com
- Create an issue in the repository

## 🔮 Future Features

- Admin panel for prompt management
- Subscription model
- Multi-language support
- AI-generated prompt previews
- User reviews and ratings
- Referral system
- Advanced analytics

---

Built with ❤️ for the AI community
