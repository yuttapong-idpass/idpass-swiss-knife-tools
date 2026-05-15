import React from "react";
import "@/features/formatter/components/JsonFormatter/JsonFormatter.css";
import JsonEditorInput from "./JsonEditorInput";
import JsonEditorOutput from "./JsonEditorOutput";
import { Button } from "@/components/ui/button";
import useJsonFormatStore from "@/features/formatter/stores/useJsonFormat.store";
type Props = {};

const JsonFormatter = (props: Props) => {
  const { getInputData, setOutputData }: any = useJsonFormatStore();

  const OnClickJsonFormat = () => {
    const data = getInputData();
    setOutputData(data);
  };

  return (
    <main className="p-4 w-full">
      <p className="text-xl font-extrabold text-foreground mb-2">
        JSON Formatter
      </p>
      <div className="flex flex-col lg:flex-row gap-2 h-auto lg:h-[calc(100vh-5rem)]">
        <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0 overflow-hidden">
          <JsonEditorInput />
        </div>

        <div className="flex items-center justify-center px-2 py-2 lg:py-0">
          <Button
            variant="secondary"
            size="lg"
            className="text-muted-foreground hover:text-foreground"
            onClick={OnClickJsonFormat}
          >
            Format
          </Button>
        </div>

        <div className="w-full lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0 overflow-hidden">
          <JsonEditorOutput />
        </div>
      </div>
    </main>
  );
};

export default JsonFormatter;
