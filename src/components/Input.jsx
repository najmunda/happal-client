import clsx from "clsx";

export default function Input({
  label,
  id,
  wrapperClassName,
  className,
  ...props
}) {
  return (
    <div className={clsx("relative", wrapperClassName)}>
      <label
        htmlFor={id}
        className="py-px px-1 absolute -top-2 left-2 text-xs text-content-secondary dark:text-content-secondary bg-card dark:bg-card-dark"
      >
        {label}
      </label>
      <input
        className={clsx(
          "w-full p-2 bg-card dark:bg-card-dark placeholder:text-content-secondary dark:placeholder:text-content-secondary-dark border border-line dark:border-line-dark rounded-lg",
          className,
        )}
        id={id}
        {...props}
      />
    </div>
  );
}
