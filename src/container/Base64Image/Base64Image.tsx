import React, { SyntheticEvent, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import CopyToClipboardImage from "../../assets/images/documents.png";
import "./Base64Image.css";
import { useSelector } from "react-redux";
import { IDescription } from "../../store/slice/Base64Slice";

import { FaFolderOpen, FaTrashCan, FaCopy } from "react-icons/fa6";
import ToastNotify from "../../components/ToastNotify/ToastNotify";
import { toast } from "react-toastify";
type Props = {};

const Base64Image = (props: Props) => {
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [base64Text, setBase64Text] = useState("");
  const [textArea, setTextArea] = useState("");
  const [description, setDescription] = useState({
    size: 0,
    height: 0,
    width: 0,
  });

  useEffect(() => {
    if (autoGenerate) {
      generateImage();
    }
  }, [base64Text, autoGenerate]);

  const onUploadFileImage = ($event: any) => {
    const reader: any = new FileReader();
    try {
      reader.onload = function (e: any) {
        setBase64Text(reader.result);
      };
      reader.readAsDataURL($event.target.files[0]);
      $event.target.value = null;
    } catch (error) {
      console.log("error ->", error);
    }
  };

  const generateImage = () => {
    const images = new Image();
    let base64String: any = base64Text;
    let imageData: any;
    let mimeType = base64Text.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/);
    if (!!base64String) {
      if (mimeType) {
        if (mimeType[0] === "image/svg+xml") {
          imageData = base64Text;
        } else if (mimeType[0] !== "image/svg+xml" && !!mimeType[0]) {
          imageData = base64String;
        } else {
          imageData =
            "data:image/png;base64," +
            base64String.replace("data:", "").replace(/^.+,/, "");
        }
      } else {
        imageData =
          "data:image/png;base64," +
          base64String.replace("data:", "").replace(/^.+,/, "");
      }

      images.src = imageData;
      images.onload = async () => {
        const height = images.height;
        const width = images.width;
        calculateBase64Size({
          name: "",
          base64: imageData,
          height: height,
          width: width,
        });
      };
      setTextArea(imageData);
    }

    images.onerror = (error) => {};
  };

  const calculateBase64Size = (description: any) => {
    const stringLength =
      description.base64.length - "data:image/png;base64,".length;
    const sizeInBytes: number =
      4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    const sizeInKb: number = sizeInBytes / 1024;
    const data: IDescription = {
      size: sizeInKb,
      height: description.height,
      width: description.width,
      name: "",
    };
    setDescription({
      size: data.size!,
      height: data.height!,
      width: data.width!,
    });
  };

  const onClearText = () => {
    setTextArea("");
    setBase64Text("");
    setDescription({ size: 0, height: 0, width: 0 });
  };

  const onCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textArea);
      toast.success("Copies!");
    } catch (error) {
      console.log("Copy error text ->", error);
    }
  };

  const handleCheckBoxAutoGenerate = ($event: SyntheticEvent<EventTarget>) => {
    const checkBoxEvent = ($event.target as HTMLInputElement).checked;
    setAutoGenerate(checkBoxEvent);
  };

  const handleTextArea = ($event: SyntheticEvent<EventTarget>) => {
    const valueTextArea = ($event.target as HTMLInputElement).value;
    setBase64Text(valueTextArea);
  };

  return (
    <div className="flex flex-col w-full p-4">
      <ToastNotify />
      <div className="flex flex-row">
        <div className="flex-initial w-full">
          <div className="flex flex-col">
            <div className="flex flex-row w-full justify-between">
              <div>
                <label
                  htmlFor="base64"
                  className="block 
                      mb-2 
                      text-lg 
                      font-medium 
                    text-gray-800 
                    dark:text-gray-300"
                >
                  Base64 Image Decoded
                </label>
              </div>
              <div className="flex flex-row gap-2">
                <div>
                  <FaCopy
                    size={30}
                    className="text-gray-800 hover:bg-gray-500 dark:text-gray-300 p-1"
                    title="Copy"
                    onClick={onCopyText}
                  />
                </div>
                <div>
                  <FaTrashCan
                    size={30}
                    className="text-gray-800 hover:bg-gray-500 dark:text-gray-300 p-1"
                    title="Clear"
                    onClick={onClearText}
                  />
                </div>
                <div className="image-upload">
                  <label htmlFor="file-input">
                    <FaFolderOpen
                      size={30}
                      className="text-gray-800 hover:bg-gray-500 dark:text-gray-300 p-1"
                      title="Upload file"
                    />
                  </label>
                  <input
                    type="file"
                    id="file-input"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={onUploadFileImage}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="control">
                <textarea
                  name="base64"
                  id="base64Area"
                  rows={8}
                  value={base64Text}
                  onChange={handleTextArea}
                  className="
                  break-words
                  base64input
                  block
                bg-gray-50 
                  border 
                border-gray-300 
                text-gray-900 
                  text-md 
                  w-full 
                  p-2 
                dark:bg-gray-700 
                dark:border-gray-600 
                dark:placeholder-gray-400 
                dark:text-white"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-initial w-1/4">
          <div className="flex mt-10 ml-6 mr-6 flex-col items-center justify-center">
            <div className="w-full">
              <button
                title="Generate"
                className="              
              inline-flex 
              w-full 
              item-centers 
              justify-center 
              px-4
              py-4 
              text-base 
              font-medium 
              leading-6 
              text-white 
              dark:text-gray-200 
              whitespace-no-wrap 
              bg-lime-500 
              rounded-md 
              shadow-sm 
              hover:bg-lime-400"
                onClick={generateImage}
              >
                Generate Image
              </button>
            </div>
            <div className="mt-2 w-full">
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
                defaultChecked={true}
                onChange={handleCheckBoxAutoGenerate}
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
                Auto generate
              </label>
            </div>
            <div className="mt-2 w-full">
              <a
                title="Generate"
                className="              
              inline-flex 
              w-full 
              item-centers 
              justify-center 
              px-4
              py-4 
              text-base 
              font-medium 
              leading-6 
              dark:text-gray-200 
              whitespace-no-wrap 
              text-white
              bg-sky-600 
              rounded-md 
              shadow-sm 
              hover:bg-sky-400
              hover:text-sky-200  
              "
                download="fromBase64Image.png"
                href={textArea}
              >
                Download Image
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-6">
        <div className="flex justify-between">
          <div>
            <label
              htmlFor="base64"
              className=" 
                      mb-2 
                      text-lg 
                      font-medium 
                    text-gray-800 
                    dark:text-gray-300"
            >
              Preview Image
            </label>
          </div>
          <div className="flex gap-4">
            <div>
              <label
                htmlFor="base64"
                className=" 
              mb-2 
              text-lg 
              font-medium 
              text-gray-800 
              dark:text-gray-300"
              >
                Dimensions : {description.width} x {description.height}
              </label>
            </div>
            <div>
              <label
                htmlFor="base64"
                className=" 
                mb-2 
                text-lg 
                font-medium 
              text-gray-800 
              dark:text-gray-300"
              >
                Size: {description.size.toFixed(2)} Kb
              </label>
            </div>
          </div>
        </div>
        <div className="flex place-items-center justify-center mt-4">
          {textArea ? (
            <img
              className="border"
              src={DOMPurify.sanitize(textArea)}
              alt="result"
            />
          ) : null}
        </div>
      </div>
    </div>

    // <div className="p-4 place-items-center">
    //   <div className="max-w-7xl mx-auto grid grid-cols-12">
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

    //       {selected === "base64" ? (
    //         <div>
    //           <div className="p-2 m-6 border-dashed border-2 border-gray-300 rounded-2xl grow">
    //             <div className="grid place-items-center h-full">
    //               <div className="image-upload">
    //                 <label htmlFor="file-input">
    //                   <div className="text-white bg-neutral-400 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
    //                     <img
    //                       className="fill-current w-10 h-10 mr-2 -ml-1 cursor"
    //                       src={Photo}
    //                     />
    //                     Upload image
    //                   </div>
    //                 </label>
    //                 <input
    //                   id="file-input"
    //                   type="file"
    //                   accept="image/png, image/gif, image/jpeg"
    //                   onChange={onInputImage}
    //                 />
    //               </div>

    //               <div>
    //                 <span className="text-lg font-bold">Preview image</span>
    //               </div>

    //               {/* <img src={base64Reducer.base64} className="h-10 w-10" /> */}

    //               {!!base64Reducer.base64.base64 ? (
    //                 <div>
    //                   <img
    //                     src={base64Reducer.base64.base64}
    //                     className="h-56 w-full"
    //                   />
    //                   <p className="text-m">
    //                     <span className="font-bold">Scale: </span>{" "}
    //                     {descriptionReducer.description.height} x{" "}
    //                     {descriptionReducer.description.width}{" "}
    //                   </p>
    //                   <p className="text-m">
    //                     <span className="font-bold">Size: </span>
    //                     {descriptionReducer.description.size?.toFixed(2)} kb
    //                   </p>
    //                 </div>
    //               ) : (
    //                 <img src={ImagePreview} className="h-10 w-10" />
    //               )}
    //             </div>
    //           </div>

    //           <div className="m-6">
    //             <div className="rounded-2xl h-32">
    //               <nav className="p-3">
    //                 <div className="container flex flex-wrap items-center justify-between mx-auto">
    //                   <div className="flex items-center">
    //                     <span className="self-center text-xl font-bold whitespace-nowrap dark:text-gray-800 ">
    //                       OUTPUT
    //                     </span>
    //                   </div>

    //                   <div className="flex md:order-2">
    //                     <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
    //                       <li>
    //                         <CopyToClipboard
    //                           text={base64Reducer.base64.base64
    //                             .replace("data:", "")
    //                             .replace(/^.+,/, "")}
    //                           onCopy={() => {}}
    //                         >
    //                           <img
    //                             src={CopyToClipboardImage}
    //                             className="h-8 w-8 cursor hover:bg-[#FF9119]/80  focus:ring-[#FF9119]/50 dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 rounded-lg"
    //                           />
    //                         </CopyToClipboard>
    //                       </li>
    //                     </ul>
    //                   </div>
    //                 </div>
    //               </nav>

    //               <textarea
    //                 id="message"
    //                 rows={4}
    //                 className="
    //               block
    //               p-4
    //               w-full
    //               text-sm
    //               text-gray-900
    //               bg-gray-50
    //               rounded-lg
    //               border
    //               border-gray-300
    //               border-dashed border-2 border-gray-300
    //               h-96"
    //                 placeholder="Base 64 here..."
    //                 value={base64Reducer.base64.base64
    //                   .replace("data:", "")
    //                   .replace(/^.+,/, "")}
    //                 onChange={changeTextArea}
    //               ></textarea>
    //             </div>
    //           </div>
    //         </div>
    //       ) : (
    //         <div>
    //           <div className="p-2 m-6 rounded-2xl grow">
    //             <div className="grid place-items-center h-full">
    //               <textarea
    //                 id="message"
    //                 rows={4}
    //                 className="
    //               block
    //               p-4
    //               w-full
    //               text-sm
    //               text-gray-900
    //               bg-gray-50
    //               rounded-lg
    //               border
    //               border-gray-300
    //               border-dashed border-2 border-gray-300
    //               h-96"
    //                 onChange={changeTextAreaBase}
    //                 placeholder="Base 64 here..."
    //               ></textarea>
    //             </div>
    //           </div>

    //           <div className="m-6">
    //             <div className="rounded-2xl h-32">
    //               <nav className="p-3">
    //                 <div className="container flex flex-wrap items-center justify-between mx-auto">
    //                   <div className="flex items-center">
    //                     <span className="self-center text-xl font-bold whitespace-nowrap dark:text-gray-800 ">
    //                       OUTPUT
    //                     </span>
    //                   </div>

    //                   <div className="flex md:order-2">
    //                     <ul className="flex flex-col mt-2 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent md:dark:bg-transparent ">
    //                       <li>
    //                         {!!base64Reducer.base64.base64 ? (
    //                           <a
    //                             className="
    //                             text-white
    //                             bg-neutral-400
    //                             bg-blue-500
    //                             hover:bg-[#FF9119]/80
    //                             focus:ring-4
    //                             focus:outline-none
    //                             focus:ring-[#FF9119]/50
    //                             font-medium
    //                             rounded-lg
    //                             text-sm px-5
    //                             py-2.5
    //                             text-center
    //                             inline-flex
    //                             items-center
    //                             dark:hover:bg-[#FF9119]/80
    //                             dark:focus:ring-[#FF9119]/40
    //                             mr-1
    //                             mb-1"
    //                             download="convertFromBase64Image.png"
    //                             href={base64Reducer.base64.base64}
    //                           >
    //                             Download
    //                           </a>
    //                         ) : null}
    //                       </li>
    //                     </ul>
    //                   </div>
    //                 </div>
    //               </nav>

    //               <div>
    //                 <div className="grid place-items-center h-full">
    //                   <span className="text-lg font-bold">Preview image</span>
    //                   {!!base64Reducer.base64.base64 ? (
    //                     <div>
    //                       <img
    //                         src={base64Reducer.base64.base64}
    //                         className="h-full w-full"
    //                       />
    //                       <p className="text-m">
    //                         <span className="font-bold">Scale: </span>{" "}
    //                         {descriptionReducer.description.height} x{" "}
    //                         {descriptionReducer.description.width}{" "}
    //                       </p>
    //                       <p className="text-m">
    //                         <span className="font-bold">Size: </span>
    //                         {descriptionReducer.description.size?.toFixed(2)} kb
    //                       </p>

    //                       <div className="grid place-items-center h-full">
    //                         <a
    //                           className="
    //                             text-white
    //                             bg-neutral-400
    //                             bg-blue-500
    //                             hover:bg-[#FF9119]/80
    //                             focus:ring-4
    //                             focus:outline-none
    //                             focus:ring-[#FF9119]/50
    //                             font-medium
    //                             rounded-lg
    //                             text-sm
    //                             px-5
    //                             py-2.5
    //                             text-center
    //                             inline-flex
    //                             items-center
    //                             dark:hover:bg-[#FF9119]/80
    //                             dark:focus:ring-[#FF9119]/40
    //                             mr-1
    //                             mb-1"
    //                           download="convertFromBase64Image.png"
    //                           href={base64Reducer.base64.base64}
    //                         >
    //                           Download
    //                         </a>
    //                       </div>
    //                     </div>
    //                   ) : (
    //                     <img src={ImagePreview} className="h-10 w-10" />
    //                   )}
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

export default Base64Image;
