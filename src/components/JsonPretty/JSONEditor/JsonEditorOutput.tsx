import React, { createRef, useEffect } from "react";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

import "./JsonEditorInput.css";
import { json } from "stream/consumers";

type Props = {
  options: {};
  onChangeJSON: {};
  json: {};
};

const JsonEditor = (props: Props) => {
  let container: any = createRef<HTMLElement>();
  useEffect(() => {
    const options: any = {
      modes: ["tree", "text", "view"],
      indentation: 2,
      onError: function (err: any) {
        console.error(err);
      },
      onChangeText: props.onChangeJSON,
    };

    let jsoneditor = new JSONEditor(container, options, props.json);
   


  
   
    console.log('output', jsoneditor);
 
  }, [props.json]);

  return <div className="h-screen" ref={(my) => (container = my)} />;
};

export default JsonEditor;
