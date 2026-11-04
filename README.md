# FoodieHub 🍽️

A responsive restaurant discovery and menu browsing application built with React, TypeScript, Vite, and Supabase.

## Features
- Browse curated restaurants and explore their menus.
- Search by restaurant name, cuisine, or description.
- Filter restaurants by cuisine.
- View dish descriptions, photos, dietary labels, and prices.
- Save favorite restaurants during the current session.
- Add menu items to a demo cart and calculate totals.
- Email/password sign-up and login using Supabase Auth.
- Responsive layout for desktop and mobile.

> The cart is currently a front-end demonstration. Checkout, payment processing, and order fulfillment are intentionally not enabled.

## Tech stack
- React 18 + TypeScript + Vite
- Supabase Auth + PostgreSQL (optional backend connection)
- Lucide icons
- Responsive CSS

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```

The restaurant and menu catalogue is seeded in the frontend so the site can be explored immediately.

## Connect Supabase authentication and database
1. Create a free project at https://supabase.com/.
2. In the Supabase SQL Editor, run supabase/schema.sql.
3. Copy the project URL and anon/public key from Project Settings → API.
4. Put them in .env.local:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Restart the Vite development server.

The anon/public key is intended for browser use when Row Level Security is correctly configured. Never put a Supabase service-role key in frontend code or commit secrets to GitHub.

## Deploy on Vercel
1. Import this public GitHub repository into https://vercel.com/.
2. Select the Vite framework preset (Vercel normally detects it automatically).
3. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY as environment variables if authentication is to be enabled.
4. Deploy.

Vercel Hobby and Supabase Free have usage limits and eligibility rules. Free tiers can change, pause inactive projects, or require upgrades if limits are exceeded. Review each provider's current terms and do not enable paid usage if the project must remain at $0.

## Demo catalogue
The initial sample catalogue includes Indian, Italian, healthy, and Japanese restaurants. Sample menu data is local to the frontend; the SQL schema is ready for moving the catalogue into Supabase in a later step.