import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock check for logged-in user
    const user = localStorage.getItem('mockUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login
    const user = { uid: '12345', email, displayName: 'Test User' };
    setCurrentUser(user);
    localStorage.setItem('mockUser', JSON.stringify(user));
    return Promise.resolve();
  };

  const signup = (email, password) => {
    return login(email, password);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mockUser');
    return Promise.resolve();
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};