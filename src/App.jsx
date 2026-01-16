import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Root, { loader as rootLoader } from "./routes/root/root.jsx";
import RootError from "./routes/root/error.jsx";
// Home
// import Home, { loader as homeLoader} from "./routes/home.jsx";

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
            lazy: () => import("./routes/cards/info"),
          },
          {
            path: ":cardId/edit",
            lazy: () => import("./routes/cards/edit"),
          },
          {
            path: ":cardId/delete",
            lazy: () => import("./routes/cards/delete"),
          },
          {
            path: ":cardId/reset",
            lazy: () => import("./routes/cards/reset"),
          },
        ],
      },
      {
        path: "/settings",
        lazy: () => import("./routes/settings/settings.jsx"),
        children: [
          {
            path: "download-cards",
            lazy: () => import("./routes/settings/download-cards.jsx"),
          },
          {
            path: "delete-cards",
            lazy: () => import("./routes/settings/delete-cards.jsx"),
          },
          {
            path: "import-cards",
            lazy: () => import("./routes/settings/import-cards.jsx"),
          },
          {
            path: "download-error-log",
            lazy: () => import("./routes/settings/download-error-log.jsx"),
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
