import clsx from "clsx";

export default function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "p-2 bg-card dark:bg-card-dark placeholder:text-content-secondary dark:placeholder:text-content-secondary-dark border border-line dark:border-line-dark rounded-lg",
        className,
      )}
      {...props}
    />
  );
}
