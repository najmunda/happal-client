import { forwardRef } from "react";
import Card from "./Card";

const Dialog = forwardRef(function Dialog({ children, ...props }, ref) {
  return (
    <Card
      as="dialog"
      ref={ref}
      className="m-auto w-full h-fit max-h-[75dvh] sm:max-w-sm md:max-w-md not-open:hidden has-open:flex flex-col items-stretch rounded-lg overflow-hidden"
      {...props}
    >
      <div className="flex-1 max-h-[calc(75dvh-16px)] overflow-auto scrollbar-thin flex flex-col gap-2">
        {children}
      </div>
    </Card>
  );
});

export default Dialog;
