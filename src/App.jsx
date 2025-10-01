import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Root, {
  loader as rootloader /*, { action as rootAction }*/,
} from "./routes/root/root.jsx";
import RootError from "./routes/root/error.jsx";
// Home
// import Home, { loader as homeLoader} from "./routes/home.jsx";
// Cards
import CardInfo, { loader as infoLoader } from "./routes/cards/info.jsx";
import CardEdit, {
  loader as editLoader,
  action as editAction,
} from "./routes/cards/edit.jsx";
import CardReset, { action as resetAction } from "./routes/cards/reset.jsx";
import CardDelete, { action as deleteAction } from "./routes/cards/delete.jsx";
import { action as syncAction } from "./routes/sync.jsx";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    shouldRevalidate: (args) => {
      const formData = args?.formData;
      const intent = formData?.get("intent");
      return intent === "sync" || intent === "logout" ? true : false;
    },
    loader: rootloader,
    element: <Root />,
    errorElement: <RootError />,
    children: [
      {
        index: true,
        lazy: () => import("./routes/about.jsx"),
      },
      {
        path: "/mine",
        lazy: () => import("./routes/mine/mine.jsx"),
        children: [
          {
            path: "help",
            lazy: () => import("./routes/mine/help"),
          },
        ],
      },
      {
        path: "/sorb",
        lazy: () => import("./routes/sorb/sorb.jsx"),
        children: [
          {
            path: "help",
            lazy: () => import("./routes/sorb/help"),
          },
        ],
      },
      {
        path: "/cards",
        lazy: () => import("./routes/cards/cards.jsx"),
        children: [
          {
            path: "help",
            lazy: () => import("./routes/cards/help"),
          },
          {
            path: ":cardId",
            element: <CardInfo />,
            loader: infoLoader,
          },
          {
            path: ":cardId/edit",
            element: <CardEdit />,
            loader: editLoader,
            action: editAction,
          },
          {
            path: ":cardId/delete",
            action: deleteAction,
            element: <CardDelete />,
          },
          {
            path: ":cardId/reset",
            action: resetAction,
            element: <CardReset />,
          },
        ],
      },
      {
        path: "/account",
        lazy: () => import("./routes/account/account.jsx"),
      },
      {
        path: "/sync",
        action: syncAction,
      },
      {
        path: "*",
        element: <Navigate to={"/"} />,
      },
    ],
  },
]);

export default function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  );
}
