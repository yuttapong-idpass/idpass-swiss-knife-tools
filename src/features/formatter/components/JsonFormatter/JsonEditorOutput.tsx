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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import useJsonFormatStore from "@/features/formatter/stores/useJsonFormat.store";
import {
  faCopy,
  faFloppyDisk,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";

const JsonEditorOutput = () => {
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
          statusbar: true,
          onChange: (updateContent: any) => {
            setOutputData(updateContent);
          },
          onRenderMenu: (items: any) => {
            const customMenu = [
              {
                type: "button",
                title: "Save File",
                className: "my-custom-button-class",
                icon: faFloppyDisk,
                onClick: () => OnSaveFile(),
              },
              {
                type: "button",
                title: "Copy",
                className: "my-custom-button-class",
                icon: faCopy,
                onClick: () => OnHandleCopyToClipBoard(),
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
    console.log("get data -->", getJsonData);
    try {
      if (getJsonData.text) {
        jsonEditorRef.current?.update({
          text: JSON.stringify(JSON.parse(getJsonData.text), null, 2),
        });
      }

      if (getJsonData.json) {
        jsonEditorRef.current?.update({ json: getJsonData.json });
      }
    } catch (error: any) {
      console.log("error", error);
    }

    return () => {};
  }, [getOutputData().text]);

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

  const OnOpenFileClick = () => {
    fileInputRef.current?.click();
  };

  const OnSaveFile = async () => {
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
      const getCurrentValue: any = jsonEditorRef.current?.get();
      if (getCurrentValue.text) {
        await writable.write(getCurrentValue.text);
        await writable.close();
      }
      if (getCurrentValue.json) {
        await writable.write(JSON.stringify(getCurrentValue.json, null, 4));
        await writable.close();
      }
    } catch (error) {
      console.log("save file error --->", error);
    }
  };

  const OnHandleCopyToClipBoard = async () => {
    try {
      const getCurrentValue: any = jsonEditorRef.current?.get();
      if (getCurrentValue.text) {
        await navigator.clipboard.writeText(getCurrentValue.text);
      }
      if (getCurrentValue.json) {
        await navigator.clipboard.writeText(
          JSON.stringify(getCurrentValue.json, null, 4),
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
    <div
      className="flex flex-col flex-1 min-h-0 overflow-hidden"
      id="jsonEditorOutput"
    >
      <div className="flex flex-row items-center mb-2 justify-between shrink-0">
        <span className="font-medium text-sm text-muted-foreground">
          Formatted Output
        </span>
        <div className="flex flex-row gap-2 justify-center items-center">
          <span className="text-xs text-green-500">
            {isCopied ? "Copied!" : ""}
          </span>
        </div>
      </div>
      <div
        className="jse-theme-dark flex-1 min-h-0 overflow-hidden"
        ref={refContainer}
      ></div>
    </div>
  );
};

export default JsonEditorOutput;
