import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createProposal = mutation({
  args: {
    gigId: v.id("gigs"),
    coverLetter: v.string(),
    price: v.number(),
    estimatedDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    // Check if freelancer already applied
    const existing = await ctx.db
      .query("proposals")
      .withIndex("by_gig", (q) => q.eq("gigId", args.gigId))
      .filter((q) => q.eq(q.field("freelancerId"), identity.subject))
      .first();
      
    if (existing) {
      throw new Error("You already submitted a proposal for this gig.");
    }
    
    return await ctx.db.insert("proposals", {
      gigId: args.gigId,
      freelancerId: identity.subject,
      coverLetter: args.coverLetter,
      price: args.price,
      estimatedDays: args.estimatedDays,
      status: "pending",
    });
  },
});

export const getGigProposals = query({
  args: { gigId: v.id("gigs") },
  handler: async (ctx, args) => {
    const proposals = await ctx.db
      .query("proposals")
      .withIndex("by_gig", (q) => q.eq("gigId", args.gigId))
      .order("desc")
      .collect();
      
    // Join freelancer data
    return await Promise.all(
      proposals.map(async (proposal) => {
        const freelancer = await ctx.db
          .query("freelancers")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", proposal.freelancerId))
          .first();
        const photoUrl = freelancer?.photoId ? await ctx.storage.getUrl(freelancer.photoId) : null;
        return { 
          ...proposal, 
          freelancer: freelancer ? { ...freelancer, photoUrl } : null 
        };
      })
    );
  },
});

export const getFreelancerProposals = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    
    const proposals = await ctx.db
      .query("proposals")
      .withIndex("by_freelancer", (q) => q.eq("freelancerId", identity.subject))
      .order("desc")
      .collect();
      
    // Join gig and client data
    return await Promise.all(
      proposals.map(async (proposal) => {
        const gig = await ctx.db.get(proposal.gigId);
        let client = null;
        if (gig) {
          client = await ctx.db
            .query("clients")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", gig.clientId))
            .first();
        }
        return { ...proposal, gig, client };
      })
    );
  },
});

export const acceptProposal = mutation({
  args: { proposalId: v.id("proposals") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) throw new Error("Proposal not found");
    
    const gig = await ctx.db.get(proposal.gigId);
    if (!gig || gig.clientId !== identity.subject) {
      throw new Error("Unauthorized");
    }
    
    // Update proposal and gig status
    await ctx.db.patch(args.proposalId, { status: "accepted" });
    await ctx.db.patch(proposal.gigId, { status: "in_progress" });
    
    // Check if conversation exists for this SPECIFIC GIG
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_gig", (q) => q.eq("gigId", proposal.gigId))
      .filter((q) => 
        q.or(
          q.and(q.eq(q.field("participant1Id"), identity.subject), q.eq(q.field("participant2Id"), proposal.freelancerId)),
          q.and(q.eq(q.field("participant1Id"), proposal.freelancerId), q.eq(q.field("participant2Id"), identity.subject))
        )
      )
      .first();
      
    if (!conversation) {
      const convId = await ctx.db.insert("conversations", {
        participant1Id: identity.subject,
        participant2Id: proposal.freelancerId,
        gigId: proposal.gigId,
        updatedAt: Date.now(),
      });
      
      await ctx.db.insert("messages", {
        conversationId: convId,
        senderId: identity.subject,
        senderRole: "client",
        text: `Hello! I have accepted your proposal for "${gig.title}". Let's discuss!`,
      });

      return { conversationId: convId };
    } else {
      await ctx.db.insert("messages", {
        conversationId: conversation._id,
        senderId: identity.subject,
        senderRole: "client",
        text: `Hello! I have accepted your proposal for "${gig.title}". Let's discuss!`,
      });
      await ctx.db.patch(conversation._id, { updatedAt: Date.now() });

      return { conversationId: conversation._id };
    }
  },
});