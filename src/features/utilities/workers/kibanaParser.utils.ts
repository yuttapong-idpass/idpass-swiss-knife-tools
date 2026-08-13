type UnknownRecord = Record<string, unknown>;

/** Kibana search metadata that duplicates large field values and is not needed in exports. */
const KIBANA_SEARCH_META_KEYS = [
  "_ignored",
  "ignored_field_values",
  "highlight",
] as const;

const WINDOWS_RESERVED_NAMES = new Set([
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9",
]);

export function prepareHitForExport(hit: UnknownRecord): UnknownRecord {
  const cleaned = { ...hit };
  for (const key of KIBANA_SEARCH_META_KEYS) {
    delete cleaned[key];
  }
  return cleaned;
}

export function stringifyHitForExport(hit: UnknownRecord): string {
  return JSON.stringify(
    prepareHitForExport(hit),
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  );
}

export function sanitizePathSegment(name: string, fallback: string): string {
  let cleaned = name
    .replace(/[\x00-\x1f\x7f]/g, "_")
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "");

  if (!cleaned) return fallback;

  const stem = cleaned.split(".")[0]?.toUpperCase() ?? "";
  if (WINDOWS_RESERVED_NAMES.has(stem) || WINDOWS_RESERVED_NAMES.has(cleaned.toUpperCase())) {
    cleaned = `${cleaned}_`;
  }

  return cleaned.length > 200 ? cleaned.slice(0, 200) : cleaned;
}

export function uriLastSegment(uri: string): string {
  // Drop the query string / fragment first — a URI such as
  // "/api/SEARCH_BY_LOCATION?LATITUDE=13.9&LONGITUDE=100.5" must yield
  // "SEARCH_BY_LOCATION", not the whole parameter blob.
  const withoutQuery = uri.trim().split(/[?#]/)[0] ?? "";
  const trimmed = withoutQuery.replace(/\/+$/, "");
  if (!trimmed) return "entry";
  const parts = trimmed.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  return last && last.length > 0 ? last : "entry";
}

export function firstScalarFromFields(
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

export function getFieldsContainer(hit: UnknownRecord): UnknownRecord {
  const f = hit.fields;
  if (f && typeof f === "object" && !Array.isArray(f)) {
    return f as UnknownRecord;
  }
  return hit;
}
