import {
  firstScalarFromFields,
  getFieldsContainer,
  prepareHitForExport,
  sanitizePathSegment,
  uriLastSegment,
} from "./kibanaParser.utils";

type UnknownRecord = Record<string, unknown>;

export interface KibanaParsedRowMeta {
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
}

export type WorkerResponse =
  | { type: "progress"; value: number }
  | {
      type: "done";
      metas: KibanaParsedRowMeta[];
      hitEntries: [string, UnknownRecord][];
      count: number;
    }
  | { type: "error"; message: string };

function isPlainObject(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Unwraps a full Elasticsearch/Kibana search response ({ hits: { hits: [...] } })
 * down to the hit array. A bare hit is returned as-is.
 */
function expandToHits(value: UnknownRecord): UnknownRecord[] {
  const outer = value.hits;
  if (Array.isArray(outer)) {
    return outer.filter(isPlainObject);
  }
  if (isPlainObject(outer) && Array.isArray(outer.hits)) {
    return outer.hits.filter(isPlainObject);
  }
  return [value];
}

/**
 * Last-resort scanner for input that is neither a single valid JSON document nor
 * NDJSON: pretty-printed objects pasted back-to-back (what Kibana Discover's
 * per-document copy button produces). Walks the text tracking brace depth while
 * ignoring braces inside strings, and parses each balanced top-level object.
 */
function extractConcatenatedObjects(text: string): UnknownRecord[] {
  const found: UnknownRecord[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}" && depth > 0) {
      depth--;
      if (depth === 0 && start >= 0) {
        try {
          const parsed: unknown = JSON.parse(text.slice(start, i + 1));
          if (isPlainObject(parsed)) found.push(...expandToHits(parsed));
        } catch {
          // Not a complete object after all — skip it and keep scanning.
        }
        start = -1;
      }
    }
  }

  return found;
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

  // 1. A single valid JSON document: an array of hits, one hit, or a full
  //    Elasticsearch search response.
  const parsed = tryParse(text);
  if (Array.isArray(parsed)) {
    return parsed.filter(isPlainObject);
  }
  if (isPlainObject(parsed)) {
    return expandToHits(parsed);
  }

  // 2. NDJSON — one complete object per line.
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim().replace(/,$/, ""))
    .filter(Boolean);
  const fromNdjson: UnknownRecord[] = [];
  for (const line of lines) {
    const row = tryParse(line);
    if (isPlainObject(row)) fromNdjson.push(...expandToHits(row));
  }
  if (fromNdjson.length > 0) return fromNdjson;

  // 3. Pretty-printed objects pasted one after another.
  const scanned = extractConcatenatedObjects(text);
  if (scanned.length > 0) return scanned;

  throw new Error(
    "Could not parse input. Paste Kibana hits as a JSON array, NDJSON (one object per line), or one or more JSON objects.",
  );
}

function buildRowsWithHits(hits: UnknownRecord[]): {
  metas: KibanaParsedRowMeta[];
  hitEntries: [string, UnknownRecord][];
} {
  const usedNames = new Map<string, number>();
  const metas: KibanaParsedRowMeta[] = [];
  const hitEntries: [string, UnknownRecord][] = [];

  const progressStep = Math.max(1, Math.floor(hits.length / 20));

  for (let index = 0; index < hits.length; index++) {
    const hit = hits[index];
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

    const mapKey = `${topicFolder}/${fileBase}`;
    const seen = usedNames.get(mapKey) ?? 0;
    usedNames.set(mapKey, seen + 1);

    const uniqueStem =
      seen > 0
        ? sanitizePathSegment(`${fileBase}(${seen})`, `${fileBase}(${seen})`)
        : fileBase;

    const zipRelativePath = `${topicFolder}/${uniqueStem}.json`;
    const key = `${zipRelativePath}-${index}`;

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
    const requestId = firstScalarFromFields(fields, [
      "REQUEST_ID.keyword",
      "REQUEST_ID",
    ]);
    const responseTime = firstScalarFromFields(fields, ["RESPONSE_TIME"]);
    const serviceEndpoint = firstScalarFromFields(fields, [
      "SERVICE_ENDPOINT.keyword",
      "SERVICE_ENDPOINT",
    ]);
    const region = firstScalarFromFields(fields, ["REGION.keyword", "REGION"]);
    const indexName =
      typeof hit._index === "string"
        ? hit._index
        : firstScalarFromFields(fields, ["_index"]);

    metas.push({
      key,
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
    });

    hitEntries.push([key, prepareHitForExport(hit)]);

    if (index % progressStep === 0) {
      self.postMessage({
        type: "progress",
        value: Math.floor((index / hits.length) * 90),
      } satisfies WorkerResponse);
    }
  }

  return { metas, hitEntries };
}

self.onmessage = (e: MessageEvent<string>) => {
  try {
    const hits = parseInputToObjects(e.data);
    if (hits.length === 0) {
      self.postMessage({
        type: "done",
        metas: [],
        hitEntries: [],
        count: 0,
      } satisfies WorkerResponse);
      return;
    }
    const { metas, hitEntries } = buildRowsWithHits(hits);
    self.postMessage({
      type: "done",
      metas,
      hitEntries,
      count: hits.length,
    } satisfies WorkerResponse);
  } catch (err) {
    self.postMessage({
      type: "error",
      message: err instanceof Error ? err.message : "Parse failed.",
    } satisfies WorkerResponse);
  }
};
