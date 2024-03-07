import React, { createRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  jsonPrettySelector,
  jsonData,
} from "./../../store/slice/JsonPrettySlice";
import { useAppDispatch } from "../../store/store";
import "./JsonPretty.css";

import JsonEditorInput from "./JSONEditor/JsonEditorInput";
import JsonEditorOutput from "./JSONEditor/JsonEditorOutput";

type Props = {};

const JsonPretty = (props: Props) => {
  const jsonPrettyReducer = useSelector(jsonPrettySelector);
  const dispatch = useAppDispatch();

  let containerInput: any = createRef<HTMLElement>();
  let containerOutput: any = createRef<HTMLElement>();

  let [resultInput, setResultInput] = useState("");

  const handleJsonInput = (event: any) => {
    setResultInput(event);
  };

  const handleJsonOutput = (event: any) => {
  };

  const handleError = ($event: any) => {
    console.log("error", $event);
  };

  const onClickPretty = () => {
    try {
      const data = JSON.parse(resultInput);
      dispatch(jsonData({ data: data }));
    } catch (error) {
      console.log("error ->", error);
    }
  };

  return (
    <div className="flex flex-row w-full gap-4">
      <div className="flex-initial w-full">
        <JsonEditorInput
          json={jsonPrettyReducer.data}
          onError={handleError}
          onChangeJSON={handleJsonInput}
          container={containerInput}
        />
      </div>
      <div className="flex-initial w-80">
        <div className="grid place-items-center h-[98vh]">
          <div>
            <button
              title="Pretty json"
              className="inline-flex w-full item-centers justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-[#38b000] rounded-md shadow-sm hover:bg-[#73DF5C]"
              onClick={onClickPretty}
            >
              Pretty
            </button>
          </div>
        </div>
      </div>
      <div className="flex-initial w-full">
        <JsonEditorOutput
          json={jsonPrettyReducer.data}
          onError={handleError}
          onChangeJSON={handleJsonOutput}
          container={containerOutput}
        />
      </div>
    </div>
  );
};

export default JsonPretty;
