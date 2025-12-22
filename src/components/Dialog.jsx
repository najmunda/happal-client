import { forwardRef } from "react";
import Card from "./Card";
import clsx from "clsx";

const Dialog = forwardRef(function Dialog({ children, ...props }, ref) {
  return (
    <dialog
      ref={ref}
      {...props}
      className="h-dvh w-dvw not-open:hidden open:flex justify-center items-end sm:items-center bg-black/50 z-50"
    >
      <Card
        as="div"
        className="pr-3 w-full h-fit max-h-[75dvh] sm:max-w-sm md:max-w-md flex flex-col items-stretch gap-2 rounded-b-none rounded-t-lg sm:rounded-lg overflow-hidden"
      >
        {children}
      </Card>
    </dialog>
  );
});

export default Dialog;

export function DialogContent({
  as: Component,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={clsx(
        "p-1 max-h-[calc(75dvh-16px)] overflow-x-hidden scrollbar-thin flex flex-col gap-2 text-wrap whitespace-normal wrap-break-word",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function DialogButtons({ className, children }) {
  return (
    <div
      className={clsx(
        "bg-card dark:bg-card-dark w-full flex justify-evenly items-center gap-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
