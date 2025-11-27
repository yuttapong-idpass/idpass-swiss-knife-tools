import React, { useEffect, useState, useRef } from "react";
import "vanilla-jsoneditor/themes/jse-theme-dark.css";
import "./JsonEditorInput.css";
import { createJSONEditor } from "vanilla-jsoneditor";
import {
  faStar,
  faFolder,
  faFloppyDisk,
  faCopy,
  faMaximize,
} from "@fortawesome/free-solid-svg-icons";
import useJsonFormatStore from "@/store/useJsonFormatStore";

type Props = {
  onChangeText: any;
  onError: any;
  text?: any;
};

const JsonEditorInput = (props: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refContainer = useRef<HTMLDivElement>(null);
  const jsonEditorRef = useRef<any>(null);

  const { setInputData, getInputData }: any = useJsonFormatStore();

  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (refContainer.current && !jsonEditorRef.current) {
      // Initialize
      jsonEditorRef.current = createJSONEditor({
        target: refContainer.current,
        props: {
          mode: "text",
          onChange: (
            updatedContent: any,
            previousContent: any,
            { contentErrors, patchResult }: any
          ) => {
            // Call the parent onChange handler
            // setData({ text: updatedContent });
            console.log("previous content", previousContent);
            console.log("updated content", updatedContent);
            console.log("contentErrors", contentErrors);
            console.log("patchResult", patchResult);
            setInputData(updatedContent);
          },
          onRenderMenu: (items: any, context: any) => {
            console.log("items -->", items);
            //disable tree and table mode
            items = items.map((item: any) => {
              if (
                item.text === "tree" ||
                item?.text === "table" ||
                item?.className === "jse-format" ||
                item?.className === "jse-compact"
              ) {
                return {
                  ...item,
                  disabled: true,
                };
              }
              return item;
            });

            const customMenu = [
              {
                type: "button",
                title: "Open File",
                className: "my-custom-button-class",
                icon: faFolder,
                onClick: () => onOpenFileClick(),
              },
              {
                type: "button",
                title: "Copy",
                className: "my-custom-button-class",
                icon: faCopy,
                onClick: () => onHandleCopyToClipBoard(),
              },
            ];
            const newItems = [...items, ...customMenu];
            return newItems;
          },
          readOnly: false,
        },
      });
    }

    return () => {
      if (jsonEditorRef.current) {
        jsonEditorRef.current.destroy();
        jsonEditorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log("input json data", getInputData());
    const getJsonData = getInputData();
    if (getJsonData.text) {
      jsonEditorRef.current?.update({ text: getJsonData.text });
    }

    if (getJsonData.json) {
      jsonEditorRef.current?.update({ json: getJsonData.json });
    }
  }, []);

  // function handleMount(editor: any, monaco: any) {
  //   editorRef.current = editor;

  //   editor.onDidChangeModelContent(() => {
  //     const value = editor.getValue();

  //     if (value === "") {
  //       monaco.editor.setModelMarkers(editor.getModel(), "json", []);
  //       setError("");
  //       return;
  //     }

  //     try {
  //       JSON.parse(value);
  //       // Clear markers if valid
  //       monaco.editor.setModelMarkers(editor.getModel(), "json", []);
  //       setError("");
  //     } catch (err: any) {
  //       // Show red underline
  //       monaco.editor.setModelMarkers(editor.getModel(), "json", [
  //         {
  //           startLineNumber: 1,
  //           startColumn: 1,
  //           endLineNumber: 1,
  //           endColumn: 1,
  //           message: err.message,
  //           severity: monaco.MarkerSeverity.Error,
  //         },
  //       ]);

  //       // Show visible error message
  //       setError(err.message);
  //     }
  //   });
  // }
  const onOpenFileClick = () => {
    fileInputRef.current?.click();
  };

  const getLanguageFromExtension = (filename: string) => {
    if (filename.endsWith(".json")) return "json";
    if (filename.endsWith(".html")) return "html";
    if (filename.endsWith(".css")) return "css";
    if (filename.endsWith(".txt")) return "txt";
    if (filename.endsWith(".ts") || filename.endsWith(".tsx"))
      return "typescript";
    return "javascript"; // default
  };

  const onHandleFileChange = ($event: any) => {
    const file: any = $event.target.files[0];
    const reader = new FileReader();
    if (!file) return;
    const detectedLanguage = getLanguageFromExtension(file.name);
    console.log("language --->", detectedLanguage);
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        jsonEditorRef.current.update({ json: JSON.parse(content) });
      }
    };
    reader.readAsText(file);
  };

  const onHandleCopyToClipBoard = async () => {
    try {
      const getCurrentValue: any = jsonEditorRef.current?.get();
      console.log("getCurrentValue", getCurrentValue);
      if (getCurrentValue.text) {
        await navigator.clipboard.writeText(getCurrentValue.text);
      }
      if (getCurrentValue.json) {
        await navigator.clipboard.writeText(
          JSON.stringify(getCurrentValue.json, null, 4)
        );
      }
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.log("error -> ", error);
    }
  };

  // const handleEditorWillMount = (monaco: any) => {
  //   // defineTheme(themeName, themeData)
  //   monaco.editor.defineTheme("my-cool-theme", {
  //     base: "vs-dark", // inherit from 'vs', 'vs-dark', or 'hc-black'
  //     inherit: true,
  //     rules: [
  //       { token: "comment", foreground: "6272a4", fontStyle: "italic" },
  //       { token: "keyword", foreground: "ff79c6" },
  //       { token: "identifier", foreground: "f8f8f2" },
  //       { token: "string", foreground: "f1fa8c" },
  //     ],
  //     colors: {
  //       "editor.background": "#282a36",
  //       "editor.foreground": "#f8f8f2",
  //       "editor.lineHighlightBackground": "#44475a",
  //       "editorCursor.foreground": "#f8f8f2",
  //       "editor.selectionBackground": "#44475a",
  //       "editor.inactiveSelectionBackground": "#44475a50",
  //     },
  //   });
  // };

  return (
    // <div
    //   className={`${toggleFullScreen ? "fullscreen" : "mt-3"} shadow-xl`}
    //   id="jsonEditorInput"
    // >
    //   <ToastNotify />
    //   <div
    //     className={`flex justify-between p-2 gap-2 w-full h-10
    //       bg-warning
    //       dark:text-default-50
    //       text-default-800
    //       `}
    //   >
    //     <div>Input Panel</div>
    //     <div className="flex gap-3">
    //       <div>
    //         <div className="image-upload">
    //           <label htmlFor="file-input">
    //             <FaFolderOpen size={23} title="Upload file" />
    //           </label>
    //           <input
    //             id="file-input"
    //             type="file"
    //             accept=".json,.txt"
    //             onChange={onClickUploadTextFile}
    //           />
    //         </div>
    //       </div>
    //       <div>
    //         <FaSave size={23} title="Save file" onClick={onClickSaveJsonFile} />
    //       </div>
    //       <div>
    //         <FaCopy
    //           size={23}
    //           title="Copy to clipboard"
    //           onClick={onCopyToClipBoard}
    //         />
    //       </div>
    //       <div onClick={onClickMaximize}>
    //         {toggleFullScreen ? (
    //           <FaMinimize size={23} title="Minimize" />
    //         ) : (
    //           <FaMaximize size={23} title="Maximize" />
    //         )}
    //       </div>
    //     </div>
    //   </div>
    //   <div
    //     className={`${toggleFullScreen ? "h-screen" : "h-[87vh]"}`}
    //     ref={refContainer}
    //   />
    // </div>

    <div className="mt-2" id="jsonEditorInput">
      <div className="flex flex-col justify-between gap-2 w-full h-10 h-[87vh]">
        <div className="flex flex-row gap-2 h-10 justify-between">
          <span>INPUT</span>
          <div className="flex flex-row gap-2 justify-center items-center">
            <span className="text-xs text-green-500">
              {isCopied ? "Copied!" : ""}
            </span>
            <input
              id="file-input"
              ref={fileInputRef}
              type="file"
              accept=".json,.txt"
              onChange={onHandleFileChange}
              className="hidden"
            />
            {/* <ButtonGroup>
              <Button
                variant="secondary"
                size="default"
                onClick={onOpenFileClick}
              >
                <FolderOpen />
                <input
                  id="file-input"
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.txt"
                  onChange={onHandleFileChange}
                  className="hidden"
                />
              </Button>
              <ButtonGroupSeparator />
              <Button
                variant="secondary"
                size="default"
                onClick={() => onSaveFile()}
              >
                <Save />
              </Button>
              <ButtonGroupSeparator />
              <Button
                variant="secondary"
                size="default"
                onClick={onHandleCopyToClipBoard}
              >
                <Copy />
              </Button>
              <ButtonGroupSeparator />
              <Button variant="secondary" size="default" onClick={onFullScreen}>
                <Maximize2 />
              </Button>
            </ButtonGroup> */}
          </div>
        </div>
        <div
          id="jsonEditorInput"
          className="jse-theme-dark h-screen"
          ref={refContainer}
        ></div>
      </div>
    </div>
  );
};

export default JsonEditorInput;
