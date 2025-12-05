import clsx from "clsx";
import { forwardRef } from "react";

const Card = forwardRef(function Card(
  { as: Component, children, className, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={clsx(
        "px-4 py-2 rounded-lg bg-card dark:bg-card-dark text-content dark:text-content-dark shadow-light dark:shadow-dark hover:shadow-hover-light dark:hover:shadow-hover-dark scrollbar-thin scrollbar-track-rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Card;
