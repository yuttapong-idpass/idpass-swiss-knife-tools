import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { useRef } from "react";

const Differ = () => {
  const editorRef = useRef(null);
  const options = {
    minimap: {
      enabled: false,
    },
    fontSize: 14, // You can add other options here too
  };

  function handleOriginalTextMount(editor: any, monaco: any) {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();

      if (value === "") {
        monaco.editor.setModelMarkers(editor.getModel(), "json", []);
        return;
      }

      try {
        JSON.parse(value);
        // Clear markers if valid
        monaco.editor.setModelMarkers(editor.getModel(), "json", []);
      } catch (err: any) {
        // Show red underline
        monaco.editor.setModelMarkers(editor.getModel(), "json", [
          {
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
            message: err.message,
            severity: monaco.MarkerSeverity.Error,
          },
        ]);
        // Show visible error message
      }
    });
  }

  function handleModifiedTextMount(editor: any, monaco: any) {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();

      if (value === "") {
        monaco.editor.setModelMarkers(editor.getModel(), "json", []);
        return;
      }

      try {
        JSON.parse(value);
        // Clear markers if valid
        monaco.editor.setModelMarkers(editor.getModel(), "json", []);
      } catch (err: any) {
        // Show red underline
        monaco.editor.setModelMarkers(editor.getModel(), "json", [
          {
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
            message: err.message,
            severity: monaco.MarkerSeverity.Error,
          },
        ]);
        // Show visible error message
      }
    });
  }

  return (
    <main className="grid grid-cols-9 items-center">
      <div className="w-full col-span-4 p-2">
        <p className="text-xl font-extrabold text-default-800">Text Compare</p>
        <div className="mt-2">
          <div className="flex flex-col justify-between gap-2 w-full">
            <div className="flex flex-row gap-2 h-4 justify-between">
              <span>Original text</span>
              <div className="flex flex-row gap-2 justify-center items-center"></div>
            </div>
            <div>
              <Editor
                height="89vh" // By default, it takes 100% of the parent, so make sure the parent has height.
                theme="vs-dark" // 'light' or 'vs-dark'
                options={options}
                onMount={handleOriginalTextMount}
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
        >
          Find Diff
        </Button>
      </div>
      <div className="w-full col-span-4 p-2">
        <div className="mt-2">
          <div className="flex flex-col justify-between gap-2 w-full">
            <div className="flex flex-row gap-2 h-4 justify-between">
              <span>Modified text</span>
              <div className="flex flex-row gap-2 justify-center items-center"></div>
            </div>
            <div>
              <Editor
                height="89vh" // By default, it takes 100% of the parent, so make sure the parent has height.
                theme="vs-dark" // 'light' or 'vs-dark'
                options={options}
                onMount={handleModifiedTextMount}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Differ;
