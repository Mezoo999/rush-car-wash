# Lam3a - لمعة | Premium Mobile Car Wash Booking System

A production-ready web platform for **Lam3a** - a premium mobile car wash service operating in 6th of October & Sheikh Zayed, Egypt.

![Lam3a Brand](https://placeholder-for-screenshot.png)

## Features

### Customer-Facing
- **Premium Landing Page** - Arabic-first interface with elegant design
- **Multi-Step Booking System** - 5-step booking flow with car details, service selection, location & time, add-ons, and payment
- **Service Catalog** - 4 service tiers: Basic, Plus, Steam, Signature
- **Monthly Packages** - 3 subscription packages with savings
- **Dynamic Pricing** - Based on car category (Standard, SUV, Luxury)

### Admin Dashboard
- **Order Management** - View, filter, and manage all orders
- **Customer Management** - Customer profiles and order history
- **Service Management** - CRUD operations for services and packages
- **Worker Management** - Assign workers to orders and track performance
- **Revenue Overview** - Real-time statistics and reporting

### Worker Panel
- **Mobile-First Design** - Optimized for field workers
- **Job List** - View assigned jobs with customer details
- **Status Updates** - Update job status (On the way → Started → Completed)
- **Navigation** - One-tap Google Maps navigation

## Tech Stack

### Frontend
- **Next.js 14** - App Router, React Server Components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Supabase** - PostgreSQL database
- **Supabase Auth** - Authentication
- **Supabase Realtime** - Live updates
- **Row Level Security** - Data protection

### Hosting
- **Vercel** - Frontend hosting
- **Supabase** - Database hosting

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/lam3a.git
cd lam3a
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```
Edit `.env.local` with your Supabase credentials.

4. **Set up the database**
Run the SQL schema in `supabase/schema.sql` in your Supabase SQL Editor.

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

```bash
npm run build
```

The static files will be generated in the `dist` folder.

## Project Structure

```
my-app/
├── app/                      # Next.js app router
│   ├── (landing)/           # Landing page routes
│   ├── (booking)/           # Booking system routes
│   ├── (admin)/             # Admin dashboard routes
│   └── (worker)/            # Worker panel routes
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── landing/             # Landing page sections
│   ├── booking/             # Booking wizard components
│   ├── admin/               # Admin dashboard components
│   └── worker/              # Worker panel components
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── utils/               # Utility functions
│   └── hooks/               # Custom React hooks
├── types/                   # TypeScript types
├── supabase/
│   └── schema.sql           # Database schema
└── public/                  # Static assets
```

## Database Schema

### Core Tables
- **users** - User accounts (customers, workers, admins)
- **cars** - Customer vehicle information
- **services** - Available service offerings
- **packages** - Monthly subscription packages
- **add_ons** - Optional service add-ons
- **orders** - Booking orders
- **workers** - Worker profiles
- **offers** - Promotional offers

### Pricing Logic

**Service Pricing (EGP):**
| Service | Standard | SUV (+20%) | Luxury (+35%) |
|---------|----------|------------|---------------|
| Basic | 330 | 400 | 445 |
| Plus | 450 | 540 | 607 |
| Steam | 600 | 720 | 810 |
| Signature | 800 | 960 | 1,080 |

**Monthly Packages:**
| Package | Washes | Standard | SUV |
|---------|--------|----------|-----|
| Basic | 3 | 900 | 1,100 |
| Standard | 4 | 1,300 | 1,600 |
| Premium | 4 | 1,900 | 2,200 |

## Authentication

The app uses Supabase Auth with the following roles:
- **customer** - Can book services and view their orders
- **worker** - Can view assigned jobs and update status
- **admin** - Full access to all features

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Customization

### Brand Colors
Edit the CSS variables in `app/globals.css`:

```css
--lam3a-charcoal: #1a1a1a;
--lam3a-beige: #d4a574;
--lam3a-cream: #faf8f5;
```

### Services & Pricing
Update the seed data in `supabase/schema.sql` or use the admin dashboard.

## Roadmap

- [x] Landing page
- [x] Booking system
- [x] Admin dashboard
- [x] Worker panel
- [ ] Online payment integration
- [ ] SMS notifications
- [ ] Customer mobile app
- [ ] Analytics dashboard
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email info@lam3a.com or join our Slack channel.

---

Made with ❤️ in Egypt by the Lam3a Team
