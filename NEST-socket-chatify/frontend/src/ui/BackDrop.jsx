import React from "react";
import ReactDOM from "react-dom";
import "../App.css";

export default function Backdrop({ children, closeModal }) {
  return ReactDOM.createPortal(
    <div
      className="backdrop absolute top-0 left-0 h-full w-full bg-slate-900 bg-opacity-50 flex justify-start items-center"
      onClick={closeModal}
    >
      {children}
    </div>,
    document.getElementById("portal")
  );
}
