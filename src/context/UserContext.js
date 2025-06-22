import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem("email");
    return email ? { email } : null;
  });

  const login = (email) => {
    localStorage.setItem("email", email);
    setUser({ email });
  };

  const logout = () => {
    localStorage.removeItem("email");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
