import { RefreshCw, RefreshCwOff } from "lucide-react";
import { useFetcher } from "react-router-dom";
import clsx from "clsx";
import { useContext } from "react";
import { OnlineContext } from "../routes/root/root";

export default function SyncButton() {
  const isOnline = useContext(OnlineContext);
  const fetcher = useFetcher({ key: "sync" });
  const isSyncing = fetcher.state == "submitting";
  return (
    <fetcher.Form method="post" action="/sync">
      <button
        disabled={isOnline === false}
        className={clsx(
          "p-2 rounded-full",
          isSyncing && isOnline && "animate-spin",
          {
            "text-black hover:bg-green-300": isOnline === true,
            "text-neutral-400": isOnline === false,
          },
        )}
      >
        {isOnline ? <RefreshCw /> : <RefreshCwOff />}
      </button>
    </fetcher.Form>
  );
}
