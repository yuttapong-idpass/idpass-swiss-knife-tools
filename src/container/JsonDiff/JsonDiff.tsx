import React, { SyntheticEvent, useState, useEffect } from "react";
import "./JsonDiff.css";

import * as diff from "diff";

// import { Differ } from 'json-diff-kit';

import { Differ, Viewer } from "json-diff-kit";
import type { DiffResult } from "json-diff-kit";

import "json-diff-kit/dist/viewer.css";

type Props = {};

interface IJsonDiff {
  color: string;
  value: string;
  count: number | undefined;
  added: boolean | undefined;
  remove: boolean | undefined;
}

let initialResult: [DiffResult[], DiffResult[]];
const initialInput1: any = JSON.stringify({});
const initialInput2: any = JSON.stringify({});

const JsonDiff = (props: Props) => {
  const d = new Differ({
    detectCircular: true,
    maxDepth: undefined,
    showModifications: true,
    arrayDiffMethod: "lcs",
    ignoreCase: false,
    recursiveEqual: true,
  });

  const [color, setColor] = useState("");
  const [diff, setDiff] = useState(d.diff("", ""));
  const [input1, setInput1] = useState(initialInput1);
  const [input2, setInput2] = useState(initialInput2);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const differ = new Differ({
  //   detectCircular: true,
  //   arrayDiffMethod: 'lcs'
  // });

  useEffect(() => {}, []);
  const handleInput1 = ($event: SyntheticEvent<EventTarget>) => {
    const input1 = ($event.target as HTMLInputElement).value;
    setInput1(input1);
  };

  const handleInput2 = ($event: SyntheticEvent<EventTarget>) => {
    const input2 = ($event.target as HTMLInputElement).value;
    setInput2(input2);
  };

  const viewerProps = {
    indent: 4,
    lineNumbers: true,
    highlightInlineDiff: false,
    inlineDiffOptions: {
      mode: "word",
      wordSeparator: " ",
    },
    hideUnchangedLines: true,
    syntaxHighlight: false,
    virtual: false,
  };

  const onCompare = () => {
    try {
      let diff = d.diff(JSON.parse(input1), JSON.parse(input2));
      setDiff(diff);

      setIsError(false);
      setErrorMessage("");
    } catch (error) {
      setIsError(true);
      setErrorMessage("Invalid json");
    }
  };

  return (
    <div className="bg-primary w-full flex flex-col p-2">
      <div className="h-1/2 flex flex-row gap-2">
        <div className="flex-initial w-full">
          <div>
            <label
              htmlFor="Input 1"
              className="text-lg font-medium text-primary"
            >
              Input 1
            </label>
          </div>
          <div>
            <textarea
              name="input1"
              id="input1"
              value={input1}
              placeholder="Enter your json  here..."
              className="
            block 
            p-4      
            mt-3  
            w-full
            h-[45vh]
            text-md
            text-primary
            shadow-md
            rounded-md
            bg-secondary  
          "
              onChange={handleInput1}
            ></textarea>
          </div>
        </div>
        <div className="flex-initial w-80">
          <div className="flex flex-col h-[45vh]">
            <div className="basis-1/4 items-end m-auto">
              {isError ? (
                <div>
                  <div className="p-4 bg-red-200 border border-1 border-red-500">
                    <span className="font-bold text-red-600 items-center">
                      {errorMessage}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="basis-1/2  items-end m-auto">
              <button
                title="Generate"
                className="              
              inline-flex 
              w-full 
              text-center
              items-center
              justify-center 
              p-3
              font-medium 
              leading-6 
              whitespace-no-wrap 
              rounded-md 
              shadow-sm
              text-[#ffffff]
              bg-cyan-400
              hover:bg-cyan-400
              dark:bg-cyan-300
              dark:hover:bg-cyan-400
              dark:text-dark-300
              "
                onClick={onCompare}
              >
                Compare
              </button>
            </div>
          </div>
          <div></div>
        </div>
        <div className="flex-initial w-full">
          <div>
            <label
              htmlFor="Input 2"
              className="text-lg font-medium text-primary"
            >
              Input 2
            </label>
          </div>
          <div>
            <textarea
              name="input2"
              id="input2"
              value={input2}
              rows={15}
              placeholder="Enter your json  here..."
              className="
            block 
            p-4 
            mt-3       
            w-full
            text-md
            text-primary
            h-[45vh]
            shadow-lg
            rounded-md
            bg-secondary  
          "
              onChange={handleInput2}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="flex-col mt-3">
        <div>
          <label htmlFor="Result" className="text-lg font-medium text-primary">
            Result
          </label>
        </div>
        <div>
          <div
            id="result"
            className="
              mt-3
              p-4
              w-full 
              block
              text-md
              text-primary
              shadow-lg
              rounded-md
              bg-secondary
              h-[43vh]
            "
          >
            <Viewer 
                diff={diff}  
                indent={4}
                lineNumbers={true}
                highlightInlineDiff={false}
                inlineDiffOptions = {{
                  mode: "word",
                  wordSeparator: " ",
                }}
                hideUnchangedLines={true}      
                className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonDiff;
