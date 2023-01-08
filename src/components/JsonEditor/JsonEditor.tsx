import React, { createRef, useEffect } from "react";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

import './JsonEditor.css';

type Props = {
    options: {},
    json: {}
};

const JsonEditor = (props: Props) => {
  let container: any = createRef<HTMLElement>();
  const options: any = {
    "modes": ["tree", "text"],
    "indentation": 2
  };

  useEffect(() => {
    let jsoneditor = new JSONEditor(container, options);

    jsoneditor.set({ "name" : "name"});
    
    console.log('s', container);
   
  }, []);

  return <div className="jsoneditor-react-container" ref={my => container = my} />;
};

export default JsonEditor;
