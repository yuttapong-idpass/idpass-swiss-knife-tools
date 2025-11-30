import React, { createRef, useEffect, useState } from "react";
import "@/features/formatter/components/JsonFormatter/JsonFormatter.css";
import JsonEditorInput from "./JsonEditorInput";
import JsonEditorOutput from "./JsonEditorOutput";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import useJsonFormatStore from "@/features/formatter/stores/useJsonFormatStore";
type Props = {};

const JsonFormatter = (props: Props) => {
  const { getInputData, setOutputData }: any = useJsonFormatStore();

  const onClickJsonFormat = () => {
    const data = getInputData();
    setOutputData(data);
  };

  return (
    <main className="w-full p-2 gap-2">
      <p className="text-xl font-extrabold text-default-800">JSON Formatter</p>
      <div className="grid grid-cols-9 items-center">
        <div className="w-full col-span-4 p-2">
          <JsonEditorInput />
        </div>

        <div className="w-full flex col-span-1 p-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            className="hover:bg-gray-200 hover:text-black"
            onClick={onClickJsonFormat}
          >
            Format <ArrowRight />
          </Button>
        </div>

        <div className="w-full col-span-4 p-2">
          <JsonEditorOutput />
        </div>
      </div>
    </main>
  );
};

export default JsonFormatter;
