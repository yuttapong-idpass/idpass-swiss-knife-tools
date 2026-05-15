import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMonacoTheme } from "@/hooks/useMonacoTheme";
import useBase64ImageStore from "@/features/formatter/stores/useBase64Image.store";
import DOMPurify from "dompurify";
import { Download, Trash2, Upload } from "lucide-react";
import {
  ChangeEvent,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";

const Editor = lazy(() =>
  import("@monaco-editor/react").then((mod) => ({ default: mod.Editor })),
);

interface ImageMeta {
  width: number;
  height: number;
  sizeKb: number;
  mimeType: string;
}

const EMPTY_META: ImageMeta = {
  width: 0,
  height: 0,
  sizeKb: 0,
  mimeType: "",
};

const Base64ToImage = () => {
  const monacoTheme = useMonacoTheme();
  const editorInputRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [defaultInputText, setDefaultInputText] = useState<string | undefined>(
    undefined,
  );
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [meta, setMeta] = useState<ImageMeta>(EMPTY_META);
  const [autoGenerate, setAutoGenerate] = useState<boolean>(false);

  const { setBase64, setImageData, getBase64, getImageData }: any =
    useBase64ImageStore();

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: "on" as const,
    automaticLayout: true,
  };

  useEffect(() => {
    const cachedBase64 = getBase64();
    const cachedImage = getImageData();
    if (cachedBase64) setDefaultInputText(cachedBase64);
    if (cachedImage) {
      setPreviewSrc(cachedImage);
      ComputeMeta(cachedImage);
    }
  }, []);

  const sanitizedPreview = useMemo(
    () => (previewSrc ? DOMPurify.sanitize(previewSrc) : ""),
    [previewSrc],
  );

  function HandleInputEditorMount(editor: any) {
    editorInputRef.current = editor;
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setBase64(value);
      if (autoGenerate) {
        DebouncedGenerate(value);
      }
    });
  }

  const debounceTimer = useRef<number | null>(null);
  function DebouncedGenerate(value: string) {
    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      GenerateImage(value, true);
    }, 350);
  }

  function BuildDataUrl(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("data:")) return trimmed;

    const cleaned = trimmed.replace(/\s+/g, "");
    if (!/^[A-Za-z0-9+/=]+$/.test(cleaned)) return null;

    return `data:image/png;base64,${cleaned}`;
  }

  function ComputeMeta(dataUrl: string) {
    const img = new Image();
    img.onload = () => {
      const mimeMatch = dataUrl.match(/^data:([^;]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
      const base64Body = dataUrl.split(",")[1] ?? "";
      const padding = (base64Body.match(/=+$/) || [""])[0].length;
      const sizeBytes = (base64Body.length * 3) / 4 - padding;
      setMeta({
        width: img.naturalWidth,
        height: img.naturalHeight,
        sizeKb: sizeBytes / 1024,
        mimeType,
      });
    };
    img.onerror = () => {
      setMeta(EMPTY_META);
    };
    img.src = dataUrl;
  }

  function GenerateImage(rawInput?: string, silent = false) {
    const value = (rawInput ?? getBase64() ?? "").toString();
    if (!value.trim()) {
      if (!silent) toast.warn("Please paste base64 text or upload a text file.");
      setPreviewSrc("");
      setImageData("");
      setMeta(EMPTY_META);
      return;
    }

    const dataUrl = BuildDataUrl(value);
    if (!dataUrl) {
      if (!silent) toast.error("Invalid base64 string.");
      setPreviewSrc("");
      setImageData("");
      setMeta(EMPTY_META);
      return;
    }

    const probe = new Image();
    probe.onload = () => {
      setPreviewSrc(dataUrl);
      setImageData(dataUrl);
      ComputeMeta(dataUrl);
      if (!silent) toast.success("Image generated successfully!");
    };
    probe.onerror = () => {
      setPreviewSrc("");
      setImageData("");
      setMeta(EMPTY_META);
      if (!silent) toast.error("Cannot render image from this base64.");
    };
    probe.src = dataUrl;
  }

  function OnUploadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = (reader.result as string).trim();
      editorInputRef.current?.setValue(result);
      setBase64(result);
      if (autoGenerate) {
        GenerateImage(result, true);
      }
      toast.success("Text file loaded.");
    };
    reader.onerror = () => toast.error("Failed to read file.");
    reader.readAsText(file);
    event.target.value = "";
  }

  function OnClearInput() {
    editorInputRef.current?.setValue("");
    setBase64("");
    setPreviewSrc("");
    setImageData("");
    setMeta(EMPTY_META);
  }

  function OnClearOutput() {
    setPreviewSrc("");
    setImageData("");
    setMeta(EMPTY_META);
  }

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        Base64 To Image
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
                Input (Base64)
              </span>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,text/plain"
                  className="hidden"
                  onChange={OnUploadFile}
                />
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={() => fileInputRef.current?.click()}
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
                  onClick={OnClearInput}
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
                options={editorOptions}
                defaultLanguage="plaintext"
                defaultValue={defaultInputText}
                onMount={HandleInputEditorMount}
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-2 py-2 lg:py-0 gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="hover:bg-gray-200 hover:text-black"
              onClick={() => GenerateImage()}
            >
              Generate
            </Button>
            <div className="flex items-center gap-2">
              <Checkbox
                id="auto-generate"
                checked={autoGenerate}
                onCheckedChange={(checked) => setAutoGenerate(checked === true)}
              />
              <Label
                htmlFor="auto-generate"
                className="text-sm text-muted-foreground"
              >
                Auto Generate
              </Label>
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Image Preview
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground disabled:opacity-50"
                  disabled={!previewSrc}
                  asChild={!!previewSrc}
                >
                  {previewSrc ? (
                    <a
                      href={previewSrc}
                      download={`base64-image.${(meta.mimeType.split("/")[1] || "png").replace("+xml", "")}`}
                    >
                      <Download size={16} aria-label="download" />
                      <span className="font-medium text-sm text-muted-foreground">
                        download
                      </span>
                    </a>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Download size={16} aria-label="download" />
                      <span className="font-medium text-sm text-muted-foreground">
                        download
                      </span>
                    </span>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                  onClick={OnClearOutput}
                >
                  <Trash2 size={16} aria-label="clear" />
                  <span className="font-medium text-sm text-muted-foreground">
                    clear
                  </span>
                </Button>
              </div>
            </div>
            <div className="flex-1 rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 flex flex-col">
              <div className="flex-1 flex items-center justify-center overflow-auto p-4">
                {previewSrc ? (
                  <img
                    alt="base64 preview"
                    src={sanitizedPreview}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No image to preview
                  </span>
                )}
              </div>
              {previewSrc && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-t border-muted-foreground/20 text-xs text-muted-foreground">
                  <span>Type: {meta.mimeType || "-"}</span>
                  <span>
                    Dimension: {meta.width} x {meta.height}
                  </span>
                  <span>Size: {meta.sizeKb.toFixed(2)} KB</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
};

export default Base64ToImage;
