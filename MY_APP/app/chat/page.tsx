"use client";

import { UserButton } from "@clerk/nextjs";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function ChatPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const conversations = useQuery(api.messages.listConversations);
  const roleParam = searchParams.get("role");
  const dbUserRole = useQuery(api.users.getUserRole);
  const userRole = roleParam === "client" || roleParam === "freelancer" ? roleParam : dbUserRole;
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  const messages = useQuery(
    api.messages.getConversationMessages,
    activeConversationId
      ? { conversationId: activeConversationId as string & { __tableName: "conversations" } }
      : "skip",
  );

  const sendMessageMutation = useMutation(api.messages.sendMessage);
  const markConversationNotificationsRead = useMutation(api.messages.markConversationNotificationsRead);
  const deleteMessageMutation = useMutation(api.messages.deleteMessage);
  const deleteConversationMutation = useMutation(api.messages.deleteConversation);
  const [messageText, setMessageText] = useState("");
  const [deletingConvId, setDeletingConvId] = useState<string | null>(null);
  const [deletingMsgId, setDeletingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const conversationIdFromUrl = searchParams.get("conversationId");
    if (conversationIdFromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveConversationId(conversationIdFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!activeConversationId && conversations && conversations.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveConversationId(conversations[0]._id);
    }
  }, [activeConversationId, conversations]);

  useEffect(() => {
    if (activeConversationId) {
      markConversationNotificationsRead({
        conversationId: activeConversationId as string & { __tableName: "conversations" },
      }).catch((err) => console.error(err));
    }
  }, [activeConversationId, markConversationNotificationsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversationId) return;

    try {
      await sendMessageMutation({
        conversationId: activeConversationId as string & { __tableName: "conversations" },
        text: messageText,
        senderRole: userRole as string,
      });
      setMessageText("");
    } catch (err) {
      console.error(err);
    }
  };

  const activeConvDetails = conversations?.find(
    (c) => c._id === activeConversationId,
  );
  const dashboardHref = userRole === "client" ? "/client/dashboard" : "/freelancer/dashboard";

  return (
    <div className="bg-transparent text-[#111827] font-body flex min-h-screen relative">
      <div className="absolute top-6 right-8 z-50">
        <UserButton />
      </div>

      {/* Main Content View with Sidebar & Chat Window */}
      <main className="flex w-full max-w-7xl mx-auto">
        {/* Sidebar: Conversation List */}
        <aside className="w-80 border-r border-[#111827]/10/10 h-screen p-4 flex flex-col bg-white border border-[#111827]/10 shadow-sm relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-[#111827] uppercase tracking-wider">
              Chat
            </h2>
            <Link 
              href={dashboardHref}
              className="text-[10px] uppercase tracking-widest font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[12px]">arrow_back</span>
              Dashboard
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {conversations === undefined ? (
              <div className="flex justify-center p-4">
                <span className="material-symbols-outlined text-[#111827] animate-spin">
                  refresh
                </span>
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-[#111827] text-sm p-4 text-center">
                No active chats yet.
              </p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  className={`relative p-4 rounded-xl transition-all border group ${
                    activeConversationId === conv._id
                      ? "bg-[#143D30] text-white  border-indigo-500/30"
                      : "bg-white border border-[#111827]/10 shadow-sm hover:bg-[#111827] hover:text-white border-[#111827]/10/10"
                  }`}
                >
                  <div className="cursor-pointer" onClick={() => setActiveConversationId(conv._id)}>
                    <p className={`font-semibold ${activeConversationId === conv._id ? "text-white" : "text-[#111827] group-hover:text-white"} transition-colors`}>
                      {conv.displayData?.name || "Unknown User"}
                    </p>
                    <p className={`text-xs mt-1 transition-colors ${activeConversationId === conv._id ? "text-indigo-200" : "text-[#143D30] group-hover:text-indigo-200"}`}>
                      {conv.displayData?.title || conv.role}
                    </p>
                    {conv.gigTitle && (
                      <div className="mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] text-indigo-500">work</span>
                        <span className={`text-[10px] font-bold uppercase tracking-tighter truncate max-w-[120px] ${activeConversationId === conv._id ? "text-white" : "text-indigo-500"}`}>
                          {conv.gigTitle}
                        </span>
                      </div>
                    )}
                  </div>
                  {deletingConvId === conv._id ? (
                    <div className="absolute inset-0 bg-[#143D30] z-20 flex items-center justify-center gap-2 rounded-xl">
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await deleteConversationMutation({ conversationId: conv._id });
                            if (activeConversationId === conv._id) setActiveConversationId(null);
                          } catch (err) { alert((err as Error).message); }
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeletingConvId(null); }}
                        className="bg-white/20 text-white px-2 py-1 rounded text-[10px] font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeletingConvId(conv._id);
                      }}
                      className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Chat"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <section className="flex-1 flex flex-col h-screen bg-transparent relative">
          {activeConversationId && activeConvDetails ? (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-[#111827]/10/10 flex items-center px-6 bg-white border border-[#111827]/10 shadow-sm shadow-lg z-10">
                <div className="flex flex-col">
                  <h3 className="font-medium text-[#111827]">
                    {activeConvDetails.displayData?.name || "Unknown User"}
                  </h3>
                  {activeConvDetails.gigTitle && (
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-indigo-500">work</span>
                      <span className="text-xs font-bold text-indigo-500 uppercase tracking-tight">Project: {activeConvDetails.gigTitle}</span>
                    </div>
                  )}
                  <p className="text-xs text-neutral-600">
                    {activeConvDetails.displayData?.title}
                  </p>
                </div>
              </div>

              {/* Chat Chat */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages === undefined ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="material-symbols-outlined text-[#111827] animate-spin text-3xl font-serif tracking-tight font-serif tracking-tight">
                      refresh
                    </span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#111827] space-y-2">
                    <span className="material-symbols-outlined text-4xl font-serif tracking-tight font-serif tracking-tight">
                      chat_bubble
                    </span>
                    <p>Send a message to start the conversation.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    let isMe = msg.senderId === user?.id;
                    
                    // Disambiguate for users testing both sides with the exact same account
                    if (msg.senderId === activeConvDetails?.otherParticipantId && msg.senderRole) {
                        isMe = msg.senderRole === userRole;
                    }

                    const sentFromLeft = !isMe;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${sentFromLeft ? "justify-start" : "justify-end"} group relative`}
                      >
                        <div
                          className={`max-w-[70%] p-4 rounded-2xl relative ${
                            sentFromLeft
                              ? "bg-white text-[#111827] rounded-tl-none border border-[#111827]/10 shadow-sm"
                              : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-tr-none shadow-[0_5px_20px_rgba(99,102,241,0.2)]"
                          }`}
                        >
                          <p className="text-[0.95rem] leading-relaxed">
                            {msg.text}
                          </p>
                          {isMe && (
                            <div className="flex items-center">
                              {deletingMsgId === msg._id ? (
                                <div className={`flex gap-1 items-center px-2 animate-in fade-in zoom-in duration-200`}>
                                  <button onClick={async (e) => {
                                    e.stopPropagation();
                                    try { await deleteMessageMutation({ messageId: msg._id }); } catch(err) { alert((err as Error).message); }
                                  }} className="text-[10px] font-bold text-red-500 hover:underline">Confirm</button>
                                  <button onClick={(e) => { e.stopPropagation(); setDeletingMsgId(null); }} className="text-[10px] font-bold text-neutral-400 hover:underline">Cancel</button>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDeletingMsgId(msg._id);
                                  }}
                                  className={`absolute ${sentFromLeft ? "-right-8" : "-left-8"} top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity`}
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Text Input Area */}
              <div className="p-4 bg-white border border-[#111827]/10 shadow-sm border-t border-[#111827]/10/10">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    className="flex-1 bg-white border border-[#111827]/10 shadow-sm rounded-xl py-4 px-6 text-[#111827] outline-none focus:border-indigo-500/50 focus:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl disabled:opacity-50 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
                  >
                    <span className="material-symbols-outlined text-xl">
                      send
                    </span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#111827]">
              <span className="material-symbols-outlined text-5xl font-serif tracking-tight mb-4 opacity-50">
                forum
              </span>
              <p className="text-xl">Select a conversation to start chatting</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
