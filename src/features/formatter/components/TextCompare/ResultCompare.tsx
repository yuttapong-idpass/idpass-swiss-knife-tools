import { DiffEditor } from "@monaco-editor/react";
const ResultCompare = () => {
  const options = {
    minimap: {
      enabled: false,
    },
    fontSize: 14, // You can add other options here too
  };
  return (
    <main className="grid items-center">
      <div className="w-full p-2">
        <p className="text-xl font-extrabold text-default-800">
          Result Compare
        </p>
        <div className="mt-2">
          <div className="flex flex-col justify-between gap-2 w-full">
            <div className="flex flex-row gap-2 h-4 justify-between">
              <span>Original text</span>
              <div className="flex flex-row gap-2 justify-center items-center">
                xxx
              </div>
            </div>
            <div>
              <DiffEditor
                height="89vh"
                language="text"
                original="Original Text"
                modified="Modified Text"
                theme="vs-dark"
                options={options}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResultCompare;
