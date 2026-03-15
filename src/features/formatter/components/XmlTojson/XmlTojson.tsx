import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import { Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { parseStringPromise } from "xml2js";
import useXMLToJsonStore from "@/features/formatter/stores/useXMLToJsonStore";
import { toast } from "react-toastify";

const XMLToJSON = () => {
  const editorXMLRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const editorJSONRef = useRef<any>(null);

  const [defaultJSONText, setDefaultJSONText] = useState<string | undefined>(
    undefined
  );
  const [defaultXMLText, setDefaultXMLText] = useState<string | undefined>(
    undefined
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
      toast.warn("Please enter XML text to convert.");
      return;
    }

    const validation = validateXML(xmlText);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    try {
      const result = await parseStringPromise(xmlText, {
        explicitArray: false,
        trim: true,
        mergeAttrs: true,
      });
      const jsonString = JSON.stringify(result, null, 2);

      setJSONText(jsonString);
      editorJSONRef.current?.setValue(jsonString);
      toast.success("XML converted to JSON successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to parse XML. Check your syntax.");
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
    <main className="p-2 gap-2 w-full">
      <p className="text-xl font-extrabold text-default-800">XML To JSON</p>
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
                    onClick={onClearXML}
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
                  defaultValue={defaultXMLText}
                  onMount={handleXMLEditorMount}
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
            onClick={onConvertXMLToJSON}
          >
            Convert
          </Button>
        </div>
        <div className="w-full col-span-4 p-2">
          <div className="mt-2">
            <div className="flex flex-col justify-between gap-2 w-full">
              <div className="flex flex-row gap-2 h-4 mt-3 mb-3 justify-between">
                <span>Output</span>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="hover:bg-gray-200 hover:text-black"
                    onClick={onClearJSON}
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
                  defaultLanguage="json"
                  defaultValue={defaultJSONText}
                  onMount={handleJSONEditorMount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default XMLToJSON;
