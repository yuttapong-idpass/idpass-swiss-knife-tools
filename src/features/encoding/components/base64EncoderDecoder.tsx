import { Button } from "@/components/ui/button";
import { useMonacoTheme } from "@/hooks/useMonacoTheme";
import { ArrowRight, ArrowLeft, Trash2 } from "lucide-react";
import { lazy, Suspense, useRef } from "react";
import useBase64EncoderDecoderStore from "../stores/base64EncoderDecoder.store";
import { appToast } from "@/lib/toast";

const Editor = lazy(() => import("@monaco-editor/react"));

export default function Base64EncoderDecoder() {
  const monacoTheme = useMonacoTheme();
  const editorPlainRef = useRef<any>(null);
  const editorEncodedRef = useRef<any>(null);

  const { plainText, encodedText, setPlainText, setEncodedText } =
    useBase64EncoderDecoderStore();

  const editorOptions = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
    wordWrap: "on" as const,
    automaticLayout: true,
  };

  function HandlePlainDidMount(editor: any) {
    editorPlainRef.current = editor;
    editor.onDidChangeModelContent(() => {
      setPlainText(editor.getValue());
    });
  }

  function HandleEncodedDidMount(editor: any) {
    editorEncodedRef.current = editor;
    editor.onDidChangeModelContent(() => {
      setEncodedText(editor.getValue());
    });
  }

  const OnEncode = () => {
    try {
      const raw = editorPlainRef.current?.getValue() ?? plainText;
      if (!raw?.trim()) return;
      const bytes = new TextEncoder().encode(raw);
      let binary = "";
      bytes.forEach((b) => (binary += String.fromCharCode(b)));
      const encoded = btoa(binary);
      editorEncodedRef.current?.setValue(encoded);
      setEncodedText(encoded);
    } catch (error: any) {
      appToast.error(error.message);
    }
  };

  const OnDecode = () => {
    try {
      const raw = editorEncodedRef.current?.getValue() ?? encodedText;
      if (!raw?.trim()) return;
      const decoded = decodeURIComponent(escape(atob(raw.trim())));
      editorPlainRef.current?.setValue(decoded);
      setPlainText(decoded);
    } catch (error: any) {
      appToast.error(error.message);
    }
  };

  const OnClearPlain = () => {
    editorPlainRef.current?.setValue("");
    setPlainText("");
  };

  const OnClearEncoded = () => {
    editorEncodedRef.current?.setValue("");
    setEncodedText("");
  };

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        Base64 Encoder / Decoder
      </p>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[calc(100vh-5rem)] text-muted-foreground">
            <span className="font-medium text-sm text-muted-foreground">
              Loading editor...
            </span>
          </div>
        }
      >
        <div className="flex flex-row gap-2 h-[calc(100vh-5rem)]">
          {/* Left panel — Plain text */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Plain Text
              </span>
              <Button
                variant="secondary"
                size="lg"
                className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                onClick={OnClearPlain}
              >
                <Trash2 size={16} aria-label="clear" />
                <span className="font-medium text-sm text-muted-foreground">
                  clear
                </span>
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                theme={monacoTheme}
                options={editorOptions}
                defaultValue={plainText}
                defaultLanguage="plaintext"
                onMount={HandlePlainDidMount}
              />
            </div>
          </div>

          {/* Divider — Encode / Decode buttons */}
          <div className="flex flex-col items-center justify-center px-1 gap-1">
            <Button
              variant="secondary"
              size="lg"
              onClick={OnEncode}
              title="Encode: Plain → Base64"
              className="group flex flex-col items-center gap-1 rounded-md px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              Encode
            </Button>

            <div className="w-px h-4 bg-border" />

            <Button
              variant="secondary"
              size="lg"
              onClick={OnDecode}
              title="Decode: Base64 → Plain"
              className="group flex flex-col items-center gap-1 rounded-md px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              Decode
            </Button>
          </div>

          {/* Right panel — Base64 encoded */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Base64 Encoded
              </span>
              <Button
                variant="secondary"
                size="lg"
                className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                onClick={OnClearEncoded}
              >
                <Trash2 size={16} aria-label="clear" />
                <span className="font-medium text-sm text-muted-foreground">
                  clear
                </span>
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                theme={monacoTheme}
                options={editorOptions}
                defaultValue={encodedText}
                defaultLanguage="plaintext"
                onMount={HandleEncodedDidMount}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
