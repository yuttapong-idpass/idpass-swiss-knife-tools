import React, { useState, useEffect, SyntheticEvent } from "react";
import "./XMLJson.css";
import xml2js from "xml2js";

type Props = {};

const XMLJson = (props: Props) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {}, []);

  const handleInput = ($event: SyntheticEvent<EventTarget>) => {
    const input = ($event.target as HTMLInputElement).value;
    setInput(String(input));
  };

  const handleOutput = ($event: SyntheticEvent<EventTarget>) => {
    const output = ($event.target as HTMLInputElement).value;
    setOutput(output);
  };

  const onConvertToJson = () => {
    try {
      const parser = new xml2js.Parser();

      const test =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:int="realURLHere"><soapenv:Header/><soapenv:Body><int:readResponse><response><request>?</request><cust><fName>?</fName></cust></response></int:readResponse></soapenv:Body></soapenv:Envelope>';

      console.log("inpit", typeof input);
      console.log("test", typeof test);

      input.replace("/\\/g", "");

      const removeNewLine = input.replace(/\\n/g, "");
      const removeSlash = removeNewLine.replace(/\\/g, "");

      console.log("input", removeSlash);
      parser.parseString(removeSlash.trim(), function (err: any, result: any) {
        setOutput(JSON.stringify(result, null, 3));
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex flex-row w-full gap-2 p-2 bg-primary">
      <div className="flex-initial w-full">
        <div>
          <span className="text-lg font-medium text-primary">Input</span>
        </div>
        <div>
          <textarea
            name="input"
            id="input"
            value={input}
            onChange={handleInput}
            className="block 
                p-4 
                mt-2 
                w-full 
                h-[94vh] 
                text-md 
                text-primary 
                shadow-md 
                rounded-md 
                bg-secondary
                numbers
                "
          ></textarea>
        </div>
      </div>
      <div className="flex-initial w-80">
        <div className="grid place-items-center h-[94vh]">
          <div>
            <button
              title="Pretty json"
              className="
              inline-flex 
              w-full 
              item-centers 
              justify-center 
              px-4 
              py-2 
              text-base 
              font-medium 
              leading-6 
              text-[#ffffff] 
              dark:text-dark-300
              whitespace-no-wrap 
              bg-success 
              rounded-md 
              shadow-sm
              bg-lime-500
              hover:bg-lime-400
              dark:bg-lime-300
              dark:hover:bg-lime-500
              "
              onClick={onConvertToJson}
            >
              Convert 
            </button>
          </div>
        </div>
      </div>
      <div className="flex-initial w-full">
        <div>
          <span className="text-lg font-medium text-primary">Output</span>
        </div>
        <div>
          <textarea
            name="output"
            id="output"
            value={output}
            onChange={handleOutput}
            className="block 
                p-4 
                mt-2 
                w-full 
                h-[94vh] 
                text-md 
                text-primary 
                shadow-md 
                rounded-md 
                bg-secondary"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default XMLJson;
