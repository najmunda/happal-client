import { useEffect, useRef } from "react";

export default function TextArea({ className, ...props}) {

  const textAreaRef = useRef();

  useEffect(() => {
    textAreaRef.current.style.height = '0px';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
  });

  return (
    <textarea className={`overflow-hidden resize-none ${className ?? ""}`} {...props} ref={textAreaRef}></textarea>
  );
}
