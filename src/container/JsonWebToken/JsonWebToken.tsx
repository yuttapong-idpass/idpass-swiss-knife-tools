import React, { useState, useEffect, SyntheticEvent } from "react";
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";
import { useSelector } from "react-redux";
import { encodeToken, encodeSelector } from "../../store/slice/jwtTokenSlice";
import { decodeToken, decodeSelector } from "../../store/slice/jwtTokenSlice";
import { useAppDispatch } from "../../store/store";

import * as jose from "jose";

import ErrorImage from "../../assets/images/cross.png";
import "./JsonWebToken.css";
import {
  FaArrowRight,
  FaArrowLeft,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa6";

type Props = {};

interface IAlgorithm {
  alg: string;
  typ: string;
}

// deepcode ignore HardcodedNonCryptoSecret: <please specify a reason of ignoring this>
const initialJwtValue: any =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkV4YW1wbGUgSldUIiwiaWF0IjoxNTE2MjM5MDIyfQ.HncDT1ysNqeX8wRJnu9qvHXySrjTqzxWAxNPgUZt3f8";

const initialPayload: any = JSON.stringify({});
const initialHeaders: any = JSON.stringify({});

const JsonWebToken = (props: Props) => {
  const encodeReducer = useSelector(encodeSelector);
  const decodeReducer = useSelector(decodeSelector);
  const dispatch = useAppDispatch();

  const options = [
    { value: "encode", text: "encode" },
    { value: "decode", text: "decode" },
  ];

  const algorithms = [
    { name: "HS256", alg: "HS256", typ: "JWT", algorithm: "HMACSHA256" },
    { name: "HS384", alg: "HS384", typ: "JWT", algorithm: "HMACSHA384" },
    { name: "HS512", alg: "HS512", typ: "JWT", algorithm: "HMACSHA512" },
  ];

  const [algorithm, setAlgorithm] = useState(algorithms[0]);
  const [jwtArea, setJwtArea] = useState(initialJwtValue);
  const [headerArea, setHeaderArea] = useState(initialPayload);
  const [payloadArea, setPayloadArea] = useState(initialHeaders);
  const [secretKey, setSecretKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [encodedSecret, setEncodedSecret] = useState(false);


  useEffect(() => { 
    onDecoded();
  }, []);



  const handleSecretKey = ($event: SyntheticEvent<EventTarget>) => {
    const secret = ($event.target as HTMLInputElement).value;
    setSecretKey(secret);
  };

  const handleJwtArea = ($event: SyntheticEvent<EventTarget>) => {
    const jwt = ($event.target as HTMLInputElement).value;
    setJwtArea(jwt);
  };

  const handleHeadersArea = ($event: SyntheticEvent<EventTarget>) => {
    const headers = ($event.target as HTMLInputElement).value;
    setHeaderArea(headers);
  };

  const handlePayloadArea = ($event: SyntheticEvent<EventTarget>) => {
    const payload = ($event.target as HTMLInputElement).value;
    setPayloadArea(payload);
  };

  const handleEncodedSecretKey = ($event: SyntheticEvent<EventTarget>) => {
    const payload = ($event.target as HTMLInputElement).checked;
    setEncodedSecret(payload);
  };

  const handleSelectOptionAlgorithm = ($event: SyntheticEvent<EventTarget>) => {
    const index: any = ($event.target as HTMLInputElement).value;
    const getAlgorithm = algorithms[index];
    setAlgorithm(getAlgorithm!);
    setHeaderArea(
      JSON.stringify({ alg: getAlgorithm.alg, typ: getAlgorithm.typ }, null, 2)
    );
  };

  const onEncoded = async () => {
    try {
      const payloadObject = JSON.parse(payloadArea);
      let secret: any;

      if (encodedSecret) {
        const encodedSecret = jose.base64url.encode(secretKey);
        secret = new TextEncoder().encode(encodedSecret);
      } else {
        secret = new TextEncoder().encode(secretKey);
      }

      if (!!secretKey) {
        const alg = algorithm.alg;
        const typ = algorithm.typ;
        if (typeof payloadObject === "object") {
          const jwt = await new jose.SignJWT(payloadObject)
            .setProtectedHeader({ alg, typ })
            .sign(secret);
          setJwtArea(jwt);
          setHeaderArea(JSON.stringify({ alg: alg, typ: typ }, null, 2));
        }
        if (isError) {
          setIsError(false);
          setErrorMessage("");
        }
      } else {
        setIsError(true);
        setErrorMessage(`Error Secret! : Please input your secret key`);
      }
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(`Error Payload! : ${error.message}`);
    }
  };

  const onDecoded = async () => {
    try {
      // deepcode ignore JwtDecodeMethod: <please specify a reason of ignoring this>
      const decodedPayload = jose.decodeJwt(jwtArea);
      const decodedHeaders = jose.decodeProtectedHeader(jwtArea);
      console.log("decoded ->", decodedPayload);
      setPayloadArea(JSON.stringify(decodedPayload, null, 2));
      setHeaderArea(JSON.stringify(decodedHeaders, null, 2));
      if (isError) {
        setIsError(false);
        setErrorMessage("");
      }
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(`Error Decoded! : ${error.message}`);
    }
  };

  // const handleEncodeArea = (event$: any) => {
  //   const encode: any = event$.target.value;

  //   if (!!encode) {
  //     try {
  //       let setting = JSON.parse(encode);
  //       setEncode(setting);
  //       dispatch(
  //         encodeToken({
  //           result: "",
  //           isError: false,
  //           messageError: "",
  //         })
  //       );
  //     } catch (error) {
  //       dispatch(
  //         encodeToken({
  //           result: "",
  //           isError: true,
  //           messageError: String(error),
  //         })
  //       );
  //     }
  //   } else {
  //     dispatch(
  //       encodeToken({
  //         result: "",
  //         isError: false,
  //         messageError: "",
  //       })
  //     );
  //   }
  // };

  // const handleDecodeArea = (event$: any) => {
  //   const decoded: any = event$.target.value;
  //   try {
  //     setDecode(decoded);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  // const handleSecretArea = (event$: any) => {
  //   const secret: any = event$.target.value;
  //   setSecretKey(secret);
  // };

  const base64Url = (source: any) => {
    let encodedSource = CryptoJS.enc.Base64.stringify(source);
    encodedSource = encodedSource.replace(/=+$/, "");
    encodedSource = encodedSource.replace(/\+/g, "-");
    encodedSource = encodedSource.replace(/\//g, "_");
    return encodedSource;
  };

  const encodeJWT = () => {
    // const header = {
    //   alg: "HS256",
    //   typ: "JWT",
    // };
    // const header = {
    //   alg: algorithm,
    //   typ: "JWT",
    // };
    // const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    // const encodeHeader = base64Url(stringifiedHeader);
    // const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(encode));
    // const encodedData = base64Url(stringifiedData);
    // const token = encodeHeader + "." + encodedData;
    // let signature;
    // if (algorithm === "HS256") {
    //   signature = CryptoJS.HmacSHA256(token, secretKey);
    // } else if (algorithm === "HS384") {
    //   signature = CryptoJS.HmacSHA384(token, secretKey);
    // } else if (algorithm === "HS512") {
    //   signature = CryptoJS.HmacSHA512(token, secretKey);
    // }
    // const base64Signature = base64Url(signature);
    // const jwt = token + "." + base64Signature;
    // dispatch(encodeToken({ result: jwt, isError: false, messageError: "" }));
  };

  const decodeJWT = () => {
    // let algorithm = decode.split(".")[0];
    // let base64Payload = decode.split(".")[1];
    // try {
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
    //   const decodeAlgorithm = Base64.decode(algorithm);
    //   const decodePayload = Base64.decode(base64Payload);
    //   dispatch(
    //     decodeToken({
    //       result: { algorithm: decodeAlgorithm, decodeText: decodePayload },
    //       isError: false,
    //       messageError: "",
    //     })
    //   );
    // } catch (error) {
    //   console.error("json web token error -->", error);
    //   dispatch(
    //     decodeToken({
    //       result: { algorithm: "", decodeText: "" },
    //       isError: true,
    //       messageError: String(error),
    //     })
    //   );
    // }
  };

  return (
    <main className="flex flex-row w-full gap-4 p-2">
      <section className="flex-initial w-full">
        <div className="flex justify-between">
          <div className="items-center">
            <label
              htmlFor="encoded"
              className="text-lg font-medium text-gray-800 dark:text-gray-300"
            >
              Encoded
            </label>
          </div>
          <div className="flex flex-row"></div>
        </div>
        <textarea
          name="encoded"
          id="encoded"
          value={jwtArea}
          rows={8}
          placeholder="Enter your token here..."
          className="
            block 
            p-4        
            w-full
            text-md
            text-gray-900
            bg-gray-50
            h-[94vh]
            shadow-md
            rounded-md
            border
            border-gray-300
            border-solid
            dark:bg-gray-700
            dark:border-gray-600
            dark:placeholder-gray-400
            dark:text-white
          "
          onChange={handleJwtArea}
        ></textarea>
      </section>
      <section className="flex-initial w-80">
        <div className="flex flex-col h-[98vh]">
          <div className="basis-1/4  items-end m-auto">
            {isError ? (
              <div>
                <div className="p-4 bg-red-200 border border-1  border-red-500">
                  <span className="font-bold text-red-600  items-center">
                    {errorMessage}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
          <div className="basis-1/2 items-center m-auto">
            <div className="mb-3">
              <label
                htmlFor="algorithm"
                className="text-lg  mr-2 font-medium text-gray-800 dark:text-gray-300"
              >
                Alg:
              </label>
              <select
                title="alg"
                name="alg"
                id="alg"
                className="border 
                  border-solid 
                  rounded-md
                  border-gray-300 p-1 
                  bg-gray-50 
                  text-gray-900 
                  dark:bg-gray-700 
                  dark:border-gray-600 
                  dark:placeholder-gray-400 
                  dark:text-white"
                onChange={handleSelectOptionAlgorithm}
              >
                {algorithms.map((item, index) => (
                  <option key={index} value={index}>
                    {item.alg}
                  </option>
                ))}
              </select>
            </div>
            <button
              title="Decoded"
              className="              
              inline-flex 
              w-full 
              text-center
              items-center
              justify-center 
              pl-6
              py-2 
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
              onClick={onDecoded}
            >
              Decoded
              <FaAngleRight
                size={15}
                className="text-white dark:text-gray-200 ml-3 mt-1"
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
              mt-3
              pr-6
              py-2 
              text-base 
              font-medium 
              leading-6 
              text-white 
              dark:text-gray-200 
              whitespace-no-wrap 
              bg-sky-500 
              rounded-md 
              shadow-sm
              hover:bg-sky-400"
              onClick={onEncoded}
            >
              <FaAngleLeft
                size={15}
                className="text-white dark:text-gray-200 mr-3 mt-1"
                title="Encoded"
              />
              Encoded
            </button>
          </div>
        </div>
      </section>
      <section className="flex-initial flex-col w-full">
        <div className="flex flex-col">
          <label
            htmlFor="secret"
            className="text-lg font-medium text-gray-800 dark:text-gray-300"
          >
            Secret
          </label>
          <section
            className="
          flex
          flex-row
          p-2
          w-full 
          text-md 
          text-gray-900 
          bg-gray-50 
          h-[15vh] border 
          border-gray-300 
          border-solid 
          rounded-md
          mb-3
          dark:bg-gray-700 
          dark:border-gray-600
          dark:placeholder-gary-400
          dark:text-white
          items-center
          shadow-md
          "
          >
            <section className="flex flex-col">
              <div>
                <span className="text-md font-medium-text-gray dark:text-white mr-4">
                  {algorithm.algorithm} (
                </span>
              </div>
              <div className="ml-4">
                <span className="text-md font-medium-text-gray dark:text-white mr-4">
                  <span className="text-[#FB2576]">
                    base64UrlEncoded(header)
                  </span>{" "}
                  + "." +{" "}
                  <span className="text-[#C147E9]">
                    base64UrlEncoded(payload)
                  </span>{" "}
                  ,
                </span>
              </div>
              <div className="ml-4">
                <input
                  type="input"
                  id="secret"
                  placeholder="Enter your secret..."
                  className=" h-10 p-2 border rounded-md border-solid border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  onChange={handleSecretKey}
                />{" "}
                )
              </div>
              <div>
                <div className="mt-2">
                  <input
                    id="autoGenerate"
                    type="checkbox"
                    className="
                w-4 
                h-4 
                text-blue-600 
                bg-gray-100 
                border-gray-300 rounded 
              focus:ring-blue-500 
              dark:focus:ring-blue-600 
                dark:ring-offset-gray-800focus:ring-2
                dark:bg-gray-700
                dark:border-gray-600
              "
                    onChange={handleEncodedSecretKey}
                    defaultChecked={encodedSecret}
                  />
                  <label
                    htmlFor="labelAutoGenerate"
                    className=" 
                      ms-2
                      text-lg 
                      font-medium 
                    text-gray-800 
                    dark:text-gray-300"
                  >
                   Secret base64 encoded
                  </label>
                </div>
              </div>
            </section>
          </section>

          <label
            htmlFor="headers"
            className="text-lg font-medium text-gray-800 dark:text-gray-300"
          >
            Headers
          </label>
          <textarea
            name="headers"
            id="headers"
            rows={8}
            value={headerArea}
            className="
            block 
            p-4        
            w-full
            text-md
            text-gray-900
            bg-gray-50
            h-[35vh]
            rounded-md
            border
            shadow-md
            mb-3
            border-gray-300
            border-solid
            dark:bg-gray-700
            dark:border-gray-600
            dark:placeholder-gray-400
            dark:text-white
          "
            onChange={handleHeadersArea}
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
            value={payloadArea}
            className="
            block 
            p-4        
            w-full
            text-md
            text-gray-900
            bg-gray-50
            h-[35vh]
            shadow-md
            rounded-md
            border
            border-gray-300
            border-solid
            dark:bg-gray-700
            dark:border-gray-600
            dark:placeholder-gray-400
            dark:text-white
          "
            onChange={handlePayloadArea}
          ></textarea>
        </div>
      </section>
    </main>
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
