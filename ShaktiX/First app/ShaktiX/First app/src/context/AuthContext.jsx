import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("shaktix_user");
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem("shaktix_users");
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem("shaktix_user", JSON.stringify(user));
      else localStorage.removeItem("shaktix_user");
    } catch (_) {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("shaktix_users", JSON.stringify(users));
    } catch (_) {}
  }, [users]);

  const login = ({ email, password }) => {
    const found = users.find((u) => u.email === email);
    if (!found) return { ok: false, error: "Wrong credentials" };
    if (String(found.password || "") !== String(password || "")) {
      return { ok: false, error: "Wrong credentials" };
    }
    const { password: _pw, ...profile } = found;
    setUser(profile);
    return { ok: true };
  };
  const logout = () => setUser(null);
  const signup = (profile) => {
    // Expecting profile to include email and password
    const exists = users.some((u) => u.email === profile.email);
    if (exists) return { ok: false, error: "Email already registered" };
    setUsers((prev) => [...prev, profile]);
    const { password: _pw, ...sessionUser } = profile;
    setUser(sessionUser);
    return { ok: true };
  };
  const updateProfile = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      return next;
    });
  };

  const value = useMemo(() => ({ user, login, logout, signup, updateProfile }), [user, users]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


