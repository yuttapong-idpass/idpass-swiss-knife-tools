import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


type Props = {};

const ToastNotify = (props: Props) => {
  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default ToastNotify;
