import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMonacoTheme } from "@/hooks/useMonacoTheme";
import { monacoOptions } from "@/lib/editor";
import { appToast } from "@/lib/toast";
import { Copy, ArrowRight, Trash2 } from "lucide-react";
import CryptoJS from "crypto-js";
import { lazy, Suspense, useMemo, useRef, useState } from "react";

const Editor = lazy(() => import("@monaco-editor/react"));

type HashKey =
  | "md5"
  | "sha1"
  | "sha128"
  | "sha224"
  | "sha256"
  | "sha384"
  | "sha512";

type HashResult = Record<HashKey, string>;

const INITIAL_HASH_RESULTS: HashResult = {
  md5: "",
  sha1: "",
  sha128: "",
  sha224: "",
  sha256: "",
  sha384: "",
  sha512: "",
};

export default function HashGenerator() {
  const monacoTheme = useMonacoTheme();
  const editorInputRef = useRef<any>(null);
  const [inputText, setInputText] = useState("");
  const [hashResults, setHashResults] = useState<HashResult>(INITIAL_HASH_RESULTS);

  const hashRows = useMemo(
    () => [
      { key: "md5" as const, label: "MD5" },
      { key: "sha1" as const, label: "SHA-1" },
      { key: "sha128" as const, label: "SHA-128" },
      { key: "sha224" as const, label: "SHA-224" },
      { key: "sha256" as const, label: "SHA-256" },
      { key: "sha384" as const, label: "SHA-384" },
      { key: "sha512" as const, label: "SHA-512" },
    ],
    [],
  );

  function handleConvert() {
    try {
      const raw = editorInputRef.current?.getValue() ?? inputText;
      if (!raw?.trim()) {
        appToast.error("Please enter text to convert.");
        return;
      }

      setHashResults({
        md5: CryptoJS.MD5(raw).toString(),
        sha1: CryptoJS.SHA1(raw).toString(),
        sha128: CryptoJS.SHA3(raw, { outputLength: 128 }).toString(),
        sha224: CryptoJS.SHA224(raw).toString(),
        sha256: CryptoJS.SHA256(raw).toString(),
        sha384: CryptoJS.SHA384(raw).toString(),
        sha512: CryptoJS.SHA512(raw).toString(),
      });
    } catch (error: any) {
      appToast.error(error?.message ?? "Failed to generate hash.");
    }
  }

  function handleClearInput() {
    editorInputRef.current?.setValue("");
    setInputText("");
  }

  function handleClearOutput() {
    setHashResults(INITIAL_HASH_RESULTS);
  }

  async function handleCopy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      appToast.success("Copied to clipboard");
    } catch (error: any) {
      appToast.error(error?.message ?? "Copy failed");
    }
  }

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">Hash Generator</p>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[calc(100vh-5rem)] text-muted-foreground">
            <span className="font-medium text-sm">Loading editor...</span>
          </div>
        }
      >
        <div className="flex flex-row gap-2 h-[calc(100vh-5rem)]">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">Input Text</span>
              <Button
                variant="secondary"
                size="lg"
                className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                onClick={handleClearInput}
              >
                <Trash2 size={16} />
                <span className="font-medium text-sm text-muted-foreground">clear</span>
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultLanguage="plaintext"
                theme={monacoTheme}
                options={monacoOptions}
                defaultValue={inputText}
                onMount={(editor) => {
                  editorInputRef.current = editor;
                  editor.onDidChangeModelContent(() => {
                    setInputText(editor.getValue());
                  });
                }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-1 gap-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleConvert}
              title="Generate hashes"
              className="group flex flex-col items-center gap-1 rounded-md px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              Convert
            </Button>
          </div>

          {/* Right panel — Hash outputs */}
          <div className="flex-1 flex flex-col min-h-0 rounded-md overflow-hidden">
            <div className="flex flex-row items-center px-3 py-2 justify-between bg-muted/30 shrink-0">
              <span className="font-medium text-sm text-muted-foreground">Output</span>
              <Button
                variant="secondary"
                size="lg"
                className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                onClick={handleClearOutput}
              >
                <Trash2 size={16} />
                <span className="font-medium text-sm text-muted-foreground">clear</span>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 border border-input rounded-md">
              {hashRows.map((row) => (
                <div key={row.key} className="space-y-1">
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <div className="flex gap-2">
                    <Input readOnly value={hashResults[row.key]} placeholder={`Output ${row.label}`} />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleCopy(hashResults[row.key])}
                      disabled={!hashResults[row.key]}
                      className="text-muted-foreground"
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
