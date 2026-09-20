import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser
} from "../api/auth.api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Restore authentication state when the app starts.
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      }
    }

    setLoading(false);
  }, []);

  /*
   * Login
   */
  const login = async (email, password) => {
    const result = await loginUser(email, password);

    setUser(result.user);
    setToken(result.token);

    localStorage.setItem(
      "auth_user",
      JSON.stringify(result.user)
    );

    localStorage.setItem(
      "auth_token",
      result.token
    );

    return result.user;
  };

  /*
   * Registration
   */
  const register = async (userData) => {
    const result = await registerUser(userData);

    setUser(result.user);
    setToken(result.token);

    localStorage.setItem(
      "auth_user",
      JSON.stringify(result.user)
    );

    localStorage.setItem(
      "auth_token",
      result.token
    );

    return result.user;
  };

  /*
   * Logout
   */
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setToken(null);

      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}

export default AuthContext;
export { AuthProvider };