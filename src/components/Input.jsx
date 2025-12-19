import clsx from "clsx";

export default function Input({ label, id, className, ...props }) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="p-px absolute -top-2 left-2 text-xs text-line-dark dark:text-line bg-card dark:bg-card-dark"
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
