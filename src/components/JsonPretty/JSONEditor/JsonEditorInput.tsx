import React, { createRef, useEffect, useState, useContext } from "react";
import { saveAs } from "file-saver";
import { FaMaximize, FaMinimize, FaCopy, FaFolderOpen } from "react-icons/fa6";
import { FaSave, FaEraser } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { ThemeContext } from "../../../providers/ThemeProvider";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

import "./JsonEditorInput.css";

type Props = {
  onChangeText: any;
  onError: any;
  container: any;
  onChangeTextFromFile?: any
};

const JsonEditorInput = ({ onChangeText, onError, container, onChangeTextFromFile }: Props) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [toggleFullScreen, setToggleFullScreen] = useState(false);
  const [copyText, setCopyText] = useState("");
  let jsonEditorElementInput: any;
  const options: any = {
    mode: "code",
    modes: ["text", "code", "tree"],
    indentation: 2,
    onError: onError,
    onChangeText: function ($event: any) {
      onChangeText($event);
      jsonEditorElementInput.refresh();
    }
  };

  useEffect(() => {
    jsonEditorElementInput = new JSONEditor(container, options);
    jsonEditorElementInput.update(undefined);
    return () => {
      jsonEditorElementInput.destroy();
    };
  }, []);

  const onClickMaximize = () => {
    setToggleFullScreen(!toggleFullScreen);
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
      reader.onload = () => {
        jsonEditorElementInput.setText(reader.result);
        onChangeTextFromFile(reader.result);
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

  const onCopyToClipBoard = async () => {
    try {
      if (typeof copyText === "string") {
        await navigator.clipboard.writeText(copyText);
      }
      if (typeof copyText === "object") {
        await navigator.clipboard.writeText(JSON.stringify(copyText));
      }
    } catch (error) {
      console.log("error -> ", error);
    }
  };

  return (
    <div
      className={`${toggleFullScreen ? "fullscreen" : "mt-3 ml-3"}`}
      id="jsonEditorInput"
    >
      <div
        className={
          "flex justify-between p-2 gap-2 w-full h-10 text-gray-300 bg-[#1E1E1E] dark:bg-[#5C469C] "
        }
      >
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
            <FaCopy
              size={23}
              className="hover:bg-gray-500"
              title="Copy to clipboard"
              onClick={onCopyToClipBoard}
            />
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
        className={`${toggleFullScreen ? "h-screen" : "h-[93vh]"} ${
          isDark ? "dark-mode" : "light-mode"
        }`}
        ref={(my) => (container = my)}
      />
    </div>
  );
};

export default JsonEditorInput;
