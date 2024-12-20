import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Root/*, { action as rootAction }*/ from './routes/root'
import Home from "./routes/home.jsx";
import Mine from "./routes/mine.jsx";
import Sorb from "./routes/sorb.jsx";
import Cards from './routes/cards.jsx'

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
        },
        {
          path: "/sorb",
          element: <Sorb />,
        },
        {
          path: "/cards",
          element: <Cards />,
        },
      ]
    },
  ]);

  return <RouterProvider router={router} />
}

