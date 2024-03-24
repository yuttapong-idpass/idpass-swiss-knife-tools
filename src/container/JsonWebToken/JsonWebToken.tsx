import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";
import { useSelector } from "react-redux";
import { encodeToken, encodeSelector } from "../../store/slice/jwtTokenSlice";
import { decodeToken, decodeSelector } from "../../store/slice/jwtTokenSlice";
import { useAppDispatch } from "../../store/store";

import * as jose from "jose";

import ErrorImage from "../../assets/images/cross.png";
import "./JsonWebToken.css";
import { FaAngleRight } from "react-icons/fa6";

type Props = {};

const JsonWebToken = (props: Props) => {
  const encodeReducer = useSelector(encodeSelector);
  const decodeReducer = useSelector(decodeSelector);
  const dispatch = useAppDispatch();

  const options = [
    { value: "encode", text: "encode" },
    { value: "decode", text: "decode" },
  ];

  const algorithms = [
    { name: "HS256", value: "HS256" },
    { name: "HS384", value: "HS384" },
    { name: "HS512", value: "HS512" },
  ];

  const [selected, setSelected] = useState(options[0].value);
  const [algorithm, setAlgorithm] = useState(algorithms[0].value);
  const [encode, setEncode] = useState({});
  const [decode, setDecode] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleSelectOption = ($event: any) => {
    setSelected($event.target.value);
    dispatch(encodeToken({ result: "", isError: false, messageError: "" }));
    dispatch(
      decodeToken({
        result: { algorithm: "", decodeText: "" },
        isError: false,
        messageError: "",
      })
    );
  };

  const handleSelectOptionAlgor = ($event: any) => {
    setAlgorithm($event.target.value);
  };

  const handleEncodeArea = (event$: any) => {
    const encode: any = event$.target.value;

    if (!!encode) {
      try {
        let setting = JSON.parse(encode);
        setEncode(setting);
        dispatch(
          encodeToken({
            result: "",
            isError: false,
            messageError: "",
          })
        );
      } catch (error) {
        dispatch(
          encodeToken({
            result: "",
            isError: true,
            messageError: String(error),
          })
        );
      }
    } else {
      dispatch(
        encodeToken({
          result: "",
          isError: false,
          messageError: "",
        })
      );
    }
  };

  const handleDecodeArea = (event$: any) => {
    const decoded: any = event$.target.value;
    try {
      setDecode(decoded);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSecretArea = (event$: any) => {
    const secret: any = event$.target.value;
    setSecretKey(secret);
  };

  const onChangeResultText = (event$: any) => {};

  const onEncoded = async () => {
    // if (!encodeReducer.encoded.isEr

    const secret = new TextEncoder().encode(
      "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2"
    );
    const alg = "HS256";
    const typ = "JWT";

    const jwt = await new jose.SignJWT({ good: "good" })
      .setProtectedHeader({ alg, typ })
      .sign(secret);

    console.log(jwt);
  };

  const onDecode = () => {
    decodeJWT();
  };

  const base64Url = (source: any) => {
    let encodedSource = CryptoJS.enc.Base64.stringify(source);
    encodedSource = encodedSource.replace(/=+$/, "");
    encodedSource = encodedSource.replace(/\+/g, "-");
    encodedSource = encodedSource.replace(/\//g, "_");
    return encodedSource;
  };

  const encodeJwt = () => {};

  const encodeJWT = () => {
    // const header = {
    //   alg: "HS256",
    //   typ: "JWT",
    // };

    const header = {
      alg: algorithm,
      typ: "JWT",
    };

    const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    const encodeHeader = base64Url(stringifiedHeader);
    const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(encode));
    const encodedData = base64Url(stringifiedData);
    const token = encodeHeader + "." + encodedData;
    let signature;

    if (algorithm === "HS256") {
      signature = CryptoJS.HmacSHA256(token, secretKey);
    } else if (algorithm === "HS384") {
      signature = CryptoJS.HmacSHA384(token, secretKey);
    } else if (algorithm === "HS512") {
      signature = CryptoJS.HmacSHA512(token, secretKey);
    }

    const base64Signature = base64Url(signature);
    const jwt = token + "." + base64Signature;
    dispatch(encodeToken({ result: jwt, isError: false, messageError: "" }));
  };

  const decodeJWT = () => {
    let algorithm = decode.split(".")[0];
    let base64Payload = decode.split(".")[1];
    try {
      // const wordsAlgorithm = CryptoJS.enc.Base64.parse(algorithm);
      // const textAlgorithm = CryptoJS.enc.Utf8.stringify(wordsAlgorithm);
      // const wordsBase64 = CryptoJS.enc.Base64.parse(base64Payload);
      // const textBase64 = CryptoJS.enc.Utf8.stringify(wordsBase64);
      // dispatch(
      //   decodeToken({
      //     result: { algorithm: textAlgorithm, decodeText: textBase64 },
      //     isError: false,
      //     messageError: "",
      //   })
      // );

      const decodeAlgorithm = Base64.decode(algorithm);
      const decodePayload = Base64.decode(base64Payload);

      dispatch(
        decodeToken({
          result: { algorithm: decodeAlgorithm, decodeText: decodePayload },
          isError: false,
          messageError: "",
        })
      );
    } catch (error) {
      console.error("json web token error -->", error);
      dispatch(
        decodeToken({
          result: { algorithm: "", decodeText: "" },
          isError: true,
          messageError: String(error),
        })
      );
    }
  };

  return (
    <div className="flex flex-row w-full gap-2 p-2">
      <div className="flex-initial w-full">
        <label
          htmlFor="encoded"
          className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-300"
        >
          Encode
        </label>
        <textarea
          name="encoded"
          id="encoded"
          rows={8}
          className="
            block 
            p-4        
            w-full
            text-md
            text-gray-900
            bg-gray-200
            h-[95vh]
            border
            border-gray-300
            border-solid
            dark:bg-gray-700
            dark:border-gray-600
            dark:placeholder-gray-400
            dark:text-white
          "
        ></textarea>
      </div>
      <div className="flex-initial w-80">
        <div className="grid place-items-center h-[98vh]">
          <button
            title="Generate"
            className="              
              inline-flex 
              w-full 
              text-center
              item-centers 
              justify-center 
              px-12
              py-2.5 
              text-base 
              font-medium 
              leading-6 
              text-white 
              dark:text-gray-200 
              whitespace-no-wrap 
              bg-teal-500 
              rounded-md 
              shadow-sm
              hover:bg-teal-400"
          >
            Encode
            <FaAngleRight 
              size={26}
              className="text-gray-800 hover:bg-gray-500 dark:text-gray-300"
              title="Encoded"
            />
          </button>
          <button
            title="Generate"
            className="              
              inline-flex 
              w-full 
              text-center
              item-centers 
              justify-center 
              px-12
              py-2.5 
              text-base 
              font-medium 
              leading-6 
              text-white 
              dark:text-gray-200 
              whitespace-no-wrap 
              bg-teal-500 
              rounded-md 
              shadow-sm
              hover:bg-teal-400"
          >
            Encode
            <FaAngleRight 
              size={26}
              className="text-gray-800 hover:bg-gray-500 dark:text-gray-300"
              title="Encoded"
            />
          </button>
        </div>
      </div>
      <div className="flex-initial flex-col w-full">
        <div>
          <label
            htmlFor="headers"
            className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-300"
          >
            Headers
          </label>
          <textarea
            name="headers"
            id="headers"
            rows={8}
            className="
            block 
            p-4        
            w-full
            text-md
            text-gray-900
            bg-gray-200
            h-[46vh]
            border
            border-gray-300
            border-solid
            dark:bg-gray-700
            dark:border-gray-600
            dark:placeholder-gray-400
            dark:text-white
          "
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="payload"
            className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-300"
          >
            Payload
          </label>
          <textarea
            name="payload"
            id="payload"
            rows={8}
            className="
            block 
            p-4        
            w-full
            text-md
            text-gray-900
            bg-gray-200
            h-[46vh]
            border
            border-gray-300
            border-solid
            dark:bg-gray-700
            dark:border-gray-600
            dark:placeholder-gray-400
            dark:text-white
          "
          ></textarea>
        </div>
      </div>
    </div>
    // <div className="p-4 place-items-center">
    //   <div className="max-w-7xl mx-auto grid grid-cols-12 h-screen">
    //     <div className="col-span-12 h-screen">
    //       <nav className="flex items-center justify-between flex-wrap bg-gray-400 p-1">
    //         <div className="flex items-center flex-shrink-0 text-white mr-6">
    //           <div className="p-2">
    //             <h1 className="font-bold">
    //               MODE :{" "}
    //               <select
    //                 className="inline-block
    //               text-sm
    //               px-3
    //               py-2
    //               leading-none
    //               border
    //               rounded
    //               text-black
    //               border-white
    //               hover:bg-white
    //               mt-4
    //               lg:mt-0"
    //                 onChange={handleSelectOption}
    //               >
    //                 {options.map((option) => (
    //                   <option key={option.value} value={option.value}>
    //                     {option.text}
    //                   </option>
    //                 ))}
    //               </select>
    //             </h1>
    //           </div>
    //         </div>
    //       </nav>

    //       {selected === "encode" ? (
    //         <div>
    //           <div className="p-2">
    //             <div>
    //               <nav className="p-3">
    //                 <div className="container flex flex-wrap items-center justify-between mx-auto">
    //                   <div className="flex items-center">
    //                     <span className="self-center text-xl font-bold whitespace-nowrap dark:text-gray-800 ">
    //                       ENCODED
    //                     </span>
    //                   </div>

    //                   <div className="flex md:order-1">
    //                     {encodeReducer.encoded.isError ? (
    //                       <>
    //                         <img src={ErrorImage} className="h-8 w-8" />
    //                         <span className="ml-3 font-bold text-red-600">
    //                           Invalid Signature !
    //                         </span>
    //                       </>
    //                     ) : null}
    //                   </div>

    //                   <div className="flex md:order-1"></div>

    //                   <div className="flex md:order-2">
    //                     <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
    //                       <li>
    //                         <label
    //                           htmlFor="large-input"
    //                           className="block mb-2 text-sm font-medium text-gray-900"
    //                         >
    //                           Algorithm
    //                         </label>
    //                         <select
    //                           className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg  sm:text-md focus:ring-blue-500 focus:border-blue-500  dark:border-gray-300 dark:placeholder-gray-400 "
    //                           onChange={handleSelectOptionAlgor}
    //                         >
    //                           {algorithms.map((algor) => (
    //                             <option key={algor.value} value={algor.value}>
    //                               {algor.name}
    //                             </option>
    //                           ))}
    //                         </select>
    //                       </li>
    //                       <li>
    //                         <label
    //                           htmlFor="large-input"
    //                           className="block mb-2 text-sm font-medium text-gray-900"
    //                         >
    //                           Secret key
    //                         </label>
    //                         <input
    //                           type="text"
    //                           id="large-input"
    //                           className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg  sm:text-md focus:ring-blue-500 focus:border-blue-500  dark:border-gray-300 dark:placeholder-gray-400 "
    //                           onChange={handleSecretArea}
    //                         />
    //                       </li>
    //                     </ul>
    //                   </div>
    //                 </div>
    //               </nav>

    //               <textarea
    //                 id="message"
    //                 rows={4}
    //                 className="
    //                   block
    //                   p-4
    //                   w-full
    //                   text-sm
    //                   text-gray-900
    //                   bg-gray-50
    //                   rounded-lg
    //                   border
    //                   border-gray-300
    //                   border-dashed border-2 border-gray-300
    //                   h-96"
    //                 placeholder="Paste your token here ..."
    //                 onChange={handleEncodeArea}
    //               ></textarea>
    //             </div>

    //             <div>
    //               <div className="grid place-items-center h-full mt-5">
    //                 <button
    //                   className="
    //                     text-white
    //                     bg-neutral-400
    //                     bg-blue-500
    //                     hover:bg-[#FF9119]/80
    //                     focus:ring-4
    //                     focus:outline-none
    //                     focus:ring-[#FF9119]/50
    //                     font-medium
    //                     rounded-lg
    //                     text-sm
    //                     px-5
    //                     py-2.5
    //                     text-center
    //                     inline-flex
    //                     items-center
    //                     dark:hover:bg-[#FF9119]/80
    //                     dark:focus:ring-[#FF9119]/40
    //                     mr-1
    //                     mb-1"
    //                   onClick={onEncoded}
    //                 >
    //                   ENCODED
    //                 </button>
    //               </div>
    //             </div>

    //             <div>
    //               <nav className="p-3">
    //                 <div className="container flex flex-wrap items-center justify-between mx-auto">
    //                   <div className="flex items-center">
    //                     <span className="self-center text-xl font-bold whitespace-nowrap dark:text-gray-800 ">
    //                       RESULT
    //                     </span>
    //                   </div>

    //                   <div className="flex md:order-2">
    //                     <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
    //                       <li></li>
    //                     </ul>
    //                   </div>
    //                 </div>
    //               </nav>

    //               <div>
    //                 <div className="relative overflow-x-auto">
    //                   {/* <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    //                     <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    //                       <tr>
    //                         <th scope="col" className="px-6 py-3">
    //                           HEADER: ALGORITHM & TOKEN TYPE
    //                         </th>
    //                       </tr>
    //                     </thead>
    //                     <tbody>
    //                       <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    //                         <th
    //                           scope="row"
    //                           className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
    //                         >
    //                           Apple MacBook Pro 17"
    //                         </th>
    //                       </tr>
    //                     </tbody>
    //                     <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    //                       <tr>
    //                         <th scope="col" className="px-6 py-3">
    //                           PAYLOAD:DATA
    //                         </th>
    //                       </tr>
    //                     </thead>
    //                     <tbody>
    //                       <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    //                         <th
    //                           scope="row"
    //                           className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
    //                         >
    //                           Apple MacBook Pro 17"
    //                         </th>
    //                       </tr>
    //                     </tbody>
    //                   </table> */}

    //                   <textarea
    //                     id="message"
    //                     rows={4}
    //                     className="
    //                       block
    //                       p-4
    //                       w-full
    //                       text-sm
    //                       text-gray-900
    //                       bg-gray-50
    //                       rounded-lg
    //                       border
    //                       border-gray-300
    //                       border-dashed border-2 border-gray-300
    //                       h-96"
    //                     placeholder="Paste your token here ..."
    //                     value={encodeReducer.encoded.result}
    //                     onChange={onChangeResultText}
    //                   ></textarea>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       ) : (
    //         <div>
    //           <div>
    //             <div className="p-2">
    //               <div>
    //                 <nav className="p-3">
    //                   <div className="container flex flex-wrap items-center justify-between mx-auto">
    //                     <div className="flex items-center">
    //                       <span className="self-center text-xl font-bold whitespace-nowrap dark:text-gray-800 ">
    //                         DECODED
    //                       </span>
    //                     </div>

    //                     <div className="flex md:order-1">
    //                       {encodeReducer.decoded.isError ? (
    //                         <>
    //                           <img src={ErrorImage} className="h-8 w-8" />
    //                           <span className="ml-3 font-bold text-red-600">
    //                             Error !
    //                           </span>
    //                         </>
    //                       ) : null}
    //                     </div>

    //                     <div className="flex md:order-1"></div>

    //                     <div className="flex md:order-2">
    //                       <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent "></ul>
    //                     </div>
    //                   </div>
    //                 </nav>

    //                 <textarea
    //                   id="message"
    //                   rows={4}
    //                   className="
    //                   block
    //                   p-4
    //                   w-full
    //                   text-sm
    //                   text-gray-900
    //                   bg-gray-50
    //                   rounded-lg
    //                   border
    //                   border-gray-300
    //                   border-dashed border-2 border-gray-300
    //                   h-96"
    //                   placeholder="Paste your token here ..."
    //                   onChange={handleDecodeArea}
    //                 ></textarea>
    //               </div>

    //               <div>
    //                 <div className="grid place-items-center h-full mt-5">
    //                   <button
    //                     className="
    //                     text-white
    //                     bg-neutral-400
    //                     bg-blue-500
    //                     hover:bg-[#FF9119]/80
    //                     focus:ring-4
    //                     focus:outline-none
    //                     focus:ring-[#FF9119]/50
    //                     font-medium
    //                     rounded-lg
    //                     text-sm
    //                     px-5
    //                     py-2.5
    //                     text-center
    //                     inline-flex
    //                     items-center
    //                     dark:hover:bg-[#FF9119]/80
    //                     dark:focus:ring-[#FF9119]/40
    //                     mr-1
    //                     mb-1"
    //                     onClick={onDecode}
    //                   >
    //                     DECODED
    //                   </button>
    //                 </div>
    //               </div>

    //               <div>
    //                 <nav className="p-3">
    //                   <div className="container flex flex-wrap items-center justify-between mx-auto">
    //                     <div className="flex items-center">
    //                       <span className="self-center text-xl font-bold whitespace-nowrap dark:text-gray-800 ">
    //                         RESULT
    //                       </span>
    //                     </div>

    //                     <div className="flex md:order-2">
    //                       <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
    //                         <li></li>
    //                       </ul>
    //                     </div>
    //                   </div>
    //                 </nav>

    //                 <div>
    //                   <div
    //                     className="
    //                       block
    //                       p-4
    //                       w-full
    //                       text-sm
    //                       text-gray-900
    //                       bg-gray-50
    //                       rounded-lg
    //                       border
    //                       border-gray-300
    //                       border-dashed border-2 border-gray-300
    //                     "
    //                   >
    //                     <div>
    //                       <div>
    //                         <span className="text-m  font-bold">
    //                           HEADER: ALGORITHM & TOKEN TYPE
    //                         </span>
    //                       </div>
    //                       <hr />
    //                       <div className="mt-5">
    //                         <span>
    //                           {!!decodeReducer.decoded.result?.algorithm ? (
    //                             <span className="text-fuchsia-500 font-bold">
    //                               {/* {JSON.stringify(
    //                                 JSON.parse(
    //                                   decodeReducer.decoded.result?.algorithm
    //                                 ),
    //                                 undefined,
    //                                 2
    //                               )} */}
    //                               {decodeReducer.decoded.result?.algorithm}
    //                             </span>
    //                           ) : (
    //                             <span className="text-bold text-xl">-</span>
    //                           )}
    //                         </span>
    //                       </div>
    //                     </div>

    //                     <div className="mt-5">
    //                       <div>
    //                         <span className="text-m font-bold">
    //                           PAYLOAD:DATA
    //                         </span>
    //                       </div>
    //                       <hr />
    //                       <div className="mt-5">
    //                         <div>
    //                           <pre>
    //                             {/* {JSON.stringify(JSON.parse(decodeReducer.decoded.result?.decodeText), undefined, 2)} */}
    //                             {/* {decodeReducer.decoded.result?.decodeText} */}

    //                             {!!decodeReducer.decoded.result?.decodeText ? (
    //                               <span className="text-purple-600 font-bold">
    //                                 {JSON.stringify(
    //                                   JSON.parse(
    //                                     decodeReducer.decoded.result?.decodeText
    //                                   ),
    //                                   undefined,
    //                                   2
    //                                 )}
    //                               </span>
    //                             ) : (
    //                               <span className="text-bold text-xl">-</span>
    //                             )}
    //                           </pre>
    //                         </div>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default JsonWebToken;
