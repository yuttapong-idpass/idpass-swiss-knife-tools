import React, { useCallback, useMemo, useRef, useState } from "react";
import "@/features/formatter/components/JsonFormatter/JsonFormatter.css";
import { saveAs } from "file-saver";
import { isMenuButton, type MenuItem } from "vanilla-jsoneditor";
import {
  AlignLeft,
  ArrowDownAZ,
  ChevronsDownUp,
  ChevronsUpDown,
  Copy,
  Download,
  FileJson,
  ListTree,
  Minimize2,
  Redo2,
  Search,
  Trash2,
  Undo2,
  Upload,
  Wand2,
} from "lucide-react";
import JsonEditorPanel, { type JsonEditorHandle } from "./JsonEditorPanel";
import JsonToolPanel, { type ToolAction, type ToolGroup } from "./JsonToolPanel";
import useJsonFormatStore from "@/features/formatter/stores/useJsonFormat.store";
import { appToast } from "@/lib/toast";

const SAMPLE_JSON = JSON.stringify(
  {
    name: "idpass-swiss-knife-tools",
    version: "1.0.0",
    tools: ["json-formatter", "jwt-decoder", "base64", "uuid"],
    author: { name: "idpass", url: "https://github.com/yuttapong-idpass" },
    active: true,
  },
  null,
  2,
);

const JsonFormatter = () => {
  const editorRef = useRef<JsonEditorHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { content, setContent } = useJsonFormatStore();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const initialTextRef = useRef(content);

  const onContentChange = useCallback(
    (text: string, parseError: string | null) => {
      setContent(text);
      setError(text.trim() ? parseError : null);
    },
    [setContent],
  );

  const onMenuItemsChange = useCallback((items: MenuItem[]) => {
    setMenuItems(items);
  }, []);

  const writeText = useCallback(
    (text: string) => {
      editorRef.current?.setText(text);
      setContent(text);
      setError(null);
    },
    [setContent],
  );

  /**
   * Builds a tool-panel action from one of the editor's own menu buttons, so
   * the handler and the enabled/disabled state come straight from the editor.
   * Buttons absent in the current mode render disabled.
   */
  const fromEditorMenu = useCallback(
    (
      match: (item: ReturnType<typeof asButton>) => boolean,
      action: Pick<ToolAction, "id" | "label" | "icon">,
    ): ToolAction => {
      const button = menuItems.map(asButton).find((item) => item && match(item));

      return {
        ...action,
        onClick: (event) => button?.onClick(event.nativeEvent),
        disabled: !button || button.disabled === true,
        title: button?.title,
        active: button?.className?.includes("jse-selected"),
      };
    },
    [menuItems],
  );

  const byClassName = (className: string) => (item: any) =>
    item.className?.split(" ").includes(className);

  const byText = (text: string) => (item: any) => item.text === text;

  const onSample = () => writeText(SAMPLE_JSON);

  const onClear = () => {
    writeText("");
    editorRef.current?.focus();
  };

  const onImportFile = ($event: React.ChangeEvent<HTMLInputElement>) => {
    const file = $event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const fileContent = loadEvent.target?.result;
      if (typeof fileContent === "string") {
        writeText(fileContent);
        appToast.success(`Imported ${file.name}`);
      }
    };
    reader.onerror = () => appToast.error("Could not read the file");
    reader.readAsText(file);
    // Allow re-importing the same file.
    $event.target.value = "";
  };

  const onExport = () => {
    const text = editorRef.current?.getText() ?? "";
    if (!text.trim()) {
      appToast.warning("Nothing to export");
      return;
    }
    saveAs(
      new Blob([text], { type: "application/json;charset=utf-8" }),
      "data.json",
    );
  };

  const onCopy = async () => {
    const text = editorRef.current?.getText() ?? "";
    if (!text.trim()) {
      appToast.warning("Nothing to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      appToast.success("Copied to clipboard");
    } catch {
      appToast.error("Could not copy to clipboard");
    }
  };

  const toolGroups: ToolGroup[] = useMemo(
    () => [
      {
        id: "mode",
        actions: [
          fromEditorMenu(byText("text"), {
            id: "text-mode",
            label: "Text mode",
            icon: AlignLeft,
          }),
          fromEditorMenu(byText("tree"), {
            id: "tree-mode",
            label: "Tree mode",
            icon: ListTree,
          }),
        ],
      },
      {
        id: "view",
        actions: [
          fromEditorMenu(byClassName("jse-expand-all"), {
            id: "expand",
            label: "Expand all",
            icon: ChevronsUpDown,
          }),
          fromEditorMenu(byClassName("jse-collapse-all"), {
            id: "collapse",
            label: "Collapse all",
            icon: ChevronsDownUp,
          }),
          fromEditorMenu(byClassName("jse-search"), {
            id: "search",
            label: "Search",
            icon: Search,
          }),
        ],
      },
      {
        id: "transform",
        actions: [
          fromEditorMenu(byClassName("jse-format"), {
            id: "format",
            label: "Format",
            icon: AlignLeft,
          }),
          fromEditorMenu(byClassName("jse-compact"), {
            id: "compact",
            label: "Minify",
            icon: Minimize2,
          }),
          fromEditorMenu(byClassName("jse-sort"), {
            id: "sort",
            label: "Sort",
            icon: ArrowDownAZ,
          }),
          fromEditorMenu(byClassName("jse-transform"), {
            id: "transform",
            label: "Transform",
            icon: Wand2,
          }),
        ],
      },
      {
        id: "history",
        actions: [
          fromEditorMenu(byClassName("jse-undo"), {
            id: "undo",
            label: "Undo",
            icon: Undo2,
          }),
          fromEditorMenu(byClassName("jse-redo"), {
            id: "redo",
            label: "Redo",
            icon: Redo2,
          }),
        ],
      },
      {
        id: "file",
        actions: [
          { id: "sample", label: "Sample", icon: FileJson, onClick: onSample },
          {
            id: "import",
            label: "Import",
            icon: Upload,
            onClick: () => fileInputRef.current?.click(),
          },
          { id: "export", label: "Export", icon: Download, onClick: onExport },
          { id: "copy", label: "Copy", icon: Copy, onClick: onCopy },
          {
            id: "clear",
            label: "Clear",
            icon: Trash2,
            onClick: onClear,
            destructive: true,
          },
        ],
      },
    ],
    [fromEditorMenu],
  );

  const isEmpty = !content.trim();

  return (
    <main className="p-4 w-full h-[calc(100vh-1rem)] flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 shrink-0">
        <h1 className="text-xl font-extrabold text-foreground">
          JSON Formatter
        </h1>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-md ${
            isEmpty
              ? "text-muted-foreground bg-muted"
              : error
                ? "text-destructive bg-destructive/10"
                : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
          }`}
          role="status"
        >
          {isEmpty ? "Empty" : error ? error : "Valid JSON"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">
        <JsonToolPanel groups={toolGroups} />

        <section className="flex-1 min-h-[320px] lg:min-h-0 flex flex-col rounded-lg border border-border bg-card overflow-hidden">
          <JsonEditorPanel
            ref={editorRef}
            initialText={initialTextRef.current}
            onContentChange={onContentChange}
            onMenuItemsChange={onMenuItemsChange}
          />
        </section>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt"
        onChange={onImportFile}
        className="hidden"
      />
    </main>
  );
};

/** Narrows a menu item to a button, or `undefined` for separators and spacers. */
const asButton = (item: MenuItem) => (isMenuButton(item) ? item : undefined);

export default JsonFormatter;
