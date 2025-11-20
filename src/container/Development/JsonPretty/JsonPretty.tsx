import React, { createRef, useEffect, useState } from "react";
import "./JsonPretty.css";

import JsonEditorInput from "./JSONEditor/JsonEditorInput";
import JsonEditorOutput from "./JSONEditor/JsonEditorOutput";
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
    <main className="w-full p-3 gap-2">
      <p className="text-xl font-extrabold text-default-800">Json Pretty</p>
      <div className="flex flex-row justify-content items-center">
        <div className="w-full md:flex-1 p-4">
          <JsonEditorInput
            onError={handleError}
            onChangeText={handleJsonInput}
          />
        </div>

        <div className="w-full md:w-32 p-4">
          <Button variant="outline" size="lg">
            Format <ArrowRight />
          </Button>
        </div>

        <div className="w-full md:flex-1 p-4">
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
