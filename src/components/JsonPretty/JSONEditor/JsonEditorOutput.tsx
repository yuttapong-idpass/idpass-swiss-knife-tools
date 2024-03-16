import React, { useState, useEffect, useContext } from "react";
import { saveAs } from "file-saver";
import { FaMaximize, FaMinimize, FaCopy, FaFolderOpen } from "react-icons/fa6";
import { FaSave, FaEraser } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { ThemeContext } from "../../../providers/ThemeProvider";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

import "./JsonEditorOutput.css";

type Props = {
  onError: any;
  text: any;
  container: any;
};

const JsonEditor = ({ onError, text, container }: Props) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  let [toggleFullScreen, setToggleFullScreen] = useState(false);
  let [copyText, setCopyText] = useState("");
  let jsonEditorElementOutput: any;
  const options: any = {
    mode: "code",
    modes: ["text", "code", "tree"],
    indentation: 2,
    onClassName: 'light_mode',
    onError: onError,
    onChangeText: function ($event: any) {
      setCopyText($event);
      jsonEditorElementOutput.refresh();
    }
  };

  useEffect(() => {
    jsonEditorElementOutput = new JSONEditor(container, options);
    jsonEditorElementOutput.update(text);
    return () => {
      jsonEditorElementOutput.destroy();
    };
  }, [text]);

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
      console.log("file path ==>", filePath);
      reader.onload = () => {
        jsonEditorElementOutput.setText(reader.result);
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
      const blob = new Blob([jsonEditorElementOutput.getText()], {
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
      await navigator.clipboard.writeText(JSON.stringify(copyText));
    } catch (error) {
      console.log("error -> ", error);
    }
  };

  return (
    <>
      <div
        className={`${toggleFullScreen ? "fullscreen" : "mt-3 ml-3 mr-3"}`}
        id="jsonEditorInput"
      >
        <div className="flex justify-between p-2 gap-2 w-full h-10  bg-[#1e1e1e] dark:bg-[#5c469c] text-gray-300">
          <div>Output Panel</div>
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
    </>
  );
};

export default JsonEditor;
