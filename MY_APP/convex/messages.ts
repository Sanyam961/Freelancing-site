import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const clerkId = identity.subject;

    const convs1 = await ctx.db
      .query("conversations")
      .withIndex("by_participant1", (q) => q.eq("participant1Id", clerkId))
      .collect();

    const convs2 = await ctx.db
      .query("conversations")
      .withIndex("by_participant2", (q) => q.eq("participant2Id", clerkId))
      .collect();

    const uniqueMap = new Map();
    for (const c of [...convs1, ...convs2]) {
       uniqueMap.set(c._id, c);
    }
    const allConvs = Array.from(uniqueMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);

    return await Promise.all(
      allConvs.map(async (conv) => {
        const otherParticipantId =
          conv.participant1Id === clerkId ? conv.participant2Id : conv.participant1Id;

        const otherUser = await ctx.db
          .query("freelancers")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", otherParticipantId))
          .first();

        let role = "freelancer";
        let displayData = otherUser ? { name: otherUser.fullName, title: otherUser.title } : null;

        if (!otherUser) {
          const clientUser = await ctx.db
            .query("clients")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", otherParticipantId))
            .first();

          if (clientUser) {
            role = "client";
            displayData = { name: clientUser.contactName, title: clientUser.companyName };
          }
        }

        const gig = conv.gigId ? (await ctx.db.get(conv.gigId)) as { title: string } | null : null;

        return {
          ...conv,
          otherParticipantId,
          displayData,
          role,
          gigTitle: gig?.title,
        };
      })
    );
  },
});

export const getConversationMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();
  },
});

export const getUnreadNotificationCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_isRead", (q) => q.eq("userId", identity.subject).eq("isRead", false))
      .collect();

    return notifications.length;
  },
});

export const markConversationNotificationsRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_isRead", (q) => q.eq("userId", identity.subject).eq("isRead", false))
      .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
      .collect();

    await Promise.all(
      unread.map((notification) =>
        ctx.db.patch(notification._id, {
          isRead: true,
        })
      )
    );
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
    senderRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const clerkId = identity.subject;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    if (conversation.participant1Id !== clerkId && conversation.participant2Id !== clerkId) {
      throw new Error("Unauthorized access config");
    }

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: clerkId,
      senderRole: args.senderRole,
      text: args.text,
    });

    const recipientId =
      conversation.participant1Id === clerkId
        ? conversation.participant2Id
        : conversation.participant1Id;

    await ctx.db.insert("notifications", {
      userId: recipientId,
      conversationId: args.conversationId,
      messageId,
      type: "message",
      title: "New message",
      body: args.text.length > 80 ? `${args.text.slice(0, 80)}...` : args.text,
      isRead: false,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.conversationId, {
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

export const startConversation = mutation({
  args: {
    otherUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const clerkId = identity.subject;

    if (clerkId === args.otherUserId) throw new Error("Cannot start conversation with yourself");

    const convs1 = await ctx.db
      .query("conversations")
      .withIndex("by_participant1", (q) => q.eq("participant1Id", clerkId))
      .collect();
    
    let existing = convs1.find((c) => c.participant2Id === args.otherUserId);

    if (!existing) {
      const convs2 = await ctx.db
        .query("conversations")
        .withIndex("by_participant2", (q) => q.eq("participant2Id", clerkId))
        .collect();
      existing = convs2.find((c) => c.participant1Id === args.otherUserId);
    }

    if (existing) {
      return existing._id;
    }

    const newConvId = await ctx.db.insert("conversations", {
      participant1Id: clerkId,
      participant2Id: args.otherUserId,
      updatedAt: Date.now(),
    });

    return newConvId;
  },
});

export const getAvailableUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const clerkId = identity.subject;
    const freelancerProfile = await ctx.db
      .query("freelancers")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    const clientProfile = await ctx.db
      .query("clients")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    const currentRole = freelancerProfile ? "freelancer" : clientProfile ? "client" : null;
    const freelancers = await ctx.db.query("freelancers").collect();
    const clients = await ctx.db.query("clients").collect();

    const users = [];

    if (currentRole === "client") {
      for (const f of freelancers) {
        users.push({ id: f.clerkId, name: f.fullName, type: "freelancer" });
      }
    } else if (currentRole === "freelancer") {
      for (const c of clients) {
        users.push({ id: c.clerkId, name: c.contactName, type: "client" });
      }
    } else {
      for (const f of freelancers) {
        if (f.clerkId !== clerkId) {
          users.push({ id: f.clerkId, name: f.fullName, type: "freelancer" });
        }
      }

      for (const c of clients) {
        if (c.clerkId !== clerkId) {
          users.push({ id: c.clerkId, name: c.contactName, type: "client" });
        }
      }
    }

    return users;
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const clerkId = identity.subject;

    const message = await ctx.db.get(args.messageId);
    if (!message || message.senderId !== clerkId) {
      throw new Error("Unauthorized to delete this message");
    }

    await ctx.db.delete(args.messageId);
  },
});

export const deleteConversation = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const clerkId = identity.subject;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    if (conversation.participant1Id !== clerkId && conversation.participant2Id !== clerkId) {
      throw new Error("Unauthorized to delete this conversation");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    await Promise.all(messages.map((m) => ctx.db.delete(m._id)));
    await ctx.db.delete(args.conversationId);
  },
});
