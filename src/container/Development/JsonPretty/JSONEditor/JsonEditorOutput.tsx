import React, { useState, useEffect, useContext, useRef } from "react";
import { saveAs } from "file-saver";
import { FaMaximize, FaMinimize, FaCopy, FaFolderOpen } from "react-icons/fa6";
import { FaSave, FaEraser } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
// import "vanilla-jsoneditor/themes/jse-theme-dark.css";
import { JSONEditor, JSONEditorPropsOptional, Mode } from "vanilla-jsoneditor";
import { JsonEditor } from 'json-edit-react'
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

type Props = {
  // onChangeText: any;
  // text: any;
  // onError: any;
  content: any;
  readOnly: boolean;
};

const JsonEditorOutput = (props: Props) => {
  // const refContainer = useRef<HTMLDivElement>(null);
  // const refEditor = useRef<JSONEditor | null>(null);
  const editorRef = useRef<any>(null);
  const [toggleFullScreen, setToggleFullScreen] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState({});

  useEffect(() => {}, []);

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

  const onClickMaximize = () => {
    setToggleFullScreen(!toggleFullScreen);
  };

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

  function handleMount(editor: any, monaco: any) {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();

      if (value === "") {
        monaco.editor.setModelMarkers(editor.getModel(), "json", []);
        setError("");
        return;
      }

      try {
        console.log("value", value);
        JSON.parse(value);

        // Clear markers if valid
        monaco.editor.setModelMarkers(editor.getModel(), "json", []);
        setError("");
      } catch (err: any) {
        // Show red underline
        monaco.editor.setModelMarkers(editor.getModel(), "json", [
          {
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
            message: err.message,
            severity: monaco.MarkerSeverity.Error,
          },
        ]);

        // Show visible error message
        setError(err.message);
      }
    });
  }

  const jsonString = JSON.stringify(
    { pretty: { data: { data: { data: "good " } } } },
    null,
    2
  );

  const onSetCode = () => {
    setCode({ data: "data" });
  };

  const showFindWidget = () => {
    // Trigger the standard "Find" action
    editorRef.current?.trigger("source", "actions.find");
  };

  return (
    // <div
    //   className={`${toggleFullScreen ? "fullscreen" : "mt-3"} shadow-xl`}
    //   id="jsonEditorInput"
    // >
    //   <ToastNotify />
    //   <div
    //     className={`flex justify-between p-2 gap-2 w-full h-10
    //       bg-violet-400
    //       dark:bg-yellow-500
    //       `}
    //   >
    //     <div>Output Panel</div>
    //     <div className="flex gap-3">
    //       <div>
    //         <div className="image-upload">
    //           <label htmlFor="file-input">
    //             <FaFolderOpen
    //               size={23}
    //               className="hover:bg-[#00adff]"
    //               title="Upload file"
    //             />
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
    //         <FaSave
    //           size={23}
    //           className="hover:bg-[#00adff]"
    //           title="Save file"
    //           onClick={onClickSaveJsonFile}
    //         />
    //       </div>
    //       <div>
    //         <FaCopy
    //           size={23}
    //           className="hover:bg-[#00adff]"
    //           title="Copy to clipboard"
    //           onClick={onCopyToClipBoard}
    //         />
    //       </div>
    //       <div onClick={onClickMaximize}>
    //         {toggleFullScreen ? (
    //           <FaMinimize
    //             size={23}
    //             className="hover:bg-[#00adff]"
    //             title="Minimize"
    //           />
    //         ) : (
    //           <FaMaximize
    //             size={23}
    //             className="hover:bg-[#00adff]"
    //             title="Maximize"
    //           />
    //         )}
    //       </div>
    //     </div>
    //   </div>
    //   <div
    //     className={`${toggleFullScreen ? "h-screen" : "h-[87vh]"}`}
    //     ref={refContainer}
    //   />
    // </div>
    <div
      className={`${toggleFullScreen ? "fullscreen" : "mt-3"}`}
      id="jsonEditorOutput"
    >
      <div className="flex flex-col justify-between gap-2 w-full h-10 h-[87vh]">
        <div className="flex flex-row p-2 gap-2 h-10 justify-between">
          <span>OUTPUT</span>
          <div className="flex flex-row gap-2 justify-center items-center">
            <div className="flex flex-row gap-2">
              <ToggleGroup type="single" variant="outline" defaultValue="text">
                <ToggleGroupItem value="text" aria-label="Toggle text">
                  <Type />
                </ToggleGroupItem>
                <ToggleGroupItem value="tree" aria-label="Toggle tree">
                  <ListTree />
                </ToggleGroupItem>
              </ToggleGroup>

              <ToggleGroup type="single" variant="outline" defaultValue="sort">
                <ToggleGroupItem value="sort" aria-label="Toggle sort" disabled>
                  <ArrowDownAZ />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="search"
                  aria-label="Toggle search"
                  onClick={showFindWidget}
                >
                  <Search />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div>
              <ButtonGroup>
                <Button variant="secondary" size="default">
                  <FolderOpen />
                </Button>
                <ButtonGroupSeparator />
                <Button variant="secondary" size="default">
                  <Save />
                </Button>
                <ButtonGroupSeparator />
                <Button variant="secondary" size="default">
                  <Copy />
                </Button>
                <ButtonGroupSeparator />
                <Button variant="secondary" size="default" onClick={onSetCode}>
                  <Maximize2 />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <Editor
          defaultLanguage="json"
          value={""}
          // beforeMount={handleEditorWillMount}
          theme="vs-dark"
          options={{
            formatOnPaste: true,
            formatOnType: true,
            minimap: {
              enabled: false,
            },
          }}
          onMount={handleMount}
        ></Editor>
        <span>{error}</span>
      </div>
    </div>
  );
};

export default JsonEditorOutput;
