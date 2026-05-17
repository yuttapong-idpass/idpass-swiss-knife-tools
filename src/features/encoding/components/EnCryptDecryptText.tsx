
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appToast } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { ArrowLeft, ArrowRight, CopyIcon, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useMonacoTheme } from "@/hooks/useMonacoTheme";

type TransformMode = "encrypt" | "decrypt";
type Algorithm = "AES";
type AesMode = "CBC" | "GCM" | "CTR";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/** Generate cryptographically random bytes and return as lowercase hex string. */
function RandomHex(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Decode a hex string to Uint8Array. Throws if string is not valid hex or wrong length. */
function HexToBytes(hex: string, expectedBytes?: number): Uint8Array {
  const clean = hex.replace(/\s/g, "");
  if (clean.length % 2 !== 0) throw new Error("Invalid hex string (odd length)");
  if (expectedBytes !== undefined && clean.length !== expectedBytes * 2) {
    throw new Error(`Expected ${expectedBytes} bytes (${expectedBytes * 2} hex chars), got ${clean.length / 2}`);
  }
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function ToBase64(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]!);
  }
  return btoa(binary);
}

function FromBase64(base64: string): Uint8Array {
  const binary = atob(base64.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Expected IV byte lengths per AES mode. */
const IV_BYTE_LENGTH: Record<AesMode, number> = { CBC: 16, GCM: 12, CTR: 16 };

/** Expected salt byte length for PBKDF2 (128-bit). */
const SALT_BYTE_LENGTH = 16;

function ToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

/** Derive a 256-bit AES key from a passphrase using PBKDF2 + SHA-256. saltBytes must be random raw bytes. */
async function DeriveAesKey(
  passphrase: string,
  saltBytes: Uint8Array,
  aesMode: AesMode,
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: ToArrayBuffer(saltBytes),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: `AES-${aesMode}`, length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export default function EnCryptDecryptText() {
  const monacoTheme = useMonacoTheme();
  const [transformMode, setTransformMode] = useState<TransformMode>("encrypt");
  const [algorithm, setAlgorithm] = useState<Algorithm>("AES");
  const [aesMode, setAesMode] = useState<AesMode>("CBC");

  const [passphrase, setPassphrase] = useState("");
  const [salt, setSalt] = useState(() => RandomHex(SALT_BYTE_LENGTH));
  const [iv, setIv] = useState(() => RandomHex(IV_BYTE_LENGTH["CBC"]));

  const [plainText, setPlainText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");

  const leftLabel = useMemo(
    () => (transformMode === "encrypt" ? "Plain Text" : "Encrypted (Base64)"),
    [transformMode],
  );
  const rightLabel = useMemo(
    () => (transformMode === "encrypt" ? "Encrypted (Base64)" : "Plain Text"),
    [transformMode],
  );
  const leftValue = transformMode === "encrypt" ? plainText : encryptedText;
  const rightValue = transformMode === "encrypt" ? encryptedText : plainText;

  const OnChangeLeft = (value: string) => {
    if (transformMode === "encrypt") {
      setPlainText(value);
      return;
    }
    setEncryptedText(value);
  };

  const OnChangeRight = (value: string) => {
    if (transformMode === "encrypt") {
      setEncryptedText(value);
      return;
    }
    setPlainText(value);
  };

  const OnTransform = async () => {
    try {
      if (!passphrase.trim()) {
        appToast.error("Passphrase is required");
        return;
      }
      if (!salt.trim()) {
        appToast.error("Salt is required");
        return;
      }
      if (!iv.trim()) {
        appToast.error("IV is required");
        return;
      }

      if (algorithm !== "AES") {
        appToast.error("Only AES is supported right now");
        return;
      }

      const saltBytes = HexToBytes(salt, SALT_BYTE_LENGTH);
      const ivBytes = HexToBytes(iv, IV_BYTE_LENGTH[aesMode]);
      const key = await DeriveAesKey(passphrase, saltBytes, aesMode);
      const ivBuffer = ToArrayBuffer(ivBytes);

      if (transformMode === "encrypt") {
        if (!plainText.trim()) return;

        const data = textEncoder.encode(plainText);
        const encrypted = await crypto.subtle.encrypt(
          aesMode === "CTR"
            ? { name: "AES-CTR", counter: ivBuffer, length: 64 }
            : { name: `AES-${aesMode}`, iv: ivBuffer },
          key,
          data,
        );

        setEncryptedText(ToBase64(new Uint8Array(encrypted)));
        return;
      }

      if (!encryptedText.trim()) return;

      const encryptedBytes = FromBase64(encryptedText);
      const decrypted = await crypto.subtle.decrypt(
        aesMode === "CTR"
          ? { name: "AES-CTR", counter: ivBuffer, length: 64 }
          : { name: `AES-${aesMode}`, iv: ivBuffer },
        key,
        ToArrayBuffer(encryptedBytes),
      );

      setPlainText(textDecoder.decode(decrypted));
    } catch (error: any) {
      appToast.error(error?.message ?? "Failed to transform text");
    }
  };

  const OnRandomSalt = () => setSalt(RandomHex(SALT_BYTE_LENGTH));

  const OnRandomIv = () => setIv(RandomHex(IV_BYTE_LENGTH[aesMode]));

  const OnSwap = () => {
    setTransformMode((prev) => (prev === "encrypt" ? "decrypt" : "encrypt"));
  };

  const OnClear = () => {
    setPlainText("");
    setEncryptedText("");
  };

  const OnCopyRight = async () => {
    try {
      await navigator.clipboard.writeText(rightValue ?? "");
      appToast.success("Copied to clipboard");
    } catch (error: any) {
      appToast.error(error?.message ?? "Copy failed");
    }
  };

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        Encrypt / Decrypt Text
      </p>
      <div className="flex flex-row gap-2 h-[calc(100vh-5rem)]">
        {/* Left panel */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex flex-row items-center mb-2 justify-between">
            <span className="font-medium text-sm text-muted-foreground">{leftLabel}</span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden rounded-md border border-input">
            <Editor
              height="100%"
              language="plaintext"
              theme={monacoTheme}
              value={leftValue}
              onChange={(value) => OnChangeLeft(value ?? "")}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                lineNumbers: "off",
                folding: false,
                renderLineHighlight: "none",
                fontSize: 13,
                padding: { top: 8, bottom: 8 },
                overviewRulerLanes: 0,
              }}
            />
          </div>
        </div>

        {/* Middle controls */}
        <div className="w-[320px] border border-border rounded-md p-3 flex flex-col gap-3 bg-muted/20 overflow-y-auto">
          <span className="font-medium text-sm text-muted-foreground">Transformation Settings</span>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Mode</span>
            <Select value={transformMode} onValueChange={(value) => setTransformMode(value as TransformMode)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="encrypt">Encrypt</SelectItem>
                  <SelectItem value="decrypt">Decrypt</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Algorithm</span>
            <Select value={algorithm} onValueChange={(value) => setAlgorithm(value as Algorithm)}>
              <SelectTrigger>
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="AES">AES</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">AES Mode</span>
            <Select
              value={aesMode}
              onValueChange={(value) => {
                const next = value as AesMode;
                setAesMode(next);
                setIv(RandomHex(IV_BYTE_LENGTH[next]));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AES mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="CBC">AES-CBC</SelectItem>
                  <SelectItem value="GCM">AES-GCM</SelectItem>
                  <SelectItem value="CTR">AES-CTR</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Passphrase</span>
            <Input
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter passphrase"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Salt
                <span className="ml-1 text-[10px] text-muted-foreground/60">
                  ({SALT_BYTE_LENGTH} bytes / {SALT_BYTE_LENGTH * 2} hex)
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={OnRandomSalt}
                className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground gap-1"
                title="Generate random salt"
              >
                <RefreshCw size={10} />
                Random
              </Button>
            </div>
            <Input
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              placeholder={`${SALT_BYTE_LENGTH * 2}-char hex`}
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                IV
                <span className="ml-1 text-[10px] text-muted-foreground/60">
                  ({IV_BYTE_LENGTH[aesMode]} bytes / {IV_BYTE_LENGTH[aesMode] * 2} hex)
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={OnRandomIv}
                className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground gap-1"
                title="Generate random IV"
              >
                <RefreshCw size={10} />
                Random
              </Button>
            </div>
            <Input
              value={iv}
              onChange={(e) => setIv(e.target.value)}
              placeholder={`${IV_BYTE_LENGTH[aesMode] * 2}-char hex`}
              className="font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant="secondary"
              onClick={OnSwap}
              className="text-muted-foreground hover:text-primary-foreground"
              title="Swap mode"
            >
              {transformMode === "encrypt" ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              Swap
            </Button>
            <Button
              onClick={OnTransform}
              className="bg-primary text-primary-foreground"
              title={transformMode === "encrypt" ? "Encrypt text" : "Decrypt text"}
            >
              {transformMode === "encrypt" ? "Encrypt" : "Decrypt"}
            </Button>
            <Button variant="secondary" onClick={OnClear} className="text-muted-foreground">
              <Trash2 size={16} />
              Clear
            </Button>
            <Button variant="secondary" onClick={OnCopyRight} className="text-muted-foreground">
              <CopyIcon size={16} />
              Copy Right
            </Button>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex flex-row items-center mb-2 justify-between">
            <span className="font-medium text-sm text-muted-foreground">{rightLabel}</span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden rounded-md border border-input">
            <Editor
              height="100%"
              language="plaintext"
              value={rightValue}
              onChange={(value) => OnChangeRight(value ?? "")}
              theme={monacoTheme}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                lineNumbers: "off",
                folding: false,
                renderLineHighlight: "none",
                fontSize: 13,
                padding: { top: 8, bottom: 8 },
                overviewRulerLanes: 0,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}