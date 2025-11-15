import React, { useState, useEffect, SyntheticEvent } from "react";
import { useSelector } from "react-redux";
import * as jose from "jose";

import { toast } from "react-toastify";
import ErrorImage from "../../assets/images/cross.png";

import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import ToastNotify from "../../../components/ToastNotify/ToastNotify";
import "./JsonWebToken.css";
type Props = {};

// deepcode ignore HardcodedNonCryptoSecret: <please specify a reason of ignoring this>
const initialJwtValue: any =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkV4YW1wbGUgSldUIiwiaWF0IjoxNTE2MjM5MDIyfQ.HncDT1ysNqeX8wRJnu9qvHXySrjTqzxWAxNPgUZt3f8";

const initialPayload: any = JSON.stringify({});
const initialHeaders: any = JSON.stringify({});

const JsonWebToken = (props: Props) => {
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
      } else {
        toast.error("Secret Error: Please input your secret key!");
      }
    } catch (error: any) {
      toast.error('Encoded Error: ' + error.message);
    }
  };

  const onDecoded = async () => {
    try {
      // deepcode ignore JwtDecodeMethod: <please specify a reason of ignoring this>
      const decodedPayload = jose.decodeJwt(jwtArea);
      const decodedHeaders = jose.decodeProtectedHeader(jwtArea);
      setPayloadArea(JSON.stringify(decodedPayload, null, 2));
      setHeaderArea(JSON.stringify(decodedHeaders, null, 2));
    } catch (error: any) {
      toast.error('Decoded Error: ' + error.message);
    }
  };

  return (
    <main className="w-full p-2  gap-2">
      <ToastNotify />
      <p className="text-xl font-bold underline underline-offset-1 text-primary">
        JWT Parser
      </p>
      <section className="grid grid-cols-9 mt-5">
        <div className="col-span-4">
          <div className="flex flex-col">
            <div>
              <span className="text-md font-bold text-primary">Encoded</span>
            </div>
            <div>
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
                  text-primary
                  h-[90vh]
                  shadow-md
                  rounded-md
                  bg-secondary
                "
                onChange={handleJwtArea}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="col-span-1 p-2">
          <div className="grid place-items-center h-[90vh]">
            <div className="grid grid-rows-3 gap-3">
              <div>
                <span className="text-lg font-bold text-primary mr-2">
                  Alg:
                </span>
                <select
                  name="alg"
                  id="alg"
                  title="alg"
                  className="rounded-md text-primary bg-secondary p-2"
                  onChange={handleSelectOptionAlgorithm}
                >
                  {algorithms.map((item, index) => (
                    <option key={index} value={item.alg}>
                      {item.alg}
                    </option>
                  ))}
                </select>
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
                  bg-yellow-500
                  dark:text-[#2d3748]
                  "
                  onClick={onDecoded}
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
                  onClick={onEncoded}
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
              <span className="text-md font-bold text-primary">Secret</span>
            </div>
            <div className="flex flex-row secret-area p-4 w-full text-md text-primary bg-secondary h-[20vh] rounded-md mb-3 items-center shadow-md">
              <div className="flex flex-col">
                <span
                  className="
                    text-md 
                    font-medium 
                    text-primary 
                    mr-4
                    "
                >
                  {algorithm.algorithm} (
                </span>
                <span
                  className="
                      text-md 
                      font-bold 
                      text-rose-500
                      dark:text-rose-300
                      mr-4
                      "
                >
                  base64UrlEncoded(header) + . +
                </span>
                <span
                  className="
                        text-md
                        font-bold
                        text-yellow-600
                        dark:text-yellow-500
                        mr-4
                      "
                >
                  base64UrlEncoded(payload),
                </span>
                <div>
                  <input
                    type="input"
                    id="secret"
                    className="h-10 p-2 rounded-md shadow-md"
                    onChange={handleSecretKey}
                  />{" "}
                  )
                </div>
                <div className="mt-2 items-center flex-center">
                  <input
                    type="checkbox"
                    id="secretEncoded"
                    className="w-4 h-4 text-primary"
                    onChange={handleEncodedSecretKey}
                    defaultChecked={encodedSecret}
                  />
                  <span
                    className="
                    ml-2
                    text-md
                    font-bold
                    text-primary
                    align-self-center
                  "
                  >
                    Secret base64 encoded
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className=" flex flex-col">
            <span className="text-md font-bold text-primary">Headers</span>
            <textarea
              name="headers"
              title="headers"
              id="headers"
              rows={8}
              className="
                block
                p-4
                w-full
                text-md
                h-[15vh]
                rounded-md
                border
                shadow-md
                mb-3
                bg-secondary
                text-rose-500
                dark:text-rose-300
                "
              value={headerArea}
              onChange={handleHeadersArea}
            ></textarea>
          </div>
          <div>
            <div>
              <span className="text-md font-bold text-primary">Payload</span>
              <textarea
                name="payload"
                id="payload"
                className="
                  block 
                  p-4 
                  w-full 
                  text-md 
                  shadow-md 
                  rounded-md 
                  bg-secondary
                  h-[47vh] 
                  text-yellow-600
                  dark:text-yellow-500
                  "
                value={payloadArea}
                onChange={handlePayloadArea}
              ></textarea>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default JsonWebToken;
