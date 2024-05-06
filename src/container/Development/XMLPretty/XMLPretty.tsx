import React, { useCallback, useState, useContext } from "react";
import { ThemeContext } from "../../../providers/ThemeProvider";
import { xmlLanguage } from "@codemirror/lang-xml";
import { githubDark, githubLight } from "@uiw/codemirror-themes-all";
import { toast } from "react-toastify";

import ReactCodeMirror from "@uiw/react-codemirror";
import xml2js from "xml2js";

import "./XMLPretty.css";
import ToastNotify from "../../../components/ToastNotify/ToastNotify";

type Props = {};

export default function XMLPretty({}: Props) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

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
    <section className="w-full p-2 gap-2 bg-primary">
      <ToastNotify />
      <div className="grid grid-cols-7">
        <div className="col-span-3">
          <div className="flex flex-col">
            <div>
              <span className="text-lg font-medium text-primary">Input</span>
            </div>
            <div>
              <ReactCodeMirror
                value={input}
                height="95vh"
                theme={isDark ? githubDark : githubLight}
                extensions={[xmlLanguage]}
                onChange={handleInput}
                className="test-wrap shadow-lg border border-1 dark:border-0"
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="grid place-items-center h-[95vh]">
            <div>
              <button
                title="xml pretty"
                className="inline-flex w-full items-center justify-center px-4 py-2 text-base font-medium text-[#ffffff] dark:text-dark-300 whitespace-no-wrap bg-success rounded-md shadow-sm bg-lime-500 hover:bg-lime-400 dark:bg-lime-300 dark:hover:bg-lime-500"
                onClick={onPrettyXml}
              >
                Pretty
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="flex flex-col">
            <div>
              <span className="text-lg font-medium text-primary">Output</span>
            </div>
            <div>
              <ReactCodeMirror
                value={output}
                height="95vh"
                theme={isDark ? githubDark : githubLight}
                extensions={[xmlLanguage]}
                onChange={handleOutput}
                className="test-wrap shadow-lg border border-1 dark:border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
