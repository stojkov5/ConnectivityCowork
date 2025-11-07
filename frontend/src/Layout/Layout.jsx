import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

const Layout = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
