import clsx from "clsx";

export default function ButtonAction({
  as: Component,
  children,
  variant,
  icon: Icon,
  ...props
}) {
  return (
    <Component
      className={clsx(
        "px-2 py-1 flex text-sm items-center gap-1 rounded-lg hover:cursor-pointer",
        {
          "dark:hover:bg-card/25 dark:hover:text-card hover:bg-card-dark/25 hover:text-card-dark":
            !variant,
          "hover:bg-success/25 hover:text-success dark:hover:bg-success-dark/25 dark:hover:text-success-dark":
            variant == "success",
          "hover:bg-warning/25 hover:text-warning dark:hover:bg-warning-dark/25 dark:hover:text-warning-dark":
            variant == "warning",
          "hover:bg-danger/25 hover:text-danger dark:hover:bg-danger-dark/25 dark:hover:text-danger-dark":
            variant == "danger",
        },
      )}
      {...props}
    >
      {Icon && <Icon size={15} />}
      {children}
    </Component>
  );
}
