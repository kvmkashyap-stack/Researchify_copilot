"use client";

import { useEffect, useState, useRef } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ChatWindow from "@/components/dashboard/ChatWindow";
import PromptInput from "@/components/dashboard/PromptInput";
import { useAppTheme } from "@/lib/hooks/useAppTheme";
import { MessageSquare, Sparkles, Sun, Moon, BookOpen, FileText, Lightbulb, Search, ClipboardList } from "lucide-react";

function decodeJwt(token: string): { sub?: string } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const getLocalStorageUserPrefix = () => {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("access_token");
  if (!token) return "";
  const decoded = decodeJwt(token);
  return decoded?.sub ? `${decoded.sub}_` : "";
};

export default function DashboardPage() {
  type ChatMessage = { id: number; role: string; content: string; isThinking?: boolean };
  
  const [sessions, setSessions] = useState<{ session_id: string; title: string }[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { theme, toggleTheme } = useAppTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getSessionsKey = () => `chat_sessions_${getLocalStorageUserPrefix()}`;
  const getHistoryKey = (sid: string) => `chat_history_${getLocalStorageUserPrefix()}${sid}`;

  const suggestions = [
    {
      title: "Summarize a paper",
      desc: "Get key takeaways from academic literature",
      prompt: "Summarize the key findings and methodology of the most cited paper on deep learning transformer models.",
      icon: FileText
    },
    {
      title: "Analyze methodology",
      desc: "Review experimental setups and research designs",
      prompt: "What are the common strengths and limitations of randomized controlled trials in medical research?",
      icon: Search
    },
    {
      title: "Brainstorm hypotheses",
      desc: "Generate new scientific questions and ideas",
      prompt: "Brainstorm 3 novel research hypotheses connecting quantum computing algorithms with cellular biology simulations.",
      icon: Lightbulb
    },
    {
      title: "Explain a concept",
      desc: "Deconstruct complex topics in simple terms",
      prompt: "Explain the concept of quantum entanglement in simple terms for a first-year college student.",
      icon: BookOpen
    },
    {
      title: "Create a report",
      desc: "Generate a structured IEEE-style research paper",
      prompt: "Generate a report on the impact of large language models on scientific research and discovery.",
      icon: ClipboardList
    }
  ];

  // Helper to load sessions from the backend
  const loadSessions = async () => {
    const sessionsKey = getSessionsKey();
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/chat/sessions", {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const local = localStorage.getItem(sessionsKey);
        let merged = [...data];

        if (local) {
          const localSessions = JSON.parse(local);
          localSessions.forEach((ls: { session_id: string; title: string }) => {
            if (!merged.some((s) => s.session_id === ls.session_id)) {
              merged.push(ls);
            }
          });
        }

        // Initialize a new unique chat session if the list is empty
        if (merged.length === 0) {
          const newId = `session_${Date.now()}`;
          merged = [{ session_id: newId, title: "New Chat" }];
          setCurrentSessionId(newId);
        } else {
          // If currentSessionId is empty or not in merged list, select the first session
          if (!currentSessionId || !merged.some(s => s.session_id === currentSessionId)) {
            setCurrentSessionId(merged[0].session_id);
          }
        }

        localStorage.setItem(sessionsKey, JSON.stringify(merged));
        setSessions(merged);
      } else {
        const local = localStorage.getItem(sessionsKey);
        let localSessions = local ? JSON.parse(local) : [];
        if (localSessions.length === 0) {
          const newId = `session_${Date.now()}`;
          localSessions = [{ session_id: newId, title: "New Chat" }];
          localStorage.setItem(sessionsKey, JSON.stringify(localSessions));
          setCurrentSessionId(newId);
        } else {
          if (!currentSessionId) {
            setCurrentSessionId(localSessions[0].session_id);
          }
        }
        setSessions(localSessions);
      }
    } catch (err) {
      console.error("Failed to load chat sessions", err);
      const local = localStorage.getItem(sessionsKey);
      let localSessions = local ? JSON.parse(local) : [];
      if (localSessions.length === 0) {
        const newId = `session_${Date.now()}`;
        localSessions = [{ session_id: newId, title: "New Chat" }];
        localStorage.setItem(sessionsKey, JSON.stringify(localSessions));
        setCurrentSessionId(newId);
      } else {
        if (!currentSessionId) {
          setCurrentSessionId(localSessions[0].session_id);
        }
      }
      setSessions(localSessions);
    }
  };

  // Load chat history for the active session ID
  const loadHistory = async (sessionId: string) => {
    if (!sessionId) return;
    setIsLoadingHistory(true);
    const historyKey = getHistoryKey(sessionId);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/chat/history?session_id=${encodeURIComponent(sessionId)}`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const formatted = data.map((msg: { role: string; content: string }, idx: number) => ({
          id: idx,
          role: msg.role,
          content: msg.content,
        }));
        // Sync to localStorage
        localStorage.setItem(historyKey, JSON.stringify(formatted));
        setMessages(formatted);
      } else {
        const local = localStorage.getItem(historyKey);
        if (local) {
          setMessages(JSON.parse(local));
        } else {
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Failed to load chat history", err);
      const local = localStorage.getItem(historyKey);
      if (local) {
        setMessages(JSON.parse(local));
      } else {
        setMessages([]);
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Reload sessions on mount, and reload history when currentSessionId changes
  useEffect(() => {
    setTimeout(() => {
      loadSessions();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      loadHistory(currentSessionId);
    }, 0);
  }, [currentSessionId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const handleNewChat = () => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSessionId(newSessionId);
    setMessages([]);
    setSessions((prev) => {
      const updated = [
        { session_id: newSessionId, title: "New Chat" },
        ...prev,
      ];
      localStorage.setItem(getSessionsKey(), JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteSession = async (sessionId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chat conversation?");
    if (!confirmDelete) return;

    const sessionsKey = getSessionsKey();
    // Optimistic update
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.session_id !== sessionId);
      localStorage.setItem(sessionsKey, JSON.stringify(remaining));
      return remaining;
    });
    localStorage.removeItem(getHistoryKey(sessionId));

    if (currentSessionId === sessionId) {
      const remaining = sessions.filter((s) => s.session_id !== sessionId);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].session_id);
      } else {
        // Create an empty default session
        const defSessionId = `session_${Date.now()}`;
        setCurrentSessionId(defSessionId);
        setMessages([]);
        setSessions([{ session_id: defSessionId, title: "New Chat" }]);
        localStorage.setItem(sessionsKey, JSON.stringify([{ session_id: defSessionId, title: "New Chat" }]));
      }
    }

    try {
      const token = localStorage.getItem("access_token");
      await fetch(`/api/chat/sessions/${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
    } catch (err) {
      console.error("Failed to delete session on backend", err);
    }
  };

  const handleRenameSession = async (sessionId: string, newTitle: string) => {
    const sessionsKey = getSessionsKey();
    // Optimistic update
    setSessions((prev) => {
      const updated = prev.map((s) => s.session_id === sessionId ? { ...s, title: newTitle } : s);
      localStorage.setItem(sessionsKey, JSON.stringify(updated));
      return updated;
    });

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/chat/sessions/${encodeURIComponent(sessionId)}/rename`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        loadSessions();
      }
    } catch (err) {
      console.error("Failed to rename session on backend", err);
    }
  };

  const handleSystemMessage = (text: string, isBot: boolean) => {
    const sysMsg = {
      id: messages.length,
      role: isBot ? "assistant" : "user",
      content: text,
    };
    setMessages((m) => [...m, sysMsg]);
  };

  const handleEditPrompt = async (messageIndex: number, newText: string) => {
    // 1. Truncate local messages array up to (but not including) this user message
    const preceding = messages.slice(0, messageIndex);
    setMessages(preceding);
    
    // 2. Call backend to truncate history up to keep_count (which is messageIndex!)
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`/api/chat/sessions/${encodeURIComponent(currentSessionId)}/truncate?keep_count=${messageIndex}`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        }
      });
    } catch (err) {
      console.error("Failed to truncate history on backend:", err);
    }
    
    // 3. Resend the message as the new prompt!
    sendMessage(newText);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    const token = localStorage.getItem("access_token");
    const userMsg = { id: messages.length, role: "user", content: text };
    
    const thinkingId = messages.length + 1;
    const thinkingMsg = { id: thinkingId, role: "assistant", content: "", isThinking: true };

    setMessages((m) => [...m, userMsg, thinkingMsg]);
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ 
          message: text,
          session_id: currentSessionId
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((m) => {
          const updated = m.map((msg) => 
            msg.id === thinkingId 
              ? { id: msg.id, role: "assistant", content: data.response }
              : msg
          );
          localStorage.setItem(getHistoryKey(currentSessionId), JSON.stringify(updated));
          return updated;
        });

        // Update titles optimistically
        setSessions((prev) => {
          const updated = [...prev];
          const sessionIndex = updated.findIndex((s) => s.session_id === currentSessionId);
          if (sessionIndex !== -1 && updated[sessionIndex].title === "New Chat") {
            const displayTitle = text.slice(0, 40) + (text.length > 40 ? "..." : "");
            updated[sessionIndex] = { ...updated[sessionIndex], title: displayTitle };
          }
          localStorage.setItem(getSessionsKey(), JSON.stringify(updated));
          return updated;
        });

        loadSessions();
      } else {
        throw new Error("Chat request failed");
      }
    } catch (err) {
      console.error(err);
      setMessages((m) => {
        const updated = m.map((msg) => 
          msg.id === thinkingId 
            ? { 
                id: msg.id, 
                role: "assistant", 
                content: "Error: I'm unable to connect to the agent right now. Please verify backend connectivity and try again." 
              }
            : msg
        );
        localStorage.setItem(`chat_history_${currentSessionId}`, JSON.stringify(updated));
        return updated;
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`flex h-screen transition-colors duration-300 overflow-hidden ${
      theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <DashboardSidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        theme={theme}
      />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col min-w-0 h-full">
        {/* Chat Section in ChatGPT style */}
        <div className="flex-1 flex flex-col justify-between h-full relative">
          
          {/* Header Info */}
          <header className={`border-b p-4 backdrop-blur-md flex items-center justify-between z-10 transition-colors duration-300 ${
            theme === 'dark' ? 'border-white/5 bg-white/[0.01]' : 'border-slate-200 bg-white/50'
          }`}>
            <div>
              <h1 className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                <MessageSquare className={`h-4.5 w-4.5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                AI Research Chat
              </h1>
              <p className={`text-[10px] transition-colors ${theme === 'dark' ? 'text-gray-500' : 'text-slate-500'}`}>
                Grounded academic dialogue, literature synthesis, and PDF uploads
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl border transition-all ${
                  theme === 'dark' 
                    ? 'border-white/10 bg-white/5 text-gray-400 hover:text-white' 
                    : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm'
                }`}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold transition-all ${
                theme === 'dark' 
                  ? 'bg-cyan-500/10 text-cyan-400' 
                  : 'bg-cyan-100 text-cyan-700'
              }`}>
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Agent Active
              </div>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 space-y-6">
            <div className="max-w-3xl mx-auto w-full">
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className={`h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 ${
                    theme === 'dark' ? 'border-cyan-400' : 'border-cyan-600'
                  }`}></div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Loading conversation history...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <h2 className={`text-2xl sm:text-3xl font-black tracking-tight mb-8 transition-colors ${
                    theme === 'dark' ? 'text-white/95' : 'text-slate-800'
                  }`}>
                    What can I help with today?
                  </h2>

                  {/* Suggestion Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-4 px-2">
                    {suggestions.map((s, idx) => {
                      const Icon = s.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => sendMessage(s.prompt)}
                          className={`flex flex-col items-start p-4.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                            theme === 'dark'
                              ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-gray-300 hover:text-white'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm hover:shadow-md'
                          }`}
                        >
                          <Icon className={`h-4.5 w-4.5 mb-2 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                          <h4 className={`text-xs font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                            {s.title}
                          </h4>
                          <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
                            {s.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <ChatWindow messages={messages} theme={theme} onEditPrompt={handleEditPrompt} />
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Prompt Input Container */}
          <div className={`border-t p-4 sm:p-6 transition-colors duration-300 ${
            theme === 'dark' 
              ? 'border-white/5 bg-gradient-to-t from-black via-black/95 to-transparent' 
              : 'border-slate-200 bg-white'
          }`}>
            <div className="max-w-3xl mx-auto w-full">
              <PromptInput onSend={sendMessage} onSystemMessage={handleSystemMessage} theme={theme} />
              {isSending && (
                <p className={`text-xs mt-2 flex items-center gap-2 px-2 font-medium ${
                  theme === 'dark' ? 'text-cyan-400/70' : 'text-cyan-600'
                }`}>
                  <span className={`h-2 w-2 rounded-full animate-ping ${
                    theme === 'dark' ? 'bg-cyan-400' : 'bg-cyan-600'
                  }`}></span>
                  Agent is processing your request...
                </p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}