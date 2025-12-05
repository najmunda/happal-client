import clsx from "clsx";

export default function Select({ className, children, ...props }) {
  return (
    <select
      className={clsx(
        "p-2 text-xs bg-card dark:bg-card-dark placeholder:text-content-secondary dark:placeholder:text-content-secondary-dark border border-line dark:border-line-dark rounded-lg cursor-pointer disabled:cursor-default",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
