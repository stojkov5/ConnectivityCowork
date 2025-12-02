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

  const renderDesktopNavLink = (to, label, isHash = false) => {
  const base =
    "group relative tracking-[0.12em] text-[15px] xl:text-[16px] font-semibold transition-colors duration-200 hover:text-[#ff8c00]";

  const underline =
    "pointer-events-none absolute left-0 -bottom-0.5 h-[2px] w-0 bg-[#ff8c00] transition-all duration-300 group-hover:w-full";

  if (isHash) {
    return (
      <HashLink smooth to={to} className={base}>
        <span className="relative inline-block pb-1">
          {label}
          <span className={underline} />
        </span>
      </HashLink>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          base,
          isActive ? "text-[#ff8c00]" : "",
        ].join(" ")
      }
    >
      <span className="relative inline-block pb-1">
        {label}
        <span className={underline} />
      </span>
    </NavLink>
  );
};


  return (
    <>
      {/* TOP NAV BAR */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] shadow-xl rounded-full backdrop-blur-xl bg-white/80 border border-white/70 z-50 raleway-400">
        <div className="py-3 px-4 md:px-6">
          <Row align="middle" justify="space-between" gutter={[8, 8]}>
            {/* Logo */}
            <Col xs={12} lg={4}>
              <NavLink to="/">
                {/* Desktop Logo */}
                <img
                  className="hidden md:block w-40 xl:w-44"
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
              <ul className="flex justify-center items-center gap-6 xl:gap-8 text-black">
                <li className="group">
                  {renderDesktopNavLink("/#welcome", "HOME", true)}
                </li>
                <li className="group">
                  {renderDesktopNavLink("/#community", "COMMUNITY", true)}
                </li>
                <li className="group">
                  {renderDesktopNavLink("/contact", "CONTACT")}
                </li>
                <li className="group">
                  {renderDesktopNavLink("/officedetails", "SPACES")}
                </li>

                {user?.isAdmin && (
                  <li className="group">
                    {renderDesktopNavLink("/admin", "DASHBOARD")}
                  </li>
                )}
              </ul>
            </Col>

            {/* Desktop Right Side (Login + Language) & Mobile Hamburger */}
            <Col xs={12} lg={6}>
              <div className="flex justify-end items-center gap-3">
                {/* DESKTOP login/logout */}
                <div className="hidden lg:flex items-center gap-3">
                  {!isLoggedIn && (
                    <NavLink
                      to="/login"
                      className="login-button font-semibold text-[15px] xl:text-[16px]  hover:text-[#ff8c00] transition-all duration-200"
                    >
                      LOGIN
                    </NavLink>
                  )}

                  {isLoggedIn && (
                    <button
                      className="text-[15px] xl:text-[16px] font-semibold hover:text-[#ff8c00] transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      LOGOUT
                    </button>
                  )}

                  {/* DESKTOP Language */}
                  <button className="bg-[#ff8c00] text-white px-4 py-1.5 rounded-full text-[13px] xl:text-[14px] font-semibold shadow-md hover:bg-[#ff9f2c] transition-colors duration-200">
                    EN / MK
                  </button>
                </div>

                {/* MOBILE Hamburger */}
                <button
                  className="lg:hidden text-black p-1 rounded-full hover:bg-black/5 transition"
                  onClick={toggleMenu}
                  aria-label="Toggle menu"
                >
                  {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </nav>

      {/* Mobile Overlay + Slide-in Menu */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleMenu}
        >
          {/* Panel */}
          <div
            className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
              <NavLink to="/" onClick={toggleMenu}>
                <img className="w-20" src="/Images/Logo2.png" alt="Mobile Logo" />
              </NavLink>
              <button
                onClick={toggleMenu}
                className="p-1 rounded-full hover:bg-black/5 transition"
                aria-label="Close menu"
              >
                <FiX size={24} />
              </button>
            </div>

            <ul className="flex flex-col space-y-4 mt-6 px-5 text-[18px] font-semibold">
              <li>
                <HashLink
                  smooth
                  to="/#welcome"
                  onClick={toggleMenu}
                  className="block py-1 tracking-[0.16em] hover:text-[#ff8c00] transition-colors duration-200"
                >
                  HOME
                </HashLink>
              </li>
              <li>
                <HashLink
                  smooth
                  to="/#community"
                  onClick={toggleMenu}
                  className="block py-1 tracking-[0.16em] hover:text-[#ff8c00] transition-colors duration-200"
                >
                  COMMUNITY
                </HashLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  onClick={toggleMenu}
                  className="block py-1 tracking-[0.16em] hover:text-[#ff8c00] transition-colors duration-200"
                >
                  CONTACT
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/officedetails"
                  onClick={toggleMenu}
                  className="block py-1 tracking-[0.16em] hover:text-[#ff8c00] transition-colors duration-200"
                >
                  SPACES
                </NavLink>
              </li>

              {user?.isAdmin && (
                <li>
                  <NavLink
                    to="/admin"
                    onClick={toggleMenu}
                    className="block py-1 tracking-[0.16em] hover:text-[#ff8c00] transition-colors duration-200"
                  >
                    DASHBOARD
                  </NavLink>
                </li>
              )}

              {!isLoggedIn && (
                <li>
                  <NavLink
                    to="/login"
                    onClick={toggleMenu}
                    className="block py-1 tracking-[0.16em] hover:text-[#ff8c00] transition-colors duration-200"
                  >
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
                    className="block py-1 tracking-[0.16em] hover:text-[#ff8c00] transition-colors duration-200"
                  >
                    LOGOUT
                  </button>
                </li>
              )}

              <li className="pt-2">
                <button
                  className="w-full px-4 py-2 rounded-full bg-[#ff8c00] text-white text-[15px] shadow-md font-semibold tracking-[0.12em] hover:bg-[#ff9f2c] transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  EN / MK
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
