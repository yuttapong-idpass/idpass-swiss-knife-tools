import React, { createRef, useEffect, useState } from "react";
import { FaMaximize, FaMinimize, FaCopy, FaFolderOpen } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

import "./JsonEditorInput.css";

type Props = {
  onChangeJSON: any;
  onError: any;
  json: any;
};

const JsonEditorInput = (props: Props) => {
  let container: any = createRef<HTMLElement>();
  let [toggleFullScreen, setToggleFullScreen] = useState(false);

  useEffect(() => {
    const options: any = {
      mode: "code",
      modes: ["text", "code", "tree", "form", "view"],
      indentation: 2,
      // onError: function (err: any) {
      //   console.error(err);
      // },
      onError: props.onError,
      onChangeText: props.onChangeJSON,
    };

    let jsoneditor = new JSONEditor(container, options);
    jsoneditor.set(props.json);

    return () => {
      jsoneditor.destroy();
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
      console.log("file path ==>", filePath);
    }
  };

  return (
    <div
      className={`${toggleFullScreen ? "fullscreen" : "mt-3 ml-3"}`}
      id="jsonEditorInput"
    >
      <div className="flex justify-between p-2 gap-4 w-full h-8  bg-sky-950 text-cyan-50">
        <div>Input Panel</div>
        <div className="flex gap-4">
          <div>
            <div className="image-upload">
              <label htmlFor="file-input">
                <FaFolderOpen size={20} className="hover:bg-gray-500" />
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
            <FaSave size={20} className="hover:bg-gray-500" />
          </div>
          <div>
            <FaCopy size={20} className="hover:bg-gray-500" />
          </div>
          <div onClick={onClickMaximize}>
            {toggleFullScreen ? (
              <FaMinimize size={20} className="hover:bg-gray-500" />
            ) : (
              <FaMaximize size={20} className="hover:bg-gray-500" />
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
