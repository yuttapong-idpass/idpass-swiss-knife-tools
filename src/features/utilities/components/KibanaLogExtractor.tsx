import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  ChevronRight,
  ChevronDown,
  Trash2,
  FileDown,
  Table2,
  Loader2,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  FolderOpen,
  FolderPlus,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/providers/ThemeProvider";
import type {
  KibanaParsedRowMeta,
  WorkerResponse,
} from "../workers/kibanaParser.worker";

type UnknownRecord = Record<string, unknown>;
type ExportFileExtension = "json" | "txt";

type PendingExportAction =
  | { type: "zip"; rows: KibanaParsedRowMeta[]; label: string }
  | {
      type: "save";
      rows: KibanaParsedRowMeta[];
      withFolders: boolean;
      label: string;
    };

function replaceJsonExtension(path: string, extension: ExportFileExtension) {
  return path.replace(/\.json$/i, `.${extension}`);
}

function resolveUniqueExportPath(
  path: string,
  usedPaths: Set<string>,
): string {
  if (!usedPaths.has(path)) {
    usedPaths.add(path);
    return path;
  }

  const lastDot = path.lastIndexOf(".");
  const stem = lastDot >= 0 ? path.slice(0, lastDot) : path;
  const ext = lastDot >= 0 ? path.slice(lastDot) : "";

  let counter = 1;
  while (usedPaths.has(`${stem}(${counter})${ext}`)) {
    counter++;
  }

  const uniquePath = `${stem}(${counter})${ext}`;
  usedPaths.add(uniquePath);
  return uniquePath;
}

