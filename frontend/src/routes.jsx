import { createBrowserRouter } from "react-router-dom";
import Landing from "../src/pages/Landing";
import OfficeDetails from "../src/pages/OfficeDetails";
import ContactPage from "../src/pages/Contact";
import Layout from "./Layout/Layout";
import KiselaVodaOffice from "./components/Offices/KiselaVoda/KiselaVoda";
import CenterOffice from "./components/Offices/Center/Centar";
import Login from "./pages/Login";
import Register from "./pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },

      { path: "/contact", element: <ContactPage /> },
      {
        path: "/officedetails",
        element: <OfficeDetails />,
      },
      {
        path: "/kiselavoda",
        element: <KiselaVodaOffice />,
      },
      {
        path: "/center",
        element: <CenterOffice />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
