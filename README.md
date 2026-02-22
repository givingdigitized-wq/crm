# Landlord CRM – Milestone 1

## Stack
- Next.js App Router + TypeScript
- Prisma + PostgreSQL
- NextAuth (credentials)
- Tailwind + simple shadcn-style UI primitives

## Features delivered
- Landlord sign up/sign in
- Data isolation via `landlordId` on all core tables
- CRUD create/list pages for Contacts, Properties, Units, and Leases
- Lease rule: one active lease per unit (app-level enforcement)
- Prisma migration and seed data
- Basic tests for lease rule logic

## Environment variables
Copy `.env.example` to `.env`.

## Setup and run
```bash
npm install
npm run prisma:generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

## Seed account
- Email: `landlord@example.com`
- Password: `password123`

## Acceptance checks
1. Sign up creates a landlord account and redirects to dashboard.
2. Signed in landlord can create/list contacts in `/contacts`.
3. Signed in landlord can create/list properties in `/properties`.
4. Property detail page `/properties/[id]` allows unit creation and lists units.
5. `/leases` allows selecting landlord-owned unit/contact and creating lease.
6. Creating a second `active` lease for the same unit is blocked.
7. All reads/writes are scoped by `landlordId`.
