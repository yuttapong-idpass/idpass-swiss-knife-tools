import React, { createRef, useEffect, useState } from "react";
import FullScreenImage from "../../assets/images/full-screen.png";
import ExitFullScreenImage from "../../assets/images/exit-fullscreen.png";
import CopyToClipboardImage from "../../assets/images/copy-to-clipboard.png";
import { useSelector } from "react-redux";
import {
  jsonPrettySelector,
  inputJson,
} from "./../../store/slice/JsonPrettySlice";
import { counterSelector, increase } from "../../store/slice/counterSlice";
import { useAppDispatch } from "../../store/store";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Highlighter from "react-highlight-words";
import "./JsonPretty.css";
import ReactJson from "react-json-view";

import JsonEditorInput from "./JSONEditor/JsonEditorInput";
import JsonEditorOutput from "./JSONEditor/JsonEditorOutput";

type Props = {};



const JsonPretty = (props: Props) => {

  

  const jsonPrettyReducer = useSelector(jsonPrettySelector);
  const counterReducer = useSelector(counterSelector);
  const dispatch = useAppDispatch();


  let containerInput: any = createRef<HTMLElement>();
  let containerOutput: any = createRef<HTMLElement>();

  let [resultInput, setResultInput] = useState({});
  let [resultOutput, setResultOutput] = useState({});


  const handleJsonInput = (event: any) => { 
    console.log('json change', event);
    setResultInput(event);
  }

  const handleJsonOutput = (event: any) => { 
    console.log('json change output', event);
    setResultOutput(event);
  }

  const onClickPretty = () => {
    const ss = resultInput;
    setResultOutput(ss);
  }

  return (
    <div className="container p-3">
      <div className="max-w-7xl mx-auto grid grid-cols-12 bg-gray-200">
        <div className="col-span-5 h-screen">
          <JsonEditorInput  options={{}} json={resultInput} onChangeJSON={handleJsonInput}/>
        </div>
        <div className="col-span-2 bg-gray-300">
          <button type="button" onClick={onClickPretty}>Click</button>

        </div>
        <div className="col-span-5">
         <JsonEditorOutput  options={{}} json={resultOutput} onChangeJSON={handleJsonOutput} />
        </div>
      </div>
    </div>
  );
};

export default JsonPretty;
