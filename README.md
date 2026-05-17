# StackSaver

StackSaver is a full-stack SaaS-style web application that helps startup teams audit their AI tool spending. It analyzes subscriptions and API usage across tools such as Cursor, GitHub Copilot, ChatGPT, Claude, OpenAI API, Gemini, Windsurf, and v0, then generates a shareable report with estimated monthly savings, annual savings, efficiency score, and tool-level recommendations.

The project is designed as a production-oriented assignment submission with a real database-backed audit flow, public report links, lead capture, email delivery, admin visibility, and a polished responsive UI with dark mode support.

## Live Demo

Add your deployed URL here after deployment:

```text
https://your-vercel-app-url.vercel.app
```

## Repository

```text
https://github.com/Chaitanya-Wanjari/stacksaver
```

## Problem Statement
Modern engineering teams increasingly use multiple AI tools for coding, writing, research, automation, and API-based workflows. As teams grow, AI tool spending can become fragmented across unused seats, duplicate subscriptions, mismatched plans, and high API usage.

StackSaver solves this problem by giving teams a quick, explainable audit of their AI stack. Instead of only tracking expenses, it provides actionable recommendations that help reduce waste while preserving productivity.

The goal is to help startup teams treat AI spend as an optimizable operating expense rather than an unclear monthly bill.
## Key Features

### AI Spend Audit

Users can enter team size, engineering team size, company stage, use case, and details of each AI tool being used. StackSaver calculates:

* Current monthly AI spend
* Recommended monthly spend
* Estimated monthly savings
* Estimated annual savings
* Spend per engineer
* Efficiency score out of 100

### Tool-Level Recommendations

The audit engine generates explainable recommendations for each tool, including:

* Removing unused seats
* Consolidating overlapping coding assistants
* Reviewing plan fit
* Keeping tools that are already efficient
* Reviewing high API usage where applicable

Each recommendation includes:

* Current spend
* Recommended spend
* Monthly savings
* Confidence level
* Category
* Reason for the recommendation

### Public Audit Reports

Every completed audit is saved to Supabase and assigned a unique public report URL. Users can refresh the report page or open it in another browser session without losing the result.

### Lead Capture

Users can request the report by email using the lead capture form. Submitted leads are stored in Supabase with relevant audit context.

### Email Delivery

StackSaver integrates with Resend for sending audit report emails. The sender can be configured using a verified domain.

### Admin Dashboard

The project includes an admin route for viewing audit and lead data. Access is protected using an environment-based admin password.

### Responsive SaaS UI

The interface is designed to look like a modern SaaS product and includes:

* Landing page with product positioning
* Audit input form
* Report dashboard
* Recommendation cards
* Lead capture section
* Responsive layout
* Dark mode toggle
* Clean typography using Geist

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui components
* Lucide React icons
* next-themes for dark mode

### Backend

* Next.js API routes
* Supabase database
* Supabase service role client for server-side operations
* Resend email API

### Tooling

* ESLint
* TypeScript
* npm
* Git and GitHub

## Architecture Overview

StackSaver follows a simple full-stack architecture:

```text
User
  |
  v
Next.js Frontend
  |
  v
Next.js API Routes
  |
  |-- Audit Engine
  |-- Supabase Database
  |-- Resend Email Service
  |
  v
Public Audit Report / Admin Dashboard
```

### Main Flow

1. User enters AI stack details in the audit form.
2. The application validates the input.
3. The audit engine calculates spend, savings, and recommendations.
4. The audit result is saved in Supabase.
5. A unique public report link is generated.
6. User can copy the report link or request the report by email.
7. Lead details are stored in Supabase.
8. Admin can review submitted audits and leads.

## Database Schema

The project uses Supabase with the following main tables:

### audits

Stores generated audit reports.

Important fields include:

* `public_id`
* `team_size`
* `engineering_team_size`
* `company_stage`
* `use_case`
* `tools`
* `result`
* `total_current_spend`
* `total_monthly_savings`
* `total_annual_savings`
* `created_at`

### leads

Stores users who request audit reports by email.

Important fields include:

* `email`
* `company_name`
* `role`
* `public_id`
* `team_size`
* `monthly_savings`
* `wants_consultation`
* `created_at`

### events

Can be used for storing product events and audit-related activity.

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
ADMIN_PASSWORD=
```

### Variable Description

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Base URL of the application. Use localhost in development and the deployed URL in production. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon or publishable key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server-side service role or secret key. Must not be exposed to the client. |
| `RESEND_API_KEY` | Resend API key used for sending report emails. |
| `ADMIN_PASSWORD` | Password used to access the admin dashboard. |

Do not commit `.env.local` to GitHub. Only commit `.env.example` with blank placeholder values.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Chaitanya-Wanjari/stacksaver.git
cd stacksaver
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Then fill in the required Supabase, Resend, and admin values.

### 4. Set up Supabase

Create a new Supabase project and run the SQL schema from:

```text
supabase/schema.sql
```

After running the schema, verify that the following tables exist:

```text
audits
leads
events
```

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

### Development

```bash
npm run dev
```

Starts the development server.

### Production Build

```bash
npm run build
```

Builds the application for production.

### Production Server

```bash
npm run start
```

Starts the production server after building.

### Linting

```bash
npm run lint
```

Runs lint checks.

### Type Checking

```bash
npm run typecheck
```

Runs TypeScript type checking if configured in `package.json`.

### Tests

```bash
npm test
```

Runs tests if configured.

## Demo Test Case

Use the following example to generate a meaningful audit report:

### Company Details

```text
Company stage: Seed
Team size: 5
Engineering team size: 3
Use case: Coding
```

### Tool 1

```text
Tool: Cursor
Plan: Pro
Monthly spend: 200
Seats: 10
Usage: Heavy
```

### Tool 2

```text
Tool: GitHub Copilot
Plan: Business
Monthly spend: 95
Seats: 5
Usage: Moderate
```

### Tool 3

```text
Tool: OpenAI API
Plan: API direct
Monthly spend: 300
Seats: 1
Usage: Critical
```

Expected result:

```text
Current spend: $595/month
Recommended spend: $400/month
Estimated savings: $195/month
Estimated annual savings: $2,340/year
```

## Project Structure

```text
stacksaver/
  app/
    api/
      audits/
      leads/
    audit/
      [publicId]/
      new/
    admin/
    globals.css
    layout.tsx
    page.tsx

  components/
    audit/
      AuditResults.tsx
      LeadCaptureForm.tsx
      SpendForm.tsx
    providers/
      theme-provider.tsx
    theme-toggle.tsx
    ui/

  lib/
    audit/
    db/
    email/
    validation/

  supabase/
    schema.sql

  tests/
  README.md
  package.json
```

## Security Notes

* Supabase service role key is used only on the server side.
* `.env.local` should never be committed.
* Public report links use generated public IDs instead of exposing database IDs.
* Admin access is protected using an environment variable.
* Resend API key should be stored only in environment variables.
* Email sending should use a verified domain in production.


