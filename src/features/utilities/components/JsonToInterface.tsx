import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMonacoTheme } from "@/hooks/useMonacoTheme";
import { appToast } from "@/lib/toast";
import { lazy, Suspense, useState } from "react";
import { run } from "json_typegen_wasm";

const Editor = lazy(() => import("@monaco-editor/react"));

const PLACEHOLDER_OUTPUT = "export interface Root {\n  // Paste JSON on the left side\n}";

const ConvertJsonToInterfaceText = (jsonText: string, rootName: string) => {
  const safeName = rootName.trim() || "Root";

  if (!jsonText.trim()) {
    return {
      output: `export interface ${safeName} {\n  // Paste JSON on the left side\n}`,
      error: "",
    };
  }

  try {
    JSON.parse(jsonText);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON format";
    return {
      output: `// Invalid JSON\n// ${message}`,
      error: message,
    };
  }

  try {
    const result = run(safeName, jsonText, `{ output_mode: "typescript" }`);

    if (result.startsWith("Error:")) {
      return { output: `// ${result}`, error: result };
    }

    return { output: result, error: "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Conversion failed";
    return { output: `// Error\n// ${message}`, error: message };
  }
};

export default function JsonToInterface() {
  const monacoTheme = useMonacoTheme();
  const [rootInterfaceName, setRootInterfaceName] = useState("Root");
  const [jsonInput, setJsonInput] = useState("");
  const [output, setOutput] = useState(PLACEHOLDER_OUTPUT);

  const HandleConvert = () => {
    const converted = ConvertJsonToInterfaceText(jsonInput, rootInterfaceName);
    if (converted.error) {
      appToast.error(converted.error);
      return;
    }

    setOutput(converted.output);
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: "on" as const,
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
  };

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-3">
        JSON to TypeScript Interface
      </p>

      <div className="mb-3 w-full max-w-xl space-y-1">
        <Label htmlFor="root-interface-name">Main Interface Name</Label>
        <Input
          id="root-interface-name"
          value={rootInterfaceName}
          onChange={(event) => setRootInterfaceName(event.target.value)}
          placeholder="Root"
        />
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[calc(100vh-10rem)] text-muted-foreground">
            <span className="font-medium text-sm">Loading editor...</span>
          </div>
        }
      >
        <div className="flex flex-col lg:flex-row gap-2 h-auto lg:h-[calc(100vh-10rem)]">
          <section className="w-full lg:flex-1 flex flex-col min-h-[320px] lg:min-h-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-muted-foreground">JSON Input</span>
            </div>
            <div className="flex-1 min-h-0 border rounded-md overflow-hidden">
              <Editor
                height="100%"
                theme={monacoTheme}
                language="json"
                value={jsonInput}
                options={editorOptions}
                onChange={(value) => setJsonInput(value ?? "")}
              />
            </div>
          </section>

          <div className="flex flex-row lg:flex-col items-center justify-center px-1 py-1 lg:py-0 gap-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={HandleConvert}
              className="rounded-md px-4 py-2 text-sm font-semibold"
            >
              Convert
            </Button>
          </div>

          <section className="w-full lg:flex-1 flex flex-col min-h-[320px] lg:min-h-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-muted-foreground">
                Interface Output (Plain Text)
              </span>
            </div>
            <div className="flex-1 min-h-0 border rounded-md overflow-hidden">
              <Editor
                height="100%"
                theme={monacoTheme}
                language="typescript"
                value={output}
                options={{ ...editorOptions, readOnly: true }}
              />
            </div>
          </section>
        </div>
      </Suspense>
    </main>
  );
}
