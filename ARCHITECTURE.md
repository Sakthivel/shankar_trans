# Architecture

## System Overview

```
Browser -> Next.js (Frontend) -> Express.js API (Serverless) -> Prisma -> PostgreSQL
```

## Directory Structure

```
shankar_trans/
├── pages/api/[...path].ts        # Express catch-all serverless handler
├── prisma/
│   ├── schema.prisma             # Database schema (8 tables, 3 enums)
│   └── seed.ts                   # Initial data seeding
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout with AuthProvider
│   │   ├── page.tsx              # Public home page
│   │   ├── login/                # Login page
│   │   └── (dashboard)/          # Protected route group
│   │       ├── layout.tsx        # Dashboard layout (sidebar + header)
│   │       └── dashboard/        # All dashboard pages
│   ├── server/                   # Express.js backend
│   │   ├── app.ts                # Express configuration
│   │   ├── controllers/          # Request handlers
│   │   ├── services/             # Business logic
│   │   ├── routes/               # Route definitions
│   │   ├── middleware/           # Auth, role, validation, error
│   │   └── validators/           # Zod schemas
│   ├── components/               # React components
│   │   ├── ui/                   # Reusable UI (Button, Input, etc.)
│   │   └── layout/               # Sidebar, Header
│   ├── context/                  # React context (Auth)
│   ├── lib/                      # Utilities (Prisma, API client, auth)
│   └── types/                    # TypeScript types
```

## Backend Architecture

Follows clean architecture with three layers:

1. **Routes** - Define HTTP endpoints, apply middleware
2. **Controllers** - Handle request/response, call services
3. **Services** - Business logic, interact with Prisma

## Authentication Flow

1. User submits credentials to `/api/v1/auth/login`
2. Server validates, returns JWT in httpOnly cookies
3. Frontend AuthContext checks `/api/v1/auth/me` on load
4. Next.js middleware redirects unauthenticated users from `/dashboard/*`
5. Express auth middleware validates JWT on every API request

## Role-Based Access

- **Staff**: Create/Read all forms, no approve, no user management
- **Manager**: Staff + approve entries + reports
- **Owner**: Full access including user management

## Database

8 tables with foreign key relationships:
- User, Driver, Vehicle, LoadingPlant, DeliveryLocation
- LpgTanker, ContractVehicle, RoadTrip
