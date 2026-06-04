import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, toFormData } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }

    try {
      setUser(await api("/auth/profile"));
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const login = async (values) => {
    const data = await api("/auth/login", { method: "POST", body: values });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (values) => {
    const data = await api("/auth/register", { method: "POST", body: toFormData(values) });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const googleLogin = async (credential) => {
    const data = await api("/auth/google", { method: "POST", body: { credential } });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, googleLogin, logout, setUser, loadProfile }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
