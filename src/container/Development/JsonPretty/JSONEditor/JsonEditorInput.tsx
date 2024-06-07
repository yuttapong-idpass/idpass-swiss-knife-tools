import React, {
  createRef,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import { saveAs } from "file-saver";
import { FaMaximize, FaMinimize, FaCopy, FaFolderOpen } from "react-icons/fa6";
import { FaSave, FaEraser } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { ThemeContext } from "../../../../providers/ThemeProvider";
import "vanilla-jsoneditor/themes/jse-theme-dark.css";
import { JSONEditor, JSONEditorPropsOptional, Mode } from "vanilla-jsoneditor";
import ToastNotify from "../../../../components/ToastNotify/ToastNotify";
import "./JsonEditorInput.css";
import { toast } from "react-toastify";

type Props = {
  onChangeText: any;
  onError: any;
  text?: any
};

const JsonEditorInput = (props: Props) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<JSONEditor | null>(null);
  const [toggleFullScreen, setToggleFullScreen] = useState(false);

  useEffect(() => {
    //create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current!,
      props: {
        onChange(content: any, previousContent, status) {
          props.onChangeText(JSON.parse(content.text));
        },
        onError(error: Error) {
          props.onError(error);
        },
        mode: Mode.text,
      },
    });

    return () => {
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // update props
    if (refEditor.current) {
      // refEditor.current.updateProps(props);
      if (typeof props.text === 'string') {
        refEditor.current.update({ text: props.text });
      }

      // if (typeof props.text === 'object') { 
      //   refEditor.current.update({ json: props.text });        
      // }
    }
  }, [props]);

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
    } else {
      reader.onload = () => {
        refEditor.current?.update({ json: JSON.parse(reader.result) });
        props.onChangeText(refEditor.current?.get());
      };
      reader.readAsText($event.target.files[0]);
      $event.target.value = null; 
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
      let currentData: any = refEditor.current?.get();
      if (!!currentData.text) {
        const blob = new Blob([currentData.text], {
          type: "application/json;charset=utf-8",
        });
        saveAs(blob, fileName);
      }

      if (!!currentData.json) {
        const blob = new Blob([JSON.stringify(currentData.json, null, 4)], {
          type: "application/json;charset=utf-8",
        });
        saveAs(blob, fileName);
      }
    } else {
      //! nothing
      return;
    }
  };

  const onCopyToClipBoard = async () => {
    try {
      const getCurrentValue: any = refEditor.current?.get();
      if (!!getCurrentValue.text) {
        await navigator.clipboard.writeText(getCurrentValue?.text);
      }

      if (!!getCurrentValue.json) {
        await navigator.clipboard.writeText(JSON.stringify(getCurrentValue?.json, null, 4));
      }
      toast.success("Copies!");
    } catch (error) {
      console.log("error -> ", error);
    }
  };

  return (
    <div
      className={`${toggleFullScreen ? "fullscreen" : "mt-3 ml-3"} shadow-xl`}
      id="jsonEditorInput"
    >
      <ToastNotify />
      <div
        className={
          "flex justify-between p-2 gap-2 w-full h-10  text-[#ffffff] bg-[#007ac7] dark:bg-[#007ac7] "
        }
      >
        <div>Input Panel</div>
        <div className="flex gap-3">
          <div>
            <div className="image-upload">
              <label htmlFor="file-input">
                <FaFolderOpen
                  size={23}
                  className="hover:bg-[#00adff]"
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
              className="hover:bg-[#00adff]"
              title="Save file"
              onClick={onClickSaveJsonFile}
            />
          </div>
          <div>
            <FaCopy
              size={23}
              className="hover:bg-[#00adff]"
              title="Copy to clipboard"
              onClick={onCopyToClipBoard}
            />
          </div>
          <div onClick={onClickMaximize}>
            {toggleFullScreen ? (
              <FaMinimize
                size={23}
                className="hover:bg-[#00adff]"
                title="Minimize"
              />
            ) : (
              <FaMaximize
                size={23}
                className="hover:bg-[#00adff]"
                title="Maximize"
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={`${toggleFullScreen ? "h-screen" : "h-[87vh]"} ${
          isDark ? "jse-theme-dark" : "input-json"
        }`}
        ref={refContainer}
      />
    </div>
  );
};

export default JsonEditorInput;
