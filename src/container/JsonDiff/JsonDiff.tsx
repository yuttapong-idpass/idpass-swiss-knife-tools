import React, { SyntheticEvent, useState, useEffect } from "react";
import "./JsonDiff.css";

import * as diff from "diff";

type Props = {};

interface IJsonDiff {
  color: string;
  value: string;
  count: number | undefined;
  added: boolean | undefined;
  remove: boolean | undefined;
}

const initialResult: IJsonDiff[] = [];

const JsonDiff = (props: Props) => {
  const [color, setColor] = useState("");
  const [result, setResult] = useState(initialResult);

  useEffect(() => {
    const good = { data: "data", sniper: "sniper" };
    const good2 = { data: "data", sniper: "good" };
    const diffs = diff.diffLines(JSON.stringify(good), JSON.stringify(good2));
    let color = "";
    let test: string[] = [];

    diffs.forEach((part) => {
      color = part.added
        ? "text-green-500 dark:text-green-300"
        : part.removed
        ? "text-red-500 dark:text-red-300"
        : "text-primary";
      // console.log('color ->', color);
      // test.push(color);

      const diffObj: IJsonDiff = {
        color: color,
        value: part.value,
        count: part.count,
        added: part.added,
        remove: part.removed,
      };

      console.log("diff obj ->", diffObj);

      setResult((prevItems) => [...prevItems, diffObj]);
      console.log(result);
    });
  }, []);

  return (
    <div className="bg-primary w-full">
      JsonDiff
      {result?.map((item, index) => (
        <span key={index}>
          {item.remove ? (
            <span className={`${item.color} line-through`}>
              {item.value}
            </span>
          ) : 
            <span className={`${item.color}`}>
                {item.value}
            </span>
          }
        </span>
      ))}
    </div>
  );
};

export default JsonDiff;
