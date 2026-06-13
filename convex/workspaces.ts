import { ConvexError, v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("Authentication is required.");
  }

  return identity;
}

async function ensureUser(ctx: MutationCtx) {
  const identity = await requireIdentity(ctx);
  const authUserId = identity.tokenIdentifier;
  const existingUser = await ctx.db
    .query("users")
    .withIndex("by_auth_user_id", (q) => q.eq("authUserId", authUserId))
    .unique();

  if (existingUser) {
    return existingUser;
  }

  const userId = await ctx.db.insert("users", {
    authUserId,
    email: identity.email,
    name: identity.name
  });

  const createdUser = await ctx.db.get(userId);

  if (!createdUser) {
    throw new ConvexError("Unable to create the authenticated user record.");
  }

  return createdUser;
}

export const getViewerWorkspace = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return {
        isAuthenticated: false,
        user: null,
        workspace: null
      };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", identity.tokenIdentifier))
      .unique();

    if (!user) {
      return {
        isAuthenticated: true,
        user: {
          name: identity.name ?? null,
          email: identity.email ?? null
        },
        workspace: null
      };
    }

    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user._id))
      .unique();

    return {
      isAuthenticated: true,
      user: {
        id: user._id,
        name: user.name ?? identity.name ?? null,
        email: user.email ?? identity.email ?? null
      },
      workspace: workspace
        ? {
            id: workspace._id,
            businessName: workspace.businessName,
            businessType: workspace.businessType ?? null,
            createdAt: workspace.createdAt
          }
        : null
    };
  }
});

export const createWorkspace = mutation({
  args: {
    businessName: v.string(),
    businessType: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    const existingWorkspace = await ctx.db
      .query("workspaces")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user._id))
      .unique();

    if (existingWorkspace) {
      throw new ConvexError("A workspace already exists for this account.");
    }

    const businessName = args.businessName.trim();
    const businessType = args.businessType?.trim();

    if (!businessName) {
      throw new ConvexError("Business name is required.");
    }

    const workspaceId = await ctx.db.insert("workspaces", {
      ownerId: user._id,
      businessName,
      businessType: businessType || undefined,
      createdAt: Date.now()
    });

    return {
      workspaceId
    };
  }
});
