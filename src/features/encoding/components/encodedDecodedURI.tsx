import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { lazy, Suspense, useRef, useState } from "react";
import { toast } from "sonner";
import useEncodedDecodedURIStore from "../stores/encodedDecodedURI.store";

const Editor = lazy(() => import("@monaco-editor/react"));

export default function EncodedDecodedURI() {
  const [mode, setMode] = useState<string>("decode");

  const editorEncodedURLRef = useRef<any>(null);
  const editorDecodedURLRef = useRef<any>(null);

  const { encodedText, decodedText, setEncodedText, setDecodedText } =
    useEncodedDecodedURIStore();

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

  function handleEncodedURLDidMount(editor: any) {
    editorEncodedURLRef.current = editor;
    editor.onDidChangeModelContent(() => {
      setEncodedText(editor.getValue());
    });
  }

  function handleDecodedURLDidMount(editor: any) {
    editorDecodedURLRef.current = editor;
    editor.onDidChangeModelContent(() => {
      setDecodedText(editor.getValue());
    });
  }

  const onDecodeURL = () => {
    try {
      const raw = editorEncodedURLRef.current?.getValue() ?? encodedText;
      const decodedURL = decodeURIComponent(raw);
      editorDecodedURLRef.current?.setValue(decodedURL);
      setDecodedText(decodedURL);
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        closeButton: true,
        duration: 3000,
      });
    }
  };

  const onEncodeURL = () => {
    try {
      const raw = editorDecodedURLRef.current?.getValue() ?? decodedText;
      const encodedURL = encodeURIComponent(raw);
      editorEncodedURLRef.current?.setValue(encodedURL);
      setEncodedText(encodedURL);
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        closeButton: true,
        duration: 3000,
      });
    }
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
        <div
          className={`flex flex-col gap-2 h-auto lg:h-[calc(100vh-5rem)] ${
            mode === "decode" ? "lg:flex-row" : "lg:flex-row-reverse"
          }`}
        >
          <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Encoded URL
              </span>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                theme="vs-dark"
                options={editorEdit}
                defaultValue={encodedText}
                defaultLanguage="plaintext"
                onMount={handleEncodedURLDidMount}
              />
            </div>
          </div>

          <div className="flex flex-row lg:flex-col items-center justify-center px-2 py-2 lg:py-0 gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
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
              className="hover:bg-gray-200 hover:text-black"
              onClick={mode === "decode" ? onDecodeURL : onEncodeURL}
            >
              {mode === "decode" ? "Decode" : "Encode"}
            </Button>
          </div>

          <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Decoded URL
              </span>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                theme="vs-dark"
                options={editorEdit}
                defaultValue={decodedText}
                defaultLanguage="plaintext"
                onMount={handleDecodedURLDidMount}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
