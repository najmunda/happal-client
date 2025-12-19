import clsx from "clsx";
import { useEffect, useRef } from "react";

export default function TextArea({ label, id, className, ...props }) {
  const textAreaRef = useRef();

  useEffect(() => {
    textAreaRef.current.style.height = "0px";
    const scrollHeight = textAreaRef.current.scrollHeight;
    textAreaRef.current.style.height =
      scrollHeight > 24 ? scrollHeight + "px" : "24px";
  });

  return (
    <div className="relative flex flex-col">
      <label
        htmlFor={id}
        className="p-px absolute -top-2 left-2 text-xs text-line-dark dark:text-line bg-card dark:bg-card-dark"
      >
        {label}
      </label>
      <textarea
        className={clsx(
          "grow w-full p-2 overflow-hidden resize-none bg-card dark:bg-card-dark placeholder:text-content-secondary dark:placeholder:text-content-secondary-dark border border-line dark:border-line-dark rounded-lg",
          className,
        )}
        {...props}
        ref={textAreaRef}
      ></textarea>
    </div>
  );
}
