import React from 'react'; /* React */

import { createBrowserRouter, RouterProvider } from 'react-router-dom'; /* Navigacija */

/* Stranice */
import Predmeti from './Predmeti';
import Oblasti from './Oblasti';
import Lekcije from './Lekcije';
import Login from './Login';
import Logout from './Logout';
import Signup from './Signup';
import Lekcija from './Lekcija';
import Kreiraj from './Kreiraj';
import Izmeni from './Izmeni';
import NotFound from './NotFound';

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />
  },
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
    path: "/oblast/:idOblasti",
    element: <Lekcije />,
  },
  {
    path: "/logout",
    element: <Logout />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/lekcija/:idLekcije",
    element: <Lekcija />
  },
  {
    path: "/kreiraj/:idOblasti",
    element: <Kreiraj />
  },
  {
    path: "/izmeni/:idLekcije",
    element: <Izmeni />
  }
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
