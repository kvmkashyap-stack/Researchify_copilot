"use client";

import { useMemo, useRef, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Filter,
  Eye,
  Download,
  Trash2,
  Star,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileImage,
  FolderOpen,
  X,
  ChevronDown,
  File,
  Check,
} from "lucide-react";

type DocumentFile = {
  id: number;
  name: string;
  type: string;
  size: string;
  modified: string;
  favorite: boolean;
};

type ViewMode = "grid" | "list";

const initialFiles: DocumentFile[] = [
  {
    id: 1,
    name: "Attention_Is_All_You_Need.pdf",
    type: "PDF",
    size: "4.2 MB",
    modified: "2 hours ago",
    favorite: true,
  },
  {
    id: 2,
    name: "Research_Notes.docx",
    type: "DOCX",
    size: "1.3 MB",
    modified: "Yesterday",
    favorite: false,
  },
  {
    id: 3,
    name: "dataset.csv",
    type: "CSV",
    size: "12 MB",
    modified: "3 days ago",
    favorite: false,
  },
  {
    id: 4,
    name: "architecture.png",
    type: "IMAGE",
    size: "2.1 MB",
    modified: "Last Week",
    favorite: true,
  },
];

const filters = ["ALL", "PDF", "DOCX", "CSV", "IMAGE"];

function FileIcon({
  type,
  large = false,
}: {
  type: string;
  large?: boolean;
}) {
  const size = large ? "h-16 w-16" : "h-8 w-8";

  switch (type) {
    case "PDF":
      return <FileText className={`${size} text-red-400`} />;

    case "CSV":
      return <FileSpreadsheet className={`${size} text-green-400`} />;

    case "IMAGE":
      return <FileImage className={`${size} text-pink-400`} />;

    case "DOCX":
      return <FileCode className={`${size} text-cyan-400`} />;

    default:
      return <File className={`${size} text-gray-400`} />;
  }
}

