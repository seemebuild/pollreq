# Convex Backend

This folder is reserved for the shared backend used by the web and future mobile apps.

Initial scope:

- schema for users, workspaces, polls, options, and responses
- Better Auth plus Convex integration for creator authentication
- queries and mutations for workspace and poll flows
- authorization checks around workspace ownership
- analytics read models for the creator dashboard

Auth setup notes:

- Run `pnpm exec convex dev` to initialize Convex and generate `convex/_generated/*`
- Run `pnpm exec auth generate --config ./convex/betterAuth/auth.ts --output ./convex/betterAuth/schema.ts` after the Better Auth config is in place
- Set `BETTER_AUTH_SECRET` and `SITE_URL` through Convex env

After dependencies are installed, run `pnpm exec convex dev` from the repo root or wire a dedicated script to generate the `_generated` files.
