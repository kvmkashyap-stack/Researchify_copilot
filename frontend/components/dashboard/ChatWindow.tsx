"use client";

import React from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, Edit2 } from "lucide-react";

type Message = {
  id: number;
  role: string;
  content: string;
  sources?: string[];
  isThinking?: boolean;
};

// Simple, fast client-side markdown parsing function to avoid importing heavy libraries and to eliminate raw tags/hashtags
function parseInlineStyles(text: string, isDark: boolean) {
  // Regex to match **bold** and `code` inline elements
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className={`font-extrabold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code 
          key={index} 
          className={`px-1.5 py-0.5 rounded text-xs font-mono ${
            isDark ? 'bg-white/10 text-cyan-300' : 'bg-slate-100 text-cyan-700'
          }`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function renderContent(content: string, isDark: boolean) {
  // Split by double newlines to isolate blocks
  const blocks = content.split(/\n\n+/);
  
  return blocks.map((block, bIdx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Handle Headings (H1, H2, H3)
    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={bIdx} className={`text-sm font-bold mt-4 mb-2 select-text ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {parseInlineStyles(trimmed.slice(4), isDark)}
        </h4>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={bIdx} className={`text-base font-bold mt-5 mb-2.5 select-text ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {parseInlineStyles(trimmed.slice(3), isDark)}
        </h3>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h2 key={bIdx} className={`text-lg font-black mt-6 mb-3 select-text ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {parseInlineStyles(trimmed.slice(2), isDark)}
        </h2>
      );
    }

    // Handle bullet list blocks
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const lines = trimmed.split("\n");
      return (
        <ul key={bIdx} className="list-disc pl-5 space-y-1.5 my-3">
          {lines.map((line, lIdx) => {
            const cleanLine = line.replace(/^[-*]\s+/, "");
            return (
              <li key={lIdx} className="text-sm leading-relaxed select-text">
                {parseInlineStyles(cleanLine, isDark)}
              </li>
            );
          })}
        </ul>
      );
    }

    // Handle numbered list blocks
    if (/^\d+\.\s+/.test(trimmed)) {
      const lines = trimmed.split("\n");
      return (
        <ol key={bIdx} className="list-decimal pl-5 space-y-1.5 my-3">
          {lines.map((line, lIdx) => {
            const cleanLine = line.replace(/^\d+\.\s+/, "");
            return (
              <li key={lIdx} className="text-sm leading-relaxed select-text">
                {parseInlineStyles(cleanLine, isDark)}
              </li>
            );
          })}
        </ol>
      );
    }

    // Default: Plain paragraph text block
    return (
      <p key={bIdx} className="text-sm leading-relaxed mb-3 last:mb-0 select-text">
        {parseInlineStyles(trimmed, isDark)}
      </p>
    );
  });
}

export default function ChatWindow({ 
  messages,
  theme = 'dark',
  onEditPrompt
}: { 
  messages: Message[];
  theme?: 'light' | 'dark';
  onEditPrompt?: (index: number, newText: string) => void;
}) {
  const [copied, setCopied] = React.useState<number | null>(null);
  const [editingMessageId, setEditingMessageId] = React.useState<number | null>(null);
  const [editText, setEditText] = React.useState("");

  async function copyMessage(id: number, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);

    setTimeout(() => {
      setCopied(null);
    }, 2000);
  }

  if (messages.length === 0) return null;

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {messages.map((message) => {
        const isUser = message.role === "user";
        const isAssistant = message.role === "assistant";
        const isEditing = editingMessageId === message.id;

        const handleSave = () => {
          if (!editText.trim()) return;
          const idx = messages.findIndex(m => m.id === message.id);
          if (idx !== -1 && onEditPrompt) {
            onEditPrompt(idx, editText.trim());
          }
          setEditingMessageId(null);
        };
        
        return (
          <motion.div 
            key={message.id} 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.25 }}
            className={`flex w-full group ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[85%] sm:max-w-2xl rounded-2xl border px-4.5 py-3.5 transition-all duration-300 ${
                isUser 
                  ? isDark
                    ? "border-cyan-500/20 bg-cyan-500 text-black shadow-lg shadow-cyan-500/5 font-medium" 
                    : "border-cyan-600 bg-cyan-600 text-white shadow-md shadow-cyan-600/5 font-medium"
                  : isDark
                    ? "border-white/5 bg-white/[0.03] text-gray-200"
                    : "border-slate-200 bg-white text-slate-800 shadow-sm"
              }`}
            >
              {message.isThinking ? (
                <div className="flex items-center gap-2 py-1">
                  <div className="flex gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full animate-bounce ${isDark ? 'bg-cyan-400' : 'bg-cyan-600'}`} style={{ animationDelay: '0ms' }} />
                    <span className={`h-1.5 w-1.5 rounded-full animate-bounce ${isDark ? 'bg-cyan-400' : 'bg-cyan-600'}`} style={{ animationDelay: '150ms' }} />
                    <span className={`h-1.5 w-1.5 rounded-full animate-bounce ${isDark ? 'bg-cyan-400' : 'bg-cyan-600'}`} style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className={`text-xs font-semibold select-none ml-1 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Thinking...</span>
                </div>
              ) : isEditing ? (
                <div className="w-full min-w-[240px]">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    className={`w-full bg-transparent outline-none border-b text-sm resize-none ${
                      isDark 
                        ? "text-black placeholder:text-gray-400 border-black/20" 
                        : "text-white placeholder:text-slate-300 border-white/20"
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSave();
                      }
                    }}
                    autoFocus
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingMessageId(null)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        isUser 
                          ? isDark ? "hover:bg-black/10 text-black/70" : "hover:bg-white/10 text-white/80"
                          : isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-slate-100 text-slate-500"
                      }`}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className={`px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${
                        isUser
                          ? isDark ? "bg-black text-white hover:bg-black/90" : "bg-white text-cyan-800 hover:bg-white/90"
                          : isDark ? "bg-cyan-400 text-black hover:bg-cyan-300" : "bg-cyan-600 text-white hover:bg-cyan-700"
                      }`}
                    >
                      Save & Submit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {renderContent(message.content, isDark)}
                </div>
              )}

              {!message.isThinking && !isEditing && (
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-[10px] ${isUser ? "text-black/40" : "text-gray-500"}`}></span>

                  {isAssistant && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => copyMessage(message.id, message.content)} 
                        className={`rounded p-1 transition ${
                          isDark 
                            ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                            : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                        }`}
                        title="Copy Response"
                      >
                        {copied === message.id ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {isUser && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => copyMessage(message.id, message.content)} 
                        className={`rounded p-1 transition ${
                          isDark ? 'hover:bg-black/10 text-black/60 hover:text-black' : 'hover:bg-white/10 text-white/70 hover:text-white'
                        }`}
                        title="Copy Prompt"
                      >
                        {copied === message.id ? (
                          <Check className="h-3.5 w-3.5 text-green-700" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingMessageId(message.id);
                          setEditText(message.content);
                        }} 
                        className={`rounded p-1 transition ${
                          isDark ? 'hover:bg-black/10 text-black/60 hover:text-black' : 'hover:bg-white/10 text-white/70 hover:text-white'
                        }`}
                        title="Edit Prompt"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {message.sources && message.sources.length > 0 && !message.isThinking && (
                <div className={`mt-3 border-t pt-3 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <div className="flex flex-wrap gap-2">
                    {message.sources.map((source) => (
                      <button 
                        key={source} 
                        className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${
                          isDark 
                            ? 'border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/40' 
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-cyan-600/40 hover:text-cyan-700'
                        }`}
                      >
                        {source}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}