"use client";

import { useMemo, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  Brain,
  Search,
  BookOpen,
  FileText,
  Database,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Sparkles,
  ExternalLink,
  X,
  Clock,
  Hash,
  Library,
} from "lucide-react";

type KnowledgeItem = {
  id: number;
  title: string;
  description: string;
  tag: string;
  category: string;
  bookmarked: boolean;
  updated: string;
  notes: string[];
  references: string[];
  related: string[];
};

const initialKnowledge: KnowledgeItem[] = [
  {
    id: 1,
    title: "Attention Is All You Need",
    description:
      "Transformer architecture, self-attention mechanism and sequence modeling.",
    tag: "Deep Learning",
    category: "Research Papers",
    bookmarked: true,
    updated: "2 hours ago",
    notes: [
      "Introduces the Transformer architecture.",
      "Uses multi-head self-attention.",
      "Removes recurrence and convolution from sequence modeling.",
    ],
    references: [
      "Vaswani et al. — Attention Is All You Need",
      "Devlin et al. — BERT",
      "Dosovitskiy et al. — Vision Transformer",
    ],
    related: ["Transformers", "BERT", "Multi-Head Attention"],
  },
  {
    id: 2,
    title: "Large Language Models",
    description:
      "Prompt engineering, fine-tuning, RLHF and inference optimization.",
    tag: "Generative AI",
    category: "Literature Reviews",
    bookmarked: false,
    updated: "Yesterday",
    notes: [
      "LLMs learn statistical representations from large-scale corpora.",
      "Fine-tuning adapts foundation models to downstream tasks.",
      "Alignment techniques improve model behavior.",
    ],
    references: [
      "GPT Technical Reports",
      "LLaMA Research",
      "Instruction Tuning Literature",
    ],
    related: ["Fine-Tuning", "RLHF", "Prompt Engineering"],
  },
  {
    id: 3,
    title: "Retrieval Augmented Generation",
    description:
      "Vector databases, embeddings, semantic search and context retrieval.",
    tag: "RAG",
    category: "Research Papers",
    bookmarked: true,
    updated: "3 days ago",
    notes: [
      "Retrieves external context before generation.",
      "Reduces reliance on model parametric knowledge.",
      "Vector embeddings enable semantic retrieval.",
    ],
    references: [
      "Retrieval-Augmented Generation for Knowledge-Intensive NLP",
      "Dense Passage Retrieval",
      "Vector Search Systems",
    ],
    related: ["Embeddings", "Vector Databases", "Semantic Search"],
  },
  {
    id: 4,
    title: "Computer Vision",
    description:
      "CNNs, Vision Transformers and multimodal representation learning.",
    tag: "Vision",
    category: "Literature Reviews",
    bookmarked: false,
    updated: "Last week",
    notes: [
      "CNNs extract hierarchical spatial features.",
      "Vision Transformers use patch-based attention.",
      "Multimodal models combine vision and language.",
    ],
    references: [
      "ResNet",
      "Vision Transformer",
      "CLIP",
    ],
    related: ["CNN", "ViT", "Multimodal AI"],
  },
  {
    id: 5,
    title: "Research Embeddings Dataset",
    description:
      "Vectorized research abstracts prepared for semantic similarity experiments.",
    tag: "Dataset",
    category: "Datasets",
    bookmarked: false,
    updated: "1 week ago",
    notes: [
      "Contains research abstract embeddings.",
      "Prepared for similarity and clustering experiments.",
    ],
    references: ["Sentence Transformers", "Semantic Similarity"],
    related: ["Embeddings", "Clustering", "Vector Search"],
  },
];

const folders = [
  {
    title: "Artificial Intelligence",
    children: ["Machine Learning", "Generative AI", "Computer Vision"],
  },
  {
    title: "Deep Learning",
    children: ["Transformers", "CNN", "Attention Mechanisms"],
  },
  {
    title: "Research Methods",
    children: ["Literature Review", "Datasets", "Experiments"],
  },
];

