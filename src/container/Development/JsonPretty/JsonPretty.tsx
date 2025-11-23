import React, { createRef, useEffect, useState } from "react";
import "./JsonPretty.css";

import JsonEditorInput from "./page/JsonEditorInput";
import JsonEditorOutput from "./page/JsonEditorOutput";
import { useAppDispatch } from "../../../store/store";
import { useSelector } from "react-redux";
import {
  jsonPrettySelector,
  setJson,
} from "../../../store/slice/jsonPrettySlice";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
type Props = {};

const JsonPretty = (props: Props) => {
  const dispatch = useAppDispatch();
  const jsonPrettyReducer: any = useSelector(jsonPrettySelector);

  const [inputText, setInputText] = useState({
    json: undefined,
    text: undefined,
  });
  const [outputText, setOutputText] = useState({
    json: undefined,
    text: undefined,
  });
  const handleJsonInput = (text: any) => {
    setInputText(text);
    console.log("text", text);
  };

  const handleJsonOutput = (text: string) => {
    // setOutputText(text);
  };

  const onSetJsonPretty = () => {
    dispatch(setJson({ data: inputText }));
  };

  const handleError = (text: any) => {};

  return (
    <main className="w-full p-2 gap-2">
      <p className="text-xl font-extrabold text-default-800">JSON Format</p>
      <div className="grid grid-cols-9 items-center">
        <div className="w-full col-span-4 p-2">
          <JsonEditorInput
            onError={handleError}
            onChangeText={handleJsonInput}
          />
        </div>

        <div className="w-full flex col-span-1 p-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            className="hover:bg-gray-200 hover:text-black"
          >
            Format <ArrowRight />
          </Button>
        </div>

        <div className="w-full col-span-4 p-4">
          <JsonEditorOutput
            content={jsonPrettyReducer.data.data}
            readOnly={true}
          />
        </div>
      </div>
    </main>
  );
};

export default JsonPretty;
