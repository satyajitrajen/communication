import React from "react";

type ButtonProps = {
  text: String | React.ReactNode;
  className: String;
  onClickFunc?: () => void;
};

export default function Button({ text, className, onClickFunc }: ButtonProps) {
  return (
    <>
      <button
        onClick={onClickFunc}
        className={`primary-gradient relative h-12 w-full overflow-hidden rounded-lg px-4 py-2 text-base font-medium outline-none lg:px-9 lg:text-lg ${className}`}
      >
        <span className="">{text}</span>
      </button>

      {/* <button
        onClick={onClickFunc}
        className={`animated-btn  ${className} w-full px-4 lg:px-9 py-2 `}
      >
        {text}
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button> */}
    </>
  );
}
