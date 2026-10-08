import { useEffect, useRef, useState } from "react";
import Markdown from "./Markdown.jsx";

const STORAGE_KEY = "chat-history-v1";
const NEAR_BOTTOM_PX = 80;

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function Chat() {
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | thinking | streaming
  const [showJump, setShowJump] = useState(false);

  const abortRef = useRef(null);
  const listRef = useRef(null);
  const pinnedRef = useRef(true); // true = user bottom pe hai, auto-scroll chalao
  const busy = status !== "idle";

  // Refresh pe history na jaye. Streaming ke dauran save nahi karte (har token pe write na ho).
  useEffect(() => {
    if (status === "idle") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {}
    }
  }, [messages, status]);

  // Naya text aaye: sirf tab neeche scroll karo jab user pehle se neeche ho.
  useEffect(() => {
    const el = listRef.current;
    if (el && pinnedRef.current) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  function onScroll() {
    const el = listRef.current;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
    pinnedRef.current = atBottom;
    setShowJump(!atBottom);
  }

  function jumpToLatest() {
    const el = listRef.current;
    pinnedRef.current = true;
    setShowJump(false);
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }

  function patchLast(patch) {
    setMessages((prev) => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], ...patch(next[next.length - 1]) };
      return next;
    });
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    const history = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStatus("thinking");
    pinnedRef.current = true;

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        // Error wale messages model ko wapis nahi bhejte
        body: JSON.stringify({ messages: history.filter((m) => !m.error) }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let first = true;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (first) {
          setStatus("streaming");
          first = false;
        }
        const chunk = decoder.decode(value, { stream: true });
        patchLast((m) => ({ content: m.content + chunk }));
      }
    } catch (err) {
      // Stop dabane pe jo partial text aa chuka hai wo rehta hai. Sirf asli error dikhao.
      if (err.name !== "AbortError") {
        patchLast((m) => ({ error: true, content: m.content || err.message }));
      }
    } finally {
      abortRef.current = null;
      setStatus("idle");
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function clearChat() {
    if (busy) return;
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="app">
      <header className="top">
        <h1>Streaming Chat</h1>
        {messages.length > 0 && (
          <button className="ghost" onClick={clearChat} disabled={busy}>
            Clear chat
          </button>
        )}
      </header>

      <main className="list" ref={listRef} onScroll={onScroll} aria-live="polite">
        {messages.length === 0 && <p className="empty">Kuch bhi poochho. Jawab word by word aayega.</p>}
        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          const waiting = isLast && m.role === "assistant" && status === "thinking";
          return (
            <div key={i} className={`msg ${m.role}${m.error ? " error" : ""}`}>
              {waiting ? (
                <span className="dots" aria-label="Thinking">
                  <i />
                  <i />
                  <i />
                </span>
              ) : m.role === "assistant" && !m.error ? (
                <Markdown text={m.content} />
              ) : (
                m.content
              )}
            </div>
          );
        })}
      </main>

      {showJump && (
        <button className="jump" onClick={jumpToLatest}>
          Jump to latest
        </button>
      )}

      <footer className="composer">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Message likho…"
          rows={1}
          aria-label="Message"
        />
        {busy ? (
          <button className="action stop" onClick={stop} aria-label="Stop generating">
            Stop
          </button>
        ) : (
          <button className="action" onClick={send} disabled={!input.trim()} aria-label="Send message">
            Send
          </button>
        )}
      </footer>
    </div>
  );
}
