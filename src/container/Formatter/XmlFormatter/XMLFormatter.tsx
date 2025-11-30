import React, { useCallback, useState, useContext } from "react";
import { xmlLanguage } from "@codemirror/lang-xml";
import { githubDark, githubLight } from "@uiw/codemirror-themes-all";
import { toast } from "react-toastify";

import ReactCodeMirror from "@uiw/react-codemirror";
import xml2js from "xml2js";

import "./XMLFormatter.css";
import ToastNotify from "../../../components/ToastNotify/ToastNotify";

type Props = {};

const XMLFormatter = ({}: Props) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleInput = useCallback(
    (value: any, viewUpdate: any) => {
      setInput(value);
    },
    [input]
  );

  const handleOutput = useCallback(
    (value: any) => {
      setOutput(value);
    },
    [output]
  );

  const onPrettyXml = () => {
    const parser = new xml2js.Parser();
    const removeNewLine = input.replace(/\\n/g, "");
    const removeSlash = removeNewLine.replace(/\\/g, "");
    const domParser = new DOMParser();
    const dom = domParser.parseFromString(removeSlash, "text/xml");

    if (dom.getElementsByTagName("parsererror").length <= 0) {
      parser.parseString(removeSlash.trim(), function (err: any, result: any) {
        const builder = new xml2js.Builder();
        const prettyXml = builder.buildObject(result);
        let lines = prettyXml.split("\n");
        // remove one line, starting at the first position
        lines.splice(0, 1);
        // join the array back into a single string
        let newText = lines.join("\n");
        setOutput(newText);
      });
    } else {
      toast.error("XML Format error!");
    }
  };

  return (
    <section className="w-full p-2 gap-2">
      <ToastNotify />
      <p className="text-xl font-bold underline underline-offset-1 text-primary">
        XML Pretty
      </p>
      <div className="grid grid-cols-9 mt-5">
        <div className="col-span-4">
          <div className="flex flex-col">
            <div>
              <span className="text-md font-bold text-primary">Input</span>
            </div>
            <div>
              <ReactCodeMirror
                value={input}
                height="90vh"
                extensions={[xmlLanguage]}
                onChange={handleInput}
                className="test-wrap text-base shadow-lg border border dark:border-0"
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="grid place-items-center h-[90vh]">
            <div>
              <button
                title="xml pretty"
                className="inline-flex w-full items-center justify-center px-4 py-2 text-base font-bold  
                whitespace-no-wrap 
                rounded-md shadow-xs 
                bg-violet-400
                text-white
                dark:bg-yellow-500
                dark:text-[#2d3748]
                "
                onClick={onPrettyXml}
              >
                Format
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex flex-col">
            <div>
              <span className="text-md font-bold text-primary">Output</span>
            </div>
            <div>
              <ReactCodeMirror
                value={output}
                height="90vh"
                extensions={[xmlLanguage]}
                onChange={handleOutput}
                className="test-wrap text-base shadow-lg border border dark:border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default XMLFormatter;
