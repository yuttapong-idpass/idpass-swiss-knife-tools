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
      <div className="grid grid-cols-9 mt-5">
        <div className="col-span-4">
          <div className="flex flex-col w-full">
            <div>
              <span className="
                text-md 
                font-semibold 
                text-primary">
                Input
              </span>
            </div>
            <div>
              <ReactCodeMirror
                value={input}
                height="90vh"
                theme={isDark ? githubDark : githubLight}
                extensions={[xmlLanguage]}
                className="shadow-lg text-base border border-1 dark:border-0"
                onChange={handleInput}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="grid place-items-center h-[90vh]">
            <div>
              <button
                title="xmlJson"
                className="inline-flex w-full items-center justify-center px-4 py-2 
                text-base 
                font-bold 
                text-primary 
                whitespace-no-wrap 
                bg-success 
                rounded-md 
                shadow-sm 
                bg-violet-400
                text-white
                dark:bg-yellow-500
                dark:text-[#2d3748]
                "
                onClick={onConvertToJson}
              >
                Convert
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-4">
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
                className="shadow-lg text-base border border-1 dark:border-0"
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
