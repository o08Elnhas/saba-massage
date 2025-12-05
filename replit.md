# Saba Massage Center - مركز سبأ للمساج

## Overview

A full-stack web application for Saba Massage Center with an admin dashboard for managing offers and site content. Built with React, Express, TypeScript, and PostgreSQL.

**Current State:** MVP Complete - Fully functional booking system with admin management.

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Replit Auth (OpenID Connect)
- **Maps:** Leaflet, React-Leaflet

## Project Structure

```
├── client/                 # Frontend (React)
│   └── src/
│       ├── components/     # Shared components
│       │   └── admin-layout.tsx  # Admin sidebar layout
│       ├── hooks/          # React Hooks
│       │   ├── useAuth.ts  # Authentication hook
│       │   └── use-toast.ts
│       ├── lib/            # Utilities
│       │   ├── queryClient.ts
│       │   ├── authUtils.ts
│       │   └── utils.ts
│       ├── pages/          # Application pages
│       │   ├── admin/      # Admin dashboard pages
│       │   │   ├── dashboard.tsx
│       │   │   ├── offers.tsx
│       │   │   └── settings.tsx
│       │   ├── landing.tsx # Public landing page
│       │   ├── home.tsx    # Logged-in home page
│       │   ├── booking.tsx # Booking with map
│       │   └── not-found.tsx
│       └── App.tsx         # Main router
├── server/                 # Backend (Express)
│   ├── db.ts               # Database connection
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data layer (DatabaseStorage)
│   ├── replitAuth.ts       # Authentication setup
│   └── index.ts            # Server entry point
├── shared/                 # Shared code
│   └── schema.ts           # Drizzle schemas (users, offers, settings, sessions)
├── design_guidelines.md    # UI/UX guidelines
└── README.md               # Installation instructions
```

## Database Schema

- **users** - User accounts with isAdmin flag
- **offers** - Massage packages/offers
- **site_settings** - Dynamic site configuration
- **sessions** - Authentication sessions

## Key Features

1. **Public Pages:**
   - Landing page with offers display
   - Home page for logged-in users
   - Interactive booking with Leaflet map
   - WhatsApp integration for bookings

2. **Admin Dashboard:**
   - Full CRUD for offers
   - Site settings management
   - Real-time statistics

## API Endpoints

- `GET/POST/PUT/DELETE /api/offers` - Offers CRUD
- `PATCH /api/offers/:id/toggle` - Toggle offer status
- `GET/POST /api/settings` - Site settings
- `GET /api/auth/user` - Current user info
- `GET /api/login` - Start login flow
- `GET /api/logout` - End session

## Making a User Admin

```sql
UPDATE users SET is_admin = true WHERE email = 'user@example.com';
```

## Running Locally

```bash
npm install
npm run db:push
npm run dev
```

## Recent Changes

- 2024-12-01: Initial MVP complete
  - Full admin dashboard for offers and settings
  - Public booking system with map
  - Replit Auth integration
  - PostgreSQL database setup
  - Arabic RTL design

## User Preferences

- Arabic (RTL) interface
- Green color scheme (primary)
- Cairo and Tajawal fonts
- WhatsApp integration for bookings
