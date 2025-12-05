import clsx from "clsx";
import { useEffect, useRef } from "react";

export default function TextArea({ className, ...props }) {
  const textAreaRef = useRef();

  useEffect(() => {
    textAreaRef.current.style.height = "0px";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  });

  return (
    <textarea
      className={clsx(
        "p-2 overflow-hidden resize-none bg-card dark:bg-card-dark placeholder:text-content-secondary dark:placeholder:text-content-secondary-dark border border-line dark:border-line-dark rounded-lg",
        className,
      )}
      {...props}
      ref={textAreaRef}
    ></textarea>
  );
}
