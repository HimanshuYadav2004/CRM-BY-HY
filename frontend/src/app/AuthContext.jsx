import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    const { data } = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
