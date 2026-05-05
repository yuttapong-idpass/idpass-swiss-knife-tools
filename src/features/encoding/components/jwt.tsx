import { decodeJwt, decodeProtectedHeader, SignJWT } from "jose";
import { lazy, Suspense, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, ArrowLeftRight, Trash2, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const Editor = lazy(() => import("@monaco-editor/react"));
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
import { appToast } from "@/lib/toast";

/** Encode raw bytes as Base64URL (no padding). */
function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decode a Base64URL string (no padding required) to raw bytes for HMAC secret. */
function base64UrlToBytes(input: string): Uint8Array {
  const trimmed = input.trim();
  if (!trimmed) {
    appToast.error("Secret is empty");
  }
  const base64 = trimmed.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

const JWTDecoder = () => {
  // Decode mode
  const editorTokenInputRef = useRef<any>(null); // Left: encoded JWT token input
  const editorDecodeHeaderRef = useRef<any>(null); // Right: decoded header output
  const editorDecodePayloadRef = useRef<any>(null); // Right: decoded payload output

  // Encode mode
  const editorEncodeHeaderRef = useRef<any>(null); // Left: header input
  const editorSecretKeyRef = useRef<any>(null); // Left: secret key input
  const editorEncodePayloadRef = useRef<any>(null); // Left: payload input
  const editorTokenOutputRef = useRef<any>(null); // Right: encoded JWT output

  const algorithms = [
    { name: "HS256", alg: "HS256", typ: "JWT", algorithm: "HMACSHA256" },
    { name: "HS384", alg: "HS384", typ: "JWT", algorithm: "HMACSHA384" },
    { name: "HS512", alg: "HS512", typ: "JWT", algorithm: "HMACSHA512" },
  ];
  const [algorithmName, setAlgorithmName] = useState<string>("HS256");
  const [mode, setMode] = useState<string>("decode");
  /** When true, secret field is interpreted as Base64URL; otherwise UTF-8 plaintext. */
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

  const editorEdit = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
    wordWrap: "on" as const,
    automaticLayout: true,
  };

  const editorReadOnly = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
    readOnly: true,
    wordWrap: "on" as const,
    automaticLayout: true,
  };

  // handler editor area
  function handleTokenInput(editor: any) {
    editorTokenInputRef.current = editor;
    editor.onDidChangeModelContent(() => {
      setEncodeTextArea(editor.getValue());
    });
  }

  function handleDecodeHeader(editor: any) {
    editorDecodeHeaderRef.current = editor;
  }

  function handleDecodePayload(editor: any) {
    editorDecodePayloadRef.current = editor;
  }

  function handleEncodeHeader(editor: any) {
    editorEncodeHeaderRef.current = editor;
    editor.onDidChangeModelContent(() => {
      setSecretHeaderArea(editor.getValue());
    });
  }

  function handleSecretKey(editor: any) {
    editorSecretKeyRef.current = editor;
    editor.onDidChangeModelContent(() => {
      setSecretKeyArea(editor.getValue());
    });
  }

  function handleEncodePayload(editor: any) {
    editorEncodePayloadRef.current = editor;
    editor.onDidChangeModelContent(() => {
      try {
        setPayloadArea(JSON.parse(editor.getValue()));
      } catch {
        // ignore invalid JSON while typing
      }
    });
  }

  function handleTokenOutput(editor: any) {
    editorTokenOutputRef.current = editor;
  }

  // function area

  function onDecode() {
    try {
      const token = editorTokenInputRef.current?.getValue() ?? encodedTextArea;
      const decoded = decodeJwt(token);
      const headers = decodeProtectedHeader(token);
      setResultDecodedHeadersArea(headers);
      setResultDecodedPayloadArea(decoded);
      editorDecodeHeaderRef.current?.setValue(JSON.stringify(headers, null, 2));
      editorDecodePayloadRef.current?.setValue(
        JSON.stringify(decoded, null, 2),
      );
    } catch (error: any) {
      appToast.error(error.message);
    }
  }

  function onSelectAlgorithm(value: string) {
    const algorithm = algorithms.find((item) => item.name === value);
    const header = { alg: algorithm?.alg, typ: algorithm?.typ };
    setAlgorithmName(value);
    const headerStr = JSON.stringify(header, null, 2);
    editorEncodeHeaderRef.current?.setValue(headerStr);
    setSecretHeaderArea(headerStr);
  }

  async function onEncode() {
    try {
      const payloadStr = editorEncodePayloadRef.current?.getValue() ?? "{}";
      const secretKeyStr = secretKeyArea ?? "";
      const secret = secretIsBase64Url
        ? base64UrlToBytes(secretKeyStr)
        : new TextEncoder().encode(secretKeyStr);
      const jwt = await new SignJWT(JSON.parse(payloadStr))
        .setProtectedHeader({ alg: algorithmName, typ: "JWT" })
        .sign(secret);
      setResultEncodedTextArea(jwt);
      editorTokenOutputRef.current?.setValue(jwt);
    } catch (error: any) {
      appToast.error(error.message);
    }
  }

  function handleSecretKeyArea(value: string) {
    setSecretKeyArea(value);
  }

  async function onSecretKeyArea(next: any) {
    const wantBase64 = next === true;
    const raw = secretKeyArea ?? "";

    if (wantBase64) {
      if (raw.length > 0) {
        const encoded = bytesToBase64Url(new TextEncoder().encode(raw));
        setSecretKeyArea(encoded);
      }
      setSecretIsBase64Url(true);
      return;
    }

    if (raw.trim().length > 0) {
      try {
        const bytes = base64UrlToBytes(raw);
        const plaintext = new TextDecoder().decode(bytes);
        setSecretKeyArea(plaintext);
      } catch (e: any) {
        appToast.error(e?.message ?? "Invalid Base64URL secret");
        return;
      }
    }
    setSecretIsBase64Url(false);
  }

  function onClearEncodedTokenArea() {
    editorTokenInputRef.current?.setValue("");
    editorDecodeHeaderRef.current?.setValue("");
    editorDecodePayloadRef.current?.setValue("");
    setEncodeTextArea("");
    setResultDecodedHeadersArea(undefined);
    setResultDecodedPayloadArea(undefined);
  }

  async function onCopyPayload() {
    try {
      const value =
        editorDecodePayloadRef.current?.getValue() ??
        JSON.stringify(resultDecodedPayloadArea, null, 2);
      await navigator.clipboard.writeText(value);
      appToast.success("Copied to clipboard");
    } catch (error: any) {
      appToast.error(error.message);
    }
  }

  async function onCopyHeader() {
    try {
      const value =
        editorDecodeHeaderRef.current?.getValue() ??
        JSON.stringify(resultDecodedHeadersArea, null, 2);
      await navigator.clipboard.writeText(value);
      appToast.success("Copied to clipboard");
    } catch (error: any) {
      appToast.error(error.message);
    }
  }

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        JWT Decoder
      </p>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[calc(100vh-5rem)] text-muted-foreground">
            Loading editor...
          </div>
        }
      >
        <div className="flex flex-col lg:flex-row gap-2 h-auto lg:h-[calc(100vh-5rem)]">
          {mode === "decode" ? (
            /* ── Decode mode – Left: Token Input ─────────────────────────────── */
            <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
              <div className="flex flex-row items-center mb-2 justify-between">
                <span className="font-medium text-sm text-muted-foreground">
                  Encoded Token
                </span>
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={onClearEncodedTokenArea}
                >
                  <Trash2 size={16} aria-label="clear" />
                  <span className="font-medium text-sm text-muted-foreground">
                    clear
                  </span>
                </Button>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  options={editorEdit}
                  onMount={handleTokenInput}
                  defaultValue={encodedTextArea}
                  defaultLanguage="plaintext"
                />
              </div>
            </div>
          ) : (
            /* ── Encode mode – Left: Header / Secret / Payload ───────────────── */
            <div className="w-full lg:flex-1 flex flex-col min-h-[500px] lg:min-h-0">
              <div className="flex flex-col h-full">
                <div className="flex flex-row items-center mb-2 justify-between">
                  <span className="font-medium text-sm text-muted-foreground">
                    Header
                  </span>
                  <div className="flex flex-row gap-2 items-center">
                    <span className="font-medium text-sm text-muted-foreground">
                      Algorithm
                    </span>
                    <Select
                      defaultValue="HS256"
                      value={algorithmName}
                      onValueChange={(value) => onSelectAlgorithm(value)}
                    >
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {algorithms.map((item, index) => (
                            <SelectItem key={index} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="h-[140px] shrink-0">
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    options={editorReadOnly}
                    defaultValue={JSON.stringify(
                      { alg: "HS256", typ: "JWT" },
                      null,
                      2,
                    )}
                    defaultLanguage="json"
                    onMount={handleEncodeHeader}
                  />
                </div>

                <div className="flex flex-row items-center my-2 justify-between">
                  <span className="font-medium text-sm text-muted-foreground">
                    Secret key
                  </span>
                  <div className="flex flex-row gap-2 items-center">
                    <div className="flex flex-row gap-2 items-center">
                      <Checkbox
                        id="encoded-secret-key"
                        name="encoded-secret-key"
                        checked={secretIsBase64Url}
                        onCheckedChange={onSecretKeyArea}
                      />
                      <span className="font-medium text-sm text-muted-foreground">
                        Base64URL Encoded
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-[40px] shrink-0">
                  {/* <Editor
                    height="100%"
                    theme="vs-dark"
                    options={editorEdit}
                    defaultValue={secretKeyArea}
                    defaultLanguage="plaintext"
                    onMount={handleSecretKey}
                  /> */}

                  <div className="relative">
                    <Input
                      type={showSecret ? "text" : "password"}
                      value={secretKeyArea}
                      onChange={(e) => handleSecretKeyArea(e.target.value)}
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

                <div className="flex flex-row items-center my-2 justify-between">
                  <span className="font-medium text-sm text-muted-foreground">
                    Payload
                  </span>
                </div>
                <div className="flex-1 min-h-[200px]">
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    options={editorEdit}
                    defaultValue={JSON.stringify(
                      payloadArea ?? undefined,
                      null,
                      2,
                    )}
                    defaultLanguage="json"
                    onMount={handleEncodePayload}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Center controls ──────────────────────────────────────────────── */}
          <div className="flex flex-row lg:flex-col items-center justify-center px-2 py-2 lg:py-0 gap-2 lg:w-[120px] shrink-0">
            <span className="font-medium text-sm text-muted-foreground whitespace-nowrap">
              {mode === "decode" ? "Encoded → Decoded" : "Decoded → Encoded"}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shrink-0"
              onClick={() => setMode(mode === "decode" ? "encode" : "decode")}
              title="Toggle mode"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="hover:bg-gray-200 hover:text-black w-full"
              onClick={mode === "decode" ? onDecode : onEncode}
            >
              {mode === "decode" ? "Decode" : "Encode"}
            </Button>
          </div>

          {mode === "decode" ? (
            /* ── Decode mode – Right: Header & Payload Output ────────────────── */
            <div className="w-full lg:flex-1 flex flex-col min-h-[500px] lg:min-h-0">
              <div className="flex flex-col h-full">
                <div className="flex flex-row items-center mb-2 justify-between">
                  <span className="font-medium text-sm text-muted-foreground">
                    Decoded Header
                  </span>
                  <div className="flex flex-row gap-2 items-center">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                      onClick={onCopyHeader}
                    >
                      <CopyIcon size={16} aria-label="copy" />
                      <span className="font-medium text-sm text-muted-foreground">
                        copy
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="h-[180px] min-h-[120px] shrink-0">
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    options={editorReadOnly}
                    defaultValue={
                      resultDecodedHeadersArea
                        ? JSON.stringify(resultDecodedHeadersArea, null, 2)
                        : ""
                    }
                    defaultLanguage="json"
                    onMount={handleDecodeHeader}
                  />
                </div>

                <div className="flex flex-row items-center my-2 justify-between">
                  <span className="font-medium text-sm text-muted-foreground">
                    Decoded Payload
                  </span>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                    onClick={onCopyPayload}
                  >
                    <CopyIcon size={16} aria-label="copy" />
                    <span className="font-medium text-sm text-muted-foreground">
                      copy
                    </span>
                  </Button>
                </div>
                <div className="flex-1 min-h-[200px]">
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    options={editorReadOnly}
                    defaultValue={
                      resultDecodedPayloadArea
                        ? JSON.stringify(resultDecodedPayloadArea, null, 2)
                        : ""
                    }
                    defaultLanguage="json"
                    onMount={handleDecodePayload}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* ── Encode mode – Right: Token Output ───────────────────────────── */
            <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
              <div className="flex flex-row items-center mb-2 justify-between">
                <span className="font-medium text-sm text-muted-foreground">
                  Encoded Token
                </span>
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={onClearEncodedTokenArea}
                >
                  <Trash2 size={16} aria-label="clear" />
                  <span className="font-medium text-sm text-muted-foreground">
                    clear
                  </span>
                </Button>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  options={editorReadOnly}
                  onMount={handleTokenOutput}
                  defaultValue={""}
                  defaultLanguage="plaintext"
                />
              </div>
            </div>
          )}
        </div>
      </Suspense>
    </main>
  );
};

export default JWTDecoder;
