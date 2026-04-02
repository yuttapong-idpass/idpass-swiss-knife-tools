import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const Editor = lazy(() =>
  import("@monaco-editor/react").then((mod) => ({ default: mod.Editor }))
);
import useXMLFormatterStore from "@/features/formatter/stores/useXMLFormatterStore";
import { toast } from "react-toastify";
import xmlFormat from "xml-formatter";

const XMLFormatter = () => {
  const editorInputRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const editorOutputRef = useRef<any>(null);

  const [defaultInputText, setDefaultInputText] = useState<string | undefined>(
    undefined,
  );
  const [defaultOutputText, setDefaultOutputText] = useState<
    string | undefined
  >(undefined);

  const { setXMLText, setFormattedXML, getXMLText, getFormattedXML }: any =
    useXMLFormatterStore();

  const editorOptions = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14,
  };

  useEffect(() => {
    if (getXMLText()) setDefaultInputText(getXMLText());
    if (getFormattedXML()) setDefaultOutputText(getFormattedXML());
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

  function handleInputEditorMount(editor: any, monaco: any) {
    editorInputRef.current = editor;
    monacoRef.current = monaco;
    editor.onDidChangeModelContent(() => {
      setXMLText(editor.getValue());
    });
  }

  function handleOutputEditorMount(editor: any) {
    editorOutputRef.current = editor;
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

  function onFormatXML() {
    const xmlText = getXMLText();
    if (!xmlText?.trim()) {
      toast.warn("Please enter XML text to format.");
      return;
    }

    const validation = validateXML(xmlText);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    try {
      const formatted = xmlFormat(xmlText, {
        lineSeparator: "\n",
        collapseContent: true,
        indentation: "  ",
      });
      setFormattedXML(formatted);
      editorOutputRef.current?.setValue(formatted);
      toast.success("XML formatted successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to format XML. Check your syntax.");
    }
  }

  function onClearInput() {
    editorInputRef.current?.setValue("");
    setXMLText("");
  }

  function onClearOutput() {
    editorOutputRef.current?.setValue("");
    setFormattedXML("");
  }

  return (
    <main className="p-2 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        XML Formatter
      </p>
      <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-5rem)] text-muted-foreground">Loading editor...</div>}>
      <div className="flex flex-col lg:flex-row gap-2 h-auto lg:h-[calc(100vh-5rem)]">
        <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
          <div className="flex flex-row items-center mb-2 justify-between">
            <span>Input</span>
            <Button
              variant="secondary"
              size="lg"
              className="hover:bg-gray-200 hover:text-black"
              onClick={onClearInput}
            >
              <Trash />
            </Button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              options={editorOptions}
              defaultLanguage="xml"
              defaultValue={defaultInputText}
              onMount={handleInputEditorMount}
              onChange={handleValidation}
            />
          </div>
        </div>

        <div className="flex items-center justify-center px-2 py-2 lg:py-0">
          <Button
            variant="secondary"
            size="lg"
            className="hover:bg-gray-200 hover:text-black"
            onClick={onFormatXML}
          >
            Format
          </Button>
        </div>

        <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
          <div className="flex flex-row items-center mb-2 justify-between">
            <span>Formatted Output</span>
            <Button
              variant="secondary"
              size="lg"
              className="hover:bg-gray-200 hover:text-black"
              onClick={onClearOutput}
            >
              <Trash />
            </Button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              options={{ ...editorOptions, readOnly: true }}
              defaultLanguage="xml"
              defaultValue={defaultOutputText}
              onMount={handleOutputEditorMount}
            />
          </div>
        </div>
      </div>
      </Suspense>
    </main>
  );
};

export default XMLFormatter;
