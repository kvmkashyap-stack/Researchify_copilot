"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  ArrowLeft,
  Brain,
  FileText,
  BookOpen,
  MessageSquare,
  Clock,
  Star,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Save,
  Send,
  CheckCircle2,
  Lightbulb,
  Quote,
  Maximize2,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";

type Tab =
  | "Overview"
  | "Summary"
  | "Notes"
  | "References"
  | "AI Chat";

const tabs: Tab[] = [
  "Overview",
  "Summary",
  "Notes",
  "References",
  "AI Chat",
];

const references = [
  {
    id: 1,
    title: "Neural Machine Translation by Jointly Learning to Align and Translate",
    authors: "Bahdanau, Cho & Bengio",
    year: "2014",
    citations: "42,000+",
  },
  {
    id: 2,
    title: "Sequence to Sequence Learning with Neural Networks",
    authors: "Sutskever, Vinyals & Le",
    year: "2014",
    citations: "35,000+",
  },
  {
    id: 3,
    title: "Effective Approaches to Attention-based Neural Machine Translation",
    authors: "Luong, Pham & Manning",
    year: "2015",
    citations: "18,000+",
  },
  {
    id: 4,
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: "Devlin et al.",
    year: "2018",
    citations: "120,000+",
  },
];

const relatedPapers = [
  {
    title: "BERT",
    subtitle: "Bidirectional Transformer Pre-training",
  },
  {
    title: "Vision Transformer",
    subtitle: "Transformers for Image Recognition",
  },
  {
    title: "GPT-3",
    subtitle: "Language Models are Few-Shot Learners",
  },
];

const chatSuggestions = [
  "Explain the Transformer architecture",
  "What are the main contributions?",
  "Explain multi-head attention",
  "What are the limitations?",
];

