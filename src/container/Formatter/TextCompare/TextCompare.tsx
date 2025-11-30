import React, {
  SyntheticEvent,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import "./TextCompare.css";
import * as diff from "diff";
import ReactCodeMirror from "@uiw/react-codemirror";
import { githubDark, githubLight } from "@uiw/codemirror-themes-all";
import { Button } from "@/components/ui/button";

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

const TextCompare = (props: Props) => {
  // const [firstPanel, setFirstPanel] = useState("");
  // const [secondPanel, setSecondPanel] = useState("");
  // const [addedCount, setAddedCount] = useState(0);
  // const [removeCount, setRemoveCount] = useState(0);
  // const [resultDiff, setResultDiff] = useState(initialDiff);
  // useEffect(() => {}, []);
  // const onDiffJson = () => {
  //   // try {
  //   const diffs = diff.diffJson(firstPanel, secondPanel);
  //   let sumAddedLine: number = 0;
  //   let sumRemoveLine: number = 0;
  //   const mapDiff = diffs.map((part, index) => {
  //     const color = part.added
  //       ? "added-color"
  //       : part.removed
  //       ? "remove-color"
  //       : "text-primary";
  //     if (part.added) {
  //       sumAddedLine += part.count!;
  //     }
  //     if (part.removed) {
  //       sumRemoveLine += part.count!;
  //     }
  //     if (color === "text-primary") {
  //       sumAddedLine += part.count!;
  //       sumRemoveLine += part.count!;
  //     }
  //     return {
  //       added: part.added,
  //       count: part.count,
  //       remove: part.removed,
  //       value: part.value,
  //       color: color,
  //     };
  //   });
  //   setAddedCount(sumAddedLine);
  //   setRemoveCount(sumRemoveLine);
  //   setResultDiff(mapDiff);
  // };
  // const handleFirst = useCallback(
  //   (value: any) => {
  //     setFirstPanel(value);
  //   },
  //   [firstPanel]
  // );
  // const handleSecond = useCallback(
  //   (value: any) => {
  //     setSecondPanel(value);
  //   },
  //   [secondPanel]
  // );
  // return (
  //   <section className="w-full p-2 gap-2">
  //     <p className="text-xl font-bold underline underline-offset-1 text-primary">
  //       Differ
  //     </p>
  //     <div className="grid grid-rows-2 mt-5">
  //       <div className="row-span-1 h-[40vh]">
  //         <div className="grid grid-cols-9">
  //           <div className="col-span-4">
  //             <div className="flex flex-col">
  //               <div>
  //                 <span className="text-md font-bold text-primary">
  //                   Input 1
  //                 </span>
  //               </div>
  //               <div>
  //                 <ReactCodeMirror
  //                   value={firstPanel}
  //                   height="45vh"
  //                   onChange={handleFirst}
  //                   className="shadow-lg border border dark:border-0 text-base"
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //           <div className="col-span-1">
  //             <div className="grid place-items-center h-[40vh]">
  //               <div>
  //                 <button
  //                   title="xml pretty"
  //                   className="inline-flex
  //                   w-full items-center
  //                   justify-center
  //                   px-4
  //                   py-2
  //                   text-base
  //                   font-bold
  //                   whitespace-no-wrap
  //                   rounded-md
  //                   shadow-xs
  //                   bg-violet-400
  //                   text-white
  //                   dark:bg-yellow-500
  //                   dark:text-[#2d3748]
  //                   "
  //                   onClick={onDiffJson}
  //                 >
  //                   Find Diff
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="col-span-4">
  //             <div className="flex flex-col">
  //               <div>
  //                 <span className="text-md font-bold text-primary">
  //                   Input 2
  //                 </span>
  //               </div>
  //               <div>
  //                 <ReactCodeMirror
  //                   value={secondPanel}
  //                   height="45vh"
  //                   onChange={handleSecond}
  //                   className="shadow-lg text-base border border dark:border-0"
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="row-span-1">
  //         <p className="text-md font-bold text-primary mt-2">Result</p>
  //         <div className="h-[45vh]">
  //           <div className="grid grid-cols-2">
  //             <div className="col-span-1 h-[45vh] code-panel bg-secondary">
  //               <div className="flex flex-row">
  //                 <div className={`p-2 ${resultDiff.length && "border-r-2"}`}>
  //                   {Array.from(Array(removeCount), (e, i) => (
  //                     <p className="text-primary">{i + 1}</p>
  //                   ))}
  //                 </div>
  //                 <div className="p-2">
  //                   {resultDiff.map((data, index) => (
  //                     <pre className="flex flex-row" key={index}>
  //                       <code>
  //                         {!data.added && (
  //                           <span
  //                             className={`${
  //                               data.remove ? "remove-color" : "text-primary"
  //                             }`}
  //                           >
  //                             {data.value}
  //                           </span>
  //                         )}
  //                       </code>
  //                     </pre>
  //                   ))}
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="col-span-1 h-[45vh] code-panel bg-secondary">
  //               <div className="flex flex-row">
  //                 <div className={`p-2 ${resultDiff.length && "border-r-2"}`}>
  //                   {Array.from(Array(addedCount), (e, i) => (
  //                     <p className="text-primary">{i + 1}</p>
  //                   ))}
  //                 </div>
  //                 <div className="p-2">
  //                   {resultDiff.map((data, index) => (
  //                     <pre className="flex flex-row" key={index}>
  //                       <code>
  //                         {!data.remove && (
  //                           <span
  //                             className={`${
  //                               data.added ? "added-color" : "text-primary"
  //                             }`}
  //                           >
  //                             {data.value}
  //                           </span>
  //                         )}
  //                       </code>
  //                     </pre>
  //                   ))}
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );
  return (
    <main className="w-full p-2 gap-2">
      <p className="text-xl font-extrabold text-default-800">Text Compare</p>
      <div className="grid grid-cols-9 items-center">
        <div className="w-full col-span-4 p-2">
          <div className="mt-2">
            <div className="flex flex-row gap-2 h-4 justify-between h-screen">
              <span>Original text</span>
            </div>
          </div>
        </div>
        <div className="w-full flex col-span-1 p-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            className="hover:bg-gray-200 hover:text-black"
          >
            Find Diff
          </Button>
        </div>
        <div className="w-full col-span-4 p-2">Modified text</div>
      </div>
    </main>
  );
};

export default TextCompare;
