import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        setUser(JSON.parse(currentUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const signup = (userData) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check if email already exists
    const emailExists = users.find(u => u.email === userData.email);
    if (emailExists) {
      return { success: false, error: "Email already registered" };
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    // Set as current user
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      setUser(foundUser);
      return { success: true, user: foundUser };
    }
    
    return { success: false, error: "Invalid email or password" };
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }
    
    // Update current user
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, updateProfile, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
