import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useTextCompareStore from "@/features/formatter/stores/useTextCompareStore";
import { Eraser } from "lucide-react";

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

  function onRouteToResultCompare() {
    navigate("/text-compare/result-compare");
  }

  function handleOriginalTextDidMount(editor: any, monaco: any) {
    editorOriginalTextRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setOriginalText(value);
    });
  }

  function handleModifiedTextDidMount(editor: any, monaco: any) {
    editorModifiedTextRef.current = editor;
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setModifiedText(value);
    });
  }

  function onClearOriginalText() {
    if (editorOriginalTextRef.current) {
      editorOriginalTextRef.current.setValue("");
      setOriginalText("");
    }
  }

  function onClearModifiedText() {
    if (editorModifiedTextRef.current) {
      editorModifiedTextRef.current.setValue("");
      setModifiedText("");
    }
  }

  return (
    <main className="">
      <div>
        <p className="text-xl font-extrabold text-default-800">Text Compare</p>
        <div className="grid grid-cols-9 items-center">
          <div className="w-full col-span-4 p-2">
            <div className="mt-2">
              <div className="flex flex-col justify-between gap-2 w-full">
                <div className="flex flex-row gap-2 h-4 mt-3 mb-3 justify-between">
                  <span>Original text</span>
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="hover:bg-gray-200 hover:text-black"
                      onClick={onClearOriginalText}
                    >
                      <Eraser />
                    </Button>
                  </div>
                </div>
                <div>
                  <Editor
                    height="89vh" // By default, it takes 100% of the parent, so make sure the parent has height.
                    theme="vs-dark" // 'light' or 'vs-dark'
                    options={options}
                    defaultValue={getOriginalText()}
                    onMount={handleOriginalTextDidMount}
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
              onClick={onRouteToResultCompare}
            >
              Find Diff
            </Button>
          </div>
          <div className="w-full col-span-4 p-2">
            <div className="mt-2">
              <div className="flex flex-col justify-between gap-2 w-full">
                <div className="flex flex-row gap-2 h-4 mt-3 mb-3 justify-between">
                  <span>Modified text</span>
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="hover:bg-gray-200 hover:text-black"
                      onClick={onClearModifiedText}
                    >
                      <Eraser />
                    </Button>
                  </div>
                </div>
                <div>
                  <Editor
                    height="89vh" // By default, it takes 100% of the parent, so make sure the parent has height.
                    theme="vs-dark" // 'light' or 'vs-dark'
                    options={options}
                    defaultValue={getModifiedText()}
                    onMount={handleModifiedTextDidMount}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Differ;
