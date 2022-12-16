import React from "react";

type Props = {};

const InputValue = (props: Props) => {
  return (
    <div className="h-1/2 border-4">
      <textarea className="none-resize w-full h-full"></textarea> 
    </div>
  );
};

export default InputValue;
