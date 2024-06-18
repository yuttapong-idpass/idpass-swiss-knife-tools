import React, { createRef, useEffect, useState } from "react";
import "./JsonPretty.css";

import JsonEditorInput from "./JSONEditor/JsonEditorInput";
import JsonEditorOutput from "./JSONEditor/JsonEditorOutput";
type Props = {};

const JsonPretty = (props: Props) => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const handleJsonInput = (text: string) => {
    setInputText(text);
  };

  const handleJsonOutput = (text: string) => {
    setOutputText(text);
  };

  const onClickPretty = () => {
    setOutputText(inputText);
  };

  const handleError = (text: any) => {};

  return (
    <main className="w-full p-2 gap-2 bg-primary">
      <p className="text-xl font-bold underline underline-offset-1 text-primary">
        Json Pretty
      </p>
      <div className="grid grid-cols-9 mt-5">
        <div className="col-span-4">
          <JsonEditorInput
            onError={handleError}
            onChangeText={handleJsonInput}
          />
        </div>
        <div className="col-span-1">
          <div className="grid place-items-center h-[92vh]">
            <div>
              <button
                title="pretty"
                id="pretty"
                name="pretty"
                className="inline-flex 
                w-full 
                items-center 
                justify-center px-4 py-2 text-base font-bold whitespace-no-wrap bg-success rounded-md shadow-sm
                bg-violet-400
                text-white
                dark:bg-yellow-500
                dark:text-[#2d3748]
                "
                onClick={onClickPretty}
              >
                Format
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <JsonEditorOutput
            text={outputText}
            onError={handleError}
            onChangeText={handleJsonOutput}
          />
        </div>
      </div>
    </main>
  );
};

export default JsonPretty;
