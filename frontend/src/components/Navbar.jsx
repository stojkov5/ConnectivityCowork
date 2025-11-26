import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { Row, Col } from "antd";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../context/AuthContext.jsx";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] shadow-xl rounded-full backdrop-blur-xl bg-white/80 border border-gray-200 z-50 raleway-400">
        <div className="py-3 px-6">
          <Row align="middle" justify="space-between">
            {/* Logo */}
            <Col xs={12} lg={4}>
              <NavLink to="/">
                {/* Desktop Logo */}
                <img
                  className="hidden md:block w-40"
                  src="/Images/Logo1.png"
                  alt="Desktop Logo"
                />
                {/* Mobile Logo */}
                <img
                  className="md:hidden w-16"
                  src="/Images/Logo2.png"
                  alt="Mobile Logo"
                />
              </NavLink>
            </Col>

            {/* Desktop Links */}
            <Col lg={14} className="hidden lg:block">
              <ul className="flex justify-center items-center gap-6 text-[17px] font-medium text-black">
                <li>
                  <HashLink
                    smooth
                    to="/#welcome"
                    className="hover:text-[#ff8c00] transition"
                  >
                    HOME
                  </HashLink>
                </li>
                <li>
                  <HashLink
                    smooth
                    to="/#community"
                    className="hover:text-[#ff8c00] transition"
                  >
                    COMMUNITY
                  </HashLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className="hover:text-[#ff8c00] transition"
                  >
                    CONTACT
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/officedetails"
                    className="hover:text-[#ff8c00] transition"
                  >
                    SPACES
                  </NavLink>
                </li>

                {user?.isAdmin && (
                  <li>
                    <NavLink
                      to="/admin"
                      className="hover:text-[#ff8c00] transition"
                    >
                      DASHBOARD
                    </NavLink>
                  </li>
                )}
              </ul>
            </Col>

            {/* Desktop Right Side (Login + Language) */}
            <Col xs={12} lg={6}>
              <div className="flex justify-end items-center gap-3">
                {/* DESKTOP login/logout */}
                <div className="hidden lg:block ">
                  {!isLoggedIn && (
                    <NavLink
                      to="/login"
                      className="font-medium login-button hover:text-[#ff8c00] transition"
                    >
                      LOGIN
                    </NavLink>
                  )}

                  {isLoggedIn && (
                    <button
                      className="text-[17px] hover:text-[#ff8c00] transition"
                      onClick={handleLogout}
                    >
                      LOGOUT
                    </button>
                  )}
                </div>

                {/* DESKTOP Language */}
                <button className="hidden lg:block bg-[#ff8c00] text-white px-3 py-1 rounded-full text-sm shadow-md">
                  EN / MK
                </button>

                {/* MOBILE Hamburger */}
                <button className="lg:hidden text-black" onClick={toggleMenu}>
                  {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white z-999 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
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
            <HashLink smooth to="/#community" onClick={toggleMenu}>
              COMMUNITY
            </HashLink>
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

          {user?.isAdmin && (
            <li>
              <NavLink to="/admin" onClick={toggleMenu}>
                DASHBOARD
              </NavLink>
            </li>
          )}

          {!isLoggedIn && (
            <li>
              <NavLink to="/login" onClick={toggleMenu}>
                LOGIN
              </NavLink>
            </li>
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
              className="px-4 py-2 rounded bg-[#ff8c00] text-white"
              onClick={toggleMenu}
            >
              EN / MK
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default NavBar;
