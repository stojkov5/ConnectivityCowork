// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  // Load from sessionStorage on first render
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.token) {
          setAuth(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse auth from sessionStorage", e);
      sessionStorage.removeItem("auth");
    }
  }, []);

  // Persist to sessionStorage
  useEffect(() => {
    if (auth && auth.token) {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    } else {
      sessionStorage.removeItem("auth");
    }
  }, [auth]);

  const login = (token, user) => {
    setAuth({ isLoggedIn: true, user, token });
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null, token: null });
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
