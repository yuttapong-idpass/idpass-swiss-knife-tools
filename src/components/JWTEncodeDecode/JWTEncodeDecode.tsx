import React, { useState, useEffect } from "react";
import FullScreenImage from "../../assets/images/full-screen.png";
import ExitFullScreenImage from "../../assets/images/exit-fullscreen.png";
import CryptoJS from "crypto-js";
import { useSelector } from "react-redux";
import { jwtToken, jwtTokenSelector } from "../../store/slice/jwtTokenSlice";
import { useAppDispatch } from "../../store/store";

type Props = {};

const JWTEncodeDecode = (props: Props) => {
  const jwtTokenReducer = useSelector(jwtTokenSelector);
  const dispatch = useAppDispatch();

  const options = [
    { value: "encode", text: "encode" },
    { value: "decode", text: "decode" },
  ];

  const [selected, setSelected] = useState(options[0].value);
  const [jsonArea, setJsonArea] = useState({});
  const [token, setToken] = useState("");
  const [jsonToken, setJsonToken] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSelectOption = ($event: any) => {
    setSelected($event.target.value);
  };

  const handleTextArea = (event$: any) => {
    try {
      let setting = JSON.parse(event$.target.value);
      //   dispatch(
      //     jwtToken({
      //       jwt: setting,
      //       isError: false,
      //       messageError: "",
      //     })
      //   );
      setJsonArea(setting);
      setIsError(false);
    } catch (error) {
      //   dispatch(
      //     jwtToken({
      //       jwt: "",
      //       isError: true,
      //       messageError: String(error),
      //     })
      //   );
      setIsError(true);
      setMessageError(String(error));
    }
  };

  const handleResult = () => {
    if (isError) {
      dispatch(
        jwtToken({ jwt: "", isError: true, messageError: messageError })
      );
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
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    const encodeHeader = base64Url(stringifiedHeader);

    // const testData = {
    //   username: "TW000681",
    //   timestamp: "",
    //   locationCode: "50185",
    //   email: "",
    //   firstname: "",
    //   lastname: "",
    //   sharedUser: "TW000681",
    //   userType: "ASP",
    //   role: "ASC TW",
    //   channelType: "sff-web",
    //   ascCode: "000679",
    //   mobileNo: "",
    //   sub: "",
    //   outChnSales: "Telewiz",
    //   outBusinessName: "",
    //   outPosition: "Owner",
    //   ou: "PARTNER",
    //   iat: 1672813236,
    //   exp: 1672816836,
    // };

    const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(jsonArea));
    const encodedData = base64Url(stringifiedData);
    const token = encodeHeader + "." + encodedData;
    const secretKey = ",TH0.n3SG0UL]^R/Q$v}aO#.V2gzbj";
    const signature = CryptoJS.HmacSHA256(token, secretKey);
    const base64Signature = base64Url(signature);

    const test = token + "." + base64Signature;

    console.log("test -->", test);
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="h-screen">
          <div className="border" style={{ height: "47%" }}>
            <div className={`flex flex-col h-full`}>
              <div className="border">
                <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-1">
                  <div className="flex items-center flex-shrink-0 text-white mr-6">
                    {/* <img
                    src={FloppyDiskImage}
                    className="fill-current h-8 w-8 mr-2 p-1 cursor"
                    width={"50%"}
                    height={"50%"}
                  /> */}
                    <img
                      src={FullScreenImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                    />

                    <select
                      className="inline-block text-sm px-3 py-1 leading-none border rounded text-black border-white  hover:bg-white mt-4 lg:mt-0"
                      value={selected}
                      onChange={handleSelectOption}
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </nav>
              </div>
              <div className="border grow">
                <textarea
                  id="inputText"
                  className="w-full h-full resize-none p-2"
                  placeholder="Input here ..."
                  onChange={handleTextArea}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="border" style={{ height: "6%" }}>
            <div className="flex flex-col items-center">
              <div className="flex flex-row">
                <div>
                    <input type="text"/>
                </div>
                <div>
                  <button
                    className="
            justify-self-end 
            bg-blue-500 
            hover:bg-blue-400 
            text-white 
            font-bold
            mt-1 
            py-1 
            px-4 
            border-b-4 
            border-blue-700 
            hover:border-blue-500 
            rounded"
                    onClick={handleResult}
                  >
                    RESULT
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="border" style={{ height: "47%" }}>
            <div className={`flex flex-col h-full`}>
              <div className="border">
                <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-1">
                  <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <img
                      src={FullScreenImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                    />
                  </div>
                </nav>
              </div>
              <div className="border grow">
                {jwtTokenReducer.isError ? (
                  <pre style={{ color: "red" }}>
                    {jwtTokenReducer.messageError}
                  </pre>
                ) : (
                  <textarea
                    id="inputText"
                    className="w-full h-full resize-none p-2"
                    placeholder="Input here ..."
                    onChange={handleTextArea}
                  ></textarea>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JWTEncodeDecode;
