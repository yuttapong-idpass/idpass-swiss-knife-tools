import { DiffEditor } from "@monaco-editor/react";
import useTextCompareStore from "../../stores/useTextCompareStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
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

  function onBackToDiffer() {
    navigate("/text-compare/differ");
  }

  return (
    <main className="grid items-center">
      <div className="w-full p-2">
        <p className="text-xl font-extrabold text-default-800">Result</p>
        <div className="mt-2">
          <div className="flex flex-col justify-start w-full">
            <div className="flex flex-row gap-2 h-4 mt-3 mb-3 justify-end">
              <div className="flex flex-row gap-2 mb-4 justify-center items-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black"
                  onClick={onBackToDiffer}
                >
                  <Trash />
                </Button>
              </div>
            </div>
            <div>
              <DiffEditor
                height="86vh"
                language="text"
                original={getOriginalText()}
                modified={getModifiedText()}
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
