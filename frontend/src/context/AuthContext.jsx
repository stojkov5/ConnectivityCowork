import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  // Init from sessionStorage ONLY (dies when browser closes)
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userStr = sessionStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuth({ isLoggedIn: true, user, token });
      } catch {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setAuth({ isLoggedIn: false, user: null, token: null });
      }
    }
  }, []);

  const login = (token, user) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));
    setAuth({ isLoggedIn: true, user, token });
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setAuth({ isLoggedIn: false, user: null, token: null });
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth, // isLoggedIn, user, token
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
