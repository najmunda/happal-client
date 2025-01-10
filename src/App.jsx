import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Root/*, { action as rootAction }*/ from './routes/root'
import Home from "./routes/home.jsx";
// Mine
import Mine, { action as mineAction } from "./routes/mine.jsx";
import Sorb, { loader as sorbLoader, action as sorbAction } from "./routes/sorb.jsx";
// Cards
import Cards, { loader as cardsLoader } from './routes/cards/cards.jsx'
import CardEdit, { loader as editLoader, action as editAction } from "./routes/cards/edit.jsx";
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
        },
        {
          path: "/sorb",
          element: <Sorb />,
          loader: sorbLoader,
          action: sorbAction,
        },
        {
          path: "/cards",
          element: <Cards />,
          loader: cardsLoader,
          children: [
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
          ]
        },
      ]
    },
  ]);

  return <RouterProvider router={router} />
}

