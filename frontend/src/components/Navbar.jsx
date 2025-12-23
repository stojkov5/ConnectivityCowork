import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { Row, Col } from "antd";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../context/AuthContext.jsx";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ru", label: "RU" },
  { code: "mk", label: "MK" },
];

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const { isLoggedIn, user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleLangMenu = () => setLangMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setLangMenuOpen(false);
  };

  const currentLang = i18n.resolvedLanguage || i18n.language || "en";

  const renderDesktopNavLink = (to, labelKey, isHash = false) => {
    const base =
      "group relative tracking-[0.12em] text-[15px] xl:text-[16px] font-semibold transition-colors duration-200 hover:text-[#ff8c00]";

    const underline =
      "pointer-events-none absolute left-0 -bottom-0.5 h-[2px] w-0 bg-[#ff8c00] transition-all duration-300 group-hover:w-full";

    const label = t(labelKey);

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
          [base, isActive ? "text-[#ff8c00]" : ""].join(" ")
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
                  src={`${import.meta.env.BASE_URL}Images/Logo1.png`}
                  alt="Desktop Logo"
                />
                {/* Mobile Logo */}
                <img
                  className="md:hidden w-16"
                  src={`${import.meta.env.BASE_URL}Images/Logo2.png`}
                  alt="Mobile Logo"
                />
              </NavLink>
            </Col>

            {/* Desktop Links */}
            <Col lg={14} className="hidden lg:block">
              <ul className="flex justify-center items-center gap-6 xl:gap-8 text-black">
                <li className="group">
                  {renderDesktopNavLink("/", "nav.home", true)}
                </li>
                <li className="group">
                  {renderDesktopNavLink("/#community", "nav.community", true)}
                </li>
                <li className="group">
                  {renderDesktopNavLink("/contact", "nav.contact")}
                </li>
                <li className="group">
                  {renderDesktopNavLink("/officedetails", "nav.spaces")}
                </li>

                {user?.isAdmin && (
                  <li className="group">
                    {renderDesktopNavLink("/admin", "nav.dashboard")}
                  </li>
                )}
              </ul>
            </Col>

            {/* Desktop Right Side (Login + Language) & Mobile Hamburger */}
            <Col xs={12} lg={6}>
              <div className="flex justify-end items-center gap-3">
                {/* DESKTOP login/logout + language */}
                <div className="hidden lg:flex items-center gap-3 relative">
                  {!isLoggedIn && (
                    <NavLink
                      to="/login"
                      className="login-button font-semibold text-[15px] xl:text-[16px] hover:text-[#ff8c00] transition-all duration-200"
                    >
                      {t("nav.login")}
                    </NavLink>
                  )}

                  {isLoggedIn && (
                    <button
                      className="text-[15px] xl:text-[16px] font-semibold hover:text-[#ff8c00] transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      {t("nav.logout")}
                    </button>
                  )}

                  {/* DESKTOP Language dropdown */}
                  <div className="relative">
                    <button
                      className="bg-[#ff8c00] text-white px-4 py-1.5 rounded-full text-[13px] xl:text-[14px] font-semibold shadow-md hover:bg-[#ff9f2c] transition-colors duration-200 flex items-center gap-1"
                      onClick={toggleLangMenu}
                      type="button"
                    >
                      {currentLang.toUpperCase()}
                      <span className="text-[10px]">▼</span>
                    </button>

                    {langMenuOpen && (
                      <div className="absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                        {LANGUAGES.map((lng) => (
                          <button
                            key={lng.code}
                            type="button"
                            onClick={() => handleLanguageChange(lng.code)}
                            className={`w-full text-left px-3 py-2 text-[13px] font-semibold tracking-[0.12em] hover:bg-gray-100 ${
                              currentLang === lng.code
                                ? "text-[#ff8c00]"
                                : "text-gray-800"
                            }`}
                          >
                            {lng.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
                <img
                  className="w-20"
                  src="/Images/Logo2.png"
                  alt="Mobile Logo"
                />
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
                  {t("nav.home")}
                </HashLink>
              </li>
              <li>
                <HashLink
                  smooth
                  to="/#community"
                  onClick={toggleMenu}
                  className="block py-1 tracking-[0.16em] hover:text-[#ff8c00] transition-colors duration-200"
                >
                  {t("nav.community")}
                </HashLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  onClick={toggleMenu}
                  className="block py-1 tracking-[0.16em] hover:text-[#ff8c00] transition-colors duration-200"
                >
                  {t("nav.contact")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/officedetails"
                  onClick={toggleMenu}
                  className="block py-1 tracking-[0.16em] hover:text-[#ff8c00] transition-colors duration-200"
                >
                  {t("nav.spaces")}
                </NavLink>
              </li>

              {user?.isAdmin && (
                <li>
                  <NavLink
                    to="/admin"
                    onClick={toggleMenu}
                    className="block py-1 tracking-[0.16em] hover:text-[#ff8c00] transition-colors duration-200"
                  >
                    {t("nav.dashboard")}
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
                    {t("nav.login")}
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
                    {t("nav.logout")}
                  </button>
                </li>
              )}

              {/* MOBILE language selection */}
              <li className="pt-2">
                <div className="w-full">
                  <p className="text-[13px] text-gray-500 mb-1 tracking-[0.14em]">
                    LANGUAGE
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {LANGUAGES.map((lng) => (
                      <button
                        key={lng.code}
                        type="button"
                        onClick={() => handleLanguageChange(lng.code)}
                        className={`flex-1 px-3 py-2 rounded-full text-[14px] tracking-[0.12em] font-semibold border transition-colors duration-200 ${
                          currentLang === lng.code
                            ? "bg-[#ff8c00] text-white border-[#ff8c00]"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {lng.label}
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
