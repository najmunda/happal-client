import clsx from "clsx";
import { useEffect, useRef } from "react";

export default function TextArea({
  label,
  id,
  wrapperClassName,
  className,
  ...props
}) {
  const textAreaRef = useRef();

  useEffect(() => {
    textAreaRef.current.style.height = "0px";
    const scrollHeight = textAreaRef.current.scrollHeight;
    textAreaRef.current.style.height =
      scrollHeight > 24 ? scrollHeight + "px" : "24px";
  });

  return (
    <div className={clsx("relative flex flex-col", wrapperClassName)}>
      <label
        htmlFor={id}
        className="py-px px-1 absolute -top-2 left-2 text-xs text-content-secondary dark:text-content-secondary bg-card dark:bg-card-dark"
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
