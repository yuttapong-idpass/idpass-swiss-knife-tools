import { Button } from "@/components/ui/button";
import { Delete, Trash2 } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const Editor = lazy(() =>
  import("@monaco-editor/react").then((mod) => ({ default: mod.Editor })),
);
import useXMLFormatterStore from "@/features/formatter/stores/useXMLFormatter.store";
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

  function ValidateXML(xml: string) {
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

  function HandleInputEditorMount(editor: any, monaco: any) {
    editorInputRef.current = editor;
    monacoRef.current = monaco;
    editor.onDidChangeModelContent(() => {
      setXMLText(editor.getValue());
    });
  }

  function HandleOutputEditorMount(editor: any) {
    editorOutputRef.current = editor;
  }

  const HandleValidation = (value: any) => {
    if (!monacoRef.current) return;
    const monaco = monacoRef.current;
    const model = monaco.editor.getModels()[0];
    const validation = ValidateXML(value);
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

  function OnFormatXML() {
    const xmlText = getXMLText();
    if (!xmlText?.trim()) {
      toast.warn("Please enter XML text to format.");
      return;
    }

    const validation = ValidateXML(xmlText);
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

  function OnClearInput() {
    editorInputRef.current?.setValue("");
    setXMLText("");
  }

  function OnClearOutput() {
    editorOutputRef.current?.setValue("");
    setFormattedXML("");
  }

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        XML Formatter
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
                onClick={OnClearInput}
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
                defaultValue={defaultInputText}
                onMount={HandleInputEditorMount}
                onChange={HandleValidation}
              />
            </div>
          </div>

          <div className="flex items-center justify-center px-2 py-2 lg:py-0">
            <Button
              variant="secondary"
              size="lg"
              className="hover:bg-gray-200 hover:text-black"
              onClick={OnFormatXML}
            >
              Format
            </Button>
          </div>

          <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Formatted Output
              </span>
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
            <div className="flex-1">
              <Editor
                height="100%"
                theme="vs-dark"
                options={{ ...editorOptions, readOnly: true }}
                defaultLanguage="xml"
                defaultValue={defaultOutputText}
                onMount={HandleOutputEditorMount}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
};

export default XMLFormatter;
