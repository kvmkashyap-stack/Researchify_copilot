"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Sparkles,
  UserCircle2,
  X,
  FileText,
  Brain,
  Upload,
  Settings,
  LogOut,
  User,
  ChevronDown,
  MessageSquare,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppTheme } from "@/lib/hooks/useAppTheme";

const notifications = [
  {
    id: 1,
    title: "Paper analysis completed",
    description: "Attention_Is_All_You_Need.pdf is ready.",
    time: "2 min ago",
    icon: Brain,
    read: false,
  },
  {
    id: 2,
    title: "Document uploaded",
    description: "Research_Notes.docx was added successfully.",
    time: "18 min ago",
    icon: Upload,
    read: false,
  },
  {
    id: 3,
    title: "Research summary generated",
    description: "Your Transformer research summary is ready.",
    time: "1 hour ago",
    icon: FileText,
    read: true,
  },
];

const searchItems = [
  {
    title: "Attention Is All You Need",
    type: "Research Paper",
    href: "/dashboard/research/1",
  },
  {
    title: "Large Language Models",
    type: "Knowledge",
    href: "/dashboard/knowledge",
  },
  {
    title: "Retrieval Augmented Generation",
    type: "Knowledge",
    href: "/dashboard/knowledge",
  },
  {
    title: "LLM Research Assistant",
    type: "Project",
    href: "/dashboard/projects/1",
  },
  {
    title: "Satellite Operations Copilot",
    type: "Project",
    href: "/dashboard/projects/2",
  },
  {
    title: "Research Documents",
    type: "Documents",
    href: "/dashboard/documents",
  },
];

