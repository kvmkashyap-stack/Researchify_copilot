import Link from "next/link";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  Search,
  Plus,
  FileText,
  Star,
  Clock,
  Brain,
  Sparkles,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const papers = [
  {
    title: "Attention Is All You Need",
    authors: "Google Research",
    year: "2017",
    status: "Analyzed",
  },
  {
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: "Google AI",
    year: "2018",
    status: "Pending",
  },
  {
    title: "LLaMA 3 Technical Report",
    authors: "Meta AI",
    year: "2025",
    status: "Completed",
  },
  {
    title: "RAG for Knowledge Intensive NLP",
    authors: "Meta AI",
    year: "2024",
    status: "Reading",
  },
];

export default function ResearchPage() {
  return (
    <div className="flex min-h-screen bg-black">
      <DashboardSidebar />

      <main className="flex flex-1 flex-col">
        <DashboardHeader />

        <div className="grid flex-1 gap-6 p-6 lg:grid-cols-[260px_1fr_330px]">
          {/* Left Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 py-3 font-semibold text-black hover:bg-cyan-300">
                <Plus className="h-5 w-5" />
                New Research
              </button>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Collections
              </h2>

              <div className="space-y-3">
                {[
                  "All Papers",
                  "Favorites",
                  "Recent",
                  "Machine Learning",
                  "Computer Vision",
                  "NLP",
                ].map((item) => (
                  <button
                    key={item}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-gray-300 transition hover:bg-cyan-500/10 hover:text-white"
                  >
                    {item}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Center */}
          <section className="space-y-6">
            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <h1 className="text-3xl font-bold text-white">
                Research Workspace
              </h1>

              <p className="mt-2 text-gray-400">
                Explore papers, generate AI summaries and organize research.
              </p>

              <div className="relative mt-6">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

                <input
                  placeholder="Search research papers..."
                  className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-5">
              {papers.map((paper) => (
                <div
                  key={paper.title}
                  className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 transition hover:border-cyan-400"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {paper.title}
                      </h2>

                      <p className="mt-2 text-gray-400">
                        {paper.authors}
                      </p>

                      <div className="mt-4 flex gap-5 text-sm text-gray-500">
                        <span>{paper.year}</span>
                        <span>{paper.status}</span>
                      </div>
                    </div>

                    <FileText className="h-10 w-10 text-cyan-400" />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/dashboard/research/1">
                      <button className="rounded-xl bg-cyan-400 px-4 py-2 font-medium text-black hover:bg-cyan-300">
                        Open
                      </button>
                    </Link>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-white hover:border-cyan-400">
                      AI Summary
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-white hover:border-cyan-400">
                      Notes
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-white hover:border-cyan-400">
                      References
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Panel */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">
                  AI Summary
                </h2>
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-400">
                Select any research paper to generate a concise AI summary,
                extract key findings, identify methodologies, and highlight
                important contributions.
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                Quick Stats
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Research Papers</span>
                  <span className="font-semibold text-white">148</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">AI Summaries</span>
                  <span className="font-semibold text-white">92</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Bookmarks</span>
                  <span className="font-semibold text-white">41</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
                <Clock className="h-5 w-5 text-cyan-400" />
                Recent Activity
              </h2>

              <div className="space-y-4 text-sm text-gray-400">
                <div>📄 Uploaded Transformer Paper</div>
                <div>⭐ Added Paper to Favorites</div>
                <div>🧠 AI Summary Generated</div>
                <div>📚 Literature Review Updated</div>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <BookOpen className="h-5 w-5 text-cyan-400" />
                Favorite Papers
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Star className="h-4 w-4 text-yellow-400" />
                  GPT-4 Technical Report
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Vision Transformers
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}