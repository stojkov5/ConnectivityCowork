// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

// how long to keep user logged in (in ms)
const SESSION_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const STORAGE_KEY = "auth";
const EXPIRY_KEY = "authExpiry";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  const [expiry, setExpiry] = useState(null);

  // --- Load from localStorage on first render ---
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const expiryStr = localStorage.getItem(EXPIRY_KEY);

      if (stored && expiryStr) {
        const parsed = JSON.parse(stored);
        const expiresAt = parseInt(expiryStr, 10);

        // still valid?
        if (parsed && parsed.token && !Number.isNaN(expiresAt)) {
          if (expiresAt > Date.now()) {
            setAuth(parsed);
            setExpiry(expiresAt);
          } else {
            // expired → clear
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(EXPIRY_KEY);
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse auth from localStorage", e);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRY_KEY);
    }
  }, []);

  // --- Auto logout when expiry is reached ---
  useEffect(() => {
    if (!auth.token || !expiry) return;

    const remaining = expiry - Date.now();
    if (remaining <= 0) {
      // already expired
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
    }, remaining);

    return () => clearTimeout(timer);
   
  }, [auth.token, expiry]);

  const login = (token, user) => {
    const newAuth = { isLoggedIn: true, user, token };
    const expiresAt = Date.now() + SESSION_DURATION_MS;

    setAuth(newAuth);
    setExpiry(expiresAt);

    // persist to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuth));
    localStorage.setItem(EXPIRY_KEY, String(expiresAt));
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null, token: null });
    setExpiry(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
