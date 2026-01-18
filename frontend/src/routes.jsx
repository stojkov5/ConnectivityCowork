// routes.jsx
import { createBrowserRouter } from "react-router-dom";
import Landing from "../src/pages/Landing";
import OfficeDetails from "../src/pages/OfficeDetails";
import ContactPage from "../src/pages/Contact";
import Layout from "./Layout/Layout";
import KiselaVodaOffice from "./components/Offices/KiselaVoda/KiselaVoda";
import CenterOffice from "./components/Offices/Center/Centar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import VerifyEmail from "./pages/VerifyEmail";
import ConfirmReservation from "./pages/ConfirmReservation.jsx";
import YourBookings from "./pages/Dashboard/YourBookings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "contact", element: <ContactPage /> },
      { path: "officedetails", element: <OfficeDetails /> },
      { path: "kiselavoda", element: <KiselaVodaOffice /> },
      { path: "center", element: <CenterOffice /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // ✅ NEW MAIN PATH
      {
        path: "dashboard/reservations",
        element: <YourBookings />,
      },

      // ✅ KEEP OLD PATH so nothing breaks
      {
        path: "dashboard/bookings",
        element: <YourBookings />,
      },

      {
        path: "admin",
        element: <AdminRoute />,
        children: [{ index: true, element: <AdminDashboard /> }],
      },
      { path: "verify/:token", element: <VerifyEmail /> },
      {
        path: "confirm-reservation/:token",
        element: <ConfirmReservation />,
      },
    ],
  },
]);

export default router;
