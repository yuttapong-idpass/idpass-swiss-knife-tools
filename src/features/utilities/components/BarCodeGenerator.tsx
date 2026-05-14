import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appToast } from "@/lib/toast";
import JsBarcode from "jsbarcode";
import { Download, Trash2 } from "lucide-react";
import { lazy, useRef, useState } from "react";

const Editor = lazy(() => import("@monaco-editor/react"));


const BARCODE_FORMATS = [
  { value: "CODE128", label: "CODE-128" },
  { value: "EAN13", label: "EAN-13" },
  { value: "EAN8", label: "EAN-8" },
  { value: "UPC", label: "UPC-A" },
  { value: "CODE39", label: "CODE-39" },
  { value: "ITF14", label: "ITF-14" },
  { value: "MSI", label: "MSI" },
  { value: "pharmacode", label: "Pharmacode" },
  { value: "codabar", label: "Codabar" },
];

const BARCODE_EXAMPLES = [
  { format: "CODE128", label: "CODE-128", value: "Hello-World-123", description: "Alphanumeric text" },
  { format: "EAN13", label: "EAN-13", value: "5901234123457", description: "13-digit product code" },
  { format: "EAN8", label: "EAN-8", value: "96385074", description: "8-digit short product code" },
  { format: "UPC", label: "UPC-A", value: "012345678905", description: "12-digit retail barcode" },
  { format: "CODE39", label: "CODE-39", value: "CODE39-ABC", description: "Uppercase alphanumeric" },
  { format: "ITF14", label: "ITF-14", value: "12345678901231", description: "14-digit shipping code" },
  { format: "MSI", label: "MSI", value: "1234567", description: "Numeric digits only" },
  { format: "pharmacode", label: "Pharmacode", value: "1234", description: "Number between 3–131070" },
  { format: "codabar", label: "Codabar", value: "A123456789B", description: "Starts/ends with A-D" },
];

export default function BarCodeGenerator() {
  const [inputText, setInputText] = useState("");
  const [format, setFormat] = useState("CODE128");
  const [hasBarcode, setHasBarcode] = useState(false);
  const [barcodeInfo, setBarcodeInfo] = useState({ format: "", value: "" });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const editorPlainRef = useRef<any>(null);

  const editorOptions = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
    wordWrap: "on" as const,
    automaticLayout: true,
  };

  function GenerateBarcode() {
    if (!inputText.trim()) {
      appToast.warning("Please enter text to generate a barcode.");
      return;
    }
    try {
      JsBarcode(svgRef.current, inputText.trim(), {
        format,
        lineColor: "#000",
        width: 2,
        height: 100,
        displayValue: true,
        margin: 10,
        background: "#ffffff",
      });
      setHasBarcode(true);
      setBarcodeInfo({ format, value: inputText.trim() });
    } catch (error: any) {
      appToast.error(error.message || "Failed to generate barcode. Check the format or input value.");
      setHasBarcode(false);
    }
  }


  function HandlePlainDidMount(editor: any) {
    editorPlainRef.current = editor;
    editor.onDidChangeModelContent(() => {
      setInputText(editor.getValue());
    });
  }



  function OnClearOutput() {
    if (svgRef.current) {
      svgRef.current.innerHTML = "";
      svgRef.current.removeAttribute("style");
      svgRef.current.removeAttribute("width");
      svgRef.current.removeAttribute("height");
      svgRef.current.removeAttribute("viewBox");
    }
    setHasBarcode(false);
    setBarcodeInfo({ format: "", value: "" });
  }

  function OnClearInput() {
    setInputText("");
    if (editorPlainRef.current) {
      editorPlainRef.current.setValue("");
    }
    OnClearOutput();
  }

  function ApplyExample(exampleFormat: string, exampleValue: string) {
    setFormat(exampleFormat);
    setInputText(exampleValue);
    if (editorPlainRef.current) {
      editorPlainRef.current.setValue(exampleValue);
    }
    OnClearOutput();
  }

  function DownloadSVG() {
    if (!svgRef.current || !hasBarcode) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `barcode-${format}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        Barcode Generator
      </p>
      <div className="flex flex-col lg:flex-row gap-2 h-auto lg:h-[calc(100vh-5rem)]">
        {/* Left: Input */}
        <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
          <div className="flex flex-row items-center mb-2 justify-between">
            <span className="font-medium text-sm text-muted-foreground">
              Input (Text)
            </span>
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
          <div className="flex-1 rounded-md border border-input overflow-hidden">
            <Editor
                height="100%"
                theme="vs-dark"
                options={editorOptions}
                defaultValue={inputText}
                defaultLanguage="plaintext"
                onMount={HandlePlainDidMount}
            />
          </div>
        </div>

        {/* Middle: Controls */}
        <div className="flex flex-col items-center justify-center px-2 py-2 lg:py-0 gap-3">
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              {BARCODE_FORMATS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="secondary"
            size="lg"
            className="hover:bg-gray-200 hover:text-black"
            onClick={GenerateBarcode}
          >
            Generate
          </Button>
        </div>

        {/* Right: Preview + Example */}
        <div className="w-full lg:flex-1 flex flex-col min-h-[400px] lg:min-h-0 gap-2">
          {/* Top: Barcode Preview (larger) */}
          <div className="flex-[3] flex flex-col min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Barcode Preview
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black text-muted-foreground disabled:opacity-50"
                  disabled={!hasBarcode}
                  onClick={DownloadSVG}
                >
                  <Download size={16} aria-label="download" />
                  <span className="font-medium text-sm text-muted-foreground">
                    download
                  </span>
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
            <div className="flex-1 rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 flex flex-col min-h-0">
              <div className="flex-1 flex items-center justify-center overflow-auto p-4">
                <svg
                  ref={svgRef}
                  className={hasBarcode ? "max-w-full" : "hidden"}
                />
                {!hasBarcode && (
                  <span className="text-sm text-muted-foreground">
                    No barcode to preview
                  </span>
                )}
              </div>
              {hasBarcode && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-t border-muted-foreground/20 text-xs text-muted-foreground">
                  <span>
                    Format:{" "}
                    {BARCODE_FORMATS.find((f) => f.value === barcodeInfo.format)
                      ?.label ?? barcodeInfo.format}
                  </span>
                  <span>Value: {barcodeInfo.value}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom: Examples (smaller) */}
          <div className="flex-[2] flex flex-col min-h-0">
            <div className="flex flex-row items-center mb-2">
              <span className="font-medium text-sm text-muted-foreground">
                Examples
              </span>
              <span className="ml-2 text-xs text-muted-foreground/60">
                — click to apply
              </span>
            </div>
            <div className="flex-1 rounded-md border border-muted-foreground/20 bg-muted/10 overflow-y-auto">
              <div className="divide-y divide-muted-foreground/10">
                {BARCODE_EXAMPLES.map((ex) => (
                  <button
                    key={ex.format}
                    onClick={() => ApplyExample(ex.format, ex.value)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/40 transition-colors group"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {ex.label}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {ex.description}
                      </span>
                    </div>
                    <span className="ml-3 text-xs font-mono text-muted-foreground/70 truncate max-w-[45%] text-right shrink-0">
                      {ex.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
