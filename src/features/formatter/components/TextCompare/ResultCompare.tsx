import { lazy, Suspense } from "react";
import useTextCompareStore from "../../stores/useTextCompare.store";

const DiffEditor = lazy(() =>
  import("@monaco-editor/react").then((mod) => ({ default: mod.DiffEditor }))
);
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ResultCompare = () => {
  const { getOriginalText, getModifiedText }: any = useTextCompareStore();
  const navigate = useNavigate();
  const options = {
    minimap: {
      enabled: false,
    },
    fontSize: 14, // You can add other options here too
    readOnly: true,
  };

  function OnBackToDiffer() {
    navigate("/text-compare/differ");
  }

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-default-800 mb-2">Result</p>
      <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-5rem)] text-muted-foreground">Loading editor...</div>}>
      <div className="flex flex-col gap-2 h-auto lg:h-[calc(100vh-5rem)]">
        <div className="flex flex-row items-center mb-2 justify-between">
          <span>Diff View</span>
          <Button
            variant="secondary"
            size="lg"
            className="hover:bg-gray-200 hover:text-black"
            onClick={OnBackToDiffer}
          >
            <ArrowLeft /> Back
          </Button>
        </div>
        <div className="flex-1 min-h-[400px] lg:min-h-0">
          <DiffEditor
            height="100%"
            language="text"
            original={getOriginalText()}
            modified={getModifiedText()}
            theme="vs-dark"
            options={options}
          />
        </div>
      </div>
      </Suspense>
    </main>
  );
};

export default ResultCompare;
