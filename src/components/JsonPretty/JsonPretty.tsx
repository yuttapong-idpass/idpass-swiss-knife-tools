import React, { createRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store";
import "./JsonPretty.css";

import {
  jsonPrettyInputSelector,
  inputData,
} from "../../store/slice/JsonPrettySlice";

import {
  jsonPrettyOutputSelector,
  outputData,
} from "../../store/slice/JsonPrettySlice";

import JsonEditorInput from "./JSONEditor/JsonEditorInput";
import JsonEditorOutput from "./JSONEditor/JsonEditorOutput";
import _ from "lodash";

type Props = {};

const JsonPretty = (props: Props) => {
  const jsonPrettyInputReducer = useSelector(jsonPrettyInputSelector);
  const jsonPrettyOutputReducer = useSelector(jsonPrettyOutputSelector);

  const dispatch = useAppDispatch();

  let containerInput: any = createRef<HTMLElement>();
  let containerOutput: any = createRef<HTMLElement>();

  const handleJsonInput = (text: any) => {
    dispatch(inputData({ input: text }));
  };

  const handleJsonInputFromFile = (text: any) => { 
    dispatch(inputData({ input: text }));
  }

  const handleError = (text: any) => {
    console.log('error json editor ->', text);
  };
  const onClickPretty = () => {
    try {
      dispatch(
        outputData({ output: JSON.parse(jsonPrettyInputReducer.input.input) })
      );
    } catch (error) {
      console.log("error ->", error);
    }
  };

  return (
    <div className="flex flex-row w-full gap-4">
      <div className="flex-initial w-full">
        <JsonEditorInput
          onError={handleError}
          container={containerInput}
          onChangeText={handleJsonInput}
          onChangeTextFromFile={handleJsonInputFromFile}
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
          text={jsonPrettyOutputReducer.output.output}
          onError={handleError}
          container={containerOutput}
        />
      </div>
    </div>
  );
};

export default JsonPretty;
