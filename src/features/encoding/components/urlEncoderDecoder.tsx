import { Button } from "@/components/ui/button";
import { useMonacoTheme } from "@/hooks/useMonacoTheme";
import { ArrowRight, ArrowLeft, Trash2 } from "lucide-react";
import { lazy, Suspense, useRef } from "react";
import useEncodedDecodedURIStore from "../stores/encodedDecodedURI.store";
import { appToast } from "@/lib/toast";

const Editor = lazy(() => import("@monaco-editor/react"));

export default function UrlEncoderDecoder() {
  const monacoTheme = useMonacoTheme();
  const editorEncodedURLRef = useRef<any>(null);
  const editorDecodedURLRef = useRef<any>(null);

  const { encodedText, decodedText, setEncodedText, setDecodedText } =
    useEncodedDecodedURIStore();

  const editorOptions = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
    wordWrap: "on" as const,
    automaticLayout: true,
  };

  function HandleEncodedURLDidMount(editor: any) {
    editorEncodedURLRef.current = editor;
    editor.onDidChangeModelContent(() => {
      setEncodedText(editor.getValue());
    });
  }

  function HandleDecodedURLDidMount(editor: any) {
    editorDecodedURLRef.current = editor;
    editor.onDidChangeModelContent(() => {
      setDecodedText(editor.getValue());
    });
  }

  const OnDecodeURL = () => {
    try {
      const raw = editorEncodedURLRef.current?.getValue() ?? encodedText;
      if (!raw?.trim()) return;
      const decoded = decodeURIComponent(raw.trim());
      editorDecodedURLRef.current?.setValue(decoded);
      setDecodedText(decoded);
    } catch (error: any) {
      appToast.error(error.message);
    }
  };

  const OnEncodeURL = () => {
    try {
      const raw = editorDecodedURLRef.current?.getValue() ?? decodedText;
      if (!raw?.trim()) return;
      const encoded = encodeURIComponent(raw.trim());
      editorEncodedURLRef.current?.setValue(encoded);
      setEncodedText(encoded);
    } catch (error: any) {
      appToast.error(error.message);
    }
  };

  const OnClearEncoded = () => {
    editorEncodedURLRef.current?.setValue("");
    setEncodedText("");
  };

  const OnClearDecoded = () => {
    editorDecodedURLRef.current?.setValue("");
    setDecodedText("");
  };

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        Encoded/Decoded URL
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
          {/* Left panel — always Encoded URL */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Encoded URL
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
                onMount={HandleEncodedURLDidMount}
              />
            </div>
          </div>

          {/* Divider — Decode / Encode buttons */}
          <div className="flex flex-col items-center justify-center px-1 gap-1">
            <Button
              variant="secondary"
              size="lg"
              onClick={OnDecodeURL}
              title="Decode: Encoded → Decoded"
              className="group flex flex-col items-center gap-1 rounded-md px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              Decode
            </Button>

            <div className="w-px h-4 bg-border" />

            <Button
              variant="secondary"
              size="lg"
              onClick={OnEncodeURL}
              title="Encode: Decoded → Encoded"
              className="group flex flex-col items-center gap-1 rounded-md px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              Encode
            </Button>
          </div>

          {/* Right panel — always Decoded URL + Info */}
          <div className="flex-1 flex flex-col min-h-0 gap-2">
            {/* Top half: Decoded editor */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex flex-row items-center mb-2 justify-between">
                <span className="font-medium text-sm text-muted-foreground">
                  Decoded URL
                </span>
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={OnClearDecoded}
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
                  defaultValue={decodedText}
                  defaultLanguage="plaintext"
                  onMount={HandleDecodedURLDidMount}
                />
              </div>
            </div>

            {/* Horizontal divider */}
            <div className="border-t border-border" />

            {/* Bottom half: Info */}
            <div className="flex-1 flex flex-col min-h-0 overflow-auto">
              <span className="font-medium text-sm text-muted-foreground mb-2">
                Information
              </span>
              <div className="flex-1 rounded-md bg-muted/40 border border-border p-4 text-sm text-muted-foreground space-y-2">
                <p>URL Encoding (percent-encoding) converts special characters to % followed by hex values.</p>
                <p className="font-bold text-sm text-muted-foreground">Common encodings:</p>
                <ul>
                  <li>Space → %20</li>
                  <li>@ → %40</li>
                  <li>& → %26</li>
                  <li>? → %3F</li>
                  <li>= → %3D</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
