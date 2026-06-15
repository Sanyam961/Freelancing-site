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
    fullName: v.string(),
    title: v.string(),
    location: v.string(),
    bio: v.string(),
    skills: v.string(),
    photoId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to saveProfile");
    }
    const clerkId = identity.subject;

    const existing = await ctx.db
      .query("freelancers")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        fullName: args.fullName,
        title: args.title,
        location: args.location,
        bio: args.bio,
        skills: args.skills,
        photoId: args.photoId,
      });
    } else {
      return await ctx.db.insert("freelancers", {
        clerkId,
        fullName: args.fullName,
        title: args.title,
        location: args.location,
        bio: args.bio,
        skills: args.skills,
        photoId: args.photoId,
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
      .query("freelancers")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();
      
    if (!profile) return null;
    
    // get url for photo
    const photoUrl = profile.photoId ? await ctx.storage.getUrl(profile.photoId) : null;
    
    return { ...profile, photoUrl };
  },
});