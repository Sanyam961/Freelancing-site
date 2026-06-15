import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveProfile = mutation({
  args: {
    companyName: v.string(),
    contactName: v.string(),
    industry: v.string(),
    website: v.string(),
    description: v.string(),
    logoId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to saveProfile");
    }
    const clerkId = identity.subject;

    const existing = await ctx.db
      .query("clients")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        companyName: args.companyName,
        contactName: args.contactName,
        industry: args.industry,
        website: args.website,
        description: args.description,
        logoId: args.logoId,
      });
    } else {
      return await ctx.db.insert("clients", {
        clerkId,
        companyName: args.companyName,
        contactName: args.contactName,
        industry: args.industry,
        website: args.website,
        description: args.description,
        logoId: args.logoId,
      });
    }
  },
});

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const clerkId = identity.subject;
    const profile = await ctx.db
      .query("clients")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();
      
    if (!profile) return null;
    
    // get url for photo
    const logoUrl = profile.logoId ? await ctx.storage.getUrl(profile.logoId) : null;
    
    return { ...profile, logoUrl };
  },
});