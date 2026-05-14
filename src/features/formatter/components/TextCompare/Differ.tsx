import { Button } from "@/components/ui/button";
import { lazy, Suspense, useRef } from "react";

const Editor = lazy(() => import("@monaco-editor/react"));
import { useNavigate } from "react-router-dom";
import useTextCompareStore from "@/features/formatter/stores/useTextCompare.store";
import { Delete, Trash2 } from "lucide-react";

const Differ = () => {
  const editorOriginalTextRef = useRef<any>(null);
  const editorModifiedTextRef = useRef<any>(null);
  const navigate = useNavigate();
  const {
    setOriginalText,
    setModifiedText,
    getOriginalText,
    getModifiedText,
  }: any = useTextCompareStore();
  const options = {
    minimap: {
      enabled: false,
    },
    fontSize: 14, // You can add other options here too
  };

  function OnRouteToResultCompare() {
    navigate("/text-compare/result-compare");
  }

  function HandleOriginalTextDidMount(editor: any, monaco: any) {
    editorOriginalTextRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setOriginalText(value);
    });
  }

  function HandleModifiedTextDidMount(editor: any, monaco: any) {
    editorModifiedTextRef.current = editor;
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setModifiedText(value);
    });
  }

  function OnClearOriginalText() {
    if (editorOriginalTextRef.current) {
      editorOriginalTextRef.current.setValue("");
      setOriginalText("");
    }
  }

  function OnClearModifiedText() {
    if (editorModifiedTextRef.current) {
      editorModifiedTextRef.current.setValue("");
      setModifiedText("");
    }
  }

  return (
    <main className="w-full p-4">
      <p className="text-xl font-extrabold text-default-800 mb-2">
        Text Compare
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
                Original text
              </span>
              <Button
                variant="secondary"
                size="lg"
                className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                onClick={OnClearOriginalText}
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
                options={options}
                defaultValue={getOriginalText()}
                onMount={HandleOriginalTextDidMount}
              />
            </div>
          </div>

          <div className="flex items-center justify-center px-2 py-2 lg:py-0">
            <Button
              variant="secondary"
              size="lg"
              className="hover:bg-gray-200 hover:text-black text-muted-foreground"
              onClick={OnRouteToResultCompare}
            >
              Compare
            </Button>
          </div>

          <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex flex-row items-center mb-2 justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Modified text
              </span>
              <Button
                variant="secondary"
                size="lg"
                className="hover:bg-gray-200 hover:text-black text-muted-foreground"
                onClick={OnClearModifiedText}
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
                options={options}
                defaultValue={getModifiedText()}
                onMount={HandleModifiedTextDidMount}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
};

export default Differ;
