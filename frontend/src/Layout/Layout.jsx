import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";
import ScrollToTop from "../components/ScrollToTop";

const Layout = () => {
  return (
    <div className="relative">
      <NavBar />
      <ScrollToTop />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

