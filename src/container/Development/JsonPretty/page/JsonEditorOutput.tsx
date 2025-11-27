import React, { useState, useEffect, useContext, useRef } from "react";
import { saveAs } from "file-saver";
import { FaMaximize, FaMinimize, FaCopy, FaFolderOpen } from "react-icons/fa6";
import { FaSave, FaEraser } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
// import "vanilla-jsoneditor/themes/jse-theme-dark.css";
import {
  createJSONEditor,
  JSONEditor,
  JSONEditorPropsOptional,
  Mode,
} from "vanilla-jsoneditor";
import { JsonEditor } from "json-edit-react";
import "./JsonEditorOutput.css";
import ToastNotify from "../../../../components/ToastNotify/ToastNotify";
import { toast } from "react-toastify";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import {
  ArrowDownAZ,
  Copy,
  FolderOpen,
  ListTree,
  Maximize2,
  Save,
  Search,
  Type,
} from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import useJsonFormatStore from "@/store/useJsonFormatStore";
import {
  faCopy,
  faFloppyDisk,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  // onChangeText: any;
  // text: any;
  // onError: any;
  content: any;
  readOnly: boolean;
};

const JsonEditorOutput = (props: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refContainer = useRef<HTMLDivElement>(null);
  const jsonEditorRef = useRef<any>(null);

  const [isCopied, setIsCopied] = useState(false);

  const { setOutputData, getOutputData }: any = useJsonFormatStore();

  useEffect(() => {
    if (refContainer.current && !jsonEditorRef.current) {
      jsonEditorRef.current = createJSONEditor({
        target: refContainer.current,
        props: {
          mode: "text",
          onChange: (
            updateContent: any,
            previousContent: any,
            { contentErrors, patchResult }: any
          ) => {
            console.log("updateContent", updateContent);
            console.log("previousContent", previousContent);
            console.log("contentErrors", contentErrors);
            console.log("patchResult", patchResult);
            setOutputData(updateContent);
          },
          onRenderMenu: (items: any) => {
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
                title: "Save File",
                className: "my-custom-button-class",
                icon: faFloppyDisk,
                onClick: () => onSaveFile(),
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
    const getJsonData = getOutputData();
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
  //       console.log("value", value);
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
  // useEffect(() => {
  //   // create editor
  //   console.log("create editor", refContainer.current);
  //   refEditor.current = new JSONEditor({
  //     target: refContainer.current!,
  //     props: {
  //       readOnly: true,
  //       mode: Mode.text
  //     },
  //   });

  //   return () => {
  //     // destroy editor
  //     if (refEditor.current) {
  //       console.log("destroy editor");
  //       refEditor.current.destroy();
  //       refEditor.current = null;
  //     }
  //   };
  // }, []);

  // // update props
  // useEffect(() => {
  //   if (refEditor.current) {
  //     console.log("update props", props);
  //     refEditor.current.updateProps(props);
  //   }
  // }, [props]);

  // const onClickMaximize = () => {
  //   setToggleFullScreen(!toggleFullScreen);
  // };

  // const onSetMode = (mode: string) => {
  //   setToggleMode(mode);
  // };

  // const onClickUploadTextFile = ($event: any) => {
  //   // const fileUpload: any = $event.target.files[0];
  //   const reader: any = new FileReader();
  //   const filePath: any = $event.target.value;
  //   const validateExtension = new RegExp(/(\.json|\.txt)$/i);
  //   if (!validateExtension.exec(filePath)) {
  //     console.log("not allow file type");
  //     filePath.value = "";
  //   } else {
  //     reader.onload = () => {
  //       refEditor.current?.update({ json: JSON.parse(reader.result) });
  //       // props.onChangeText(refEditor.current?.get());
  //     };
  //     reader.readAsText($event.target.files[0]);
  //     $event.target.value = "";
  //   }
  // };

  // const onClickSaveJsonFile = () => {
  //   let fileName = window.prompt("Save as...");
  //   if (!!fileName) {
  //     if (fileName?.indexOf(".") === -1) {
  //       fileName = fileName + ".json";
  //     } else {
  //       if (fileName?.split(".").pop()?.toLowerCase() === "json") {
  //         // Nothing to do
  //       } else {
  //         fileName = fileName?.split(".")[0] + ".json";
  //       }
  //     }
  //     let currentData: any = refEditor.current?.get();
  //     if (!!currentData.text) {
  //       const blob = new Blob([currentData.text], {
  //         type: "application/json;charset=utf-8",
  //       });
  //       saveAs(blob, fileName);
  //     }

  //     if (!!currentData.json) {
  //       const blob = new Blob([JSON.stringify(currentData.json, null, 4)], {
  //         type: "application/json;charset=utf-8",
  //       });
  //       saveAs(blob, fileName);
  //     }
  //   } else {
  //     //! nothing
  //     return;
  //   }
  // };

  // const onCopyToClipBoard = async () => {
  //   try {
  //     const getCurrentValue: any = refEditor.current?.get();
  //     if (!!getCurrentValue.text) {
  //       await navigator.clipboard.writeText(getCurrentValue.text);
  //     }

  //     if (!!getCurrentValue.json) {
  //       await navigator.clipboard.writeText(
  //         JSON.stringify(getCurrentValue.json, null, 4)
  //       );
  //     }
  //     toast.success("Copies!");
  //   } catch (error) {
  //     console.log("error ->", error);
  //   }
  // };

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
  //       console.log("value", value);
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

  // const jsonString = JSON.stringify(
  //   { pretty: { data: { data: { data: "good " } } } },
  //   null,
  //   2
  // );

  // const onSetCode = () => {
  //   setCode({ data: "data" });
  // };

  // const showFindWidget = () => {
  //   editorRef.current?.trigger("source", "actions.find");
  // };

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

  const onSaveFile = async () => {
    try {
      const options = {
        suggestedName: "untitled.txt",
        types: [
          {
            description: "Text Files",
            accept: {
              "text/plain": [".txt"],
            },
          },
        ],
      };

      // @ts-ignore
      const fileHandle = await window.showSaveFilePicker(options);
      const writable = await fileHandle.createWritable();
      await writable.write("data in save to file");
      await writable.close();
    } catch (error) {}
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

  return (
    <div className="mt-2" id="jsonEditorInput">
      <div className="flex flex-col justify-between gap-2 w-full h-10 h-[87vh]">
        <div className="flex flex-row gap-2 h-10 justify-between">
          <span>OUTPUT</span>
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

export default JsonEditorOutput;
