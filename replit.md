# ZeroShotHire - AI-Powered Career Guidance Platform

## Overview

ZeroShotHire is an AI-powered career guidance platform that helps users discover their ideal career paths through personalized recommendations, skill gap analysis, and structured learning roadmaps. The platform combines career counseling with educational features, offering LinkedIn profile optimization, resume building, and interactive career roadmaps.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool.

**UI Component System**: Built on shadcn/ui components with Radix UI primitives, providing a comprehensive design system with consistent styling and accessibility features. The "new-york" style variant is used with custom theming.

**Styling Approach**: Tailwind CSS with custom design tokens defined in CSS variables, supporting light and dark themes. The design follows an educational platform aesthetic with blue/purple color schemes, drawing inspiration from platforms like Coursera and LinkedIn Learning.

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration that handles API requests and caching.

**Routing**: Wouter for client-side routing, providing a lightweight alternative to React Router.

**Animation**: Framer Motion for declarative animations and micro-interactions, including progress rings, counters, and page transitions.

**Form Handling**: React Hook Form with Zod validation for type-safe form management.

### Backend Architecture

**Runtime**: Node.js with Express.js server.

**API Design**: RESTful API architecture with routes defined in `server/routes.ts`. Key endpoints include:
- LinkedIn profile optimization and management
- Resume building and generation
- Career roadmap progress tracking
- User profile management

**Data Storage Strategy**: Currently uses in-memory storage (`MemStorage` class) for development, with interface-based design (`IStorage`) allowing easy migration to persistent databases. The application is structured to support Drizzle ORM with PostgreSQL (via Neon serverless).

**AI Integration**: OpenAI API integration for intelligent features like LinkedIn profile optimization and career recommendations.

**Development Server**: Custom Vite middleware setup for hot module replacement in development, with separate production build process.

### Design System

**Typography**: 
- Primary: Inter (body text, UI elements)
- Accent: Outfit (headers, distinctive elements)
- Monospace: JetBrains Mono (data/statistics)

**Color Philosophy**: Educational and approachable aesthetic with primary blue (trust), deep purple (AI/innovation), success green, and warning amber. Supports comprehensive light/dark theming through CSS variables.

**Component Patterns**: Compound components with progressive disclosure, celebratory feedback (confetti animations), and data visualization through Recharts for career fit analysis.

### Data Models

**Core Entities**:
- User profiles with skills, interests, career goals, and work preferences
- LinkedIn profiles with headline, summary, experience, and skills
- Resumes with personal info, experience, education, and skills sections
- Career roadmaps with milestones and learning phases
- User progress tracking for roadmaps and achievements

**Validation**: Zod schemas defined in `shared/schema.ts` for type-safe data validation across client and server.

## External Dependencies

### Third-Party Services

**OpenAI API**: Used for AI-powered features including career recommendations, LinkedIn profile optimization, and potentially resume content generation. Requires `OPENAI_API_KEY` environment variable.

**Neon Database**: PostgreSQL serverless database provider configured through `@neondatabase/serverless`. Requires `DATABASE_URL` environment variable.

### Key Libraries

**UI Components**: Radix UI primitives (@radix-ui/*) for accessible, unstyled components.

**Data Visualization**: Recharts for rendering career fit radar charts and skill gap bar charts.

**Form Management**: React Hook Form with @hookform/resolvers for Zod integration.

**Styling**: Tailwind CSS with class-variance-authority and clsx for conditional styling.

**Animation**: Framer Motion for animations, canvas-confetti for achievement celebrations.

**Database**: Drizzle ORM with Drizzle Kit for schema management and migrations.

**Development Tools**: 
- TSX for TypeScript execution
- ESBuild for production builds
- Vite plugins for Replit integration (cartographer, dev-banner, runtime-error-modal)

### Database Configuration

Drizzle ORM configured with PostgreSQL dialect, schema defined in `shared/schema.ts`, migrations output to `./migrations` directory. The application expects a `DATABASE_URL` environment variable pointing to a PostgreSQL database.

### Font Loading

Google Fonts CDN for web fonts (Inter, Outfit, DM Sans, Geist Mono, Architects Daughter, Fira Code) loaded via HTML link tags.

### Session Management

Configured for PostgreSQL session storage via `connect-pg-simple`, though current implementation uses in-memory storage.