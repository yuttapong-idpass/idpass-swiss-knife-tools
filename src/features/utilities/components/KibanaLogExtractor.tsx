import { Fragment, useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  ChevronRight,
  Trash2,
  FileDown,
  Table2,
  Loader2,
} from "lucide-react";

type UnknownRecord = Record<string, unknown>;

interface KibanaParsedRow {
  key: string;
  topicFolder: string;
  requestUri: string;
  fileBaseName: string;
  zipRelativePath: string;
  method: string;
  status: string;
  timestamp: string;
  requestId: string;
  responseTime: string;
  serviceEndpoint: string;
  region: string;
  indexName: string;
  hit: UnknownRecord;
}

function firstScalarFromFields(
  fields: UnknownRecord | undefined,
  keys: string[],
): string {
  if (!fields) return "";
  for (const k of keys) {
    const raw = fields[k];
    if (raw === undefined || raw === null) continue;
    if (Array.isArray(raw) && raw.length > 0) {
      const v = raw[0];
      if (v !== undefined && v !== null) return String(v);
    } else if (typeof raw === "string" || typeof raw === "number") {
      return String(raw);
    }
  }
  return "";
}

function getFieldsContainer(hit: UnknownRecord): UnknownRecord {
  const f = hit.fields;
  if (f && typeof f === "object" && !Array.isArray(f)) {
    return f as UnknownRecord;
  }
  return hit;
}

function uriLastSegment(uri: string): string {
  const trimmed = uri.trim().replace(/\/+$/, "");
  if (!trimmed) return "entry";
  const parts = trimmed.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  return last && last.length > 0 ? last : "entry";
}

function sanitizePathSegment(name: string, fallback: string): string {
  const cleaned = name
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 0 ? cleaned : fallback;
}

function parseInputToObjects(raw: string): UnknownRecord[] {
  const text = raw.trim();
  if (!text) return [];

  const tryParse = (s: string): unknown => {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  };

  const asArray = tryParse(text);
  if (Array.isArray(asArray)) {
    return asArray.filter(
      (x): x is UnknownRecord => x !== null && typeof x === "object",
    );
  }

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const fromNdjson: UnknownRecord[] = [];
  for (const line of lines) {
    const row = tryParse(line);
    if (row && typeof row === "object" && !Array.isArray(row)) {
      fromNdjson.push(row as UnknownRecord);
    }
  }
  if (fromNdjson.length > 0) return fromNdjson;

  throw new Error(
    "Could not parse input. Use a JSON array of hits or NDJSON (one object per line).",
  );
}

function buildRows(hits: UnknownRecord[]): KibanaParsedRow[] {
  const usedNames = new Map<string, number>();

  return hits.map((hit, index) => {
    const fields = getFieldsContainer(hit);

    const topicRaw =
      firstScalarFromFields(fields, [
        "kafka_topic_name.keyword",
        "kafka_topic_name",
      ]) || "unknown-topic";

    const requestUri = firstScalarFromFields(fields, [
      "REQUEST_URI.keyword",
      "REQUEST_URI",
    ]);

    const topicFolder = sanitizePathSegment(topicRaw, "unknown-topic");
    const baseFromUri = uriLastSegment(requestUri);
    const fileBase = sanitizePathSegment(baseFromUri, `entry-${index + 1}`);

    const requestId = firstScalarFromFields(fields, [
      "REQUEST_ID.keyword",
      "REQUEST_ID",
    ]);

    let uniqueStem = fileBase;
    const mapKey = `${topicFolder}/${fileBase}`;
    const seen = usedNames.get(mapKey) ?? 0;
    usedNames.set(mapKey, seen + 1);
    if (seen > 0) {
      const suffix = requestId || String(seen + 1);
      uniqueStem = sanitizePathSegment(`${fileBase}_${suffix}`, fileBase);
    }

    const zipRelativePath = `${topicFolder}/${uniqueStem}.json`;

    const method = firstScalarFromFields(fields, [
      "REQUEST_METHOD.keyword",
      "REQUEST_METHOD",
    ]);

    const status = firstScalarFromFields(fields, [
      "RESPONSE_STATUS.keyword",
      "RESPONSE_STATUS",
    ]);

    const timestamp = firstScalarFromFields(fields, [
      "TIMESTAMP.keyword",
      "TIMESTAMP",
      "@timestamp",
    ]);

    const responseTime = firstScalarFromFields(fields, ["RESPONSE_TIME"]);

    const serviceEndpoint = firstScalarFromFields(fields, [
      "SERVICE_ENDPOINT.keyword",
      "SERVICE_ENDPOINT",
    ]);

    const region = firstScalarFromFields(fields, ["REGION.keyword", "REGION"]);

    const indexName =
      typeof hit._index === "string" ? hit._index : firstScalarFromFields(fields, ["_index"]);

    return {
      key: `${zipRelativePath}-${index}`,
      topicFolder,
      requestUri: requestUri || "—",
      fileBaseName: `${uniqueStem}.json`,
      zipRelativePath,
      method: method || "—",
      status: status || "—",
      timestamp: timestamp || "—",
      requestId: requestId || "—",
      responseTime: responseTime || "—",
      serviceEndpoint: serviceEndpoint || "—",
      region: region || "—",
      indexName: indexName || "—",
      hit,
    };
  });
}

