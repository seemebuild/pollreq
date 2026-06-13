import { validatePublishablePoll } from "@pollreq/shared";
import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

type ViewerWorkspace = {
  userId: Id<"users">;
  workspaceId: Id<"workspaces">;
  businessName: string;
};

type OwnedPoll = {
  poll: {
    _id: Id<"polls">;
    title: string;
    description?: string;
    type: "single-choice" | "multiple-choice" | "rating" | "open-feedback";
    status: "draft" | "live" | "closed";
    slug: string;
    publishedAt?: number;
    createdAt: number;
    workspaceId: Id<"workspaces">;
  };
  options: Array<{
    _id: Id<"pollOptions">;
    label: string;
    position: number;
    pollId: Id<"polls">;
  }>;
};

function slugify(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "poll";
}

async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("Authentication is required.");
  }

  return identity;
}

async function requireViewerWorkspace(ctx: QueryCtx | MutationCtx): Promise<ViewerWorkspace> {
  const identity = await requireIdentity(ctx);
  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_user_id", (q) => q.eq("authUserId", identity.tokenIdentifier))
    .unique();

  if (!user) {
    throw new ConvexError("Create your workspace before managing polls.");
  }

  const workspace = await ctx.db
    .query("workspaces")
    .withIndex("by_owner_id", (q) => q.eq("ownerId", user._id))
    .unique();

  if (!workspace) {
    throw new ConvexError("Create your workspace before managing polls.");
  }

  return {
    userId: user._id,
    workspaceId: workspace._id,
    businessName: workspace.businessName
  };
}

async function generateUniqueSlug(ctx: MutationCtx, title: string) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let attempt = 1;

  while (await ctx.db.query("polls").withIndex("by_slug", (q) => q.eq("slug", slug)).unique()) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  return slug;
}

async function requireOwnedPoll(ctx: MutationCtx, pollId: Id<"polls">): Promise<OwnedPoll> {
  const { workspaceId } = await requireViewerWorkspace(ctx);
  const poll = await ctx.db.get(pollId);

  if (!poll || poll.workspaceId !== workspaceId) {
    throw new ConvexError("This poll does not belong to your workspace.");
  }

  const options = await ctx.db
    .query("pollOptions")
    .withIndex("by_poll_id", (q) => q.eq("pollId", pollId))
    .take(20);

  return { poll, options };
}

export const listWorkspacePolls = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return {
        isAuthenticated: false,
        workspace: null,
        polls: []
      };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", identity.tokenIdentifier))
      .unique();

    if (!user) {
      return {
        isAuthenticated: true,
        workspace: null,
        polls: []
      };
    }

    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user._id))
      .unique();

    if (!workspace) {
      return {
        isAuthenticated: true,
        workspace: null,
        polls: []
      };
    }

    const polls = await ctx.db
      .query("polls")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspace._id))
      .order("desc")
      .take(10);

    const pollsWithCounts = await Promise.all(
      polls.map(async (poll) => {
        const optionCount = (
          await ctx.db
            .query("pollOptions")
            .withIndex("by_poll_id", (q) => q.eq("pollId", poll._id))
            .take(10)
        ).length;

        return {
          id: poll._id,
          title: poll.title,
          description: poll.description ?? null,
          type: poll.type,
          status: poll.status,
          slug: poll.slug,
          createdAt: poll.createdAt,
          publishedAt: poll.publishedAt ?? null,
          optionCount
        };
      })
    );

    return {
      isAuthenticated: true,
      workspace: {
        id: workspace._id,
        businessName: workspace.businessName
      },
      polls: pollsWithCounts
    };
  }
});

export const getPublicPollBySlug = query({
  args: {
    slug: v.string()
  },
  handler: async (ctx, args) => {
    const slug = args.slug.trim();

    if (!slug) {
      return {
        state: "not-found" as const,
        poll: null
      };
    }

    const poll = await ctx.db
      .query("polls")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!poll) {
      return {
        state: "not-found" as const,
        poll: null
      };
    }

    if (poll.status !== "live") {
      return {
        state: poll.status === "closed" ? ("closed" as const) : ("not-live" as const),
        poll: {
          id: poll._id,
          title: poll.title,
          description: poll.description ?? null,
          type: poll.type,
          slug: poll.slug,
          status: poll.status
        }
      };
    }

    const options = await ctx.db
      .query("pollOptions")
      .withIndex("by_poll_id", (q) => q.eq("pollId", poll._id))
      .take(20);

    return {
      state: "live" as const,
      poll: {
        id: poll._id,
        title: poll.title,
        description: poll.description ?? null,
        type: poll.type,
        slug: poll.slug,
        status: poll.status,
        options: options.map((option) => ({
          id: option._id,
          label: option.label,
          position: option.position
        }))
      }
    };
  }
});

export const createPollDraft = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("single-choice"),
      v.literal("multiple-choice"),
      v.literal("rating"),
      v.literal("open-feedback")
    ),
    options: v.optional(v.array(v.string()))
  },
  handler: async (ctx, args) => {
    const { workspaceId } = await requireViewerWorkspace(ctx);
    const title = args.title.trim();
    const description = args.description?.trim() || undefined;
    const type = args.type;
    const options = (args.options ?? []).map((option) => option.trim()).filter(Boolean);

    if (!title) {
      throw new ConvexError("A poll question is required before saving.");
    }

    const normalizedOptions = type === "single-choice" || type === "multiple-choice" ? options : [];
    const slug = await generateUniqueSlug(ctx, title);
    const createdAt = Date.now();

    const pollId = await ctx.db.insert("polls", {
      workspaceId,
      title,
      description,
      type,
      status: "draft",
      slug,
      createdAt
    });

    for (const [index, label] of normalizedOptions.entries()) {
      await ctx.db.insert("pollOptions", {
        pollId,
        label,
        position: index
      });
    }

    return {
      pollId,
      slug,
      status: "draft" as const
    };
  }
});

export const publishPoll = mutation({
  args: {
    pollId: v.id("polls")
  },
  handler: async (ctx, args) => {
    const { poll, options } = await requireOwnedPoll(ctx, args.pollId);

    if (poll.status === "live") {
      return {
        pollId: poll._id,
        status: "live" as const
      };
    }

    const readiness = validatePublishablePoll({
      title: poll.title,
      description: poll.description,
      type: poll.type,
      status: "draft",
      options: options.map((option) => ({ label: option.label }))
    });

    if (!readiness.ok) {
      throw new ConvexError(readiness.reason);
    }

    const publishedAt = Date.now();

    await ctx.db.patch(poll._id, {
      status: "live",
      publishedAt
    });

    return {
      pollId: poll._id,
      status: "live" as const,
      publishedAt
    };
  }
});

export const closePoll = mutation({
  args: {
    pollId: v.id("polls")
  },
  handler: async (ctx, args) => {
    const { poll } = await requireOwnedPoll(ctx, args.pollId);

    if (poll.status === "closed") {
      return {
        pollId: poll._id,
        status: "closed" as const
      };
    }

    await ctx.db.patch(poll._id, {
      status: "closed"
    });

    return {
      pollId: poll._id,
      status: "closed" as const
    };
  }
});
