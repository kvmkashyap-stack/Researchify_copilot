"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  FolderKanban,
  Plus,
  Search,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  LayoutGrid,
  Columns3,
  X,
  CheckCircle2,
  Circle,
  Timer,
  Eye,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

type ProjectStatus = "Active" | "Completed" | "Planning";

type Project = {
  id: number;
  title: string;
  description: string;
  progress: number;
  members: number;
  due: string;
  status: ProjectStatus;
};

type TaskStatus = "todo" | "progress" | "review" | "completed";

type Task = {
  id: number;
  title: string;
  project: string;
  status: TaskStatus;
  priority: "Low" | "Medium" | "High";
  due: string;
};

const initialProjects: Project[] = [
  {
    id: 1,
    title: "LLM Research Assistant",
    description:
      "Research on retrieval augmented generation, vector databases and prompt engineering.",
    progress: 78,
    members: 5,
    due: "12 Aug 2026",
    status: "Active",
  },
  {
    id: 2,
    title: "Satellite Operations Copilot",
    description:
      "AI copilot for satellite telemetry monitoring and anomaly detection.",
    progress: 62,
    members: 4,
    due: "20 Aug 2026",
    status: "Active",
  },
  {
    id: 3,
    title: "Medical Paper Analyzer",
    description:
      "Automatic summarization and citation extraction from medical research papers.",
    progress: 100,
    members: 3,
    due: "Completed",
    status: "Completed",
  },
  {
    id: 4,
    title: "Research Knowledge Graph",
    description:
      "Create relationships between papers, authors and concepts using AI.",
    progress: 43,
    members: 6,
    due: "30 Aug 2026",
    status: "Planning",
  },
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Collect RAG research papers",
    project: "LLM Research Assistant",
    status: "todo",
    priority: "High",
    due: "8 Aug",
  },
  {
    id: 2,
    title: "Prepare vector database comparison",
    project: "LLM Research Assistant",
    status: "todo",
    priority: "Medium",
    due: "9 Aug",
  },
  {
    id: 3,
    title: "Analyze telemetry dataset",
    project: "Satellite Operations Copilot",
    status: "progress",
    priority: "High",
    due: "7 Aug",
  },
  {
    id: 4,
    title: "Build anomaly research notes",
    project: "Satellite Operations Copilot",
    status: "progress",
    priority: "Medium",
    due: "10 Aug",
  },
  {
    id: 5,
    title: "Review generated summaries",
    project: "Medical Paper Analyzer",
    status: "review",
    priority: "Medium",
    due: "6 Aug",
  },
  {
    id: 6,
    title: "Validate citation extraction",
    project: "Medical Paper Analyzer",
    status: "review",
    priority: "High",
    due: "6 Aug",
  },
  {
    id: 7,
    title: "Define knowledge graph schema",
    project: "Research Knowledge Graph",
    status: "completed",
    priority: "Low",
    due: "Completed",
  },
];

