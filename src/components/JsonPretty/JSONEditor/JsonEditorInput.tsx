import React, { createRef, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { FaMaximize, FaMinimize, FaCopy, FaFolderOpen } from "react-icons/fa6";
import { FaSave, FaEraser } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

import "./JsonEditorInput.css";
import CopyToClipboard from "react-copy-to-clipboard";

type Props = {
  onChangeJSON: any;
  onError: any;
  json: any;
  container: any;
};

const JsonEditorInput = ({ onChangeJSON, onError, json, container }: Props) => {
  let [toggleFullScreen, setToggleFullScreen] = useState(false);
  let [copyText, setCopyText] = useState("");
  let jsonEditorElementInput: any;
  const options: any = {
    mode: "code",
    modes: ["text", "code", "tree"],
    indentation: 2,
    // onError: function (err: any) {
    //   console.error(err);
    // },
    onError: onError,
    onChangeText: onChangeJSON,
  };

  useEffect(() => {
    jsonEditorElementInput = new JSONEditor(container, options);
    jsonEditorElementInput.set(json);
    return () => {
      jsonEditorElementInput.destroy();
    };
  }, []);

  const onClickMaximize = () => {
    setToggleFullScreen(!toggleFullScreen);
  };

  const onDeleteText = () => {
    jsonEditorElementInput.setText();
  };

  const onClickUploadTextFile = ($event: any) => {
    // const fileUpload: any = $event.target.files[0];
    const reader: any = new FileReader();
    const filePath: any = $event.target.value;
    const validateExtension = new RegExp(/(\.json|\.txt)$/i);
    if (!validateExtension.exec(filePath)) {
      console.log("not allow file type");
      filePath.value = "";
      return false;
    } else {
      console.log("file path ==>", filePath);
      reader.onload = () => {
        jsonEditorElementInput.setText(reader.result);
      };
      reader.readAsText($event.target.files[0]);
    }
  };

  const onClickSaveJsonFile = () => {
    let fileName = window.prompt("Save as...");
    if (!!fileName) {
      if (fileName?.indexOf(".") === -1) {
        fileName = fileName + ".json";
      } else {
        if (fileName?.split(".").pop()?.toLowerCase() === "json") {
          // Nothing to do
        } else {
          fileName = fileName?.split(".")[0] + ".json";
        }
      }
      const blob = new Blob([jsonEditorElementInput.getText()], {
        type: "application/json;charset=utf-8",
      });
      saveAs(blob, fileName);
    } else {
      //! nothing
      return;
    }
  };

  const onCopyToClipBoard = () => {
    console.log('json', jsonEditorElementInput.getText());


    // setCopyText(jsonEditorElementInput.getText());
  };

  return (
    <div
      className={`${toggleFullScreen ? "fullscreen" : "mt-3 ml-3"}`}
      id="jsonEditorInput"
    >
      <div className="flex justify-between p-2 gap-2 w-full h-8  bg-sky-950 text-gray-300">
        <div>Input Panel</div>
        <div className="flex gap-3">
          <div>
            <div className="image-upload">
              <label htmlFor="file-input">
                <FaFolderOpen
                  size={23}
                  className="hover:bg-gray-500"
                  title="Upload file"
                />
              </label>
              <input
                id="file-input"
                type="file"
                accept=".json,.txt"
                onChange={onClickUploadTextFile}
              />
            </div>
          </div>
          <div>
            <FaSave
              size={23}
              className="hover:bg-gray-500"
              title="Save file"
              onClick={onClickSaveJsonFile}
            />
          </div>
          <div>
            <CopyToClipboard text={copyText} onCopy={() => {}}>
              <span onClick={onCopyToClipBoard}>
                Copy to clipboard with span
              </span>
            </CopyToClipboard>
            {/* <FaCopy size={23} className="hover:bg-gray-500" title="Copy text" onClick={onCopyToClipBoard}/> */}
          </div>
          <div>
            <FaEraser size={20} onClick={onDeleteText} />
          </div>
          <div onClick={onClickMaximize}>
            {toggleFullScreen ? (
              <FaMinimize
                size={23}
                className="hover:bg-gray-500"
                title="Minimize"
              />
            ) : (
              <FaMaximize
                size={23}
                className="hover:bg-gray-500"
                title="Maximize"
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={`${toggleFullScreen ? "h-screen" : "h-[93vh]"}`}
        ref={(my) => (container = my)}
      />
    </div>
  );
};

export default JsonEditorInput;