export default function DashboardHeader() {
  const router = useRouter();
  const { theme, toggleTheme } = useAppTheme();
  const isDark = theme === "dark";

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [notificationItems, setNotificationItems] =
    useState(notifications);

  const unreadCount = notificationItems.filter(
    (notification) => !notification.read
  ).length;

  const filteredSearchItems = searchItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setShowProfile(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        setShowSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  function markAllAsRead() {
    setNotificationItems((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }

  function openSearchResult(href: string) {
    setSearch("");
    setShowSearch(false);
    router.push(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        {/* Left */}

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl lg:text-2xl">
            AI Research Copilot
          </h1>

          <p className="mt-1 hidden text-sm text-gray-400 md:block">
            Search papers, analyze documents and generate research
            insights.
          </p>
        </div>

        {/* Right */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Desktop Search */}

          <div
            ref={searchRef}
            className="relative hidden lg:block"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-3 rounded-2xl border bg-white/[0.03] px-4 py-3 transition ${
                showSearch
                  ? "border-cyan-400/50"
                  : "border-white/10"
              }`}
            >
              <Search className="h-4 w-4 text-gray-500" />

              <input
                type="text"
                value={search}
                onFocus={() => setShowSearch(true)}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setShowSearch(true);
                }}
                placeholder="Search research..."
                className="w-56 bg-transparent text-sm text-white outline-none placeholder:text-gray-500 xl:w-64"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-500 transition hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>

            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-[58px] z-50 w-[380px] overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl shadow-black/50"
                >
                  <div className="border-b border-white/10 px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Search Research
                    </p>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto p-2">
                    {filteredSearchItems.length > 0 ? (
                      filteredSearchItems.map((item) => (
                        <button
                          key={`${item.type}-${item.title}`}
                          onClick={() =>
                            openSearchResult(item.href)
                          }
                          className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition hover:bg-white/5"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                            <Search className="h-4 w-4 text-cyan-400" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {item.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {item.type}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-10 text-center">
                        <Search className="mx-auto h-7 w-7 text-gray-700" />

                        <p className="mt-3 text-sm text-gray-500">
                          No research found.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Search */}

          <button
            onClick={() => setShowSearch(true)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-gray-300 transition hover:bg-white/5 lg:hidden"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}

          <div ref={notificationRef} className="relative">
            <button
              onClick={() => {
                setShowNotifications((current) => !current);
                setShowProfile(false);
              }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-cyan-500/30 hover:bg-white/5"
            >
              <Bell className="h-5 w-5 text-gray-300" />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-black bg-cyan-400 px-1 text-[10px] font-bold text-black">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-[58px] z-50 w-[340px] overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl shadow-black/60 sm:w-[390px]"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div>
                      <h2 className="font-semibold text-white">
                        Notifications
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        {unreadCount} unread notifications
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-medium text-cyan-400 transition hover:text-cyan-300"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[420px] overflow-y-auto p-2">
                    {notificationItems.map((notification) => {
                      const Icon = notification.icon;

                      return (
                        <button
                          key={notification.id}
                          onClick={() =>
                            setNotificationItems((current) =>
                              current.map((item) =>
                                item.id === notification.id
                                  ? {
                                      ...item,
                                      read: true,
                                    }
                                  : item
                              )
                            )
                          }
                          className="relative flex w-full gap-4 rounded-2xl p-4 text-left transition hover:bg-white/5"
                        >
                          {!notification.read && (
                            <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-cyan-400" />
                          )}

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                            <Icon className="h-5 w-5 text-cyan-400" />
                          </div>

                          <div className="min-w-0 pr-4">
                            <p
                              className={`text-sm ${
                                notification.read
                                  ? "text-gray-300"
                                  : "font-medium text-white"
                              }`}
                            >
                              {notification.title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              {notification.description}
                            </p>

                            <p className="mt-2 text-[11px] text-gray-600">
                              {notification.time}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Research Mode */}

          <div className="hidden items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 xl:flex">
            <Sparkles className="h-4 w-4 text-cyan-400" />

            <span className="text-sm text-cyan-300">
              Research Mode
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-2xl border transition ${
              isDark 
                ? 'border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/5' 
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Profile */}

          <div ref={profileRef} className="relative">
            <button
              onClick={() => {
                setShowProfile((current) => !current);
                setShowNotifications(false);
              }}
              className={`flex items-center gap-2 rounded-2xl border p-1.5 transition ${
                showProfile
                  ? "border-cyan-400/40 bg-cyan-500/10"
                  : "border-white/10 bg-white/[0.04] hover:border-cyan-500/30"
              }`}
            >
              <UserCircle2 className="h-9 w-9 text-gray-300" />

              <ChevronDown className="mr-1 hidden h-4 w-4 text-gray-500 sm:block" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-[60px] z-50 w-64 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl shadow-black/60"
                >
                  <div className="border-b border-white/10 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
                        <User className="h-5 w-5 text-cyan-400" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          Researcher
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          AI Research Workspace
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        router.push("/dashboard");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        setShowProfile(false);
                        router.push("/dashboard/chat");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      AI Chat
                    </button>

                    <button
                      onClick={() => {
                        setShowProfile(false);
                        router.push("/dashboard/settings");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <Settings className="h-4 w-4 text-gray-500" />
                      Settings
                    </button>
                  </div>

                  <div className="border-t border-white/10 p-2">
                    <button
                      onClick={() => {
                        localStorage.removeItem("access_token");
                        // Clear chat-related local storage items to prevent history leaks between users
                        Object.keys(localStorage).forEach((key) => {
                          if (key.startsWith("chat_")) {
                            localStorage.removeItem(key);
                          }
                        });
                        router.push("/login");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 p-4 backdrop-blur-xl lg:hidden"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mx-auto mt-16 w-full max-w-lg"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/40 bg-[#0b0b0b] px-4 py-3">
                <Search className="h-5 w-5 text-cyan-400" />

                <input
                  autoFocus
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search research..."
                  className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-600"
                />

                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearch("");
                  }}
                  className="text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] p-2">
                {filteredSearchItems.length > 0 ? (
                  filteredSearchItems.map((item) => (
                    <button
                      key={`${item.type}-${item.title}`}
                      onClick={() =>
                        openSearchResult(item.href)
                      }
                      className="flex w-full items-center gap-4 rounded-2xl p-4 text-left transition hover:bg-white/5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                        <Search className="h-4 w-4 text-cyan-400" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {item.type}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center text-sm text-gray-500">
                    No results found.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}