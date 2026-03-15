import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import { Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useXMLFormatterStore from "@/features/formatter/stores/useXMLFormatterStore";
import { toast } from "react-toastify";

const XMLFormatter = () => {
  const editorInputRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const editorOutputRef = useRef<any>(null);

  const [defaultInputText, setDefaultInputText] = useState<string | undefined>(
    undefined
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

  function formatXML(xml: string, indent = "  "): string {
    const PADDING = indent;
    let formatted = "";
    let pad = 0;

    const lines = xml
      .replace(/(>)(<)(\/*)/g, "$1\n$2$3")
      .replace(/\r?\n/g, "\n")
      .split("\n");

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (line.startsWith("<?")) {
        formatted += line + "\n";
        continue;
      }

      if (line.startsWith("</")) {
        pad = Math.max(0, pad - 1);
      }

      formatted += PADDING.repeat(pad) + line + "\n";

      if (
        line.startsWith("<") &&
        !line.startsWith("</") &&
        !line.startsWith("<?") &&
        !line.endsWith("/>") &&
        !/<\/[^>]+>$/.test(line)
      ) {
        pad++;
      }
    }

    return formatted.trimEnd();
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
      const formatted = formatXML(xmlText);
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
    <main className="w-full p-2 gap-2">
      <p className="text-xl font-extrabold text-default-800">XML Formatter</p>
      <div className="grid grid-cols-9 items-center">
        <div className="w-full col-span-4 p-2">
          <div className="mt-2">
            <div className="flex flex-col justify-between gap-2 w-full">
              <div className="flex flex-row gap-2 h-4 mt-3 mb-3 justify-between">
                <span>Input</span>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="hover:bg-gray-200 hover:text-black"
                    onClick={onClearInput}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
              <div>
                <Editor
                  height="86vh"
                  theme="vs-dark"
                  options={editorOptions}
                  defaultLanguage="xml"
                  defaultValue={defaultInputText}
                  onMount={handleInputEditorMount}
                  onChange={handleValidation}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex col-span-1 p-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            className="hover:bg-gray-200 hover:text-black"
            onClick={onFormatXML}
          >
            Format
          </Button>
        </div>
        <div className="w-full col-span-4 p-2">
          <div className="mt-2">
            <div className="flex flex-col justify-between gap-2 w-full">
              <div className="flex flex-row gap-2 h-4 mt-3 mb-3 justify-between">
                <span>Formatted Output</span>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="hover:bg-gray-200 hover:text-black"
                    onClick={onClearOutput}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
              <div>
                <Editor
                  height="86vh"
                  theme="vs-dark"
                  options={{ ...editorOptions, readOnly: true }}
                  defaultLanguage="xml"
                  defaultValue={defaultOutputText}
                  onMount={handleOutputEditorMount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default XMLFormatter;
