import { decodeJwt, decodeProtectedHeader, SignJWT } from "jose";
import { lazy, Suspense, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, Trash2, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useJwtStore from "../stores/jwtStore.store";
import { Input } from "@/components/ui/input";
import { useMonacoTheme } from "@/hooks/useMonacoTheme";
import { appToast } from "@/lib/toast";

const Editor = lazy(() => import("@monaco-editor/react"));

/** Encode raw bytes as Base64URL (no padding). */
function BytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decode a Base64URL string to raw bytes for HMAC secret. */
function Base64UrlToBytes(input: string): Uint8Array {
  const trimmed = input.trim();
  if (!trimmed) appToast.error("Secret is empty");
  const base64 = trimmed.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const algorithms = [
  { name: "HS256", alg: "HS256", typ: "JWT" },
  { name: "HS384", alg: "HS384", typ: "JWT" },
  { name: "HS512", alg: "HS512", typ: "JWT" },
];

const JWTDecoder = () => {
  const monacoTheme = useMonacoTheme();
  // Always-mounted refs — never swap roles
  const editorTokenRef = useRef<any>(null);    // Left: encoded JWT (in + out)
  const editorHeaderRef = useRef<any>(null);   // Right-top: decoded header (readonly)
  const editorPayloadRef = useRef<any>(null);  // Right-mid: payload (editable for encode)

  const [algorithmName, setAlgorithmName] = useState("HS256");
  const [secretIsBase64Url, setSecretIsBase64Url] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const {
    encodedTextArea,
    resultDecodedHeadersArea,
    resultDecodedPayloadArea,
    payloadArea,
    secretKeyArea,
    setEncodeTextArea,
    setResultDecodedHeadersArea,
    setResultDecodedPayloadArea,
    setSecretHeaderArea,
    setSecretKeyArea,
    setPayloadArea,
    setResultEncodedTextArea,
  } = useJwtStore();

  const editorOptions = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
    wordWrap: "on" as const,
    automaticLayout: true,
  };

  const editorReadOnlyOptions = { ...editorOptions, readOnly: true };

  // ── Mount handlers ────────────────────────────────────────────────────────

  function HandleTokenMount(editor: any) {
    editorTokenRef.current = editor;
    editor.onDidChangeModelContent(() => setEncodeTextArea(editor.getValue()));
  }

  function HandleHeaderMount(editor: any) {
    editorHeaderRef.current = editor;
  }

  function HandlePayloadMount(editor: any) {
    editorPayloadRef.current = editor;
    editor.onDidChangeModelContent(() => {
      try {
        setPayloadArea(JSON.parse(editor.getValue()));
      } catch {
        // ignore invalid JSON while typing
      }
    });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  function OnDecode() {
    try {
      const token = editorTokenRef.current?.getValue() ?? encodedTextArea;
      if (!token?.trim()) return;
      const decoded = decodeJwt(token.trim());
      const headers = decodeProtectedHeader(token.trim());
      setResultDecodedHeadersArea(headers);
      setResultDecodedPayloadArea(decoded);
      editorHeaderRef.current?.setValue(JSON.stringify(headers, null, 2));
      editorPayloadRef.current?.setValue(JSON.stringify(decoded, null, 2));
    } catch (error: any) {
      appToast.error(error.message);
    }
  }

  async function OnEncode() {
    try {
      const payloadStr = editorPayloadRef.current?.getValue() ?? "{}";
      const secretKeyStr = secretKeyArea ?? "";
      if (!secretKeyStr.trim()) {
        appToast.error("Secret key is required");
        return;
      }
      const secret = secretIsBase64Url
        ? Base64UrlToBytes(secretKeyStr)
        : new TextEncoder().encode(secretKeyStr);
      const jwt = await new SignJWT(JSON.parse(payloadStr))
        .setProtectedHeader({ alg: algorithmName, typ: "JWT" })
        .sign(secret);
      setResultEncodedTextArea(jwt);
      editorTokenRef.current?.setValue(jwt);
    } catch (error: any) {
      appToast.error(error.message);
    }
  }

  function OnSelectAlgorithm(value: string) {
    const algorithm = algorithms.find((a) => a.name === value);
    setAlgorithmName(value);
    const headerStr = JSON.stringify({ alg: algorithm?.alg, typ: algorithm?.typ }, null, 2);
    setSecretHeaderArea(headerStr);
    editorHeaderRef.current?.setValue(headerStr);
  }

  async function OnSecretKeyArea(next: any) {
    const wantBase64 = next === true;
    const raw = secretKeyArea ?? "";
    if (wantBase64) {
      if (raw.length > 0) setSecretKeyArea(BytesToBase64Url(new TextEncoder().encode(raw)));
      setSecretIsBase64Url(true);
      return;
    }
    if (raw.trim().length > 0) {
      try {
        setSecretKeyArea(new TextDecoder().decode(Base64UrlToBytes(raw)));
      } catch (e: any) {
        appToast.error(e?.message ?? "Invalid Base64URL secret");
        return;
      }
    }
    setSecretIsBase64Url(false);
  }

  function OnClearLeft() {
    editorTokenRef.current?.setValue("");
    setEncodeTextArea("");
  }

  function OnClearRight() {
    editorHeaderRef.current?.setValue("");
    editorPayloadRef.current?.setValue("");
    setResultDecodedHeadersArea(undefined);
    setResultDecodedPayloadArea(undefined);
    setPayloadArea(undefined);
  }

  async function OnCopyToken() {
    try {
      await navigator.clipboard.writeText(editorTokenRef.current?.getValue() ?? "");
      appToast.success("Copied to clipboard");
    } catch (e: any) {
      appToast.error(e.message);
    }
  }

  async function OnCopyPayload() {
    try {
      const value =
        editorPayloadRef.current?.getValue() ??
        JSON.stringify(resultDecodedPayloadArea, null, 2);
      await navigator.clipboard.writeText(value);
      appToast.success("Copied to clipboard");
    } catch (e: any) {
      appToast.error(e.message);
    }
  }

  async function OnCopyHeader() {
    try {
      const value =
        editorHeaderRef.current?.getValue() ??
        JSON.stringify(resultDecodedHeadersArea, null, 2);
      await navigator.clipboard.writeText(value);
      appToast.success("Copied to clipboard");
    } catch (e: any) {
      appToast.error(e.message);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">JWT Decoder</p>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[calc(100vh-5rem)] text-muted-foreground">
            Loading editor...
          </div>
        }
      >
        <div className="flex flex-row gap-2 h-[calc(100vh-5rem)]">

          {/* ── Left panel: Encoded Token ─────────────────────────────────── */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">Encoded Token</span>
              <div className="flex gap-1">
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={OnCopyToken}
                >
                  <CopyIcon size={16} />
                  <span className="font-medium text-sm text-muted-foreground">copy</span>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={OnClearLeft}
                >
                  <Trash2 size={16} />
                  <span className="font-medium text-sm text-muted-foreground">clear</span>
                </Button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                theme={monacoTheme}
                options={editorOptions}
                defaultValue={encodedTextArea}
                defaultLanguage="plaintext"
                onMount={HandleTokenMount}
              />
            </div>
          </div>

          {/* ── Middle: Decode / Encode buttons ──────────────────────────── */}
          <div className="flex flex-col items-center justify-center px-1 gap-1">
            <Button
              variant="secondary"
              size="lg"
              onClick={OnDecode}
              title="Decode: Token → Header + Payload"
              className="group flex flex-col items-center gap-1 rounded-md px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              Decode
            </Button>

            <div className="w-px h-4 bg-border" />

            <Button
              variant="secondary"
              size="lg"
              onClick={OnEncode}
              title="Encode: Payload + Secret → Token"
              className="group flex flex-col items-center gap-1 rounded-md px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              Encode
            </Button>
          </div>

          {/* ── Right panel: Header + Payload + Secret ────────────────────── */}
          <div className="flex-1 flex flex-col min-h-0 gap-2">

            {/* Header (readonly) */}
            <div className="flex flex-col min-h-0" style={{ flex: "0 0 160px" }}>
              <div className="flex flex-row items-center mb-2 justify-between">
                <div className="flex flex-row items-center gap-2">
                  <span className="font-medium text-sm text-muted-foreground">Decoded Header</span>
                  <Select
                    defaultValue="HS256"
                    value={algorithmName}
                    onValueChange={OnSelectAlgorithm}
                  >
                    <SelectTrigger className="h-7 w-24 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {algorithms.map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={OnCopyHeader}
                >
                  <CopyIcon size={16} />
                  <span className="font-medium text-sm text-muted-foreground">copy</span>
                </Button>
              </div>
              <div className="flex-1 min-h-0">
                <Editor
                  height="100%"
                  theme={monacoTheme}
                  options={editorReadOnlyOptions}
                  defaultValue={
                    resultDecodedHeadersArea
                      ? JSON.stringify(resultDecodedHeadersArea, null, 2)
                      : JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2)
                  }
                  defaultLanguage="json"
                  onMount={HandleHeaderMount}
                />
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Payload (editable) */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex flex-row items-center mb-2 justify-between">
                <span className="font-medium text-sm text-muted-foreground">Payload</span>
                <div className="flex gap-1">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                    onClick={OnCopyPayload}
                  >
                    <CopyIcon size={16} />
                    <span className="font-medium text-sm text-muted-foreground">copy</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                    onClick={OnClearRight}
                  >
                    <Trash2 size={16} />
                    <span className="font-medium text-sm text-muted-foreground">clear</span>
                  </Button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <Editor
                  height="100%"
                  theme={monacoTheme}
                  options={editorOptions}
                  defaultValue={
                    resultDecodedPayloadArea
                      ? JSON.stringify(resultDecodedPayloadArea, null, 2)
                      : undefined
                  }
                  defaultLanguage="json"
                  onMount={HandlePayloadMount}
                />
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Secret key (for encode) */}
            <div className="flex flex-col gap-2 shrink-0 pb-1">
              <div className="flex flex-row items-center gap-2">
                <span className="font-medium text-sm text-muted-foreground">Secret Key</span>
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id="encoded-secret-key"
                    checked={secretIsBase64Url}
                    onCheckedChange={OnSecretKeyArea}
                  />
                  <label
                    htmlFor="encoded-secret-key"
                    className="text-xs text-muted-foreground cursor-pointer select-none"
                  >
                    Base64URL
                  </label>
                </div>
              </div>
              <div className="relative">
                <Input
                  type={showSecret ? "text" : "password"}
                  value={secretKeyArea}
                  placeholder="Enter secret key..."
                  onChange={(e) => setSecretKeyArea(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showSecret ? "Hide secret" : "Show secret"}
                >
                  {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

        </div>
      </Suspense>
    </main>
  );
};

export default JWTDecoder;
