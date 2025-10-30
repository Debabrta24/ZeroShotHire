# Deployment Guide for Vercel

This application is configured for deployment on Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed (optional): `npm i -g vercel`

## Environment Variables

Before deploying, you need to set up your environment variables in Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
DATABASE_URL=your_database_url
A4F_API_KEY=your_openai_api_key
RAPIDAPI_KEY=your_rapidapi_key
NEWSDATA_API_KEY=your_news_api_key
EVENTBRITE_API_KEY=your_eventbrite_key
SESSION_SECRET=your_secure_session_secret
PORT=5000
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to https://vercel.com/new
3. Import your repository
4. Vercel will automatically detect the configuration
5. Add your environment variables
6. Click "Deploy"

### Option 2: Deploy via CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Build Configuration

The application uses the following build configuration:

- **Build Command**: `npm run build`
- **Output Directory**: `dist/public` (frontend static files)
- **Install Command**: `npm install`
- **Serverless Handler**: `api/index.ts` (Vercel serverless function)

## How It Works

This application uses Vercel's hybrid deployment model:
- **Frontend**: Built React app is served as static files from the `dist/public` directory
- **API Routes**: The `api/index.ts` file exports the Express app as a serverless function
- **Routing**:
  - `/api/*` routes are handled by the serverless Express function via rewrite
  - Static assets (files with extensions, `/assets/*`, etc.) are served directly from `dist/public`
  - All other paths (client-side routes like `/dashboard`, `/profile`) are rewritten to `/index.html` for SPA routing
  - The React Router (wouter) handles client-side navigation
- **Build Process**: 
  - `npm run build` compiles both the frontend (Vite) and backend (esbuild)
  - Frontend goes to `dist/public/` for static serving on Vercel
  - Backend is bundled separately (not used by Vercel - api/index.ts is the entry point)

## Database Setup

Make sure your DATABASE_URL points to a production database (e.g., Neon, Supabase, or another PostgreSQL provider).

## Post-Deployment

After successful deployment:

1. Test all API endpoints
2. Verify environment variables are loaded correctly
3. Check database connections
4. Test authentication flows

## Troubleshooting

- **Build fails**: Check that all dependencies are in `dependencies` (not `devDependencies`) for production
- **API routes not working**: Verify `vercel.json` routing configuration
- **Environment variables not loading**: Double-check they're set in Vercel project settings
- **Database connection issues**: Ensure DATABASE_URL is correct and database is accessible from Vercel's servers

## Local Production Testing

To test the production build locally:

```bash
npm run build
npm start
```

Then visit http://localhost:5000

## Notes

- The application serves both frontend and backend from a single server
- Port 5000 is used by default but Vercel will override this
- All API routes are prefixed with `/api`
- Static assets are served from the `dist` directory after build