const columnHelper = createColumnHelper<KibanaParsedRowMeta>();

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ---------------------------------------------------------------------------
// Memoised expanded JSON panel — avoids re-running JSON.stringify on every
// render triggered by selectedKeys / expandedKeys state changes.
// ---------------------------------------------------------------------------
const ExpandedJsonCell = memo(function ExpandedJsonCell({
  fileBaseName,
  hit,
}: {
  fileBaseName: string;
  hit: UnknownRecord | undefined;
}) {
  const json = useMemo(
    () => (hit ? JSON.stringify(hit, null, 2) : "{}"),
    [hit],
  );

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(json);
    toast.success("Copied to clipboard");
  }, [json]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          JSON Details — {fileBaseName}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border hover:bg-muted transition-colors"
        >
          Copy JSON
        </button>
      </div>
      <pre className="text-xs font-mono whitespace-pre-wrap break-all bg-[#1e1e1e] text-[#d4d4d4] border border-border rounded-md p-3 max-h-80 overflow-auto leading-relaxed">
        {json}
      </pre>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function KibanaLogExtractor() {
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const workerRef = useRef<Worker | null>(null);
  // Hit data lives in a ref — React never tracks it, preventing expensive
  // reconciliation of large objects on every state update.
  const hitsMapRef = useRef<Map<string, UnknownRecord>>(new Map());

  const [rows, setRows] = useState<KibanaParsedRowMeta[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [zipping, setZipping] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedTopicFilter, setSelectedTopicFilter] = useState("all");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [pendingExport, setPendingExport] = useState<PendingExportAction | null>(
    null,
  );
  const [selectedExtension, setSelectedExtension] =
    useState<ExportFileExtension>("json");
  const [inputOpen, setInputOpen] = useState(true);

  // Spin up the worker once for the lifetime of the component.
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/kibanaParser.worker.ts", import.meta.url),
      { type: "module" },
    );
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const topicCount = useMemo(
    () => new Set(rows.map((r) => r.topicFolder)).size,
    [rows],
  );

  const topicFilterOptions = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.topicFolder))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [rows],
  );

  const filteredRows = useMemo(() => {
    if (selectedTopicFilter === "all") return rows;
    return rows.filter((r) => r.topicFolder === selectedTopicFilter);
  }, [rows, selectedTopicFilter]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "expand",
        header: () => null,
        cell: ({ row }) => {
          const isExpanded = expandedKeys.has(row.original.key);
          return (
            <button
              type="button"
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
              onClick={() => handleToggleExpand(row.original.key)}
              className="flex items-center justify-center h-5 w-5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          );
        },
        size: 32,
      }),
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          const pageRows = table.getRowModel().rows;
          const allPageSelected =
            pageRows.length > 0 &&
            pageRows.every((r) => selectedKeys.has(r.original.key));
          return (
            <input
              type="checkbox"
              checked={allPageSelected}
              onChange={() => {
                const keys = pageRows.map((r) => r.original.key);
                setSelectedKeys((prev) => {
                  const next = new Set(prev);
                  if (allPageSelected) {
                    keys.forEach((k) => next.delete(k));
                  } else {
                    keys.forEach((k) => next.add(k));
                  }
                  return next;
                });
              }}
              aria-label="Select all on page"
              className="h-4 w-4"
            />
          );
        },
        cell: ({ row }) => {
          const isSelected = selectedKeys.has(row.original.key);
          return (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggleSelect(row.original.key)}
              aria-label={`Select ${row.original.fileBaseName}`}
              className="h-4 w-4"
            />
          );
        },
        size: 40,
      }),
      columnHelper.accessor("topicFolder", {
        header: "Service folder",
        cell: (info) => (
          <span
            className="font-mono text-xs block truncate max-w-[180px]"
            title={info.getValue()}
          >
            {info.getValue()}
          </span>
        ),
        size: 180,
      }),
      columnHelper.accessor("fileBaseName", {
        header: "File",
        cell: (info) => (
          <span
            className="font-mono text-xs text-primary block truncate max-w-[160px]"
            title={info.getValue()}
          >
            {info.getValue()}
          </span>
        ),
        size: 160,
      }),
      columnHelper.accessor("requestUri", {
        header: "Request URI",
        cell: (info) => (
          <span
            className="text-muted-foreground block truncate max-w-[220px]"
            title={info.getValue()}
          >
            {info.getValue()}
          </span>
        ),
        size: 220,
      }),
      columnHelper.accessor("method", {
        header: "Method",
        size: 80,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        size: 70,
      }),
      columnHelper.accessor("timestamp", {
        header: "Timestamp",
        cell: (info) => <span className="text-xs">{info.getValue()}</span>,
        size: 160,
      }),
      columnHelper.accessor("requestId", {
        header: "Request ID",
        cell: (info) => (
          <span className="font-mono text-xs break-all">{info.getValue()}</span>
        ),
        size: 100,
      }),
      columnHelper.accessor("responseTime", {
        header: "ms",
        size: 60,
      }),
      columnHelper.accessor("serviceEndpoint", {
        header: "Endpoint",
        size: 120,
      }),
      columnHelper.accessor("region", {
        header: "Region",
        size: 90,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expandedKeys, selectedKeys],
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  const handleParse = useCallback(() => {
    const raw = textareaRef.current?.value ?? "";
    if (!raw.trim()) return;

    const worker = workerRef.current;
    if (!worker) return;

    setIsParsing(true);
    setParseProgress(0);

    // Remove any previous listener before attaching a new one.
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const data = e.data;

      if (data.type === "progress") {
        setParseProgress(data.value);
        return;
      }

      setIsParsing(false);
      setParseProgress(100);

      if (data.type === "error") {
        toast.error(data.message);
        setRows([]);
        hitsMapRef.current = new Map();
        setSelectedKeys(new Set());
        setExpandedKeys(new Set());
        setSelectedTopicFilter("all");
        return;
      }

      // type === "done"
      const { metas, hitEntries, count } = data;
      hitsMapRef.current = new Map(hitEntries);

      if (count === 0) {
        toast.info("No log entries found in the input.");
        setRows([]);
        setSelectedKeys(new Set());
        setExpandedKeys(new Set());
        return;
      }

      setRows(metas);
      setSelectedKeys(new Set());
      setExpandedKeys(new Set());
      setSelectedTopicFilter("all");
      toast.success(
        `Parsed ${count} ${count === 1 ? "entry" : "entries"}.`,
      );
    };

    worker.onerror = (err) => {
      setIsParsing(false);
      toast.error(err.message || "Parse failed.");
    };

    worker.postMessage(raw);
  }, []);

  const handleClear = useCallback(() => {
    if (textareaRef.current) textareaRef.current.value = "";
    hitsMapRef.current = new Map();
    setRows([]);
    setSelectedKeys(new Set());
    setExpandedKeys(new Set());
    setSelectedTopicFilter("all");
    setParseProgress(0);
  }, []);

  const handleToggleSelect = useCallback((key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleToggleExpand = useCallback((key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedKeys((prev) => {
      const visibleKeys = filteredRows.map((r) => r.key);
      const visibleKeySet = new Set(visibleKeys);
      const allVisibleSelected =
        visibleKeys.length > 0 && visibleKeys.every((k) => prev.has(k));
      if (allVisibleSelected) {
        return new Set([...prev].filter((k) => !visibleKeySet.has(k)));
      }
      const next = new Set(prev);
      for (const key of visibleKeys) next.add(key);
      return next;
    });
  }, [filteredRows]);

  const handleDownloadZip = useCallback(
    async (targetRows: KibanaParsedRowMeta[], extension: ExportFileExtension) => {
      if (targetRows.length === 0) {
        toast.info("Select at least one log entry first.");
        return;
      }
      setZipping(true);
      try {
        const zip = new JSZip();
        const usedPaths = new Set<string>();
        for (const row of targetRows) {
          const hit = hitsMapRef.current.get(row.key);
          const json = hit ? JSON.stringify(hit, null, 2) : "{}";
          const exportPath = resolveUniqueExportPath(
            replaceJsonExtension(row.zipRelativePath, extension),
            usedPaths,
          );
          zip.file(exportPath, json);
        }
        const blob = await zip.generateAsync({ type: "blob" });
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        saveAs(blob, `kibana-logs-${stamp}.zip`);
        toast.success(
          `ZIP ready — download started (${targetRows.length} .${extension} file${targetRows.length === 1 ? "" : "s"}).`,
        );
      } catch {
        toast.error("Could not build ZIP.");
      } finally {
        setZipping(false);
      }
    },
    [],
  );

  const handleSaveFiles = useCallback(
    async (
      targetRows: KibanaParsedRowMeta[],
      withFolders: boolean,
      extension: ExportFileExtension,
    ) => {
      if (targetRows.length === 0) {
        toast.info("Select at least one log entry first.");
        return;
      }
      if (!("showDirectoryPicker" in window)) {
        toast.error(
          "Your browser does not support the File System Access API. Please use Chrome or Edge.",
        );
        return;
      }
      setSaving(true);
      try {
        const dirHandle = await (
          window as Window & {
            showDirectoryPicker: (
              options?: Record<string, unknown>,
            ) => Promise<FileSystemDirectoryHandle>;
          }
        ).showDirectoryPicker({ mode: "readwrite" });

        let savedCount = 0;
        const usedPaths = new Set<string>();
        for (const row of targetRows) {
          try {
            let targetDir: FileSystemDirectoryHandle = dirHandle;
            if (withFolders) {
              targetDir = await dirHandle.getDirectoryHandle(row.topicFolder, {
                create: true,
              });
            }
            const basePath = withFolders
              ? replaceJsonExtension(row.zipRelativePath, extension)
              : replaceJsonExtension(row.fileBaseName, extension);
            const exportPath = resolveUniqueExportPath(basePath, usedPaths);
            const fileName = exportPath.includes("/")
              ? exportPath.slice(exportPath.lastIndexOf("/") + 1)
              : exportPath;
            const fileHandle = await targetDir.getFileHandle(fileName, {
              create: true,
            });
            const writable = await fileHandle.createWritable();
            const hit = hitsMapRef.current.get(row.key);
            await writable.write(hit ? JSON.stringify(hit, null, 2) : "{}");
            await writable.close();
            savedCount++;
          } catch {
            // skip individual file errors silently
          }
        }
        toast.success(
          `Saved ${savedCount} .${extension} file${savedCount === 1 ? "" : "s"} successfully.`,
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        toast.error("Could not save files to the selected folder.");
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const openExportDialog = useCallback((action: PendingExportAction) => {
    if (action.rows.length === 0) {
      toast.info("Select at least one log entry first.");
      return;
    }
    setPendingExport(action);
    setSelectedExtension("json");
    setExportDialogOpen(true);
  }, []);

  const handleConfirmExport = useCallback(() => {
    if (!pendingExport) return;

    const action = pendingExport;
    setExportDialogOpen(false);
    setPendingExport(null);

    if (action.type === "zip") {
      void handleDownloadZip(action.rows, selectedExtension);
      return;
    }

    void handleSaveFiles(action.rows, action.withFolders, selectedExtension);
  }, [handleDownloadZip, handleSaveFiles, pendingExport, selectedExtension]);

  const selectedRows = useMemo(
    () => filteredRows.filter((row) => selectedKeys.has(row.key)),
    [filteredRows, selectedKeys],
  );

  const allVisibleSelected =
    filteredRows.length > 0 &&
    filteredRows.every((row) => selectedKeys.has(row.key));

  const { pageIndex, pageSize } = pagination;
  const pageCount = table.getPageCount();
  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const inputThemeClass = isDarkMode
    ? "bg-[#1e1e1e] text-[#d4d4d4] border-white/10 placeholder:text-white/50"
    : "bg-white text-slate-900 border-slate-300 placeholder:text-slate-500";

  return (
    <main className="p-4 w-full  mx-auto">
      <p className="text-xl font-extrabold text-default-800 mb-4">
        Kibana Log Extractor
      </p>
      <p className="text-sm text-muted-foreground mb-6 max-w-3xl">
        Paste Elasticsearch / Kibana Discover hits (JSON array or NDJSON). Files
        are grouped into folders named by{" "}
        <span className="font-mono text-xs bg-muted px-1 rounded">
          kafka_topic_name.keyword
        </span>
        , with each hit saved as{" "}
        <span className="font-mono text-xs bg-muted px-1 rounded">
          {"{last URI segment}"}.json
        </span>
        . Duplicate API names in the same service folder get{" "}
        <span className="font-mono text-xs bg-muted px-1 rounded">
          (1), (2), …
        </span>{" "}
        suffixes so every log is exported.
      </p>

      <div className="flex flex-col gap-4">
        <Collapsible
          open={inputOpen}
          onOpenChange={setInputOpen}
          className="flex flex-col gap-2"
        >
          <div className="flex justify-between items-center flex-wrap gap-2">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 font-medium text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {inputOpen ? (
                  <ChevronDown size={16} className="shrink-0" />
                ) : (
                  <ChevronRight size={16} className="shrink-0" />
                )}
                Input —{" "}
                <span className="font-mono text-xs bg-muted px-1 rounded">
                  NDJSON
                </span>{" "}
                or{" "}
                <span className="font-mono text-xs bg-muted px-1 rounded">
                  JSON array
                </span>
              </button>
            </CollapsibleTrigger>
            <Button
              variant="secondary"
              size="lg"
              type="button"
              className="hover:bg-gray-200 hover:text-black text-muted-foreground"
              onClick={handleClear}
            >
              <Trash2 size={14} className="mr-1" />
              Clear
            </Button>
          </div>

          <CollapsibleContent className="flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              defaultValue=""
              className={`w-full min-h-[12rem] h-48 p-3 font-mono text-sm border rounded-md resize-y focus:outline-none focus:ring-1 focus:ring-ring ${inputThemeClass}`}
              placeholder={`Paste a JSON array of hits, or one JSON object per line:\n\n[{"_index":"...","fields":{"kafka_topic_name.keyword":["az-sit-..."],"REQUEST_URI.keyword":["/path/MyEndpoint"],...}}, ...]`}
            />

            {isParsing && (
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-200 rounded-full"
                  style={{ width: `${parseProgress}%` }}
                />
              </div>
            )}
          </CollapsibleContent>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleParse} disabled={isParsing}>
              {isParsing ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <ChevronRight size={16} className="mr-1" />
              )}
              {isParsing ? `Parsing… ${parseProgress}%` : "Parse logs"}
            </Button>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Filter:
              <select
                value={selectedTopicFilter}
                onChange={(e) => {
                  const newFilter = e.target.value;
                  setSelectedTopicFilter(newFilter);
                  setPagination((p) => ({ ...p, pageIndex: 0 }));
                }}
                className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                disabled={rows.length === 0}
              >
                <option value="all">All service folders</option>
                {topicFilterOptions.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>
            <Button
              type="button"
              variant="secondary"
              disabled={rows.length === 0 || zipping || saving}
              onClick={() =>
                openExportDialog({
                  type: "zip",
                  rows,
                  label: `Download all (${rows.length})`,
                })
              }
            >
              {zipping ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <FileDown size={16} className="mr-1" />
              )}
              Download all
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={selectedRows.length === 0 || zipping || saving}
              onClick={() =>
                openExportDialog({
                  type: "zip",
                  rows: selectedRows,
                  label: `Download selected (${selectedRows.length})`,
                })
              }
            >
              {zipping ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <FileDown size={16} className="mr-1" />
              )}
              Download selected ({selectedRows.length})
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={selectedRows.length === 0 || zipping || saving}
              onClick={() =>
                openExportDialog({
                  type: "save",
                  rows: selectedRows,
                  withFolders: false,
                  label: `Save files (${selectedRows.length})`,
                })
              }
            >
              {saving ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <FolderOpen size={16} className="mr-1" />
              )}
              Save files ({selectedRows.length})
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={selectedRows.length === 0 || zipping || saving}
              onClick={() =>
                openExportDialog({
                  type: "save",
                  rows: selectedRows,
                  withFolders: true,
                  label: `Save and create folders (${selectedRows.length})`,
                })
              }
            >
              {saving ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <FolderPlus size={16} className="mr-1" />
              )}
              Save and create folders ({selectedRows.length})
            </Button>
          </div>
        </Collapsible>

        {rows.length > 0 && (
          <section
            className="flex flex-col gap-0 border border-border rounded-lg overflow-hidden bg-card"
            id="entries-table"
          >
            {/* Table header bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-border">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Table2 size={18} className="text-muted-foreground" />
                Parsed entries
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  {filteredRows.length}/{rows.length} file
                  {rows.length === 1 ? "" : "s"} · {topicCount} service folder
                  {topicCount === 1 ? "" : "s"}
                </span>
                <span>Selected: {selectedKeys.size}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:text-foreground px-2 py-1 rounded border border-border hover:bg-muted transition-colors"
                  onClick={handleToggleSelectAll}
                >
                  {allVisibleSelected ? "Unselect visible" : "Select visible"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:text-foreground px-2 py-1 rounded border border-border hover:bg-muted transition-colors"
                  onClick={() =>
                    setExpandedKeys(new Set(filteredRows.map((r) => r.key)))
                  }
                >
                  Expand all
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:text-foreground px-2 py-1 rounded border border-border hover:bg-muted transition-colors"
                  onClick={() => setExpandedKeys(new Set())}
                >
                  Collapse all
                </Button>
              </div>
            </div>

            {/* Scrollable table */}
            <div className="overflow-auto max-h-[520px]">
              <Table className="text-sm">
                <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="text-xs uppercase tracking-wide text-muted-foreground border-b border-border hover:bg-transparent"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          style={{
                            width:
                              header.getSize() !== 150
                                ? header.getSize()
                                : undefined,
                          }}
                          className="px-3 py-2 font-medium whitespace-nowrap"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => {
                    const isExpanded = expandedKeys.has(row.original.key);
                    return (
                      <Fragment key={row.original.key}>
                        <TableRow
                          className={`border-b border-border/80 hover:bg-muted/30 transition-colors ${isExpanded ? "bg-muted/20" : ""}`}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="px-3 py-2 align-top overflow-hidden"
                              style={{
                                width:
                                  cell.column.getSize() !== 150
                                    ? cell.column.getSize()
                                    : undefined,
                                maxWidth:
                                  cell.column.getSize() !== 150
                                    ? cell.column.getSize()
                                    : undefined,
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                        {isExpanded && (
                          <TableRow className="border-b border-border bg-muted/10 hover:bg-muted/10">
                            <TableCell
                              colSpan={columns.length}
                              className="px-4 py-3"
                            >
                              <ExpandedJsonCell
                                fileBaseName={row.original.fileBaseName}
                                hit={hitsMapRef.current.get(row.original.key)}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPagination({ pageIndex: 0, pageSize: val });
                  }}
                  className="h-7 rounded border border-border bg-background px-2 text-xs"
                >
                  {PAGE_SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <span>
                {filteredRows.length === 0
                  ? "0 of 0"
                  : `${pageIndex * pageSize + 1}–${Math.min(
                      (pageIndex + 1) * pageSize,
                      filteredRows.length,
                    )} of ${filteredRows.length}`}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="First page"
                >
                  <ChevronsLeft size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </Button>
                <span className="px-2">
                  {pageCount === 0 ? 1 : pageIndex + 1} /{" "}
                  {pageCount === 0 ? 1 : pageCount}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => table.setPageIndex(pageCount - 1)}
                  disabled={!table.getCanNextPage()}
                  aria-label="Last page"
                >
                  <ChevronsRight size={14} />
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>

      <Dialog
        open={exportDialogOpen}
        onOpenChange={(open) => {
          setExportDialogOpen(open);
          if (!open) setPendingExport(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose file extension</DialogTitle>
            <DialogDescription>
              {pendingExport?.label ?? "Select how exported log files should be saved."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <Label className="text-sm font-medium">File extension</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={selectedExtension === "json" ? "default" : "outline"}
                onClick={() => setSelectedExtension("json")}
              >
                .json
              </Button>
              <Button
                type="button"
                variant={selectedExtension === "txt" ? "default" : "outline"}
                onClick={() => setSelectedExtension("txt")}
              >
                .txt
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              File content stays the same formatted JSON. Only the extension changes.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setExportDialogOpen(false);
                setPendingExport(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmExport}>
              Export as .{selectedExtension}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
