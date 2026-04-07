import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Download,
  Trash2,
  ChevronRight,
  ChevronDown,
  FileArchive,
  FolderOpen,
  FileJson,
} from "lucide-react";

interface LogEntry {
  id: string;
  folderName: string;
  requestUri: string;
  rawContent: string;
  selected: boolean;
  expanded: boolean;
}

function extractRequestUri(obj: any): string | null {
  if (obj?.REQUEST_URI) {
    const uri = Array.isArray(obj.REQUEST_URI)
      ? obj.REQUEST_URI[0]
      : obj.REQUEST_URI;
    return typeof uri === "string" ? uri : null;
  }
  if (obj?._source?.REQUEST_URI) {
    const uri = Array.isArray(obj._source.REQUEST_URI)
      ? obj._source.REQUEST_URI[0]
      : obj._source.REQUEST_URI;
    return typeof uri === "string" ? uri : null;
  }
  if (obj?.fields?.REQUEST_URI) {
    const uri = Array.isArray(obj.fields.REQUEST_URI)
      ? obj.fields.REQUEST_URI[0]
      : obj.fields.REQUEST_URI;
    return typeof uri === "string" ? uri : null;
  }
  return null;
}

function getLastPathSegment(uri: string): string {
  const withoutQuery = uri.split("?")[0];
  const cleaned = withoutQuery.replace(/\/$/, "");
  const parts = cleaned.split("/");
  const last = parts[parts.length - 1];
  return last || "unknown";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function KibanaLogExtractor() {
  const [inputText, setInputText] = useState("");
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [isParsed, setIsParsed] = useState(false);

  const parseLog = () => {
    if (!inputText.trim()) {
      toast.warn("Please enter Kibana log data.");
      return;
    }

    let objects: any[] = [];

    // Strategy 1: Try as JSON array or single object
    try {
      const parsed = JSON.parse(inputText.trim());
      if (Array.isArray(parsed)) {
        objects = parsed;
      } else if (typeof parsed === "object" && parsed !== null) {
        objects = [parsed];
      }
    } catch {
      // Strategy 2: Try as NDJSON (one JSON per line)
      const lines = inputText
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      let failedCount = 0;
      lines.forEach((line, idx) => {
        try {
          const obj = JSON.parse(line.trim());
          objects.push(obj);
        } catch {
          failedCount++;
          if (failedCount <= 3) {
            toast.warn(`Line ${idx + 1}: Invalid JSON, skipping.`);
          }
        }
      });
    }

    if (objects.length === 0) {
      toast.error("No valid JSON found. Please paste NDJSON or a JSON array.");
      return;
    }

    const parsed: LogEntry[] = [];
    objects.forEach((obj, idx) => {
      const uri = extractRequestUri(obj);
      if (!uri) return;

      const segment = getLastPathSegment(uri);
      parsed.push({
        id: `entry-${idx}-${Date.now()}`,
        folderName: segment,
        requestUri: uri,
        rawContent: JSON.stringify(obj, null, 2),
        selected: true,
        expanded: false,
      });
    });

    if (parsed.length === 0) {
      toast.error(
        "No entries with REQUEST_URI found. Checked top-level, _source, and fields."
      );
      return;
    }

    setEntries(parsed);
    setIsParsed(true);
    toast.success(`Parsed ${parsed.length} log entries successfully.`);
  };

  const toggleSelect = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, selected: !e.selected } : e))
    );
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, expanded: !entry.expanded } : entry
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected = entries.every((e) => e.selected);
    setEntries((prev) => prev.map((e) => ({ ...e, selected: !allSelected })));
  };

  const downloadZip = async () => {
    const selected = entries.filter((e) => e.selected);
    if (selected.length === 0) {
      toast.warn("Please select at least one entry.");
      return;
    }

    const zip = new JSZip();
    const folderFileCounts: Record<string, number> = {};

    selected.forEach((entry) => {
      const folder = zip.folder(entry.folderName)!;
      const count = folderFileCounts[entry.folderName] || 0;
      folderFileCounts[entry.folderName] = count + 1;
      const fileName = count === 0 ? "log.json" : `log_${count + 1}.json`;
      folder.file(fileName, entry.rawContent);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    saveAs(blob, `kibana-logs-${timestamp}.zip`);
    toast.success(`Downloaded ${selected.length} entries as ZIP.`);
  };

  const clear = () => {
    setInputText("");
    setEntries([]);
    setIsParsed(false);
  };

  const selectedCount = entries.filter((e) => e.selected).length;
  const allSelected = entries.length > 0 && entries.every((e) => e.selected);

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-4">
        Kibana Log Extractor
      </p>

      <div className="flex flex-col gap-4">
        {/* Input Section */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-muted-foreground">
              Paste Kibana Log — supports{" "}
              <span className="font-mono text-xs bg-muted px-1 rounded">
                NDJSON
              </span>{" "}
              or{" "}
              <span className="font-mono text-xs bg-muted px-1 rounded">
                JSON Array
              </span>
            </span>
            <Button variant="ghost" size="sm" onClick={clear}>
              <Trash2 size={14} className="mr-1" />
              Clear
            </Button>
          </div>

          <textarea
            className="w-full h-48 p-3 font-mono text-sm bg-[#1e1e1e] text-white border border-border rounded-md resize-y focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder={`Paste NDJSON (one entry per line) or a JSON array:\n\n{"REQUEST_URI": ["/partnergetprofile/66982616969"], "method": "GET", ...}\n{"REQUEST_URI": ["/partnergetprofile/66982616970"], "method": "POST", ...}\n\nor:\n[{"REQUEST_URI": ["/partnergetprofile/111"], ...}, ...]`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <div className="flex gap-2">
            <Button variant="secondary" onClick={parseLog}>
              <ChevronRight size={16} className="mr-1" />
              Parse Logs
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {isParsed && entries.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                Extracted Entries{" "}
                <span className="text-muted-foreground font-normal">
                  ({entries.length} total)
                </span>
              </span>
              <div className="flex gap-2 items-center">
                <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                  {allSelected ? "Deselect All" : "Select All"}
                </Button>
                <Button
                  size="sm"
                  onClick={downloadZip}
                  disabled={selectedCount === 0}
                >
                  <FileArchive size={15} className="mr-1" />
                  <Download size={15} className="mr-1" />
                  Download ZIP{" "}
                  {selectedCount > 0 && (
                    <span className="ml-1 bg-primary-foreground text-primary rounded-full px-1.5 text-xs font-bold">
                      {selectedCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Zip structure preview */}
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2 font-mono">
              <span className="font-semibold text-foreground">
                ZIP structure:
              </span>{" "}
              kibana-logs.zip /
              {Array.from(
                new Set(entries.filter((e) => e.selected).map((e) => e.folderName))
              )
                .slice(0, 4)
                .map((f) => ` ${f}/log.json`)
                .join(" ·")}
              {entries.filter((e) => e.selected).length > 4 && " · ..."}
            </div>

            <div className="border border-border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="w-10 px-3 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-2 text-left w-6"></th>
                    <th className="px-3 py-2 text-left">Folder Name</th>
                    <th className="px-3 py-2 text-left">REQUEST_URI</th>
                    <th className="px-3 py-2 text-right">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <>
                      <tr
                        key={entry.id}
                        className={`border-t border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                          !entry.selected ? "opacity-40" : ""
                        }`}
                        onClick={() => toggleSelect(entry.id)}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={entry.selected}
                            onChange={() => toggleSelect(entry.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="cursor-pointer"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <button
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => toggleExpand(entry.id, e)}
                            title="Preview JSON"
                          >
                            {entry.expanded ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5 font-mono text-blue-400 font-medium">
                            <FolderOpen size={14} />
                            {entry.folderName}
                            <span className="text-muted-foreground font-normal text-xs">
                              / <FileJson size={11} className="inline" />{" "}
                              log.json
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2 font-mono text-muted-foreground text-xs max-w-xs truncate">
                          {entry.requestUri}
                        </td>
                        <td className="px-3 py-2 text-right text-muted-foreground text-xs whitespace-nowrap">
                          {formatBytes(new Blob([entry.rawContent]).size)}
                        </td>
                      </tr>
                      {entry.expanded && (
                        <tr
                          key={`${entry.id}-preview`}
                          className="border-t border-border bg-[#1e1e1e]"
                        >
                          <td colSpan={5} className="px-4 py-3">
                            <pre className="font-mono text-xs text-green-400 overflow-auto max-h-64 whitespace-pre-wrap break-all">
                              {entry.rawContent}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
