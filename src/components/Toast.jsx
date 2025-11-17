import { CircleAlert, CircleCheck } from "lucide-react";

export default function Toast({ message, type }) {
  return (
    <div
      className={`p-2 w-fit flex items-center gap-1 bg-white shadow-sm rounded-lg`}
    >
      {type === "success" ? (
        <CircleCheck className="fill-green-500 text-white" />
      ) : (
        <CircleAlert className="fill-red-500 text-white" />
      )}
      <p className="text-center">{message}</p>
    </div>
  );
}
