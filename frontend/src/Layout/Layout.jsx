import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
