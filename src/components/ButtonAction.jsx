import clsx from "clsx";

export default function ButtonAction({as: Component, children, variant, ...props}) {

  return (
    <Component
      className={clsx("px-2 py-1 flex gap-1 hover:bg-neutral-100 rounded-lg",
        {
          "hover:bg-green-100 hover:text-green-500": variant == "success",
          "hover:bg-yellow-100 hover:text-yellow-500": variant == "warning",
          "hover:bg-red-100 hover:text-red-500": variant == "danger",
        },
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
