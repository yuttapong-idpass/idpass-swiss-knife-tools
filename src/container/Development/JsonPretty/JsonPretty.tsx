import React, { createRef, useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import "./JsonPretty.css";

import JsonEditorInput from "./JSONEditor/JsonEditorInput";
import JsonEditorOutput from "./JSONEditor/JsonEditorOutput";
type Props = {};

const JsonPretty = (props: Props) => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [content, setContent] = useState({
    json: {
      greeting: "Hello World",
      color: "#ff3e00",
      ok: true,
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    },
    text: undefined,
  });
  const handleJsonInput = (text: any) => {
    // setInputText(text);
  };

  const handleJsonOutput = (text: string) => {
    setOutputText(text);
  };

  const onClickPretty = () => {
    setOutputText(inputText);
  };

  const handleError = (text: any) => {};

  return (
    <main className="w-full p-2 gap-2 ">
      <p className="text-xl font-extrabold text-default-800">Json Pretty</p>
      <div className="grid grid-cols-9 mt-3">
        <div className="col-span-4">
          <JsonEditorInput
            onError={handleError}
            onChangeText={handleJsonInput}
          />
        </div>
        <div className="col-span-1">
          <div className="grid place-items-center h-[92vh]">
            <div>
              <Button
                variant="shadow"
                className="text-default-50"
                color="warning"
                radius="sm"
              >
                Format
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <JsonEditorOutput
            // text={outputText}
            // onError={handleError}
            // onChangeText={handleJsonOutput}
          />
        </div>
      </div>
    </main>
  );
};

export default JsonPretty;