export default function KibanaLogExtractor() {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<KibanaParsedRow[]>([]);
  const [zipping, setZipping] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const topicCount = useMemo(() => {
    return new Set(rows.map((r) => r.topicFolder)).size;
  }, [rows]);

  const handleParse = useCallback(() => {
    try {
      const hits = parseInputToObjects(input);
      if (hits.length === 0) {
        toast.info("No log entries found in the input.");
        setRows([]);
        setSelectedKeys(new Set());
        setExpandedKeys(new Set());
        return;
      }
      const parsedRows = buildRows(hits);
      setRows(parsedRows);
      setSelectedKeys(new Set(parsedRows.map((row) => row.key)));
      setExpandedKeys(new Set());
      toast.success(
        `Parsed ${hits.length} ${hits.length === 1 ? "entry" : "entries"}.`,
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Parse failed.";
      toast.error(msg);
      setRows([]);
      setSelectedKeys(new Set());
      setExpandedKeys(new Set());
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
    setRows([]);
    setSelectedKeys(new Set());
    setExpandedKeys(new Set());
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
      if (prev.size === rows.length) return new Set();
      return new Set(rows.map((r) => r.key));
    });
  }, [rows]);

  const handleDownloadZip = useCallback(async (targetRows: KibanaParsedRow[]) => {
    if (targetRows.length === 0) {
      toast.info("Select at least one log entry first.");
      return;
    }
    setZipping(true);
    try {
      const zip = new JSZip();
      for (const row of targetRows) {
        const json = JSON.stringify(row.hit, null, 2);
        zip.file(row.zipRelativePath, json);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      saveAs(blob, `kibana-logs-${stamp}.zip`);
      toast.success(
        `ZIP ready — download started (${targetRows.length} file${targetRows.length === 1 ? "" : "s"}).`,
      );
    } catch {
      toast.error("Could not build ZIP.");
    } finally {
      setZipping(false);
    }
  }, []);

  const selectedRows = useMemo(
    () => rows.filter((row) => selectedKeys.has(row.key)),
    [rows, selectedKeys],
  );
  const allSelected = rows.length > 0 && selectedKeys.size === rows.length;

  return (
    <main className="p-4 w-full max-w-[1400px] mx-auto">
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
          {'{last URI segment}'}.json
        </span>
        . Duplicate path names get a suffix from{" "}
        <span className="font-mono text-xs bg-muted px-1 rounded">REQUEST_ID</span>.
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              Input —{" "}
              <span className="font-mono text-xs bg-muted px-1 rounded">
                NDJSON
              </span>{" "}
              or{" "}
              <span className="font-mono text-xs bg-muted px-1 rounded">
                JSON array
              </span>
            </span>
            <Button variant="ghost" size="sm" type="button" onClick={handleClear}>
              <Trash2 size={14} className="mr-1" />
              Clear
            </Button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full min-h-[12rem] h-48 p-3 font-mono text-sm bg-[#1e1e1e] text-white border border-border rounded-md resize-y focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder={`Paste a JSON array of hits, or one JSON object per line:\n\n[{"_index":"...","fields":{"kafka_topic_name.keyword":["az-sit-..."],"REQUEST_URI.keyword":["/path/MyEndpoint"],...}}, ...]`}
          />

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleParse}>
              <ChevronRight size={16} className="mr-1" />
              Parse logs
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={rows.length === 0 || zipping}
              onClick={() => void handleDownloadZip(rows)}
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
              disabled={selectedRows.length === 0 || zipping}
              onClick={() => void handleDownloadZip(selectedRows)}
            >
              {zipping ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <FileDown size={16} className="mr-1" />
              )}
              Download selected ({selectedRows.length})
            </Button>
          </div>
        </div>

        {rows.length > 0 && (
          <section className="flex flex-col gap-3 border border-border rounded-lg overflow-hidden bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-border">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Table2 size={18} className="text-muted-foreground" />
                Parsed entries
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  {rows.length} file{rows.length === 1 ? "" : "s"} · {topicCount}{" "}
                  service folder{topicCount === 1 ? "" : "s"}
                </span>
                <span>Selected: {selectedKeys.size}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={handleToggleSelectAll}
                >
                  {allSelected ? "Unselect all" : "Select all"}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                    <th className="px-3 py-2 font-medium whitespace-nowrap">Pick</th>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">
                      Service folder
                    </th>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">
                      File
                    </th>
                    <th className="px-3 py-2 font-medium min-w-[200px]">
                      Request URI
                    </th>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">
                      Method
                    </th>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">
                      Timestamp
                    </th>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">
                      Request ID
                    </th>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">
                      ms
                    </th>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">
                      Endpoint
                    </th>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">
                      Region
                    </th>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">
                      Preview
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const isExpanded = expandedKeys.has(r.key);
                    const isSelected = selectedKeys.has(r.key);
                    return (
                      <Fragment key={r.key}>
                        <tr
                          className="border-b border-border/80 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-3 py-2 align-top">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(r.key)}
                              aria-label={`Select ${r.fileBaseName}`}
                              className="h-4 w-4"
                            />
                          </td>
                          <td className="px-3 py-2 font-mono text-xs align-top">
                            {r.topicFolder}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs align-top text-primary">
                            {r.fileBaseName}
                          </td>
                          <td className="px-3 py-2 align-top break-all max-w-md text-muted-foreground">
                            {r.requestUri}
                          </td>
                          <td className="px-3 py-2 align-top">{r.method}</td>
                          <td className="px-3 py-2 align-top">{r.status}</td>
                          <td className="px-3 py-2 align-top whitespace-nowrap text-xs">
                            {r.timestamp}
                          </td>
                          <td className="px-3 py-2 align-top font-mono text-xs">
                            {r.requestId}
                          </td>
                          <td className="px-3 py-2 align-top">{r.responseTime}</td>
                          <td className="px-3 py-2 align-top">{r.serviceEndpoint}</td>
                          <td className="px-3 py-2 align-top">{r.region}</td>
                          <td className="px-3 py-2 align-top">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() => handleToggleExpand(r.key)}
                            >
                              {isExpanded ? "Collapse" : "Expand"}
                            </Button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="border-b border-border/80 bg-muted/20">
                            <td colSpan={12} className="px-3 py-3">
                              <pre className="text-xs font-mono whitespace-pre-wrap break-all bg-background border border-border rounded p-3 max-h-72 overflow-auto">
                                {JSON.stringify(r.hit, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
