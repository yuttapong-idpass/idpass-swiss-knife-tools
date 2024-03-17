import React, { useState } from "react";
import Photo from "../../assets/images/photo.png";
import ImagePreview from "../../assets/images/image-file.png";
import CopyToClipboardImage from "../../assets/images/documents.png";
import "./FromBase64.css";
import { useSelector } from "react-redux";
import {
  base64Selector,
  descriptionSelector,
  base64,
  descriptions,
  IDescription,
} from "../../store/slice/Base64Slice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAppDispatch } from "../../store/store";

type Props = {};

const options = [
  { value: "base64", text: "Image to base 64" },
  { value: "image", text: "Base64 to image" },
];

const FromBase64 = (props: Props) => {
  const [selected, setSelected] = useState(options[0].value);

  const base64Reducer = useSelector(base64Selector);
  const descriptionReducer = useSelector(descriptionSelector);
  const dispatch = useAppDispatch();

  const onInputImage = (event$: any) => {
    const fileUpload: any = event$.target.files[0];
    const reader: any = new FileReader();

    reader.onload = () => {
      // let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
      // dispatch(base64({ base64: base64String }))
      let images = new Image();
      images.src = reader.result;
      images.onload = () => {
        const height = images.height;
        const width = images.width;
        const base64String = reader.result;

        calculateBase64Size({
          name: "",
          base: base64String,
          height: height,
          width: width,
        });

        dispatch(base64({ base64: base64String, errorImage: false }));
      };
    };
    reader.readAsDataURL(fileUpload);
  };

  const onInputBase64 = (event$: any) => {
    const images = new Image();
    let base64String: any;
    let imageData: any;

    let mimeType = event$.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/);

    if (mimeType) {
      if (mimeType[0] === "image/svg+xml") {
        imageData = event$;
      } else {
        base64String = event$.replace("data:", "").replace(/^.+,/, "");
        imageData = "data:image/png;base64," + base64String;
      }
    } else {
      base64String = event$.replace("data:", "").replace(/^.+,/, "");
      imageData = "data:image/png;base64," + base64String;
    }

    images.src = imageData;
    images.onload = () => {
      const height = images.height;
      const width = images.width;

      calculateBase64Size({
        name: "",
        base: imageData,
        height: height,
        width: width,
      });
    };

    dispatch(base64({ base64: imageData, errorImage: false }));
    images.onerror = (error) => {};
  };

  const calculateBase64Size = (description: any) => {
    const stringLength =
      description.base.length - "data:image/png;base64,".length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    const sizeInKb = sizeInBytes / 1024;
    const data: IDescription = {
      size: sizeInKb,
      height: description.height,
      width: description.width,
      name: "",
    };
    dispatch(descriptions(data));
  };

  const changeTextArea = (event$: any) => {};
  const changeTextAreaBase = (event$: any) => {
    const base64 = event$.target.value;
    onInputBase64(base64);
  };

  const handleSelectOption = ($event: any) => {
    dispatch(base64({ base64: "", errorImage: false }));
    dispatch(descriptions({ name: "", height: 0, size: 0, width: 0 }));
    setSelected($event.target.value);
  };

  return (
    <>
    
    </>



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

export default FromBase64;
