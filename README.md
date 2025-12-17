# Restaurant POS System

## 📋 Overview

A complete, modern Point-of-Sale (POS) system for restaurants and cafes built with:
- **Frontend**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime Subscriptions
- **Deployment**: Vercel

### Features
- ✅ Cashier Interface (Sessions, Tables, Menu)
- ✅ Kitchen Display System (KDS)
- ✅ Order Management
- ✅ Inventory Tracking
- ✅ Multi-language Support
- ✅ Alcohol Tracking
- ✅ Real-time Order Updates
- ✅ User Management & Authentication
- ✅ Supplier Management
- ✅ Revenue Reports

## 🗄️ Database Schema

Supabase database is already configured with tables:
- `users` - User management with role-based access
- `menu_items` - Menu items and pricing
- `orders` - Order tracking
- `order_items` - Individual items in orders
- Additional tables for sessions, tables, inventory, suppliers, reports

**Database URL**: supabase.com/project/mrfqapwerwbjdczartyk

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/georgegamelr-spec/restaurant-pos-system.git
cd restaurant-pos-system
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` file
```
NEXT_PUBLIC_SUPABASE_URL=https://mrfqapwerwbjdczartyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SUPABASE_JWT_SECRET=your_jwt_secret
```

4. Run development server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📁 Project Structure

```
restaurant-pos-system/
├── app/
│   ├── page.tsx              # Home page
│   ├── cashier/              # Cashier interface
│   ├── kitchen/              # Kitchen display system
│   ├── api/                  # API routes
│   └── layout.tsx            # Root layout
├── components/               # Reusable components
├── lib/                      # Utilities and helpers
├── public/                   # Static assets
├── styles/                   # Global styles
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🔑 Key Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id` - Update order

### Menu
- `GET /api/menu` - Get menu items
- `POST /api/menu` - Add menu item

## 🎨 UI Components

- Cashier Dashboard
- Table Management
- Menu Display
- Kitchen Display
- Order History
- Reporting Dashboard

## 🔐 Security

- Row-level security (RLS) policies on Supabase
- JWT token authentication
- Protected API routes
- HTTPS only in production

## 📊 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect Vercel to your GitHub account
3. Deploy from Vercel dashboard
4. Set environment variables in Vercel settings

```bash
vercel deploy
```

## 🧪 Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## 📱 Browser Support

- Chrome/Chromium
- Firefox
- Safari
- Edge

## 🤝 Contributing

To contribute to this project:
1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, open an issue on GitHub or contact the development team.

---

**Status**: MVP in development
**Last Updated**: December 17, 2025
**Target Launch**: December 17, 2025
