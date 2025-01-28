import React, { SyntheticEvent, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import CopyToClipboardImage from "../../assets/images/documents.png";
import "./Base64Image.css";
import { useSelector } from "react-redux";

import { FaFolderOpen, FaTrashCan, FaCopy } from "react-icons/fa6";
import ToastNotify from "../../../components/ToastNotify/ToastNotify";
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
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const generateImage = () => {
    const images = new Image();
    let base64String: any = base64Text;
    let imageData: any;
    let mimeType = base64Text.match(new RegExp(/[^:]\w+\/[\w-+\d.]+(?=;|,)/));
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
    const data: any = {
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
    <main className="w-full p-2 gap-2">
      <ToastNotify />
      <p className="text-xl font-bold underline underline-offset-1 text-primary">
        Base 64 Image
      </p>
      <div className="grid grid-cols-2 mt-5">
        <div className="col-span-2">
          <div className="flex flex-row">
            <div className="flex flex-col flex-initial w-3/4">
              <div className="flex flex-row w-full justify-between">
                <span className="text-md font-bold text-primary">Input</span>
                <div className="flex flex-row gap-2 mb-2">
                  <FaCopy
                    title="copy"
                    id="copy"
                    size={30}
                    className="text-primary p-1"
                    onClick={onCopyText}
                  />
                  <FaTrashCan
                    title="trash"
                    id="trash"
                    size={30}
                    className="text-primary p-1"
                    onClick={onClearText}
                  />

                  <div className="image-upload">
                    <label htmlFor="file-input">
                      <FaFolderOpen
                        title="trash"
                        id="trash"
                        size={30}
                        className="text-primary p-1"
                        onClick={onClearText}
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
              <div className="w-full">
                <textarea
                  name="base64"
                  id="base64"
                  rows={8}
                  className="
                    break-word 
                    base64input 
                    block 
                    bg-secondary 
                    text-primary 
                    text-md 
                    w-full 
                    p-4 
                    shadow-md 
                    rounded-md"
                  value={base64Text}
                  onChange={handleTextArea}
                ></textarea>
              </div>
            </div>
            <div className="flex flex-col flex-initial w-1/4">
              <div className="flex mt-10 ml-3 flex-col gap-4">
                <button
                  title="generate"
                  id="generate"
                  className="w-full item-centers justify-center px-4 py-4 font-bold leading-6 rounded-md shadow-sm text-white dark:text-[#2d3748] bg-yellow-500"
                  onClick={generateImage}
                >
                  Generate Image
                </button>

                <div>
                  <input
                    type="checkbox"
                    id="autoGenerate"
                    className="w-4 h-4 text-primary rounded"
                    defaultChecked={true}
                    onChange={handleCheckBoxAutoGenerate}
                  />
                  <span className="ms-2 text-lg font-medium text-primary">
                    Auto Generate
                  </span>
                </div>

                <a
                  title="download"
                  id="download"
                  className="w-full item-centers text-center justify-center px-4 py-4 font-bold leading-6 rounded-md shadow-sm text-white dark:text-[#2d3748] bg-violet-400"
                  download="fromBase64Image.png"
                  href={textArea}
                >
                  Download Image
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4 mt-4">
          <div className="flex flex-col">
            <div className="flex flex-row w-full justify-between">
              <span className="text-md font-bold text-primary">Output</span>
              <div className="flex gap-4">
                <span className="mb-2 text-lg font-bold text-primary">
                  Dimension: {description.width} x {description.height}
                </span>
                <span className="mb-2 text-lg font-bold text-primary">
                  Size: {description.size.toFixed(2)} Kb
                </span>
              </div>
            </div>
            <div className="flex place-items-center justify-center mt-4">
              {textArea ? (
                <img alt="result" src={DOMPurify.sanitize(textArea)} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Base64Image;