export default function ResearchDetailsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [favorite, setFavorite] = useState(false);
  const [shared, setShared] = useState(false);

  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const totalPages = 18;

  const [notes, setNotes] = useState(
    "The Transformer replaces recurrent layers entirely with attention mechanisms.\n\nImportant: Review multi-head attention architecture and positional encoding."
  );

  const [notesSaved, setNotesSaved] = useState(false);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const [copied, setCopied] = useState(false);

  function zoomIn() {
    setZoom((current) => Math.min(current + 10, 150));
  }

  function zoomOut() {
    setZoom((current) => Math.max(current - 10, 60));
  }

  function saveNotes() {
    setNotesSaved(true);

    window.setTimeout(() => {
      setNotesSaved(false);
    }, 2000);
  }

  function askAI(customQuestion?: string) {
    const prompt = customQuestion || question.trim();

    if (!prompt) return;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: prompt,
      },
      {
        role: "assistant",
        content:
          "This frontend workspace is ready for your research AI backend. The response area can display generated explanations, citations, paper-specific context and follow-up answers.",
      },
    ]);

    setQuestion("");
  }

  function copySummary() {
    navigator.clipboard?.writeText(
      "The paper introduces the Transformer, an architecture based entirely on attention mechanisms that removes recurrence and convolution from sequence modeling."
    );

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  function downloadPaper() {
    const content =
      "Attention Is All You Need — Research Workspace frontend demo.";

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Attention_Is_All_You_Need.txt";
    anchor.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen bg-black">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <DashboardHeader />

        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Header */}

          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <Link
                href="/dashboard/research"
                className="mb-4 inline-flex items-center gap-2 text-sm text-cyan-400 transition hover:text-cyan-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Research
              </Link>

              <div className="flex items-start gap-4">
                <div className="hidden rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 sm:block">
                  <FileText className="h-7 w-7 text-cyan-400" />
                </div>

                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                      Deep Learning
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                      Transformer
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                    Attention Is All You Need
                  </h1>

                  <p className="mt-2 text-sm text-gray-400 sm:text-base">
                    Vaswani et al. • Google Research • 2017
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFavorite((current) => !current)}
                className={`rounded-xl border p-3 transition ${
                  favorite
                    ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
                    : "border-white/10 text-gray-300 hover:border-yellow-400/30 hover:text-yellow-400"
                }`}
                title="Favorite"
              >
                <Star
                  className={`h-5 w-5 ${
                    favorite ? "fill-yellow-400" : ""
                  }`}
                />
              </button>

              <button
                onClick={() => {
                  setShared(true);

                  window.setTimeout(() => {
                    setShared(false);
                  }, 1800);
                }}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-gray-300 transition hover:border-cyan-400 hover:text-white"
              >
                {shared ? (
                  <Check className="h-5 w-5 text-green-400" />
                ) : (
                  <Share2 className="h-5 w-5" />
                )}

                <span className="hidden sm:inline">
                  {shared ? "Shared" : "Share"}
                </span>
              </button>

              <button
                onClick={downloadPaper}
                className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black transition hover:bg-cyan-300"
              >
                <Download className="h-5 w-5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>

          {/* Stats */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["18", "Pages"],
              ["52", "References"],
              ["12 min", "Read Time"],
              ["92%", "AI Relevance"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-cyan-500/20 bg-white/5 p-5 backdrop-blur-xl"
              >
                <p className="text-2xl font-bold text-white">
                  {value}
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Tabs */}

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
            <div className="flex min-w-max gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                    activeTab === tab
                      ? "bg-cyan-400 text-black"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Overview */}

          {activeTab === "Overview" && (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="space-y-6">
                {/* PDF Viewer */}

                <div className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-white/5 backdrop-blur-xl">
                  <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-cyan-400" />

                      <div>
                        <h2 className="font-semibold text-white">
                          Paper Viewer
                        </h2>

                        <p className="text-xs text-gray-500">
                          Attention_Is_All_You_Need.pdf
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          setPage((current) =>
                            Math.max(1, current - 1)
                          )
                        }
                        className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-cyan-500/30 hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <span className="min-w-20 text-center text-xs text-gray-400">
                        {page} / {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          setPage((current) =>
                            Math.min(totalPages, current + 1)
                          )
                        }
                        className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-cyan-500/30 hover:text-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <div className="mx-1 h-6 w-px bg-white/10" />

                      <button
                        onClick={zoomOut}
                        className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:text-white"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>

                      <span className="min-w-12 text-center text-xs text-gray-400">
                        {zoom}%
                      </span>

                      <button
                        onClick={zoomIn}
                        className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:text-white"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setZoom(100)}
                        className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:text-white"
                        title="Reset zoom"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>

                      <button
                        className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:text-white"
                        title="Fullscreen"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="h-[680px] overflow-auto bg-[#111111] p-6 sm:p-10">
                    <div
                      className="mx-auto min-h-[620px] origin-top rounded-sm bg-[#f7f7f5] p-8 text-black shadow-2xl transition-transform sm:p-12"
                      style={{
                        width: `${Math.max(70, zoom)}%`,
                        minWidth: "560px",
                      }}
                    >
                      <div className="border-b border-black/10 pb-8 text-center">
                        <h2 className="text-3xl font-bold">
                          Attention Is All You Need
                        </h2>

                        <p className="mt-4 text-sm text-gray-600">
                          Ashish Vaswani, Noam Shazeer, Niki Parmar,
                          Jakob Uszkoreit, Llion Jones, Aidan N.
                          Gomez, Łukasz Kaiser, Illia Polosukhin
                        </p>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-center text-lg font-bold">
                          Abstract
                        </h3>

                        <p className="mt-5 text-sm leading-7 text-gray-800">
                          The dominant sequence transduction models
                          are based on complex recurrent or
                          convolutional neural networks. This research
                          introduces the Transformer architecture,
                          based entirely on attention mechanisms.
                        </p>

                        <h3 className="mt-8 text-lg font-bold">
                          1. Introduction
                        </h3>

                        <p className="mt-4 text-sm leading-7 text-gray-800">
                          Recurrent neural networks have long been
                          established as state-of-the-art approaches
                          in sequence modeling. The Transformer
                          proposes a different architecture that
                          removes recurrence and instead relies on
                          self-attention to model dependencies
                          between input and output sequences.
                        </p>

                        <div className="mt-8 rounded-lg border border-black/10 bg-black/[0.03] p-6">
                          <p className="text-center text-sm font-semibold">
                            Figure {page}. Transformer Architecture
                          </p>

                          <div className="mt-5 grid grid-cols-2 gap-5">
                            <div className="rounded border border-black/20 p-5 text-center text-xs">
                              Encoder
                              <div className="mt-3 rounded border border-black/20 p-3">
                                Multi-Head Attention
                              </div>
                              <div className="mt-2 rounded border border-black/20 p-3">
                                Feed Forward
                              </div>
                            </div>

                            <div className="rounded border border-black/20 p-5 text-center text-xs">
                              Decoder
                              <div className="mt-3 rounded border border-black/20 p-3">
                                Masked Attention
                              </div>
                              <div className="mt-2 rounded border border-black/20 p-3">
                                Feed Forward
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="mt-10 text-center text-xs text-gray-500">
                        Page {page}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Right Panel */}

              <aside className="space-y-6">
                <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                      <Brain className="h-5 w-5 text-cyan-400" />
                      AI Summary
                    </h2>

                    <button
                      onClick={copySummary}
                      className="rounded-lg border border-white/10 p-2 text-gray-500 transition hover:text-white"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-gray-400">
                    The paper introduces the Transformer, an
                    architecture based entirely on attention
                    mechanisms that removes recurrence and
                    convolution from sequence modeling.
                  </p>

                  <button
                    onClick={() => setActiveTab("Summary")}
                    className="mt-5 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                  >
                    View full summary →
                  </button>
                </div>

                <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    AI Insights
                  </h2>

                  <div className="mt-5 space-y-3">
                    {[
                      [
                        "Main Contribution",
                        "Introduced the Transformer architecture.",
                      ],
                      [
                        "Core Mechanism",
                        "Multi-head self-attention.",
                      ],
                      [
                        "Complexity",
                        "Attention scales quadratically with sequence length.",
                      ],
                    ].map(([title, text]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-white/10 bg-black/30 p-4"
                      >
                        <p className="text-sm font-medium text-white">
                          {title}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Lightbulb className="h-5 w-5 text-cyan-400" />
                    Key Findings
                  </h2>

                  <div className="mt-5 space-y-4">
                    {[
                      "Self-attention replaces recurrence.",
                      "Architecture enables highly parallel training.",
                      "Attention improves long-range dependency modeling.",
                      "Transformers became foundational to modern LLMs.",
                    ].map((finding) => (
                      <div
                        key={finding}
                        className="flex gap-3 text-sm leading-6 text-gray-400"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                        {finding}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Clock className="h-5 w-5 text-cyan-400" />
                    Activity
                  </h2>

                  <div className="mt-5 space-y-4 text-sm text-gray-400">
                    <p>Viewed 2 hours ago</p>
                    <p>AI Summary generated</p>
                    <p>Added to research collection</p>
                    <p>Notes updated yesterday</p>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Summary */}

          {activeTab === "Summary" && (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <section className="space-y-6">
                <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-cyan-400/10 p-3">
                      <Brain className="h-6 w-6 text-cyan-400" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        AI Paper Summary
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Structured research overview
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-8">
                    <div>
                      <h3 className="font-semibold text-white">
                        Overview
                      </h3>

                      <p className="mt-3 leading-7 text-gray-400">
                        This work introduces the Transformer, a
                        sequence modeling architecture built entirely
                        around attention. By removing recurrent
                        computation, the architecture allows greater
                        parallelization during training while
                        effectively modeling dependencies across
                        sequences.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        Methodology
                      </h3>

                      <p className="mt-3 leading-7 text-gray-400">
                        The architecture uses stacked encoder and
                        decoder blocks containing multi-head
                        self-attention, position-wise feed-forward
                        networks, residual connections and positional
                        encodings.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        Significance
                      </h3>

                      <p className="mt-3 leading-7 text-gray-400">
                        The architecture became the foundation for a
                        large family of subsequent language and
                        multimodal models, fundamentally changing
                        modern deep-learning research.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="font-semibold text-white">
                    Research Metadata
                  </h3>

                  <div className="mt-5 space-y-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Published</span>
                      <span className="text-gray-300">2017</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Authors</span>
                      <span className="text-gray-300">8</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">References</span>
                      <span className="text-gray-300">52</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Pages</span>
                      <span className="text-gray-300">18</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.04] p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-white">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    AI Relevance
                  </h3>

                  <p className="mt-4 text-4xl font-bold text-white">
                    92%
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[92%] rounded-full bg-cyan-400" />
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    Highly relevant to your current AI and deep
                    learning research collection.
                  </p>
                </div>
              </aside>
            </div>
          )}

          {/* Notes */}

          {activeTab === "Notes" && (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                      <BookOpen className="h-5 w-5 text-cyan-400" />
                      Research Notes
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Capture findings while reading the paper.
                    </p>
                  </div>

                  <button
                    onClick={saveNotes}
                    className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 font-medium text-black transition hover:bg-cyan-300"
                  >
                    {notesSaved ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}

                    {notesSaved ? "Saved" : "Save Notes"}
                  </button>
                </div>

                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="mt-6 min-h-[520px] w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-5 leading-7 text-gray-300 outline-none transition focus:border-cyan-400"
                  placeholder="Write your research notes..."
                />
              </div>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="font-semibold text-white">
                    Note Suggestions
                  </h3>

                  <div className="mt-5 space-y-3">
                    {[
                      "Main contribution",
                      "Methodology",
                      "Important results",
                      "Limitations",
                      "Future research",
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() =>
                          setNotes(
                            (current) =>
                              `${current}\n\n${item}:\n`
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm text-gray-400 transition hover:border-cyan-500/30 hover:text-cyan-300"
                      >
                        + {item}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* References */}

          {activeTab === "References" && (
            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <Quote className="h-5 w-5 text-cyan-400" />
                  References & Citations
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Papers referenced by or related to this research.
                </p>
              </div>

              <div className="mt-7 space-y-4">
                {references.map((reference, index) => (
                  <div
                    key={reference.id}
                    className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-cyan-500/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-sm font-semibold text-cyan-400">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-medium leading-6 text-white">
                          {reference.title}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                          {reference.authors} • {reference.year}
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          {reference.citations} citations
                        </p>
                      </div>
                    </div>

                    <button className="flex shrink-0 items-center gap-2 text-sm text-cyan-400 transition hover:text-cyan-300">
                      View Paper
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Chat */}

          {activeTab === "AI Chat" && (
            <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="rounded-3xl border border-cyan-500/20 bg-white/5 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  Suggested Questions
                </h3>

                <div className="mt-5 space-y-3">
                  {chatSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => askAI(suggestion)}
                      className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-left text-sm leading-6 text-gray-400 transition hover:border-cyan-500/30 hover:text-cyan-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </aside>

              <section className="flex min-h-[620px] flex-col overflow-hidden rounded-3xl border border-cyan-500/20 bg-white/5">
                <div className="border-b border-white/10 p-5">
                  <h2 className="flex items-center gap-2 font-semibold text-white">
                    <Brain className="h-5 w-5 text-cyan-400" />
                    Ask this Paper
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Ask questions using the paper as context.
                  </p>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto p-5">
                  {messages.length === 0 ? (
                    <div className="flex h-full min-h-[380px] items-center justify-center text-center">
                      <div>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
                          <MessageSquare className="h-6 w-6 text-cyan-400" />
                        </div>

                        <h3 className="mt-5 font-semibold text-white">
                          Ask anything about this paper
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                          Explore methodology, findings, limitations,
                          concepts and citations.
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-7 ${
                            message.role === "user"
                              ? "bg-cyan-400 text-black"
                              : "border border-white/10 bg-black/40 text-gray-300"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-white/10 p-4">
                  <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-black/40 p-2 focus-within:border-cyan-400">
                    <textarea
                      value={question}
                      onChange={(event) =>
                        setQuestion(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          !event.shiftKey
                        ) {
                          event.preventDefault();
                          askAI();
                        }
                      }}
                      rows={2}
                      placeholder="Ask something about this research paper..."
                      className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600"
                    />

                    <button
                      onClick={() => askAI()}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-black transition hover:bg-cyan-300"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-2 text-center text-[11px] text-gray-600">
                    Enter to send • Shift + Enter for new line
                  </p>
                </div>
              </section>
            </div>
          )}

          {/* Related Papers */}

          <div className="rounded-3xl border border-cyan-500/20 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Related Research
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Continue exploring connected work.
                </p>
              </div>

              <Link
                href="/dashboard/research"
                className="hidden text-sm text-cyan-400 transition hover:text-cyan-300 sm:block"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {relatedPapers.map((paper) => (
                <button
                  key={paper.title}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5 text-left transition hover:-translate-y-0.5 hover:border-cyan-500/30"
                >
                  <FileText className="h-5 w-5 text-cyan-400" />

                  <h3 className="mt-4 font-medium text-white">
                    {paper.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {paper.subtitle}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-xs text-cyan-400">
                    Open paper
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}