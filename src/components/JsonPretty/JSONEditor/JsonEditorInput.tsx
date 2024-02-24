import React, { createRef, useEffect } from "react";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

import "./JsonEditorInput.css";

type Props = {
  options: {};
  onChangeJSON: {};
  json: {};
};

const JsonEditor = (props: Props) => {
  let container: any = createRef<HTMLElement>();
  useEffect(() => {
    const options: any = {
      mode: "text",
      indentation: 2,
      onError: function (err: any) {
        console.error(err);
      },
      onChangeText: props.onChangeJSON,
      
    };

    let jsoneditor = new JSONEditor(container, options);
    jsoneditor.set(props.json);

    return () => {
      jsoneditor.destroy();
    };
  }, []);

  return <>
    <div className="h-[97vh] mt-3 ml-3" ref={(my) => (container = my)} />
  </>;
};

export default JsonEditor;
