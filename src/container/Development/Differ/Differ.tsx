import React, {
  SyntheticEvent,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import "./Differ.css";
import * as diff from "diff";
import ReactCodeMirror from "@uiw/react-codemirror";
import { githubDark, githubLight } from "@uiw/codemirror-themes-all";
import { ThemeContext } from "../../../providers/ThemeProvider";

// import { Differ } from 'json-diff-kit';
// import "json-diff-kit/dist/viewer.css";

type Props = {};

interface IDiffer {
  color: string;
  value: string;
  count: number | undefined;
  added: boolean | undefined;
  remove: boolean | undefined;
}

interface IForm {
  input1: string;
  input2: string;
}

const initialInput1: any = "";
const initialInput2: any = "";
const initialDiff: IDiffer[] = [];

export default function Differ(props: Props) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [firstPanel, setFirstPanel] = useState("");
  const [secondPanel, setSecondPanel] = useState("");
  const [result, setResult] = useState("");
  const [color, setColor] = useState("");
  const [diffData, setDiffData] = useState(initialDiff);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
  }, []);

  const onDiffJson = () => {
    setDiffData([]);
    // try {
    const diffs = diff.diffJson(
      // JSON.parse(firstPanel),
      // JSON.parse(secondPanel)
      firstPanel,
      secondPanel
    );
    diffs.forEach((part) => {
      const color = part.added
        ? "added-color"
        : part.removed
        ? "remove-color"
        : "text-primary";
      const data = {
        added: part.added,
        count: part.count,
        remove: part.removed,
        value: part.value,
        color: color,
      };
      setDiffData((prevItem: any) => [...prevItem, data]);
      setIsError(false);
      setErrorMessage("");
    });
    // } catch (error) {
    //   setIsError(true);
    //   setErrorMessage("Invalid json");
    // }
  };

  const handleFirst = useCallback(
    (value: any) => {
      setFirstPanel(value);
    },
    [firstPanel]
  );

  const handleSecond = useCallback(
    (value: any) => {
      setSecondPanel(value);
    },
    [secondPanel]
  );

  function renderLineNumbers(pre: any) {
    var offsetTop = window
      .getComputedStyle(pre, null)
      .getPropertyValue("padding-top");

    pre.classList.add("line-numbers-code");

    // Add class after clone
    var wrapper = document.createElement("pre");
    wrapper.classList.add("line-numbers-wrapper");

    // Create line numbers
    var lines = pre.innerHTML.split("\n");

    if (lines[lines.length - 1] === "</code>") {
      var closingTag = lines.pop();
      lines[lines.length - 1] += closingTag;
    }

    wrapper.innerHTML =
      "<code>" +
      lines
        .map(function (_: any, i: any) {
          return padLeft(i + 1 + "│", 4);
        })
        .join("\n") +
      "</code>";
    pre.style.top = offsetTop; // Offset clone by whatever padding you have set in app

    pre.parentNode.replaceChild(wrapper, pre);
    wrapper.appendChild(pre);
  }

  function padLeft(str: any, l: any) {
    return Array(l - str.length + 1).join(" ") + str;
  }

  return (
    <section className="w-full p-2 gap-2 bg-primary">
      <p className="text-xl font-bold underline underline-offset-1 text-primary">
        Code Differ
      </p>
      <div className="grid grid-rows-2 mt-5">
        <div className="row-span-1 h-[40vh]">
          <div className="grid grid-cols-7">
            <div className="col-span-3">
              <div className="flex flex-col">
                <div>
                  <span className="text-md font-bold text-primary">
                    Input 1
                  </span>
                </div>
                <div>
                  <ReactCodeMirror
                    value={firstPanel}
                    height="40vh"
                    theme={isDark ? githubDark : githubLight}
                    onChange={handleFirst}
                    className="shadow-lg border border-1 dark:border-0 text-base"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="grid place-items-center h-[40vh]">
                <div>
                  <button
                    title="xml pretty"
                    className="inline-flex w-full items-center justify-center px-4 py-2 text-base font-medium text-[#ffffff] dark:text-dark-300 whitespace-no-wrap bg-success rounded-md shadow-sm bg-lime-500 hover:bg-lime-400 dark:bg-lime-300 dark:hover:bg-lime-500"
                    onClick={onDiffJson}
                  >
                    Pretty
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex flex-col">
                <div>
                  <span className="text-md font-bold text-primary">
                    Input 2
                  </span>
                </div>
                <div>
                  <ReactCodeMirror
                    value={secondPanel}
                    height="40vh"
                    theme={isDark ? githubDark : githubLight}
                    onChange={handleSecond}
                    className="shadow-lg text-base border border-1 dark:border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-1">
          <div className="bg-secondary mt-2 h-[45vh] code-panel">
            <pre>
              <code>{diffData.map((data: any, index: number) => (<p key={index}>{data.value}</p>))}</code>
            </pre>
          </div>
          {/* {diffData.map((item: any, index: any) => (
            <div key={index}>
              <span className={`${item.color}`}>{item.value}</span>
            </div>
          ))} */}
          {/* <div className="holder">
            <div>
              <pre id="lines"></pre>
            </div>
            <div>
              <pre id="code">
                {diffData.map((item: any, index: any) => (
                  <div key={index}>
                    <span className={`${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </pre>
            </div>
          </div> */}
          {/* <div className="flex flex-col">
            <div>
              <span className="text-md font-bold text-primary">Result</span>
            </div>
            <div className="bg-secondary code-panel">
              <div className="holder">
                <div className={` ${ diffData.length > 0 ? 'border-r-2' : '' } text-primary h-[44vh] p-2 `}>
                  {diffData.map((item: any, index: any) => (
                    <pre id="lines" className="" key={index}>
                      {index + 1}
                    </pre>
                  ))}
                </div>
                <div className="p-2">
                  {diffData.map((item: any, index: any) => (
                    <pre id="lines" className={`${item.color}`} key={index}>
                      {item.value}
                    </pre>
                  ))}
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

const TextWithLineNumbers = ({ text }: any) => {
  const lines = text.split("\n");

  return (
    <div>
      {lines.map((line: any, index: any) => (
        <div key={index}>
          <span>{index + 1}</span>
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
};
