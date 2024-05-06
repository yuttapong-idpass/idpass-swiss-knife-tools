import React, { SyntheticEvent, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import "./JsonDiff.css";
import * as diff from "diff";
import ReactCodeMirror from "@uiw/react-codemirror";
import { githubDark } from "@uiw/codemirror-themes-all";
import { xmlLanguage } from "@codemirror/lang-xml";

// import { Differ } from 'json-diff-kit';
// import "json-diff-kit/dist/viewer.css";

type Props = {};

interface IJsonDiff {
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
const initialDiff: IJsonDiff[] = [];

const JsonDiff = (props: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IForm>();

  const [color, setColor] = useState("");
  const [diffData, setDiffData] = useState(initialDiff);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {}, []);
  const onDiffJson = () => {
    setDiffData([]);
    try {
      const diffs = diff.diffJson(
        JSON.parse(getValues("input1")),
        JSON.parse(getValues("input2"))
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
    } catch (error) {
      setIsError(true);
      setErrorMessage("Invalid json");
    }
  };

  const onSubmit: SubmitHandler<IForm> = (data) => {
    setValue("input1", data.input1);
    setValue("input2", data.input2);
    onDiffJson();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-primary w-full flex flex-col p-2"
    >
      <div>
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
                id="input1"
                // value={input1}
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
                {...register("input1", {
                  required: true,
                })}
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
                id="input2"
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
                {...register("input2", {
                  required: true,
                })}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex-col mt-3">
          <div>
            <label
              htmlFor="Result"
              className="text-lg font-medium text-primary"
            >
              Result
            </label>
          </div>
          <div>
            <pre
              id="display"
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
              {diffData.map((item: any, index: any) => (
                <div key={index}>
                  <span className={`${item.color}`}>{item.value}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </form>
  );
};

export default JsonDiff;
