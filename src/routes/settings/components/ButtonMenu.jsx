import clsx from "clsx";

export default function ButtonMenu({ children, className, ...props }) {
  return (
    <button
      className={clsx(
        "p-2 flex gap-2 items-center text-left disabled:text-content-secondary disabled:dark:text-content-secondary-dark dark:hover:bg-card/25 dark:hover:text-card hover:bg-card-dark/25 hover:text-card-dark disabled:hover:bg-card disabled:dark:hover:bg-card-dark rounded-lg hover:cursor-pointer disabled:hover:cursor-default",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
