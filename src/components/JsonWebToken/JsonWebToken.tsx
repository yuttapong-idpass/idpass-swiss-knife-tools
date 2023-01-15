import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { useSelector } from "react-redux";
import { jwtToken, jwtTokenSelector } from "../../store/slice/jwtTokenSlice";
import { useAppDispatch } from "../../store/store";

import ErrorImage from "../../assets/images/cross.png";

type Props = {};

const JsonWebToken = (props: Props) => {
  const jwtTokenReducer = useSelector(jwtTokenSelector);
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
  const [secretKey, setSecretKey] = useState("");
  const [messageError, setMessageError] = useState("");

  const handleSelectOption = ($event: any) => {
    setSelected($event.target.value);
  };

  const handleSelectOptionAlgor = ($event: any) => {
      setAlgorithm($event.target.value);
  }

  const handleEncodeArea = (event$: any) => {
    const encode: any = event$.target.value;
    try {
      let setting = JSON.parse(encode);
      setEncode(setting);
      dispatch(jwtToken({ jwt: "", isError: false, messageError: "" }));
    } catch (error) {
      dispatch(
        jwtToken({ jwt: "", isError: true, messageError: String(error) })
      );
    }
  };

  const handleSecretArea = (event$: any) => {
    const secret: any = event$.target.value;
    setSecretKey(secret);
  };

  const onChangeResultText = (event$: any) => {};

  const onEncoded = () => {
    if (jwtTokenReducer.isError) {
      dispatch(jwtToken({ jwt: "", isError: true, messageError: "" }));
    } else {
      encodeJWT();
    }
  };

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

    const header = {
      alg: algorithm,
      typ: "JWT"
    }

    const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    const encodeHeader = base64Url(stringifiedHeader);

    // const testData = {
    //   "username": "TW000681",
    //   "timestamp": "",
    //   "locationCode": "50185",
    //   "email": "",
    //   "firstname": "",
    //   "lastname": "",
    //   "sharedUser": "TW000681",
    //   "userType": "ASP",
    //   "role": "ASC TW",
    //   "channelType": "sff-web",
    //   "ascCode": "000679",
    //   "mobileNo": "",
    //   "sub": "",
    //   "outChnSales": "Telewiz",
    //   "outBusinessName": "",
    //   "outPosition": "Owner",
    //   "ou": "PARTNER",
    //   "iat": 1672813236,
    //   "exp": 1672816836,
    // };

    const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(encode));
    const encodedData = base64Url(stringifiedData);
    const token = encodeHeader + "." + encodedData;
    let signature 

    if (algorithm === 'HS256') {
      signature = CryptoJS.HmacSHA256(token, secretKey);
    } else if (algorithm === 'HS384') { 
      signature = CryptoJS.HmacSHA384(token, secretKey);
    } else if (algorithm === 'HS512') { 
      signature = CryptoJS.HmacSHA512(token, secretKey);
    }

    const base64Signature = base64Url(signature);
    const jwt = token + "." + base64Signature;
    dispatch(jwtToken({ jwt: jwt, isError: false, messageError: "" }));
  };

  return (
    <div className="p-4 place-items-center">
      <div className="max-w-7xl mx-auto grid grid-cols-12 h-screen">
        <div className="col-span-12 h-screen">
          <nav className="flex items-center justify-between flex-wrap bg-gray-400 p-1">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
              <div className="p-2">
                <h1 className="font-bold">
                  MODE :{" "}
                  <select
                    className="inline-block 
                  text-sm 
                  px-3 
                  py-2 
                  leading-none 
                  border 
                  rounded 
                  text-black 
                  border-white  
                  hover:bg-white 
                  mt-4 
                  lg:mt-0"
                    onChange={handleSelectOption}
                  >
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                </h1>
              </div>
            </div>
          </nav>

          {selected === "encode" ? (
            <div>
              <div className="p-2">
                <div>
                  <nav className="p-3">
                    <div className="container flex flex-wrap items-center justify-between mx-auto">
                      <div className="flex items-center">
                        <span className="self-center text-xl font-bold whitespace-nowrap dark:text-gray-800 ">
                          ENCODED
                        </span>
                      </div>

                      <div className="flex md:order-1">
                        {jwtTokenReducer.isError ? (
                          <>
                            <img src={ErrorImage} className="h-8 w-8" />
                            <span className="ml-3 font-bold text-red-600">
                              Invalid Signature !
                            </span>
                          </>
                        ) : null}
                      </div>

                      <div className="flex md:order-1"></div>

                      <div className="flex md:order-2">
                        <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
                          <li>
                            <label
                              htmlFor="large-input"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Algorithm
                            </label>
                            <select
                              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg  sm:text-md focus:ring-blue-500 focus:border-blue-500  dark:border-gray-300 dark:placeholder-gray-400 "
                              onChange={handleSelectOptionAlgor}
                            >
                              {algorithms.map((algor) => (
                                <option key={algor.value} value={algor.value}>
                                  {algor.name}
                                </option>
                              ))}
                            </select>
                          </li>
                          <li>
                            <label
                              htmlFor="large-input"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Secret key
                            </label>
                            <input
                              type="text"
                              id="large-input"
                              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg  sm:text-md focus:ring-blue-500 focus:border-blue-500  dark:border-gray-300 dark:placeholder-gray-400 "
                              onChange={handleSecretArea}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </nav>

                  <textarea
                    id="message"
                    rows={4}
                    className="
                      block 
                      p-4
                      w-full 
                      text-sm 
                      text-gray-900 
                      bg-gray-50 
                      rounded-lg 
                      border 
                      border-gray-300 
                      border-dashed border-2 border-gray-300
                      h-96"
                    placeholder="Paste your token here ..."
                    onChange={handleEncodeArea}
                  ></textarea>
                </div>

                <div>
                  <div className="grid place-items-center h-full mt-5">
                    <button
                      className="
                        text-white 
                        bg-neutral-400 
                        bg-blue-500 
                        hover:bg-[#FF9119]/80 
                        focus:ring-4 
                        focus:outline-none 
                        focus:ring-[#FF9119]/50 
                        font-medium 
                        rounded-lg 
                        text-sm 
                        px-5 
                        py-2.5 
                        text-center 
                        inline-flex 
                        items-center 
                        dark:hover:bg-[#FF9119]/80 
                        dark:focus:ring-[#FF9119]/40 
                        mr-1 
                        mb-1"
                      onClick={onEncoded}
                    >
                      ENCODED
                    </button>
                  </div>
                </div>

                <div>
                  <nav className="p-3">
                    <div className="container flex flex-wrap items-center justify-between mx-auto">
                      <div className="flex items-center">
                        <span className="self-center text-xl font-bold whitespace-nowrap dark:text-gray-800 ">
                          RESULT
                        </span>
                      </div>

                      <div className="flex md:order-2">
                        <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
                          <li></li>
                        </ul>
                      </div>
                    </div>
                  </nav>

                  <div>
                    <div className="relative overflow-x-auto">
                      {/* <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              HEADER: ALGORITHM & TOKEN TYPE
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              Apple MacBook Pro 17"
                            </th>
                          </tr>
                        </tbody>
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              PAYLOAD:DATA
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              Apple MacBook Pro 17"
                            </th>
                          </tr>
                        </tbody>
                      </table> */}

                      <textarea
                        id="message"
                        rows={4}
                        className="
                          block 
                          p-4
                          w-full 
                          text-sm 
                          text-gray-900 
                          bg-gray-50 
                          rounded-lg 
                          border 
                          border-gray-300 
                          border-dashed border-2 border-gray-300
                          h-96"
                        placeholder="Paste your token here ..."
                        value={jwtTokenReducer.jwt}
                        onChange={onChangeResultText}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>Decode mode</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonWebToken;
