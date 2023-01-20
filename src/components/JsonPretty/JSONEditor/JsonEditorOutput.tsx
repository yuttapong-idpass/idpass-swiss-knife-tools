import React, { createRef, useRef, useEffect } from "react";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

import "./JsonEditorOutput.css";


type Props = {
  options: {};
  onChangeJSON: {};
  json: {};
};

const JsonEditor = (props: Props) => {
  let container: any = useRef<HTMLElement>();
  useEffect(() => {
    const options: any = {
      mode: "view",
      modes: ['text', 'code', 'tree', 'form', 'view'],
      indentation: 5,
      onError: function (err: any) {
        console.error(err);
      },
      onChangeText: props.onChangeJSON
    };

    let jsoneditor = new JSONEditor(container, options);
    jsoneditor.set(props.json);

    return () => {
      console.log('Child unmounted');
      jsoneditor.destroy();
    };


 
  }, [props.json]);

  return <div className="h-screen" ref={(my) => (container = my)} />;
};

export default JsonEditor;
