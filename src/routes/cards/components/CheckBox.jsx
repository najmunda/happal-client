import clsx from "clsx";

const CheckBox = {
  Input: ({ className, ...props }) => {
    return (
      <input
        type="checkbox"
        {...props}
        className={clsx("invisible absolute", className)}
      />
    );
  },
  Label: ({ className, children, ...props }) => {
    return (
      <label
        {...props}
        className={clsx(
          "relative shrink-0 p-2 text-xs bg-card dark:bg-card-dark border border-line dark:border-line-dark has-checked:text-content has-checked:bg-main cursor-pointer rounded-lg",
          className,
        )}
      >
        {children}
      </label>
    );
  },
};

export default CheckBox;
