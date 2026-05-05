import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { appToast } from "@/lib/toast";

const Editor = lazy(() =>
  import("@monaco-editor/react").then((mod) => ({ default: mod.Editor })),
);

import { parseStringPromise } from "xml2js";
import useXMLToJsonStore from "@/features/formatter/stores/useXMLToJson.store";

const XMLToJSON = () => {
  const editorXMLRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const editorJSONRef = useRef<any>(null);

  const [defaultJSONText, setDefaultJSONText] = useState<string | undefined>(
    undefined,
  );
  const [defaultXMLText, setDefaultXMLText] = useState<string | undefined>(
    undefined,
  );

  const { setXMLText, setJSONText, getXMLText, getJSONText }: any =
    useXMLToJsonStore();

  const editorOptions = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
  };

  useEffect(() => {
    if (getXMLText()) setDefaultXMLText(getXMLText());
    if (getJSONText()) setDefaultJSONText(getJSONText());
  }, []);

  function validateXML(xml: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const errorNode = xmlDoc.getElementsByTagName("parsererror")[0];
    if (errorNode) {
      return {
        isValid: false,
        message: errorNode.textContent || "Invalid XML Syntax",
      };
    }
    return { isValid: true, message: "Valid XML Syntax" };
  }

  function handleXMLEditorMount(editor: any, monaco: any) {
    editorXMLRef.current = editor;
    monacoRef.current = monaco;
    editor.onDidChangeModelContent(() => {
      setXMLText(editor.getValue());
    });
  }

  function handleJSONEditorMount(editor: any) {
    editorJSONRef.current = editor;
  }

  const handleValidation = (value: any) => {
    if (!monacoRef.current) return;
    const monaco = monacoRef.current;
    const model = monaco.editor.getModels()[0];
    const validation = validateXML(value);
    if (!validation.isValid) {
      monaco.editor.setModelMarkers(model, "owner", [
        {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: model.getLineCount(),
          endColumn: model.getLineMaxColumn(model.getLineCount()),
          message: validation.message,
          severity: monaco.MarkerSeverity.Error,
        },
      ]);
    } else {
      monaco.editor.setModelMarkers(model, "owner", []);
    }
  };

  async function onConvertXMLToJSON() {
    const xmlText = getXMLText();
    if (!xmlText?.trim()) {
      appToast.warning("Please enter XML text to convert.");
      return;
    }

    const validation = validateXML(xmlText);
    if (!validation.isValid) {
      appToast.error(validation.message);
      return;
    }

    try {
      const result = await parseStringPromise(xmlText, {
        explicitArray: false,
        trim: true,
        mergeAttrs: true,
      });
      const jsonString = JSON.stringify(result);
      let formattedJson = "";
      try {
        formattedJson = JSON.stringify(JSON.parse(jsonString), null, 2);
      } catch {
        appToast.error("Failed to format JSON. Please try again.");
        return;
      }

      setJSONText(formattedJson);
      editorJSONRef.current?.setValue(formattedJson);
      appToast.success("XML converted to JSON successfully!");
    } catch (err: any) {
      appToast.error(err?.message || "Failed to parse XML. Check your syntax.");
    }
  }

  function onClearXML() {
    editorXMLRef.current?.setValue("");
    setXMLText("");
  }

  function onClearJSON() {
    editorJSONRef.current?.setValue("");
    setJSONText("");
  }

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        XML To JSON
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
                Input
              </span>
              <Button
                variant="secondary"
                size="lg"
                className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                onClick={onClearXML}
              >
                <Trash2 size={16} aria-label="clear" />
                <span className="font-medium text-sm text-muted-foreground">
                  clear
                </span>
              </Button>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                theme="vs-dark"
                options={editorOptions}
                defaultLanguage="xml"
                defaultValue={defaultXMLText}
                onMount={handleXMLEditorMount}
                onChange={handleValidation}
              />
            </div>
          </div>

          <div className="flex items-center justify-center px-2 py-2 lg:py-0">
            <Button
              variant="secondary"
              size="lg"
              className="hover:bg-gray-200 hover:text-black text-muted-foreground"
              onClick={onConvertXMLToJSON}
            >
              Convert
            </Button>
          </div>

          <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Output
              </span>
              <Button
                variant="secondary"
                size="lg"
                className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                onClick={onClearJSON}
              >
                <Trash2 size={16} aria-label="clear" />
                <span className="font-medium text-sm text-muted-foreground">
                  clear
                </span>
              </Button>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                theme="vs-dark"
                options={{ ...editorOptions, readOnly: true }}
                defaultLanguage="json"
                defaultValue={defaultJSONText}
                onMount={handleJSONEditorMount}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
};

export default XMLToJSON;
