import React, {
  useState,
  useEffect,
  useContext,
  SyntheticEvent,
  useCallback,
} from "react";
import "./XMLJson.css";
import xml2js from "xml2js";
import ToastNotify from "../../../components/ToastNotify/ToastNotify";
import { toast } from "react-toastify";
import { ThemeContext } from "../../../providers/ThemeProvider";
import ReactCodeMirror from "@uiw/react-codemirror";
import { githubDark, githubLight } from "@uiw/codemirror-themes-all";
import { xmlLanguage } from "@codemirror/lang-xml";
import { jsonLanguage } from "@codemirror/lang-json";

type Props = {};

const XMLJson = (props: Props) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleInput = useCallback(
    (value: any) => {
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

  const onConvertToJson = () => {
    const parser = new xml2js.Parser();
    const removeNewLine = input.replace(/\\n/g, "");
    const removeSlash = removeNewLine.replace(/\\/g, "");
    const domParser = new DOMParser();
    const dom = domParser.parseFromString(removeSlash, "text/xml");
    if (dom.getElementsByTagName("parsererror").length <= 0) {
      parser.parseString(removeSlash.trim(), function (err: any, result: any) {
        setOutput(JSON.stringify(result, null, 2));
      });
    } else {
      toast.error("XML Format error!");
    }
  };

  return (
    <section className="w-full p-2 gap-2 bg-primary">
      <ToastNotify />
      <p className="text-xl font-bold underline underline-offset-1 text-primary">
        XML To JSON
      </p>
      <div className="grid grid-cols-7 mt-5">
        <div className="col-span-3">
          <div className="flex flex-col w-full">
            <div>
              <span className="text-md font-semibold text-[#ffffff]">
                Input
              </span>
            </div>
            <div>
              <ReactCodeMirror
                value={input}
                height="90vh"
                theme={isDark ? githubDark : githubLight}
                extensions={[xmlLanguage]}
                className="shadow-lg border border-1 dark:border-0"
                onChange={handleInput}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="grid place-items-center h-[90vh]">
            <div>
              <button
                title="xml pretty"
                className="inline-flex w-full items-center justify-center px-4 py-2 text-base font-medium text-[#ffffff] dark:text-dark-300 whitespace-no-wrap bg-success rounded-md shadow-sm bg-lime-500 hover:bg-lime-400 dark:bg-lime-300 dark:hover:bg-lime-500"
                onClick={onConvertToJson}
              >
                Convert
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="flex flex-col">
            <div>
              <span className="text-md font-semibold text-primary">Output</span>
            </div>
            <div>
              <ReactCodeMirror
                value={output}
                height="90vh"
                theme={isDark ? githubDark : githubLight}
                extensions={[jsonLanguage]}
                className="shadow-lg border border-1 dark:border-0"
                onChange={handleOutput}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default XMLJson;
