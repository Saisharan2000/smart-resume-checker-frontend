// src/auth.js
export const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

export const login = (email) => {
  localStorage.setItem("user", JSON.stringify({ email }));
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