export default function KnowledgePage() {
  const [knowledge, setKnowledge] =
    useState<KnowledgeItem[]>(initialKnowledge);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] =
    useState<KnowledgeItem | null>(null);

  const [expandedFolders, setExpandedFolders] = useState<string[]>([
    "Artificial Intelligence",
  ]);

  const categories = [
    {
      title: "Research Papers",
      icon: FileText,
      count: knowledge.filter(
        (item) => item.category === "Research Papers"
      ).length,
      color: "text-cyan-400",
    },
    {
      title: "Literature Reviews",
      icon: BookOpen,
      count: knowledge.filter(
        (item) => item.category === "Literature Reviews"
      ).length,
      color: "text-green-400",
    },
    {
      title: "Datasets",
      icon: Database,
      count: knowledge.filter(
        (item) => item.category === "Datasets"
      ).length,
      color: "text-yellow-400",
    },
    {
      title: "Bookmarks",
      icon: Bookmark,
      count: knowledge.filter((item) => item.bookmarked).length,
      color: "text-pink-400",
    },
  ];

  const filteredKnowledge = useMemo(() => {
    return knowledge.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tag.toLowerCase().includes(query);

      let matchesCategory = true;

      if (activeCategory === "Bookmarks") {
        matchesCategory = item.bookmarked;
      } else if (activeCategory !== "All") {
        matchesCategory = item.category === activeCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [knowledge, search, activeCategory]);

  function toggleFolder(folder: string) {
    setExpandedFolders((current) =>
      current.includes(folder)
        ? current.filter((item) => item !== folder)
        : [...current, folder]
    );
  }

  function toggleBookmark(id: number) {
    setKnowledge((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              bookmarked: !item.bookmarked,
            }
          : item
      )
    );

    setSelectedItem((current) =>
      current?.id === id
        ? {
            ...current,
            bookmarked: !current.bookmarked,
          }
        : current
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <DashboardHeader />

        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
          {/* Header */}

          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
              <Brain className="h-8 w-8 text-cyan-400" />
              Knowledge Base
            </h1>

            <p className="mt-2 text-gray-400">
              Organize research, notes, AI summaries and references.
            </p>
          </div>

          {/* Search */}

          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search papers, topics, tags and notes..."
              className="w-full rounded-3xl border border-cyan-500/20 bg-white/5 py-4 pl-14 pr-5 text-white backdrop-blur-xl outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
            />
          </div>

          {/* Stats */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((item) => {
              const Icon = item.icon;

              const active = activeCategory === item.title;

              return (
                <button
                  key={item.title}
                  onClick={() =>
                    setActiveCategory(
                      active ? "All" : item.title
                    )
                  }
                  className={`rounded-3xl border p-6 text-left backdrop-blur-xl transition ${
                    active
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-cyan-500/20 bg-white/5 hover:border-cyan-400"
                  }`}
                >
                  <Icon
                    className={`h-9 w-9 ${item.color}`}
                  />

                  <h2 className="mt-5 text-lg font-semibold text-white">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-gray-400">
                    {item.count} Items
                  </p>
                </button>
              );
            })}
          </div>

          {/* Main Workspace */}

          <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
            {/* Folder Tree */}

            <aside className="h-fit rounded-3xl border border-cyan-500/20 bg-white/5 p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2">
                <Library className="h-5 w-5 text-cyan-400" />

                <h2 className="font-semibold text-white">
                  Knowledge Library
                </h2>
              </div>

              <button
                onClick={() => setActiveCategory("All")}
                className={`mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                  activeCategory === "All"
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FolderOpen className="h-4 w-4" />
                All Knowledge
              </button>

              <div className="space-y-2">
                {folders.map((folder) => {
                  const expanded =
                    expandedFolders.includes(folder.title);

                  return (
                    <div key={folder.title}>
                      <button
                        onClick={() =>
                          toggleFolder(folder.title)
                        }
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                      >
                        {expanded ? (
                          <ChevronDown className="h-4 w-4 text-cyan-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}

                        {expanded ? (
                          <FolderOpen className="h-4 w-4 text-cyan-400" />
                        ) : (
                          <Folder className="h-4 w-4 text-gray-500" />
                        )}

                        {folder.title}
                      </button>

                      {expanded && (
                        <div className="ml-8 border-l border-white/10 pl-3">
                          {folder.children.map((child) => (
                            <button
                              key={child}
                              onClick={() => setSearch(child)}
                              className="block w-full rounded-lg px-3 py-2 text-left text-xs text-gray-500 transition hover:bg-white/5 hover:text-cyan-300"
                            >
                              {child}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Knowledge Content */}

            <section>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {activeCategory === "All"
                      ? "All Knowledge"
                      : activeCategory}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredKnowledge.length} results
                  </p>
                </div>

                {activeCategory !== "All" && (
                  <button
                    onClick={() => setActiveCategory("All")}
                    className="text-sm text-cyan-400 transition hover:text-cyan-300"
                  >
                    Clear category
                  </button>
                )}
              </div>

              {filteredKnowledge.length > 0 ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  {filteredKnowledge.map((item) => (
                    <div
                      key={item.id}
                      className="group rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                          {item.tag}
                        </span>

                        <button
                          onClick={() =>
                            toggleBookmark(item.id)
                          }
                          className={`rounded-xl border p-2 transition ${
                            item.bookmarked
                              ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                              : "border-white/10 text-gray-500 hover:border-cyan-400/30 hover:text-cyan-300"
                          }`}
                        >
                          {item.bookmarked ? (
                            <BookmarkCheck className="h-4 w-4" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <h3 className="mt-5 text-xl font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-3 leading-7 text-gray-400">
                        {item.description}
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        Updated {item.updated}
                      </div>

                      <button
                        onClick={() => setSelectedItem(item)}
                        className="mt-6 flex items-center gap-2 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                      >
                        Open Knowledge
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-20 text-center">
                  <Search className="mx-auto h-11 w-11 text-gray-700" />

                  <h3 className="mt-5 text-xl font-semibold text-white">
                    No knowledge found
                  </h3>

                  <p className="mt-2 text-gray-500">
                    Try another search term or category.
                  </p>

                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("All");
                    }}
                    className="mt-6 rounded-xl border border-cyan-500/30 px-5 py-2.5 text-sm text-cyan-300 transition hover:bg-cyan-500/10"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Knowledge Detail */}

      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl overflow-y-auto border-l border-cyan-500/20 bg-[#090909] shadow-2xl shadow-cyan-500/10">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#090909]/95 p-6 backdrop-blur-xl">
              <div>
                <span className="text-xs font-medium text-cyan-400">
                  {selectedItem.tag}
                </span>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Knowledge Detail
                </h2>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-xl border border-white/10 p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl font-bold leading-tight text-white">
                    {selectedItem.title}
                  </h1>

                  <button
                    onClick={() =>
                      toggleBookmark(selectedItem.id)
                    }
                    className={`rounded-xl border p-2.5 ${
                      selectedItem.bookmarked
                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 text-gray-400"
                    }`}
                  >
                    {selectedItem.bookmarked ? (
                      <BookmarkCheck className="h-5 w-5" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <p className="mt-4 leading-7 text-gray-400">
                  {selectedItem.description}
                </p>
              </div>

              {/* AI Notes */}

              <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  AI Notes
                </h3>

                <div className="mt-5 space-y-3">
                  {selectedItem.notes.map((note) => (
                    <div
                      key={note}
                      className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />

                      <p className="text-sm leading-6 text-gray-300">
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* References */}

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <BookOpen className="h-5 w-5 text-cyan-400" />
                  References
                </h3>

                <div className="mt-4 space-y-3">
                  {selectedItem.references.map((reference) => (
                    <button
                      key={reference}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-left text-sm text-gray-300 transition hover:border-cyan-500/30"
                    >
                      <span>{reference}</span>

                      <ExternalLink className="h-4 w-4 shrink-0 text-gray-600" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Related */}

              <div>
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Hash className="h-5 w-5 text-cyan-400" />
                  Related Topics
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedItem.related.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setSearch(topic);
                        setSelectedItem(null);
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:border-cyan-400 hover:text-cyan-300"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Notes */}

              <div>
                <h3 className="font-semibold text-white">
                  Research Notes
                </h3>

                <textarea
                  rows={6}
                  placeholder="Write notes about this topic..."
                  className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                />

                <button className="mt-3 w-full rounded-2xl bg-cyan-400 py-3 font-semibold text-black transition hover:bg-cyan-300">
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}