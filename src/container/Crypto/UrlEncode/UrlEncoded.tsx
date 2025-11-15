import React, { SyntheticEvent, useState } from "react";

import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import { encoded, decoded } from "../../../store/slice/enCodeSlice";
import { useAppDispatch } from "../../../store/store";

import "./UrlEncoded.css";

type Props = {};

const UrlEncoded = (props: Props) => {
  const dispatch = useAppDispatch();

  const [encodedText, setEncodedText] = useState("");
  const [decodedText, setDecodedText] = useState("");

  const handleEncoded = ($event: SyntheticEvent<EventTarget>) => {
    const encodedTextArea = ($event.target as HTMLInputElement).value;
    setEncodedText(encodedTextArea);
  };

  const handleDecoded = ($event: SyntheticEvent<EventTarget>) => {
    const decodedTextArea = ($event.target as HTMLInputElement).value;
    setDecodedText(decodedTextArea);
  };

  const URLEncoded = () => {
    dispatch(encoded({ encoded: encodedText, decoded: decodedText }));
  };

  const URLDecoded = () => {
    dispatch(decoded({ encoded: encodedText, decoded: decodedText }));
  };

  const isValidURL = (url: string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol (optional)
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path (optional)
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string (optional)
        "(\\#[-a-z\\d_]*)?$",
      "i" // fragment locator (optional)
    );
    return !!urlPattern.test(url);
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
              <span className="text-md font-bold text-primary">Encoded</span>
              <textarea
                name="encoded"
                id="encoded"
                value={encodedText}
                placeholder="Enter your URL here..."
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
                onChange={handleEncoded}
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
                  <span className="ml-2">Decoded</span>
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
                  <span className="mr-2">Encoded</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex flex-col">
            <div>
              <span className="text-md font-bold text-primary">Decoded</span>
              <textarea
                name="decoded"
                id="decoded"
                value={decodedText}
                placeholder="Enter your URL here..."
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
                onChange={handleDecoded}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UrlEncoded;
