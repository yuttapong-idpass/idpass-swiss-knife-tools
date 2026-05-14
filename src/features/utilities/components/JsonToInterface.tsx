import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lazy, Suspense, useState } from "react";

const Editor = lazy(() => import("@monaco-editor/react"));

type GeneratorState = {
  interfaces: string[];
  usedNames: Map<string, number>;
};

const IsValidIdentifier = (name: string) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);

const ToPascalCase = (value: string) =>
  value
    .replace(/[^A-Za-z0-9_$]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const ToSafeInterfaceName = (value: string, fallback = "Root") => {
  const candidate = ToPascalCase(value) || fallback;
  return /^[A-Za-z_$]/.test(candidate) ? candidate : `${fallback}${candidate}`;
};

const CreateUniqueName = (name: string, state: GeneratorState) => {
  const normalizedName = ToSafeInterfaceName(name, "Item");
  const current = state.usedNames.get(normalizedName);

  if (!current) {
    state.usedNames.set(normalizedName, 1);
    return normalizedName;
  }

  const next = current + 1;
  state.usedNames.set(normalizedName, next);
  return `${normalizedName}${next}`;
};

const BuildPropertyName = (rawKey: string) =>
  IsValidIdentifier(rawKey) ? rawKey : `"${rawKey}"`;

const InferType = (
  value: unknown,
  hintName: string,
  state: GeneratorState,
): string => {
  if (value === null) return "null";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";

  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";

    const inferredItemTypes = Array.from(
      new Set(value.map((item) => InferType(item, `${hintName}Item`, state))),
    );

    if (inferredItemTypes.length === 1) {
      return `${inferredItemTypes[0]}[]`;
    }

    return `(${inferredItemTypes.join(" | ")})[]`;
  }

  if (typeof value === "object") {
    const interfaceName = CreateUniqueName(hintName, state);
    const entries = Object.entries(value as Record<string, unknown>);
    const members = entries.map(([key, childValue]) => {
      const childType = InferType(childValue, ToPascalCase(key) || "Field", state);
      return `  ${BuildPropertyName(key)}: ${childType};`;
    });

    state.interfaces.push(
      `export interface ${interfaceName} {\n${members.join("\n")}\n}`,
    );

    return interfaceName;
  }

  return "unknown";
};

const ConvertJsonToInterfaceText = (jsonText: string, rootName: string) => {
  const safeRootName = ToSafeInterfaceName(rootName, "Root");

  if (!jsonText.trim()) {
    return {
      output: `export interface ${safeRootName} {\n  // Paste JSON on the left side\n}`,
      error: "",
    };
  }

  try {
    const parsed = JSON.parse(jsonText);
    const state: GeneratorState = {
      interfaces: [],
      usedNames: new Map([[safeRootName, 1]]),
    };

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const rootEntries = Object.entries(parsed as Record<string, unknown>);
      const rootMembers = rootEntries.map(([key, childValue]) => {
        const childType = InferType(childValue, ToPascalCase(key) || "Field", state);
        return `  ${BuildPropertyName(key)}: ${childType};`;
      });

      return {
        output: [
          ...state.interfaces,
          `export interface ${safeRootName} {\n${rootMembers.join("\n")}\n}`,
        ].join("\n\n"),
        error: "",
      };
    }

    const rootType = InferType(parsed, `${safeRootName}Value`, state);
    return {
      output: [
        ...state.interfaces,
        `export type ${safeRootName} = ${rootType};`,
      ].join("\n\n"),
      error: "",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON format";
    return {
      output: `// Invalid JSON\n// ${message}`,
      error: message,
    };
  }
};

export default function JsonToInterface() {
  const [rootInterfaceName, setRootInterfaceName] = useState("Root");
  const [jsonInput, setJsonInput] = useState("");
  const [output, setOutput] = useState(
    "export interface Root {\n  // Paste JSON on the left side\n}",
  );
  const [error, setError] = useState("");

  const HandleConvert = () => {
    const converted = ConvertJsonToInterfaceText(jsonInput, rootInterfaceName);
    setOutput(converted.output);
    setError(converted.error);
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
          <div className="flex items-center justify-center h-[calc(100vh-12rem)] text-muted-foreground">
            <span className="font-medium text-sm">Loading editor...</span>
          </div>
        }
      >
        <div className="flex flex-row gap-3 h-[calc(100vh-12rem)]">
          <section className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-muted-foreground">JSON Input</span>
            </div>
            <div className="flex-1 min-h-0 border rounded-md overflow-hidden">
              <Editor
                height="100%"
                theme="vs-dark"
                language="json"
                value={jsonInput}
                options={editorOptions}
                onChange={(value) => setJsonInput(value ?? "")}
              />
            </div>
            {error ? (
              <p className="text-xs text-red-500 mt-2">JSON error: {error}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">
                Paste JSON แล้วกด Convert เพื่อแปลงเป็น TypeScript interface
              </p>
            )}
          </section>

          <div className="flex flex-col items-center justify-center px-1 gap-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={HandleConvert}
              className="rounded-md px-4 py-2 text-sm font-semibold"
            >
              Convert
            </Button>
            <div className="w-px h-6 bg-border" />
          </div>

          <section className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-muted-foreground">
                Interface Output (Plain Text)
              </span>
            </div>
            <div className="flex-1 min-h-0 border rounded-md overflow-hidden">
              <Editor
                height="100%"
                theme="vs-dark"
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
