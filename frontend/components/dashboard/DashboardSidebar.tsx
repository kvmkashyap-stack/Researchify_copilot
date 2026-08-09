"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  LogOut,
  Menu,
  X,
  User,
  MessageSquare,
  Edit2,
} from "lucide-react";

interface SidebarProps {
  sessions?: { session_id: string; title: string }[];
  currentSessionId?: string;
  onSelectSession?: (id: string) => void;
  onNewChat?: () => void;
  onDeleteSession?: (id: string) => void;
  onRenameSession?: (id: string, newTitle: string) => Promise<void>;
  theme?: 'light' | 'dark';
}

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

function SidebarContent({
  sessions = [],
  currentSessionId = "default",
  onSelectSession = () => {},
  onNewChat = () => {},
  onDeleteSession = () => {},
  onRenameSession,
  mobile = false,
  onCloseMobile,
  onLogout,
  theme = 'dark',
}: {
  sessions?: { session_id: string; title: string }[];
  currentSessionId?: string;
  onSelectSession?: (id: string) => void;
  onNewChat?: () => void;
  onDeleteSession?: (id: string) => void;
  onRenameSession?: (id: string, newTitle: string) => Promise<void>;
  mobile?: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  theme?: 'light' | 'dark';
}) {
  const [userEmail, setUserEmail] = useState("Researcher");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; sessionId: string } | null>(null);
  
  // Renaming UI state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded && decoded.sub) {
        const email = decoded.sub;
        setTimeout(() => {
          setUserEmail(email);
        }, 0);
      }
    }
  }, []);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      sessionId,
    });
  };

  const startRename = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditTitle(currentTitle);
  };

  const saveRename = async (sessionId: string) => {
    if (!editTitle.trim()) {
      setEditingSessionId(null);
      return;
    }
    if (onRenameSession) {
      await onRenameSession(sessionId, editTitle.trim());
    }
    setEditingSessionId(null);
  };

  const isDark = theme === 'dark';

  return (
    <div className="flex h-full w-full flex-col px-4 py-6 justify-between relative">
      {/* Top Section */}
      <div className="flex flex-col h-[75vh]">
        {/* Logo */}
        <div className="flex items-center justify-between px-2">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="group flex items-center"
          >
            <motion.img
              whileHover={{ scale: 1.02 }}
              src="/logo.png"
              alt="Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {mobile && (
            <button
              onClick={onCloseMobile}
              className={`rounded-xl border p-2 transition hover:text-white ${
                isDark 
                  ? 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10' 
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-6 px-2">
          {/* New Chat Button */}
          <button
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 shadow-lg transition active:scale-[0.98] text-sm font-bold ${
              isDark 
                ? 'border-cyan-400/20 bg-cyan-500/10 text-white shadow-cyan-500/10 hover:bg-cyan-500/20' 
                : 'border-transparent bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/10'
            }`}
          >
            <Plus className="h-4.5 w-4.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History Threads */}
        <div className="mt-8 flex-1 overflow-y-auto space-y-1.5 px-2 pr-1 custom-scrollbar">
          <p className={`text-[10px] font-bold uppercase tracking-wider px-2 mb-2 ${
            isDark ? 'text-gray-600' : 'text-slate-400'
          }`}>
            Chat History
          </p>

          {sessions.length === 0 ? (
            <p className="text-xs text-gray-500 px-2 py-1 italic">No recent chats</p>
          ) : (
            sessions.map((s) => {
              const active = s.session_id === currentSessionId;
              const isEditing = editingSessionId === s.session_id;

              if (isEditing) {
                return (
                  <div
                    key={s.session_id}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 border transition-all ${
                      active
                        ? isDark 
                          ? "border-cyan-400/20 bg-cyan-500/5"
                          : "border-cyan-200 bg-cyan-50/70"
                        : isDark
                          ? "border-white/5 bg-white/[0.03]"
                          : "border-slate-200 bg-white shadow-sm"
                    }`}
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveRename(s.session_id);
                        } else if (e.key === "Escape") {
                          setEditingSessionId(null);
                        }
                      }}
                      onBlur={() => saveRename(s.session_id)}
                      className={`text-xs font-semibold bg-transparent outline-none border-b border-cyan-400 w-full py-0.5 ${
                        isDark ? "text-white" : "text-slate-950"
                      }`}
                      autoFocus
                    />
                  </div>
                );
              }

              return (
                <div
                  key={s.session_id}
                  onContextMenu={(e) => handleContextMenu(e, s.session_id)}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer border transition-all duration-200 ${
                    active
                      ? isDark 
                        ? "border-cyan-400/20 bg-cyan-500/5 text-white"
                        : "border-cyan-200 bg-cyan-50/70 text-cyan-900"
                      : isDark
                        ? "border-transparent text-gray-400 hover:bg-white/[0.03] hover:text-gray-200"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  onClick={() => {
                    onSelectSession(s.session_id);
                    onCloseMobile();
                  }}
                  title="Right-click or click edit to rename"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare className={`h-4 w-4 shrink-0 ${
                      active 
                        ? isDark ? "text-cyan-400" : "text-cyan-600"
                        : isDark ? "text-gray-500" : "text-slate-400"
                    }`} />
                    <span className="truncate text-xs font-semibold">
                      {s.title}
                    </span>
                  </div>

                  {/* Inline Edit & Delete Icons on Hover */}
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(s.session_id, s.title);
                      }}
                      className={`p-1 rounded transition hover:text-cyan-400 ${
                        isDark ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-slate-100 text-slate-400'
                      }`}
                      title="Rename Chat"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(s.session_id);
                      }}
                      className={`p-1 rounded transition hover:text-red-400 ${
                        isDark ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-slate-100 text-slate-400'
                      }`}
                      title="Delete Chat"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 px-2">
        {/* User Account Info */}
        <div className={`flex items-center gap-3 rounded-xl border p-3 ${
          isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'
        }`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'
          }`}>
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`truncate text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {userEmail}
            </p>
            <p className="text-[9px] text-gray-500 font-medium">
              Active Session
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 ${
            isDark ? 'border-white/10 text-gray-300' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </button>
      </div>

      {/* Context Menu Portal Mock */}
      {contextMenu && (
        <div
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          className={`fixed z-[100] w-36 rounded-xl border p-1 shadow-2xl backdrop-blur-xl ${
            isDark ? 'border-white/10 bg-[#0a0a0a]/95' : 'border-slate-200 bg-white/95'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              const s = sessions.find((x) => x.session_id === contextMenu.sessionId);
              if (s) startRename(s.session_id, s.title);
              setContextMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-bold text-gray-300 hover:bg-white/5"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Rename Chat
          </button>
          <button
            onClick={() => {
              onDeleteSession(contextMenu.sessionId);
              setContextMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-bold text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Chat
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardSidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  theme = 'dark',
}: SidebarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobile() {
    setMobileOpen(false);
  }

  function logout() {
    setMobileOpen(false);
    localStorage.removeItem("access_token");
    router.push("/login");
  }

  const isDark = theme === 'dark';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`sticky top-0 hidden h-screen w-64 shrink-0 border-r backdrop-blur-2xl lg:flex transition-colors duration-300 ${
        isDark ? 'border-white/10 bg-[#050505]/95' : 'border-slate-200 bg-white/95'
      }`}>
        <SidebarContent
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={onSelectSession}
          onNewChat={onNewChat}
          onDeleteSession={onDeleteSession}
          onRenameSession={onRenameSession}
          onCloseMobile={closeMobile}
          onLogout={logout}
          theme={theme}
        />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`fixed bottom-5 left-5 z-[60] flex h-12 w-12 items-center justify-center rounded-2xl border shadow-2xl backdrop-blur-xl transition lg:hidden ${
          isDark 
            ? 'border-cyan-400/20 bg-[#0a0a0a]/95 text-white hover:border-cyan-400 shadow-black/50' 
            : 'border-slate-200 bg-white/95 text-slate-800 hover:border-cyan-600 shadow-slate-200'
        }`}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
        <span className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-cyan-600'}`} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm lg:hidden"
              aria-label="Close sidebar overlay"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className={`fixed bottom-0 left-0 top-0 z-[90] w-[86%] max-w-[280px] border-r shadow-2xl lg:hidden ${
                isDark ? 'border-cyan-500/20 bg-[#070707] shadow-black' : 'border-slate-200 bg-white shadow-slate-300'
              }`}
            >
              <SidebarContent
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={onSelectSession}
                onNewChat={onNewChat}
                onDeleteSession={onDeleteSession}
                onRenameSession={onRenameSession}
                mobile
                onCloseMobile={closeMobile}
                onLogout={logout}
                theme={theme}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}