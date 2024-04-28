import React, { createRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../store/store";
import "./JsonPretty.css";

import JsonEditorInput from "./JSONEditor/JsonEditorInput";
import JsonEditorOutput from "./JSONEditor/JsonEditorOutput";
import _ from "lodash";

type Props = {};

const JsonPretty = (props: Props) => {
  const [inputJson, setInputJson] = useState(undefined);
  const [outputJson, setOutputJson] = useState(undefined);

  const dispatch = useAppDispatch();

  const handleJsonInput = (text: any) => {
    setInputJson(text);
  };

  const handleError = (text: any) => {};

  const onClickPretty = () => {
    try {
      setOutputJson(inputJson);
    } catch (error) {
      console.log("error ->", error);
    }
  };

  return (
    <div className="flex flex-row w-full gap-2 bg-primary">
      <div className="flex-initial w-full">
        <JsonEditorInput onError={handleError} onChangeText={handleJsonInput} />
      </div>
      <div className="flex-initial w-80">
        <div className="grid place-items-center h-[98vh] ">
          <div>
            <button
              title="Pretty json"
              className="
              inline-flex 
              w-full 
              item-centers 
              justify-center 
              px-4 
              py-2 
              text-base 
              font-medium 
              leading-6 
              text-[#ffffff] 
              dark:text-dark-300
              whitespace-no-wrap 
              bg-success 
              rounded-md 
              shadow-sm
              bg-lime-500
              hover:bg-lime-400
              dark:bg-lime-300
              dark:hover:bg-lime-500
              "
              onClick={onClickPretty}
            >
              Pretty
            </button>
          </div>
        </div>
      </div>
      <div className="flex-initial w-full">
        <JsonEditorOutput text={outputJson} onError={handleError} />
      </div>
    </div>
  );
};

export default JsonPretty;
