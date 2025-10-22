import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { Row, Col } from "antd";
import { HashLink } from "react-router-hash-link";

const NavBar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <nav className="bg-white px-4 w-full z-50 raleway-400">
      <div className="max-w-7xl mx-auto py-4">
        <Row align="middle" justify="space-between" >
          {/* Logo */}
          <Col xs={12} lg={4}>
            <div className="hidden md:block">
              <NavLink to="/">
                <img
                  className="w-48"
                  src="/Images/Logo1.png"
                  alt="Desktop Logo"
                />
              </NavLink>
            </div>
            <div className="md:hidden">
              <NavLink to="/">
                <img
                  className="w-20"
                  src="/Images/Logo2.png"
                  alt="Mobile Logo"
                />
              </NavLink>
            </div>
          </Col>

          {/* Desktop links */}
          <Col lg={14} className="hidden lg:block">
            <ul className="flex justify-center text-lg gap-3">
              <li className="">
                <HashLink smooth to="/#welcome">
                  HOME
                </HashLink>
              </li>
              <li className="">
                <HashLink smooth to="/#community">
                  COMMUNITY
                </HashLink>
              </li>
              <li className="">
                <NavLink to="/contact">CONTACT</NavLink>
              </li>
              <li className="">
                <NavLink to="/officedetails">SPACES</NavLink>
              </li>

              {!isLoggedIn && (
                <>
                  <li className="">
                    <NavLink to="/login">LOGIN</NavLink>
                  </li>
                  <li className="">
                    <NavLink to="/register">REGISTER</NavLink>
                  </li>
                </>
              )}

              {isLoggedIn && (
                <li className="">
                  <button className="logout" onClick={handleLogout}>
                    LOGOUT
                  </button>
                </li>
              )}
            </ul>
          </Col>

          {/* Language & Hamburger */}
          <Col xs={12} lg={6}>
            <div className="flex justify-end items-center space-x-4">
              <div className="hidden lg:block">
                <button className="bg-white px-2 py-1 rounded text-lg">
                  EN / MK
                </button>
              </div>
              <div className="lg:hidden">
                <button onClick={toggleMenu}>
                  {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden z-50 fixed top-0 left-0 w-full h-full bg-white transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <NavLink to="/" onClick={toggleMenu}>
            <img className="w-20" src="/Images/Logo2.png" alt="Mobile Logo" />
          </NavLink>
          <button onClick={toggleMenu}>
            <FiX size={28} />
          </button>
        </div>

        <ul className="flex flex-col items-center justify-center space-y-6 mt-16 text-2xl">
          <li>
            <NavLink to="/" onClick={toggleMenu}>
              HOME
            </NavLink>
          </li>
          <li>
            <a href="#community" onClick={toggleMenu}>
              COMMUNITY
            </a>
          </li>
          <li>
            <NavLink to="/contact" onClick={toggleMenu}>
              CONTACT
            </NavLink>
          </li>
          <li>
            <NavLink to="/officedetails" onClick={toggleMenu}>
              SPACES
            </NavLink>
          </li>

          {!isLoggedIn && (
            <>
              <li>
                <NavLink to="/login" onClick={toggleMenu}>
                  LOGIN
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" onClick={toggleMenu}>
                  REGISTER
                </NavLink>
              </li>
            </>
          )}

          {isLoggedIn && (
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
              >
                LOGOUT
              </button>
            </li>
          )}

          <li>
            <button
              className="px-4 py-2 rounded"
              onClick={() => alert("Switch Language")}
            >
              EN / MK
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
