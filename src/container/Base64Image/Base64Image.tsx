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
    <div className="flex flex-col w-full p-4 bg-primary">
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
                      text-primary
                      "
                >
                  Base64 Image Decoded
                </label>
              </div>
              <div className="flex flex-row gap-2">
                <div>
                  <FaCopy
                    size={30}
                    className="text-primary hover:bg-gray-500 p-1"
                    title="Copy"
                    onClick={onCopyText}
                  />
                </div>
                <div>
                  <FaTrashCan
                    size={30}
                    className="text-primary hover:bg-gray-500  p-1"
                    title="Clear"
                    onClick={onClearText}
                  />
                </div>
                <div className="image-upload">
                  <label htmlFor="file-input">
                    <FaFolderOpen
                      size={30}
                      className="text-primary hover:bg-gray-500 p-1"
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
                  bg-secondary
                  text-primary 
                  text-md 
                  w-full 
                  p-4
                  shadow-md 
                  rounded-md"
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
              bg-success
              hover:bg-[#99ca5f]
              whitespace-no-wrap 
              rounded-md 
              shadow-sm
              text-[#ffffff]
              dark:text-dark-300
              dark:hover:bg-[#8bc34a]
              
              " 
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
                text-primary
                bg-[#0092e1] 
                dark:[#00adff]
                rounded 
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
                      text-primary
                      "
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
              whitespace-no-wrap 
              text-[#ffffff]
              dark:text-dark-300
              bg-information
              hover:bg-[#50a1f5]
              dark:hover:bg-[#2196f3]
              rounded-md 
              shadow-sm 
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
                      text-primary
                      "
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
              text-primary
              "
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
                text-primary
              "
              >
                Size: {description.size.toFixed(2)} Kb
              </label>
            </div>
          </div>
        </div>
        <div className="flex place-items-center justify-center mt-4">
          {textArea ? (
            <img
              src={DOMPurify.sanitize(textArea)}
              alt="result"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Base64Image;
