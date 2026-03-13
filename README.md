# Shankar Transport Management System

A full-stack transport fleet management web application built with Next.js, Express.js, Prisma, and PostgreSQL. Deployed on Vercel.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js (Vercel Serverless Functions)
- **Database**: PostgreSQL (Prisma Postgres)
- **ORM**: Prisma
- **Auth**: JWT with httpOnly cookies, bcrypt password hashing
- **Validation**: Zod

## Features

- **Authentication**: Login/Logout with JWT, role-based access control
- **Roles**: Staff, Manager, Owner with different permission levels
- **LPG Tanker**: Full CRUD with 26 form fields including financial tracking
- **Contract Vehicle**: Full CRUD with shift and KM tracking
- **Road Trip**: Full CRUD with document upload and GC tracking
- **Master Data**: CRUD for Drivers, Vehicles, Loading Plants, Delivery Locations
- **Dashboard**: Role-specific views with summary statistics
- **Reports**: Filter by vehicle, driver, trip ID, month, year with CSV export
- **Approval Workflow**: Manager/Owner can approve entries

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use Prisma Postgres)

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` - Prisma Postgres connection string
- `DIRECT_DATABASE_URL` - Direct PostgreSQL connection for migrations
- `JWT_SECRET` - Secret for JWT access tokens
- `JWT_REFRESH_SECRET` - Secret for JWT refresh tokens

### Database Setup

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default Login Credentials

| User ID  | Password | Role    |
|----------|----------|---------|
| owner    | admin123 | Owner   |
| manager  | admin123 | Manager |
| staff    | admin123 | Staff   |

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Set build command: `prisma generate && next build`
5. Deploy

## API Endpoints

All API endpoints are prefixed with `/api/v1`:

| Endpoint | Methods | Auth | Description |
|----------|---------|------|-------------|
| `/auth/login` | POST | No | User login |
| `/auth/logout` | POST | No | User logout |
| `/auth/me` | GET | Yes | Current user info |
| `/users` | CRUD | Owner | User management |
| `/drivers` | CRUD | Yes | Driver management |
| `/vehicles` | CRUD | Yes | Vehicle management |
| `/loading-plants` | CRUD | Yes | Loading plant management |
| `/delivery-locations` | CRUD | Yes | Delivery location management |
| `/lpg-tankers` | CRUD + Approve | Yes | LPG tanker entries |
| `/contract-vehicles` | CRUD + Approve | Yes | Contract vehicle entries |
| `/road-trips` | CRUD + Approve | Yes | Road trip entries |
| `/reports` | GET | Yes | Report generation |
