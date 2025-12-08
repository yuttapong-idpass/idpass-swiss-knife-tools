import { DiffEditor } from "@monaco-editor/react";
import useTextCompareStore from "../../stores/useTextCompareStore";
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

  function onBackToDiffer() {
    navigate("/text-compare/differ");
  }

  return (
    <main className="grid items-center">
      <div className="w-full p-2">
        <p className="text-xl font-extrabold text-default-800">
          Result Compare
        </p>
        <div className="mt-2">
          <div className="flex flex-col justify-between gap-2 w-full">
            <div className="flex flex-row gap-2 h-4 justify-end">
              {/* <span>Original text</span>
              <div className="flex flex-row gap-2 justify-center items-center">
                {getOriginalText()}
              </div> */}
              <div className="flex flex-row gap-2 mb-4 justify-center items-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:bg-gray-200 hover:text-black"
                  onClick={onBackToDiffer}
                >
                  <ArrowLeft />
                  Back
                </Button>
              </div>
            </div>
            <div>
              <DiffEditor
                height="89vh"
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
