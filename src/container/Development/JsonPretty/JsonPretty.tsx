import React, { createRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useAppDispatch } from "../../../store/store";
// import useJsonPrettyStore from "../../../store/jsonPrettyStore";
import "./JsonPretty.css";

import JsonEditorInput from "./JSONEditor/JsonEditorInput";
import JsonEditorOutput from "./JSONEditor/JsonEditorOutput";
import _ from "lodash";
import useJsonPrettyStore from "../../../store/jsonPrettyStore";
type Props = {};

const JsonPretty = (props: Props) => {
  const { input, output, setJsonInput, setJsonOutput } = useJsonPrettyStore();

  const handleJsonInput = (text: any) => {
    setJsonInput(text);
  };

  const onClickPretty = () => {
    setJsonOutput(input);
  };

  const handleError = (text: any) => {};

  return (
    <section className="w-full p-2 gap-2 bg-primary">
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
          <JsonEditorOutput text={output} onError={handleError} />
        </div>
      </div>
    </section>
    // <div className="flex flex-row w-full gap-2 bg-primary">
    //   <div className="flex-initial w-full">
    //     <JsonEditorInput onError={handleError} onChangeText={handleJsonInput} />
    //   </div>
    //   <div className="flex-initial w-80">
    //     <div className="grid place-items-center h-[98vh] ">
    //       <div>
    //         <button
    //           title="Pretty json"
    //           className="
    //           inline-flex
    //           w-full
    //           item-centers
    //           justify-center
    //           px-4
    //           py-2
    //           text-base
    //           font-medium
    //           leading-6
    //           text-[#ffffff]
    //           dark:text-dark-300
    //           whitespace-no-wrap
    //           bg-success
    //           rounded-md
    //           shadow-sm
    //           bg-lime-500
    //           hover:bg-lime-400
    //           dark:bg-lime-300
    //           dark:hover:bg-lime-500
    //           "
    //           onClick={onClickPretty}
    //         >
    //           Pretty
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="flex-initial w-full">
    //     <JsonEditorOutput text={output} onError={handleError} />
    //   </div>
    // </div>
  );
};

export default JsonPretty;
