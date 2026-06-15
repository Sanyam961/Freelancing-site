import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createGig = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    budget: v.number(),
    category: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    deadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    return await ctx.db.insert("gigs", {
      clientId: identity.subject,
      title: args.title,
      description: args.description,
      budget: args.budget,
      category: args.category,
      skills: args.skills,
      deadline: args.deadline,
      status: "open",
    });
  },
});

export const getOpenGigs = query({
  args: {},
  handler: async (ctx) => {
    const gigs = await ctx.db
      .query("gigs")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .order("desc")
      .collect();
      
    // Join client data
    const gigsWithClients = await Promise.all(
      gigs.map(async (gig) => {
        const client = await ctx.db
          .query("clients")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", gig.clientId))
          .first();
        return { ...gig, client };
      })
    );
      
    return gigsWithClients;
  },
});

export const getAllOpenGigs = query({
  args: {},
  handler: async (ctx) => {
    const gigs = await ctx.db
      .query("gigs")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .order("desc")
      .collect();

    return await Promise.all(
      gigs.map(async (gig) => {
        const client = await ctx.db
          .query("clients")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", gig.clientId))
          .first();

        return { ...gig, client };
      })
    );
  },
});

export const getClientGigs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    
    return await ctx.db
      .query("gigs")
      .withIndex("by_client", (q) => q.eq("clientId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const completeGig = mutation({
  args: { gigId: v.id("gigs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const gig = await ctx.db.get(args.gigId);
    if (!gig || gig.clientId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.gigId, { status: "completed" });
    return true;
  },
});

export const deleteGig = mutation({
  args: { gigId: v.id("gigs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const gig = await ctx.db.get(args.gigId);
    if (!gig || gig.clientId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.gigId);
  },
});