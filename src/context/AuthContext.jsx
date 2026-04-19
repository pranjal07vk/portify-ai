import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUsersDb = () => JSON.parse(localStorage.getItem('users_db') || '{}');
  const saveUsersDb = (db) => localStorage.setItem('users_db', JSON.stringify(db));

  useEffect(() => {
    // Mock check for logged-in user session
    const activeEmail = localStorage.getItem('mockUserSession');
    if (activeEmail) {
      const db = getUsersDb();
      if (db[activeEmail]) {
        setCurrentUser(db[activeEmail]);
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const db = getUsersDb();
    if (db[email]) {
      setCurrentUser(db[email]);
      localStorage.setItem('mockUserSession', email);
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Account not found. Please sign up."));
    }
  };

  const signup = (email, password, name, city, phone) => {
    const db = getUsersDb();
    if (db[email]) {
      return Promise.reject(new Error("Account already exists with this email. Please sign in."));
    }
    
    const newUser = { 
      uid: Date.now().toString(), 
      email, 
      displayName: name, 
      city, 
      phone: phone || '', 
      bio: '', 
      skills: '', 
      profileImage: null 
    };
    db[email] = newUser;
    saveUsersDb(db);
    
    setCurrentUser(newUser);
    localStorage.setItem('mockUserSession', email);
    return Promise.resolve();
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    
    const db = getUsersDb();
    db[updatedUser.email] = updatedUser;
    saveUsersDb(db);
    
    return Promise.resolve();
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mockUserSession');
    return Promise.resolve();
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};