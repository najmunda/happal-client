import { RefreshCw } from "lucide-react";
import { useFetcher } from "react-router-dom";

export default function SyncButton() {
  const fetcher = useFetcher({key: 'sync'});
  const isSyncing = fetcher.state == 'submitting';
  return (
    <fetcher.Form method="post" action="/sync">
      <button className={`p-2 rounded-full hover:bg-green-300 ${isSyncing ? "animate-spin" : ""}`}><RefreshCw /></button>
    </fetcher.Form>
  );
}
