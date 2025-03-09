import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Root/*, { action as rootAction }*/ from './routes/root'
import Home from "./routes/home.jsx";
import Account from "./routes/account.jsx";
// Mine
import Mine, { action as mineAction } from "./routes/mine/mine.jsx";
import MineHelp from "./routes/mine/help";
// Sorb
import Sorb, { loader as sorbLoader, action as sorbAction } from "./routes/sorb/sorb.jsx";
import SorbHelp from "./routes/sorb/help";
// Cards
import Cards, { revalidate as cardsRevalidate, loader as cardsLoader } from './routes/cards/cards.jsx'
import CardHelp from "./routes/cards/help";
import CardInfo, { loader as infoLoader } from "./routes/cards/info.jsx";
import CardEdit, { loader as editLoader, action as editAction } from "./routes/cards/edit.jsx";
import CardReset, { action as resetAction } from "./routes/cards/reset.jsx";
import CardDelete, { action as deleteAction } from "./routes/cards/delete.jsx";

export default function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      //action: rootAction(logout),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/mine",
          element: <Mine />,
          action: mineAction,
          children: [
            {
              path: "help",
              element: <MineHelp />,
            },
          ]
        },
        {
          path: "/sorb",
          element: <Sorb />,
          loader: sorbLoader,
          action: sorbAction,
          children: [
            {
              path: "help",
              element: <SorbHelp />,
            },
          ]
        },
        {
          path: "/cards",
          element: <Cards />,
          shouldRevalidate: cardsRevalidate,
          loader: cardsLoader,
          children: [
            {
              path: "help",
              element: <CardHelp />,
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
              element: <CardDelete />
            },
            {
              path: ":cardId/reset",
              action: resetAction,
              element: <CardReset />
            },
          ]
        },
        {
          path: "/account",
          element: <Account />,
        },
      ]
    },
  ]);

  return <RouterProvider router={router} />
}

