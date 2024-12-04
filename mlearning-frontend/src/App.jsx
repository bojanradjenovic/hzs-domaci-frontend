import React from 'react'; /* React */

import { createBrowserRouter, RouterProvider } from 'react-router-dom'; /* Navigacija */

/* Stranice */
import Predmeti from './Predmeti';
import Oblasti from './Oblasti';
import Lekcije from './Lekcije';
import Login from './Login';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Predmeti />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/predmet/:idPredmeta",
    element: <Oblasti />,
  },
  {
    path: "oblast/:idOblasti",
    element: <Lekcije />,
  }
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
