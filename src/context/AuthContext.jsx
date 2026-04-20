import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseAuthProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUser({ uid: user.uid, email: user.email, ...docSnap.data() });
        } else {
          setCurrentUser({ uid: user.uid, email: user.email, displayName: user.displayName });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password, name, city, phone) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateFirebaseAuthProfile(user, { displayName: name });
    
    // Create user document in Firestore
    const userData = {
      displayName: name,
      email: email,
      city: city || '',
      phone: phone || '',
      bio: '',
      skills: '',
      profileImage: null
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    setCurrentUser({ uid: user.uid, ...userData });
    return userCredential;
  };

  const updateProfile = async (updates) => {
    if (!currentUser?.uid) return;
    
    const docRef = doc(db, 'users', currentUser.uid);
    await updateDoc(docRef, updates);
    
    setCurrentUser({ ...currentUser, ...updates });
  };

  const logout = () => {
    return signOut(auth);
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