export default function DocumentsPage() {
  const [files, setFiles] = useState<DocumentFile[]>(initialFiles);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState("Recent");
  const [previewFile, setPreviewFile] = useState<DocumentFile | null>(null);
  const [deleteFile, setDeleteFile] = useState<DocumentFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = useMemo(() => {
    let result = files.filter((file) => {
      const matchesSearch = file.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "ALL" || file.type === activeFilter;

      return matchesSearch && matchesFilter;
    });

    if (sortBy === "Name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "Type") {
      result = [...result].sort((a, b) => a.type.localeCompare(b.type));
    }

    if (sortBy === "Favorites") {
      result = [...result].sort(
        (a, b) => Number(b.favorite) - Number(a.favorite)
      );
    }

    return result;
  }, [files, search, activeFilter, sortBy]);

  function toggleFavorite(id: number) {
    setFiles((current) =>
      current.map((file) =>
        file.id === id
          ? {
              ...file,
              favorite: !file.favorite,
            }
          : file
      )
    );
  }

  function confirmDelete() {
    if (!deleteFile) return;

    setFiles((current) =>
      current.filter((file) => file.id !== deleteFile.id)
    );

    setDeleteFile(null);
  }

  function addUploadedFiles(uploadedFiles: FileList | null) {
    if (!uploadedFiles?.length) return;

    const newFiles: DocumentFile[] = Array.from(uploadedFiles).map(
      (file, index) => {
        const extension =
          file.name.split(".").pop()?.toUpperCase() || "FILE";

        let type = extension;

        if (
          ["PNG", "JPG", "JPEG", "WEBP", "SVG"].includes(extension)
        ) {
          type = "IMAGE";
        }

        return {
          id: Date.now() + index,
          name: file.name,
          type,
          size: `${Math.max(file.size / 1024 / 1024, 0.01).toFixed(1)} MB`,
          modified: "Just now",
          favorite: false,
        };
      }
    );

    setFiles((current) => [...newFiles, ...current]);
  }

  function downloadFile(file: DocumentFile) {
    const content = `Frontend demo file: ${file.name}`;

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();

    URL.revokeObjectURL(url);
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
                <FolderOpen className="h-8 w-8 text-cyan-400" />
                Documents
              </h1>

              <p className="mt-2 text-gray-400">
                Manage research papers, datasets, reports and notes.
              </p>
            </div>

            <button
              onClick={() => inputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300"
            >
              <Upload className="h-5 w-5" />
              Upload Files
            </button>

            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(event) => addUploadedFiles(event.target.files)}
            />
          </div>

          {/* Stats */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold text-white">
                {files.length}
              </p>

              <p className="mt-2 text-gray-400">
                Documents
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold text-white">
                32 GB
              </p>

              <p className="mt-2 text-gray-400">
                Storage Used
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold text-white">
                {files.filter((file) => file.favorite).length}
              </p>

              <p className="mt-2 text-gray-400">
                Favorites
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold text-white">
                24
              </p>

              <p className="mt-2 text-gray-400">
                Shared
              </p>
            </div>
          </div>

          {/* Upload Drop Zone */}

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              addUploadedFiles(event.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition ${
              isDragging
                ? "border-cyan-400 bg-cyan-400/10"
                : "border-white/10 bg-white/[0.03] hover:border-cyan-500/40"
            }`}
          >
            <Upload className="mx-auto h-9 w-9 text-cyan-400" />

            <p className="mt-3 font-medium text-white">
              Drop research files here
            </p>

            <p className="mt-1 text-sm text-gray-500">
              PDF, DOCX, CSV and images
            </p>
          </div>

          {/* Toolbar */}

          <div className="relative rounded-3xl border border-cyan-500/20 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 xl:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search documents..."
                  className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowFilters((current) => !current)}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-white transition hover:border-cyan-400"
                  >
                    <Filter className="h-5 w-5" />
                    {activeFilter === "ALL"
                      ? "Filter"
                      : activeFilter}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 top-14 z-30 w-44 rounded-2xl border border-white/10 bg-[#101010] p-2 shadow-2xl">
                      {filters.map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setActiveFilter(filter);
                            setShowFilters(false);
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                        >
                          {filter === "ALL"
                            ? "All Files"
                            : filter}

                          {activeFilter === filter && (
                            <Check className="h-4 w-4 text-cyan-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowSort((current) => !current)}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-white transition hover:border-cyan-400"
                  >
                    {sortBy}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showSort && (
                    <div className="absolute right-0 top-14 z-30 w-44 rounded-2xl border border-white/10 bg-[#101010] p-2 shadow-2xl">
                      {[
                        "Recent",
                        "Name",
                        "Type",
                        "Favorites",
                      ].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setShowSort(false);
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                        >
                          {option}

                          {sortBy === option && (
                            <Check className="h-4 w-4 text-cyan-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-2xl border p-3 transition ${
                    viewMode === "grid"
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-black/40 text-white hover:border-cyan-400"
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-2xl border p-3 transition ${
                    viewMode === "list"
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-black/40 text-white hover:border-cyan-400"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Documents */}

          {filteredFiles.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-6 xl:grid-cols-2"
                  : "space-y-4"
              }
            >
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`border border-cyan-500/20 bg-white/5 backdrop-blur-xl transition hover:border-cyan-400 ${
                    viewMode === "grid"
                      ? "rounded-3xl p-6"
                      : "flex flex-col gap-5 rounded-2xl p-5 lg:flex-row lg:items-center lg:justify-between"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                      <FileIcon type={file.type} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold text-white">
                        {file.name}
                      </h2>

                      <p className="mt-2 text-sm text-gray-400">
                        {file.type} • {file.size}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        Modified {file.modified}
                      </p>
                    </div>
                  </div>

                  <div
                    className={
                      viewMode === "grid"
                        ? "mt-6 flex flex-wrap items-center gap-3"
                        : "flex flex-wrap items-center gap-3"
                    }
                  >
                    <button
                      onClick={() => toggleFavorite(file.id)}
                      className={`rounded-xl border p-2.5 transition ${
                        file.favorite
                          ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
                          : "border-white/10 text-gray-400 hover:border-yellow-400/40 hover:text-yellow-400"
                      }`}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          file.favorite
                            ? "fill-yellow-400"
                            : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => setPreviewFile(file)}
                      className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-medium text-black transition hover:bg-cyan-300"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>

                    <button
                      onClick={() => downloadFile(file)}
                      className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-white transition hover:border-cyan-400"
                    >
                      <Download className="h-4 w-4" />

                      <span className="hidden sm:inline">
                        Download
                      </span>
                    </button>

                    <button
                      onClick={() => setDeleteFile(file)}
                      className="flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-red-400 transition hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />

                      <span className="hidden sm:inline">
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-20 text-center">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-600" />

              <h2 className="mt-5 text-xl font-semibold text-white">
                No documents found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-500">
                Try changing your search or filter, or upload a new
                research document.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("ALL");
                }}
                className="mt-6 rounded-xl border border-cyan-500/30 px-5 py-2.5 text-cyan-300 transition hover:bg-cyan-500/10"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}

      {previewFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-cyan-500/20 bg-[#0b0b0b] shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="flex min-w-0 items-center gap-4">
                <FileIcon type={previewFile.type} />

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold text-white">
                    {previewFile.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {previewFile.type} • {previewFile.size}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewFile(null)}
                className="rounded-xl border border-white/10 p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/50">
                <div className="text-center">
                  <FileIcon
                    type={previewFile.type}
                    large
                  />

                  <p className="mt-5 font-medium text-white">
                    {previewFile.name}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Document preview area
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    Your backend can provide the actual file URL here.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-gray-500">
                    Type
                  </p>

                  <p className="mt-2 font-medium text-white">
                    {previewFile.type}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-gray-500">
                    Size
                  </p>

                  <p className="mt-2 font-medium text-white">
                    {previewFile.size}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-gray-500">
                    Modified
                  </p>

                  <p className="mt-2 font-medium text-white">
                    {previewFile.modified}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setPreviewFile(null)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-gray-300 transition hover:bg-white/5"
                >
                  Close
                </button>

                <button
                  onClick={() => downloadFile(previewFile)}
                  className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 font-medium text-black transition hover:bg-cyan-300"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}

      {deleteFile && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[#0b0b0b] p-7 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              Delete document?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Are you sure you want to delete{" "}
              <span className="text-white">
                {deleteFile.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setDeleteFile(null)}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-gray-300 transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="rounded-xl bg-red-500 px-5 py-2.5 font-medium text-white transition hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}