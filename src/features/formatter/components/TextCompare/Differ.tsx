import { Button } from "@/components/ui/button";
import { useMonacoTheme } from "@/hooks/useMonacoTheme";
import { appToast } from "@/lib/toast";
import { lazy, Suspense, useRef, type ChangeEvent } from "react";

const Editor = lazy(() => import("@monaco-editor/react"));
import { useNavigate } from "react-router-dom";
import useTextCompareStore from "@/features/formatter/stores/useTextCompare.store";
import { Trash2, Upload } from "lucide-react";
import { monacoOptions } from "@/lib/editor";

const ACCEPTED_FILE_TYPES = ".json,.txt,application/json,text/plain";

function ReadTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) ?? "");
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
}

const Differ = () => {
  const monacoTheme = useMonacoTheme();
  const editorOriginalTextRef = useRef<any>(null);
  const editorModifiedTextRef = useRef<any>(null);
  const originalFileInputRef = useRef<HTMLInputElement>(null);
  const modifiedFileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const {
    setOriginalText,
    setModifiedText,
    getOriginalText,
    getModifiedText,
  }: any = useTextCompareStore();
  function OnRouteToResultCompare() {
    navigate("/text-compare/result-compare");
  }

  function HandleOriginalTextDidMount(editor: any, monaco: any) {
    editorOriginalTextRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setOriginalText(value);
    });
  }

  function HandleModifiedTextDidMount(editor: any, monaco: any) {
    editorModifiedTextRef.current = editor;
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setModifiedText(value);
    });
  }

  function OnClearOriginalText() {
    if (editorOriginalTextRef.current) {
      editorOriginalTextRef.current.setValue("");
      setOriginalText("");
    }
  }

  function OnClearModifiedText() {
    if (editorModifiedTextRef.current) {
      editorModifiedTextRef.current.setValue("");
      setModifiedText("");
    }
  }

  async function OnUploadFile(
    event: ChangeEvent<HTMLInputElement>,
    target: "original" | "modified",
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "json" && extension !== "txt") {
      appToast.error("Only .json and .txt files are supported.");
      return;
    }

    try {
      const content = await ReadTextFile(file);
      if (target === "original") {
        editorOriginalTextRef.current?.setValue(content);
        setOriginalText(content);
      } else {
        editorModifiedTextRef.current?.setValue(content);
        setModifiedText(content);
      }
      appToast.success(`${file.name} loaded.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to read file.";
      appToast.error(message);
    }
  }

  return (
    <main className="w-full p-4">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        Text Compare
      </p>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[calc(100vh-5rem)] text-muted-foreground">
            Loading editor...
          </div>
        }
      >
        <div className="flex flex-col lg:flex-row gap-2 h-auto lg:h-[calc(100vh-5rem)]">
          <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Original text
              </span>
              <div className="flex items-center gap-2">
                <input
                  ref={originalFileInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  className="hidden"
                  onChange={(event) => OnUploadFile(event, "original")}
                />
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={() => originalFileInputRef.current?.click()}
                >
                  <Upload size={16} aria-label="upload" />
                  <span className="font-medium text-sm text-muted-foreground">
                    upload
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={OnClearOriginalText}
                >
                  <Trash2 size={16} aria-label="clear" />
                  <span className="font-medium text-sm text-muted-foreground">
                    clear
                  </span>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                theme={monacoTheme}
                options={monacoOptions}
                defaultValue={getOriginalText()}
                onMount={HandleOriginalTextDidMount}
              />
            </div>
          </div>

          <div className="flex items-center justify-center px-2 py-2 lg:py-0">
            <Button
              variant="secondary"
              size="lg"
              className="hover:bg-gray-200 hover:text-black text-muted-foreground"
              onClick={OnRouteToResultCompare}
            >
              Compare
            </Button>
          </div>

          <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Modified text
              </span>
              <div className="flex items-center gap-2">
                <input
                  ref={modifiedFileInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  className="hidden"
                  onChange={(event) => OnUploadFile(event, "modified")}
                />
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={() => modifiedFileInputRef.current?.click()}
                >
                  <Upload size={16} aria-label="upload" />
                  <span className="font-medium text-sm text-muted-foreground">
                    upload
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={OnClearModifiedText}
                >
                  <Trash2 size={16} aria-label="clear" />
                  <span className="font-medium text-sm text-muted-foreground">
                    clear
                  </span>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                theme={monacoTheme}
                options={monacoOptions}
                defaultValue={getModifiedText()}
                onMount={HandleModifiedTextDidMount}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
};

export default Differ;
