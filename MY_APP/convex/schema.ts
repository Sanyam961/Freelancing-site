import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
  }).index("by_clerkId", ["clerkId"]),
  freelancers: defineTable({
    clerkId: v.string(),
    fullName: v.string(),
    title: v.string(),
    location: v.string(),
    bio: v.string(),
    skills: v.string(),
    photoId: v.optional(v.id("_storage")),
  }).index("by_clerkId", ["clerkId"]),
  clients: defineTable({
    clerkId: v.string(),
    companyName: v.string(),
    contactName: v.string(),
    industry: v.string(),
    website: v.string(),
    description: v.string(),
    logoId: v.optional(v.id("_storage")),
  }).index("by_clerkId", ["clerkId"]),
  conversations: defineTable({
    participant1Id: v.string(),
    participant2Id: v.string(),
    gigId: v.optional(v.id("gigs")),
    updatedAt: v.number(),
  }).index("by_participant1", ["participant1Id"])
    .index("by_participant2", ["participant2Id"])
    .index("by_gig", ["gigId"]),
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    senderRole: v.optional(v.string()),
    text: v.string(),
  }).index("by_conversation", ["conversationId"]),
  notifications: defineTable({
    userId: v.string(),
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
    type: v.union(v.literal("message"), v.literal("proposal")),
    title: v.string(),
    body: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_isRead", ["userId", "isRead"]),
  gigs: defineTable({
    clientId: v.string(), // clerkId
    title: v.string(),
    description: v.string(),
    budget: v.number(),
    category: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    deadline: v.optional(v.string()),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("completed")),
  }).index("by_client", ["clientId"])
    .index("by_status", ["status"]),
  proposals: defineTable({
    gigId: v.id("gigs"),
    freelancerId: v.string(), // clerkId
    coverLetter: v.string(),
    price: v.number(),
    estimatedDays: v.optional(v.number()),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
  }).index("by_gig", ["gigId"])
    .index("by_freelancer", ["freelancerId"]),
});