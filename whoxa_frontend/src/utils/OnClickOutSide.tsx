// This Reusable Component is for handling the click event outside of this component like in sidebar when user clicks outside of sidebar 
// sidebar should close 

import React, { useRef, useEffect, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClickOutside: () => void;
  className?: string;
}

function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  onClickOutside: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside(); // Call the onClickOutside function
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

function OnClickOutside(props: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, props.onClickOutside);
  return (
    <div className={props.className} ref={wrapperRef}>
      {props.children}
    </div>
  );
}

export default OnClickOutside;
