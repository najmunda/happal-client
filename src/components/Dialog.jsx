import { forwardRef } from "react";
import Card from "./Card";

const Dialog = forwardRef(function Dialog({ children, ...props }, ref) {
  return (
    <dialog
      ref={ref}
      {...props}
      className="h-screen w-screen absolute not-open:hidden open:flex justify-center items-center top-0 bg-black/50 z-50"
    >
      <Card
        as="div"
        className="w-full h-fit max-h-[75dvh] sm:max-w-sm md:max-w-md flex flex-col items-stretch rounded-lg overflow-hidden"
      >
        <div className="flex-1 py-[2px] max-h-[calc(75dvh-16px)] overflow-auto scrollbar-thin flex flex-col gap-2">
          {children}
        </div>
      </Card>
    </dialog>
  );
});

export default Dialog;
