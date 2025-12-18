import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Root, { loader as rootLoader } from "./routes/root/root.jsx";
import RootError from "./routes/root/error.jsx";
// Home
// import Home, { loader as homeLoader} from "./routes/home.jsx";
// Cards
import CardInfo, { loader as infoLoader } from "./routes/cards/info.jsx";
import { action as editAction } from "./routes/cards/edit.jsx";
import { action as resetAction } from "./routes/cards/reset.jsx";
import { action as deleteAction } from "./routes/cards/delete.jsx";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader: rootLoader,
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
            action: editAction,
          },
          {
            path: ":cardId/delete",
            action: deleteAction,
          },
          {
            path: ":cardId/reset",
            action: resetAction,
          },
        ],
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
