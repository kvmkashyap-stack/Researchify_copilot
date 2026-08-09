"use client";

import { useState, useRef } from "react";
import { ArrowUp, Plus, RefreshCw, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PromptInput({ 
  onSend, 
  onSystemMessage,
  theme = 'dark'
}: { 
  onSend: (text: string) => void;
  onSystemMessage?: (text: string, isBot: boolean) => void;
  theme?: 'light' | 'dark';
}) {
  const [prompt, setPrompt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!prompt.trim() && !attachedFile) return;
    
    let textToSend = prompt.trim();
    if (attachedFile && !textToSend) {
      textToSend = `Analyze the uploaded document: "${attachedFile.name}"`;
    } else if (attachedFile) {
      textToSend = `[Attached Document: "${attachedFile.name}"]\n\n${textToSend}`;
    }
    
    onSend(textToSend);
    setPrompt("");
    setAttachedFile(null);
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are supported for analysis.");
      return;
    }

    setUploading(true);
    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (res.ok) {
        setAttachedFile({ name: file.name });
        if (onSystemMessage) {
          onSystemMessage(`Successfully uploaded and indexed "${file.name}". You can now ask questions or generate a report using its content!`, true);
        }
      } else {
        const errText = await res.text();
        throw new Error(errText || "Ingestion failed");
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to upload "${file.name}". Please ensure the backend server is running.`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isDark = theme === 'dark';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={`rounded-2xl border p-4 backdrop-blur-md transition-colors duration-300 ${
        isDark 
          ? 'border-white/10 bg-white/[0.03]' 
          : 'border-slate-200 bg-white shadow-sm'
      }`}
    >
      <AnimatePresence>
        {attachedFile && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold mb-3 border transition-all ${
              isDark 
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                : 'bg-cyan-50 text-cyan-700 border-cyan-100'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="truncate max-w-[220px]">{attachedFile.name}</span>
            <button 
              type="button"
              onClick={() => setAttachedFile(null)}
              className={`p-0.5 rounded-full transition-colors ${
                isDark ? 'hover:bg-cyan-500/20 text-cyan-400' : 'hover:bg-cyan-100 text-cyan-700'
              }`}
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <textarea 
        rows={3} 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)} 
        placeholder="Ask the assistant about your research, or upload a PDF to analyze..." 
        className={`w-full resize-none bg-transparent outline-none text-sm transition-colors ${
          isDark 
            ? 'text-white placeholder:text-gray-500' 
            : 'text-slate-800 placeholder:text-slate-400'
        }`}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf" 
        className="hidden" 
      />

      <div className="mt-3 flex justify-between items-center">
        <button
          type="button"
          onClick={handlePlusClick}
          disabled={uploading}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition disabled:opacity-50 ${
            isDark 
              ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white' 
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Upload PDF to analyze"
        >
          {uploading ? (
            <RefreshCw className={`h-5 w-5 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>

        <motion.button 
          whileTap={{ scale: 0.95 }} 
          whileHover={{ scale: 1.02 }} 
          onClick={handleSubmit} 
          disabled={uploading || (!prompt.trim() && !attachedFile)}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition disabled:opacity-50 ${
            isDark 
              ? 'bg-cyan-400 text-black hover:bg-cyan-300' 
              : 'bg-cyan-600 text-white hover:bg-cyan-700 disabled:hover:bg-cyan-600 shadow-sm shadow-cyan-600/10'
          }`}
          title="Send Message"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}