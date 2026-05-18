
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMonacoTheme } from "@/hooks/useMonacoTheme";
import { appToast } from "@/lib/toast";
import { monacoOptions } from "@/lib/editor";
import { ArrowLeft, ArrowRight, CopyIcon, Trash2 } from "lucide-react";
import { lazy, Suspense, useRef, useMemo } from "react";
import useEncryptDecryptStore from "../stores/encryptDecrypt.store";
import CryptoJS from "crypto-js";

const Editor = lazy(() => import("@monaco-editor/react"));

export default function EnCryptDecryptText() {
  const monacoTheme = useMonacoTheme();
  const editorLeftRef = useRef<any>(null);
  const editorRightRef = useRef<any>(null);

  const {
    plainText,
    encryptedText,
    transformMode,
    algorithm,
    aesMode,
    passphrase,
    setPlainText,
    setEncryptedText,
    setTransformMode,
    setAlgorithm,
    setAesMode,
    setPassphrase,
  } = useEncryptDecryptStore();

  const leftLabel = useMemo(
    () => (transformMode === "encrypt" ? "Plain Text" : "Encrypted (Base64)"),
    [transformMode],
  );
  const rightLabel = useMemo(
    () => (transformMode === "encrypt" ? "Encrypted (Base64)" : "Plain Text"),
    [transformMode],
  );

  const leftDefaultValue = transformMode === "encrypt" ? plainText : encryptedText;
  const rightDefaultValue = transformMode === "encrypt" ? encryptedText : plainText;

  function handleEncrypt() {
    const raw = editorLeftRef.current?.getValue() ?? plainText;
    if (!raw?.trim()) return;
    if (!passphrase) {
      appToast.error("Passphrase is required");
      return;
    }
    try {
      const mode = aesMode === "CTR" ? CryptoJS.mode.CTR : CryptoJS.mode.CBC;
      const padding = aesMode === "CTR" ? CryptoJS.pad.NoPadding : CryptoJS.pad.Pkcs7;
      const result = CryptoJS.AES.encrypt(raw, passphrase, { mode, padding }).toString();
      editorRightRef.current?.setValue(result);
      setEncryptedText(result);
      appToast.success("Encrypted successfully");
    } catch (error: any) {
      appToast.error(error?.message ?? "Encryption failed");
    }
  }

  function handleDecrypt() {
    const raw = editorLeftRef.current?.getValue() ?? encryptedText;
    if (!raw?.trim()) return;
    if (!passphrase) {
      appToast.error("Passphrase is required");
      return;
    }
    try {
      const mode = aesMode === "CTR" ? CryptoJS.mode.CTR : CryptoJS.mode.CBC;
      const padding = aesMode === "CTR" ? CryptoJS.pad.NoPadding : CryptoJS.pad.Pkcs7;
      const bytes = CryptoJS.AES.decrypt(raw.trim(), passphrase, { mode, padding });
      const result = bytes.toString(CryptoJS.enc.Utf8);
      if (!result) {
        appToast.error("Decryption failed — wrong passphrase or corrupted data");
        return;
      }
      editorRightRef.current?.setValue(result);
      setPlainText(result);
      appToast.success("Decrypted successfully");
    } catch (error: any) {
      appToast.error(error?.message ?? "Decryption failed — wrong passphrase or corrupted data");
    }
  }

  function handleSwap() {
    const newMode = transformMode === "encrypt" ? "decrypt" : "encrypt";
    setTransformMode(newMode);
    const leftVal = editorLeftRef.current?.getValue() ?? "";
    const rightVal = editorRightRef.current?.getValue() ?? "";
    setTimeout(() => {
      editorLeftRef.current?.setValue(rightVal);
      editorRightRef.current?.setValue(leftVal);
    }, 0);
  }

  function handleClear() {
    editorLeftRef.current?.setValue("");
    editorRightRef.current?.setValue("");
    setPlainText("");
    setEncryptedText("");
  }

  async function handleCopyRight() {
    try {
      const rightVal = editorRightRef.current?.getValue() ?? "";
      await navigator.clipboard.writeText(rightVal);
      appToast.success("Copied to clipboard");
    } catch (error: any) {
      appToast.error(error?.message ?? "Copy failed");
    }
  }

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        Encrypt / Decrypt Text
      </p>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[calc(100vh-5rem)] text-muted-foreground">
            <span className="font-medium text-sm">Loading editor...</span>
          </div>
        }
      >
        <div className="flex flex-row gap-2 h-[calc(100vh-5rem)]">
          {/* Left panel */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">{leftLabel}</span>
              <Button
                variant="secondary"
                size="lg"
                className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                onClick={() => {
                  editorLeftRef.current?.setValue("");
                  if (transformMode === "encrypt") setPlainText("");
                  else setEncryptedText("");
                }}
              >
                <Trash2 size={16} />
                <span className="font-medium text-sm text-muted-foreground">clear</span>
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden rounded-md border border-input">
              <Editor
                height="100%"
                language="plaintext"
                theme={monacoTheme}
                defaultValue={leftDefaultValue}
                options={monacoOptions}
                onMount={(editor) => {
                  editorLeftRef.current = editor;
                }}
              />
            </div>
          </div>

          {/* Middle controls */}
          <div className="w-[280px] border border-border rounded-md p-3 flex flex-col gap-3 bg-muted/20 overflow-y-auto">
            <span className="font-semibold text-sm">Transformation Settings</span>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Mode</span>
              <Select
                value={transformMode}
                onValueChange={(v) => setTransformMode(v as "encrypt" | "decrypt")}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Select
                value={algorithm}
                onValueChange={(v) => setAlgorithm(v as "AES")}
              >
                <SelectTrigger>
                  <SelectValue />
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
                onValueChange={(v) => setAesMode(v as "CBC" | "GCM" | "CTR")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="CBC">AES-CBC</SelectItem>
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
                type="password"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                variant="secondary"
                onClick={handleSwap}
                className="text-muted-foreground hover:text-primary-foreground"
                title="Swap sides"
              >
                {transformMode === "encrypt" ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                Swap
              </Button>
              <Button
                className="bg-primary text-primary-foreground"
                onClick={transformMode === "encrypt" ? handleEncrypt : handleDecrypt}
              >
                {transformMode === "encrypt" ? "Encrypt" : "Decrypt"}
              </Button>
              <Button
                variant="secondary"
                onClick={handleClear}
                className="text-muted-foreground"
              >
                <Trash2 size={16} />
                Clear All
              </Button>
              <Button
                variant="secondary"
                onClick={handleCopyRight}
                className="text-muted-foreground"
              >
                <CopyIcon size={16} />
                Copy Right
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/60 leading-relaxed pt-1">
              Salt &amp; IV are auto-generated and embedded in the output.
              Use the same passphrase and mode to decrypt.
            </p>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">{rightLabel}</span>
              <Button
                variant="secondary"
                size="lg"
                className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                onClick={() => {
                  editorRightRef.current?.setValue("");
                  if (transformMode === "encrypt") setEncryptedText("");
                  else setPlainText("");
                }}
              >
                <Trash2 size={16} />
                <span className="font-medium text-sm text-muted-foreground">clear</span>
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden rounded-md border border-input">
              <Editor
                height="100%"
                language="plaintext"
                theme={monacoTheme}
                defaultValue={rightDefaultValue}
                options={monacoOptions}
                onMount={(editor) => {
                  editorRightRef.current = editor;
                }}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
