"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const HATCH = `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='6' x2='6' y2='0' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);
  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = "auto";
      taRef.current.style.height = Math.min(taRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);
  useEffect(() => {
    if (isOpen && msgs.length === 0)
      setMsgs([{ id: "w", role: "assistant", content: "I am Maya. How can I help you today?" }]);
  }, [isOpen, msgs.length]);

  const send = useCallback(async () => {
    const t = input.trim();
    if (!t || loading) return;
    const um: ChatMessage = { id: Date.now().toString(), role: "user", content: t };
    const all = [...msgs, um];
    setMsgs(all); setInput(""); setLoading(true);
    if (taRef.current) taRef.current.style.height = "auto";
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: all.map(m => ({ role: m.role, content: m.content })) }),
      });
      const d = await r.json();
      setMsgs(p => [...p, { id: (Date.now()+1).toString(), role: "assistant", content: d?.text || "Sorry, please try again." }]);
    } catch {
      setMsgs(p => [...p, { id: (Date.now()+1).toString(), role: "assistant", content: "Connection error. Try again." }]);
    } finally { setLoading(false); }
  }, [input, loading, msgs]);

  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const hs: React.CSSProperties = { position: "absolute", inset: 0, transform: "translate(5px,5px)", borderRadius: "inherit", backgroundImage: HATCH, backgroundSize: "6px 6px", zIndex: -1, pointerEvents: "none" };
  const hb: React.CSSProperties = { ...hs, transform: "translate(3px,3px)" };

  if (isHidden) return null;

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>

      {/* ── LAUNCHER ── */}
      {!isOpen && (
        <div style={{ position: "relative", width: 190, background: "#FAFAF8", border: "1px solid #222", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 10px 14px", fontFamily: "'Inter',sans-serif", animation: "cb-up .35s ease-out" }}>
          <button onClick={() => setIsHidden(true)} aria-label="Hide Chatbot" style={{ position: "absolute", top: 4, right: 4, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#888", padding: 2, lineHeight: 1, zIndex: 10 }}>✕</button>
          <span style={hs} aria-hidden />
          <div style={{ position: "absolute", top: -38, right: 0, background: "#fff", border: "1px solid #222", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontStyle: "italic", color: "#333", whiteSpace: "nowrap", boxShadow: "1px 1px 3px rgba(0,0,0,.08)" }}>
            Hey there! I&apos;m here to help.
            <span style={{ position: "absolute", bottom: -6, right: 28, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #fff" }} />
          </div>
          <span style={{ fontStyle: "italic", fontSize: 13, color: "#444" }}>Chat with</span>
          <span style={{ fontFamily: "var(--font-playfair),'Playfair Display',Georgia,serif", fontSize: 34, fontWeight: 600, color: "#111", lineHeight: 1.1, marginBottom: 2 }}>Maya</span>

          {/* Static character image — no Rive, no WebGL */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/maya-character.png"
            alt="Maya"
            width={160}
            height={170}
            style={{ width: 160, height: 170, objectFit: "cover", objectPosition: "top center", borderRadius: 8, marginBottom: 8 }}
          />

          <button onClick={() => setIsOpen(true)} style={{ position: "relative", background: "#57C5B6", color: "#000", border: "1px solid #222", borderRadius: 14, padding: "8px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
            <span style={hb} aria-hidden />
            Let&apos;s Chat!
          </button>
        </div>
      )}

      {/* ── CHAT WINDOW ── */}
      {isOpen && (
        <div style={{ position: "relative", width: 340, maxWidth: "calc(100vw - 48px)", height: 480, maxHeight: "calc(100vh - 100px)", background: "#FAFAF8", border: "1px solid #222", borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Inter',sans-serif", animation: "cb-up .3s ease-out" }}>
          <span style={hs} aria-hidden />

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: "1px solid #e0ddd5", gap: 10, flexShrink: 0, background: "#FAFAF8" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/maya-character.png"
              alt="Maya"
              width={48}
              height={48}
              style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", objectPosition: "top center", border: "1px solid #ccc", flexShrink: 0 }}
            />
            <span style={{ fontFamily: "var(--font-playfair),'Playfair Display',Georgia,serif", fontSize: 24, fontWeight: 600, color: "#111", flex: 1 }}>Meet Maya</span>
            <button onClick={() => setIsOpen(false)} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#333", padding: 4, lineHeight: 1 }}>✕</button>
          </div>

          {/* Messages */}
          <div id="cb-msgs" style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 14, background: "#FAFAF8" }}>
            {msgs.map(m => (
              <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start", gap: 8 }}>
                {m.role === "assistant" && <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #bbb", background: "#57C5B6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>May</div>}
                <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: 12, fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word", ...(m.role === "assistant" ? { background: "#F2EEE3", color: "#222" } : { background: "#fff", color: "#222", border: "1px solid #222" }) }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #bbb", background: "#57C5B6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>May</div>
                <div style={{ background: "#F2EEE3", padding: "12px 18px", borderRadius: 12, display: "flex", gap: 5 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#999", animation: `cb-dot 1.4s ease-in-out ${i*.16}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: "1px solid #e0ddd5", padding: "10px 12px", background: "#fff", display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
            <textarea ref={taRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} placeholder="Type a message" rows={1} style={{ width: "100%", resize: "none", border: "none", outline: "none", fontSize: 14, fontFamily: "'Inter',sans-serif", color: "#222", background: "transparent", lineHeight: 1.5, padding: "4px 0", maxHeight: 120, overflow: "auto" }} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={send} disabled={!input.trim()||loading} aria-label="Send" style={{ position: "relative", width: 40, height: 34, background: !input.trim()||loading ? "#b0ddd6" : "#57C5B6", border: "1px solid #222", borderRadius: 10, cursor: !input.trim()||loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: !input.trim()||loading ? .6 : 1, transition: "opacity .15s" }}>
                <span style={hb} aria-hidden />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cb-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cb-dot{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
        #cb-msgs::-webkit-scrollbar{width:5px}
        #cb-msgs::-webkit-scrollbar-thumb{background:#ccc;border-radius:4px}
      `}</style>
    </div>
  );
}
