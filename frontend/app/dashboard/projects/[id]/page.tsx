import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";
import {
  ArrowLeft,
  FolderKanban,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Brain,
  MessageSquare,
  Activity,
  Plus,
} from "lucide-react";

const tasks = [
  { title: "Collect Research Papers", status: "Completed" },
  { title: "Generate AI Summary", status: "In Progress" },
  { title: "Review Literature", status: "Pending" },
  { title: "Prepare Final Report", status: "Pending" },
];

const documents = [
  "Transformer.pdf",
  "BERT Paper.pdf",
  "Research Notes.docx",
  "Dataset.csv",
];

export default function ProjectWorkspacePage() {
  return (
    <div className="flex min-h-screen bg-black">
      <DashboardSidebar />

      <main className="flex flex-1 flex-col">
        <DashboardHeader />

        <div className="space-y-6 p-6 lg:p-8">
          {/* Header */}

          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/dashboard/projects"
                className="mb-4 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Link>

              <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
                <FolderKanban className="h-8 w-8 text-cyan-400" />
                AI Research Assistant
              </h1>

              <p className="mt-2 text-gray-400">
                Intelligent research management workspace
              </p>
            </div>

            <button className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-black hover:bg-cyan-300">
              Open Dashboard
            </button>
          </div>

          {/* Stats */}

          <div className="grid gap-6 md:grid-cols-4">
            {[
              ["78%", "Progress"],
              ["18", "Documents"],
              ["5", "Members"],
              ["12 Aug", "Deadline"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6"
              >
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="mt-2 text-gray-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
            {/* Left */}

            <section className="space-y-6">
              {/* Overview */}

              <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
                <h2 className="text-xl font-semibold text-white">
                  Project Overview
                </h2>

                <p className="mt-4 leading-7 text-gray-400">
                  This workspace contains all research papers, AI summaries,
                  project notes, tasks and collaboration tools required for
                  completing the project.
                </p>
              </div>

              {/* Tasks */}

              <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Tasks
                  </h2>

                  <button className="rounded-xl bg-cyan-400 p-2 text-black">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.title}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-cyan-400" />

                        <span className="text-white">{task.title}</span>
                      </div>

                      <span className="text-sm text-gray-400">
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}

              <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                  <FileText className="h-5 w-5 text-cyan-400" />
                  Project Documents
                </h2>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-gray-300"
                    >
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Right */}

            <aside className="space-y-6">
              <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  AI Assistant
                </h2>

                <textarea
                  rows={6}
                  placeholder="Ask AI about this project..."
                  className="mt-5 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none"
                />

                <button className="mt-4 w-full rounded-2xl bg-cyan-400 py-3 font-semibold text-black">
                  Ask AI
                </button>
              </div>

              <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <Users className="h-5 w-5 text-cyan-400" />
                  Team
                </h2>

                <div className="mt-5 space-y-3 text-gray-300">
                  <p>• Research Lead</p>
                  <p>• AI Engineer</p>
                  <p>• Backend Developer</p>
                  <p>• Frontend Developer</p>
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  Recent Activity
                </h2>

                <div className="mt-5 space-y-4 text-sm text-gray-400">
                  <p>Uploaded new research paper</p>
                  <p>AI summary generated</p>
                  <p>Project milestone updated</p>
                  <p>Notes modified</p>
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                  Deadline: 12 August 2026
                </div>

                <div className="mt-4 flex items-center gap-3 text-gray-300">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  Last Updated: Today
                </div>

                <div className="mt-4 flex items-center gap-3 text-gray-300">
                  <MessageSquare className="h-5 w-5 text-cyan-400" />
                  28 AI Conversations
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}