const columns: {
  id: TaskStatus;
  title: string;
  icon: typeof Circle;
}[] = [
  {
    id: "todo",
    title: "To Do",
    icon: Circle,
  },
  {
    id: "progress",
    title: "In Progress",
    icon: Timer,
  },
  {
    id: "review",
    title: "Review",
    icon: Eye,
  },
  {
    id: "completed",
    title: "Completed",
    icon: CheckCircle2,
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [view, setView] = useState<"projects" | "board">("projects");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProject, setNewTaskProject] = useState(
    initialProjects[0].title
  );
  const [newTaskPriority, setNewTaskPriority] =
    useState<Task["priority"]>("Medium");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = search.toLowerCase();

      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || project.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  const activeProjects = projects.filter(
    (project) => project.status === "Active"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const collaborators = projects.reduce(
    (total, project) => total + project.members,
    0
  );

  function createProject() {
    if (!newProjectTitle.trim()) return;

    const project: Project = {
      id: Date.now(),
      title: newProjectTitle,
      description:
        newProjectDescription ||
        "New research project workspace.",
      progress: 0,
      members: 1,
      due: "Not set",
      status: "Planning",
    };

    setProjects((current) => [project, ...current]);

    setNewProjectTitle("");
    setNewProjectDescription("");
    setShowProjectModal(false);
  }

  function createTask() {
    if (!newTaskTitle.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTaskTitle,
      project: newTaskProject,
      status: "todo",
      priority: newTaskPriority,
      due: "Not set",
    };

    setTasks((current) => [...current, task]);

    setNewTaskTitle("");
    setNewTaskPriority("Medium");
    setShowTaskModal(false);
  }

  function moveTask(id: number, direction: "next" | "previous") {
    const order: TaskStatus[] = [
      "todo",
      "progress",
      "review",
      "completed",
    ];

    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task;

        const currentIndex = order.indexOf(task.status);

        const nextIndex =
          direction === "next"
            ? Math.min(currentIndex + 1, order.length - 1)
            : Math.max(currentIndex - 1, 0);

        return {
          ...task,
          status: order[nextIndex],
        };
      })
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <DashboardHeader />

        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
          {/* Header */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
                <FolderKanban className="h-8 w-8 text-cyan-400" />
                Research Projects
              </h1>

              <p className="mt-2 text-gray-400">
                Organize projects, research tasks and team progress.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {view === "board" && (
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                >
                  <Plus className="h-5 w-5" />
                  Add Task
                </button>
              )}

              <button
                onClick={() => setShowProjectModal(true)}
                className="flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300"
              >
                <Plus className="h-5 w-5" />
                New Project
              </button>
            </div>
          </div>

          {/* Stats */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold text-white">
                {activeProjects}
              </p>

              <p className="mt-2 text-gray-400">
                Active Projects
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold text-white">
                {completedProjects}
              </p>

              <p className="mt-2 text-gray-400">
                Completed
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold text-white">
                {collaborators}
              </p>

              <p className="mt-2 text-gray-400">
                Collaborators
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold text-white">
                {tasks.length}
              </p>

              <p className="mt-2 text-gray-400">
                Tasks
              </p>
            </div>
          </div>

          {/* Controls */}

          <div className="flex flex-col gap-4 rounded-3xl border border-cyan-500/20 bg-white/5 p-5 backdrop-blur-xl xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="Search projects..."
                className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-12 pr-5 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <button
                  onClick={() =>
                    setShowFilters((current) => !current)
                  }
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-gray-300 transition hover:border-cyan-400 hover:text-white"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {filter === "All" ? "Filter" : filter}
                </button>

                {showFilters && (
                  <div className="absolute right-0 top-14 z-30 w-44 rounded-2xl border border-white/10 bg-[#101010] p-2 shadow-2xl">
                    {[
                      "All",
                      "Active",
                      "Planning",
                      "Completed",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilter(status);
                          setShowFilters(false);
                        }}
                        className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                          filter === status
                            ? "bg-cyan-400/10 text-cyan-300"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex rounded-2xl border border-white/10 bg-black/40 p-1">
                <button
                  onClick={() => setView("projects")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${
                    view === "projects"
                      ? "bg-cyan-400 text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Projects
                </button>

                <button
                  onClick={() => setView("board")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${
                    view === "board"
                      ? "bg-cyan-400 text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Columns3 className="h-4 w-4" />
                  Board
                </button>
              </div>
            </div>
          </div>

          {/* Project View */}

          {view === "projects" && (
            <>
              {filteredProjects.length > 0 ? (
                <div className="grid gap-6 xl:grid-cols-2">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs ${
                              project.status === "Completed"
                                ? "border-green-500/20 bg-green-500/10 text-green-300"
                                : project.status === "Planning"
                                ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                                : "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                            }`}
                          >
                            {project.status}
                          </span>

                          <h2 className="mt-4 text-2xl font-semibold text-white">
                            {project.title}
                          </h2>
                        </div>

                        <FolderKanban className="h-7 w-7 shrink-0 text-cyan-400" />
                      </div>

                      <p className="mt-4 leading-7 text-gray-400">
                        {project.description}
                      </p>

                      <div className="mt-6">
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-gray-400">
                            Progress
                          </span>

                          <span className="font-medium text-cyan-300">
                            {project.progress}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                            style={{
                              width: `${project.progress}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-5 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-cyan-400" />
                          {project.members} Members
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-cyan-400" />
                          {project.due}
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          {project.status}
                        </div>
                      </div>

                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 transition hover:gap-3 hover:text-cyan-300"
                      >
                        Open Project
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-20 text-center">
                  <FolderKanban className="mx-auto h-12 w-12 text-gray-700" />

                  <h2 className="mt-5 text-xl font-semibold text-white">
                    No projects found
                  </h2>

                  <p className="mt-2 text-gray-500">
                    Try another search or project status.
                  </p>

                  <button
                    onClick={() => {
                      setSearch("");
                      setFilter("All");
                    }}
                    className="mt-6 rounded-xl border border-cyan-500/30 px-5 py-2.5 text-cyan-300 transition hover:bg-cyan-500/10"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* Kanban Board */}

          {view === "board" && (
            <div className="overflow-x-auto pb-4">
              <div className="grid min-w-[1100px] grid-cols-4 gap-5">
                {columns.map((column) => {
                  const Icon = column.icon;

                  const columnTasks = tasks.filter(
                    (task) => task.status === column.id
                  );

                  return (
                    <div
                      key={column.id}
                      className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-cyan-400" />

                          <h2 className="font-semibold text-white">
                            {column.title}
                          </h2>
                        </div>

                        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/10 px-2 text-xs text-gray-400">
                          {columnTasks.length}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {columnTasks.map((task) => (
                          <div
                            key={task.id}
                            className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-4 transition hover:border-cyan-500/30"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-sm font-medium leading-6 text-white">
                                {task.title}
                              </h3>

                              <span
                                className={`shrink-0 rounded-full px-2 py-1 text-[10px] ${
                                  task.priority === "High"
                                    ? "bg-red-500/10 text-red-300"
                                    : task.priority === "Medium"
                                    ? "bg-yellow-500/10 text-yellow-300"
                                    : "bg-green-500/10 text-green-300"
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>

                            <p className="mt-3 text-xs text-gray-500">
                              {task.project}
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Calendar className="h-3.5 w-3.5" />
                                {task.due}
                              </div>

                              <div className="flex items-center gap-1">
                                {task.status !== "todo" && (
                                  <button
                                    onClick={() =>
                                      moveTask(
                                        task.id,
                                        "previous"
                                      )
                                    }
                                    className="rounded-lg border border-white/10 p-1.5 text-gray-500 transition hover:border-cyan-500/30 hover:text-cyan-300"
                                  >
                                    <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                                  </button>
                                )}

                                {task.status !== "completed" && (
                                  <button
                                    onClick={() =>
                                      moveTask(task.id, "next")
                                    }
                                    className="rounded-lg border border-white/10 p-1.5 text-gray-500 transition hover:border-cyan-500/30 hover:text-cyan-300"
                                  >
                                    <ChevronRight className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {columnTasks.length === 0 && (
                          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-xs text-gray-600">
                            No tasks
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* New Project Modal */}

      {showProjectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-[#0b0b0b] p-7 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Create Research Project
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create a new frontend project workspace.
                </p>
              </div>

              <button
                onClick={() => setShowProjectModal(false)}
                className="rounded-xl border border-white/10 p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <label className="text-sm text-gray-400">
                  Project Name
                </label>

                <input
                  value={newProjectTitle}
                  onChange={(event) =>
                    setNewProjectTitle(event.target.value)
                  }
                  placeholder="e.g. Quantum Computing Research"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">
                  Description
                </label>

                <textarea
                  value={newProjectDescription}
                  onChange={(event) =>
                    setNewProjectDescription(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Describe the research project..."
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setShowProjectModal(false)}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-gray-300 transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={createProject}
                className="rounded-xl bg-cyan-400 px-5 py-2.5 font-semibold text-black transition hover:bg-cyan-300"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}

      {showTaskModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-[#0b0b0b] p-7 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Add Research Task
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  New tasks start in the To Do column.
                </p>
              </div>

              <button
                onClick={() => setShowTaskModal(false)}
                className="rounded-xl border border-white/10 p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <label className="text-sm text-gray-400">
                  Task
                </label>

                <input
                  value={newTaskTitle}
                  onChange={(event) =>
                    setNewTaskTitle(event.target.value)
                  }
                  placeholder="Enter task..."
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">
                  Project
                </label>

                <select
                  value={newTaskProject}
                  onChange={(event) =>
                    setNewTaskProject(event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#101010] px-4 py-3 text-white outline-none focus:border-cyan-400"
                >
                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.title}
                    >
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400">
                  Priority
                </label>

                <div className="mt-2 grid grid-cols-3 gap-3">
                  {(["Low", "Medium", "High"] as const).map(
                    (priority) => (
                      <button
                        key={priority}
                        onClick={() =>
                          setNewTaskPriority(priority)
                        }
                        className={`rounded-xl border px-3 py-2.5 text-sm transition ${
                          newTaskPriority === priority
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                            : "border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        {priority}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setShowTaskModal(false)}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-gray-300 transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={createTask}
                className="rounded-xl bg-cyan-400 px-5 py-2.5 font-semibold text-black transition hover:bg-cyan-300"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}