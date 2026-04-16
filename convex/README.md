# Convex Backend

This folder is reserved for the shared backend used by the web and future mobile apps.

Initial scope:

- schema for users, workspaces, polls, options, and responses
- Better Auth plus Convex integration for creator authentication
- queries and mutations for workspace and poll flows
- authorization checks around workspace ownership
- analytics read models for the creator dashboard

Auth setup notes:

- Run `pnpm run convex:dev` from the repo root to initialize Convex and generate `convex/_generated/*`
- Run `pnpm run auth:generate` after the Better Auth config is in place
- Set `BETTER_AUTH_SECRET` and `SITE_URL` through Convex env
- The root Convex scripts read deployment values from `apps/web/.env.local`
- The Better Auth generator runs from `convex/betterAuth` and overwrites `schema.ts`

After dependencies are installed, run `pnpm run convex:dev` from the repo root or wire a dedicated script to generate the `_generated` files.
