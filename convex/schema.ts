import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authUserId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string())
  }).index("by_auth_user_id", ["authUserId"]),
  workspaces: defineTable({
    ownerId: v.id("users"),
    businessName: v.string(),
    businessType: v.optional(v.string()),
    createdAt: v.number()
  }).index("by_owner_id", ["ownerId"]),
  polls: defineTable({
    workspaceId: v.id("workspaces"),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("single-choice"),
      v.literal("multiple-choice"),
      v.literal("rating"),
      v.literal("open-feedback")
    ),
    status: v.union(v.literal("draft"), v.literal("live"), v.literal("closed")),
    slug: v.string(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number()
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_slug", ["slug"]),
  pollOptions: defineTable({
    pollId: v.id("polls"),
    label: v.string(),
    position: v.number()
  }).index("by_poll_id", ["pollId"]),
  responses: defineTable({
    pollId: v.id("polls"),
    respondentName: v.optional(v.string()),
    respondentEmail: v.optional(v.string()),
    respondentReference: v.optional(v.string()),
    ratingValue: v.optional(v.number()),
    comment: v.optional(v.string()),
    submittedAt: v.number()
  }).index("by_poll_id", ["pollId"]),
  responseOptions: defineTable({
    responseId: v.id("responses"),
    pollOptionId: v.id("pollOptions")
  })
    .index("by_response_id", ["responseId"])
    .index("by_poll_option_id", ["pollOptionId"])
});
