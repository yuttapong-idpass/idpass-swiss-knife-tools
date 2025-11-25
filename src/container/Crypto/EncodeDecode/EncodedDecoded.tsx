import React, { SyntheticEvent, useState } from "react";

import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";

import "./EncodedDecoded.css";

type Props = {};

const EncodedDecoded = (props: Props) => {
  const [encodedText, setEncodedText] = useState("");
  const [decodedText, setDecodedText] = useState("");

  const handleEncodedText = ($event: SyntheticEvent<EventTarget>) => {
    const plainTextArea = ($event.target as HTMLInputElement).value;
    setEncodedText(plainTextArea);
  };

  const handleDecodedText = ($event: SyntheticEvent<EventTarget>) => {
    const resultTextArea = ($event.target as HTMLInputElement).value;
    setDecodedText(resultTextArea);
  };

  const URLEncoded = () => {
    const encodeURI = encodeURIComponent(decodedText);
    setEncodedText(encodeURI);
  };

  const URLDecoded = () => {
    const decodeURI = decodeURIComponent(encodedText);
    setDecodedText(decodeURI);
  };

  return (
    <main className="w-full p-2 gap-2">
      <p className="text-xl font-bold underline underline-offset-1 text-primary">
        URL Encoded/Decoded
      </p>
      <div className="grid grid-cols-9 mt-5">
        <div className="col-span-4">
          <div className="flex flex-col">
            <div>
              <span className="text-md font-bold text-primary">
                Decoded Text
              </span>
              <textarea
                name="decoded"
                id="decoded"
                value={decodedText}
                placeholder="Enter your text here..."
                className="
                  block
                  p-4
                  w-full
                  text-md
                  text-primary
                  h-[90vh]
                  shadow-md
                  rounded-md
                  bg-secondary
                "
                onChange={handleDecodedText}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="grid place-items-center h-[90vh]">
            <div className="grid grid-rows-3 gap-3">
              <div>
                <button
                  title="xml pretty"
                  className="inline-flex 
                  w-full items-center 
                  justify-center 
                  px-4 
                  py-2 
                  text-base 
                  font-bold 
                  whitespace-no-wrap  
                  rounded-md 
                  shadow-xs
                  text-white
                  bg-yellow-500
                  dark:text-[#2d3748]
                  "
                  onClick={URLEncoded}
                >
                  <span className="ml-2">Encoded</span>
                  <BiSolidRightArrow
                    size={17}
                    className="
                      ml-1
                      text-white
                      dark:text-[#2d3748]"
                  />
                </button>
              </div>
              <div>
                <button
                  title="xml pretty"
                  className="inline-flex 
                  w-full items-center 
                  justify-center 
                  px-4 
                  py-2 
                  text-base 
                  font-bold 
                  whitespace-no-wrap  
                  rounded-md 
                  shadow-xs
                  text-white
                  bg-violet-400
                  dark:text-[#2d3748]
                  "
                  onClick={URLDecoded}
                >
                  <BiSolidLeftArrow
                    size={17}
                    className="
                    mr-1
                    text-white
                    dark:text-[#2d3748]
                  "
                  />
                  <span className="mr-2">Decoded</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex flex-col">
            <div>
              <span className="text-md font-bold text-primary">
                Encoded Text
              </span>
              <textarea
                name="encoded"
                id="encoded"
                value={encodedText}
                placeholder="Enter your text here..."
                className="
                  block
                  p-4
                  w-full
                  text-md
                  text-primary
                  h-[90vh]
                  shadow-md
                  rounded-md
                  bg-secondary
                "
                onChange={handleEncodedText}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EncodedDecoded;
