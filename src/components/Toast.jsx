import { CircleAlert, CircleCheck } from "lucide-react";
import Card from "./Card";

export default function Toast({ message, type }) {
  return (
    <Card as="div" className="w-fit flex items-center gap-1">
      {type === "success" ? (
        <CircleCheck className="fill-success dark:fill-success-dark text-card dark:text-card-dark" />
      ) : (
        <CircleAlert className="fill-danger dark:fill-danger-dark text-card dark:text-card-dark" />
      )}
      <p className="text-center">{message}</p>
    </Card>
  );
}
