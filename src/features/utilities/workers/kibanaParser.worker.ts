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

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
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

    hitEntries.push([key, hit]);

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
