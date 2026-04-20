import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [others, setOthers] = useState([]);
  const [generatedPortfolios, setGeneratedPortfolios] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to fetch a collection
  const fetchCollection = async (collectionName) => {
    if (!currentUser?.uid) return [];
    const snapshot = await getDocs(collection(db, `users/${currentUser.uid}/${collectionName}`));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (currentUser?.uid) {
        try {
          const [loadedProjects, loadedExperiences, loadedCertifications, loadedOthers, loadedPortfolios] = await Promise.all([
            fetchCollection('projects'),
            fetchCollection('experiences'),
            fetchCollection('certifications'),
            fetchCollection('others'),
            fetchCollection('generatedPortfolios')
          ]);
          
          if (isMounted) {
            setProjects(loadedProjects);
            setExperiences(loadedExperiences);
            setCertifications(loadedCertifications);
            setOthers(loadedOthers);
            setGeneratedPortfolios(loadedPortfolios);
            setIsLoaded(true);
          }
        } catch (error) {
          console.error("Error loading data from Firestore:", error);
          if (isMounted) setIsLoaded(true); // Don't block UI on error
        }
      } else {
        if (isMounted) {
          setProjects([]);
          setExperiences([]);
          setCertifications([]);
          setOthers([]);
          setGeneratedPortfolios([]);
          setIsLoaded(false);
        }
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [currentUser]);

  // Generic helpers for Firestore operations
  const addDocToFirestore = async (collectionName, item, stateSetter, stateArray) => {
    if (!currentUser?.uid) return;
    const docId = Date.now().toString();
    const newItem = { ...item, id: docId };
    try {
      await setDoc(doc(db, `users/${currentUser.uid}/${collectionName}`, docId), newItem);
      stateSetter([...stateArray, newItem]);
    } catch (error) {
      console.error(`Error adding to ${collectionName}:`, error);
    }
  };

  const updateDocInFirestore = async (collectionName, id, updatedFields, stateSetter, stateArray) => {
    if (!currentUser?.uid) return;
    try {
      await updateDoc(doc(db, `users/${currentUser.uid}/${collectionName}`, id), updatedFields);
      stateSetter(stateArray.map(item => item.id === id ? { ...item, ...updatedFields } : item));
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
    }
  };

  const deleteDocFromFirestore = async (collectionName, id, stateSetter, stateArray) => {
    if (!currentUser?.uid) return;
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/${collectionName}`, id));
      stateSetter(stateArray.filter(item => item.id !== id));
    } catch (error) {
      console.error(`Error deleting from ${collectionName}:`, error);
    }
  };

  // Specific operations
  const addProject = (project) => addDocToFirestore('projects', project, setProjects, projects);
  const updateProject = (id, updated) => updateDocInFirestore('projects', id, updated, setProjects, projects);
  const deleteProject = (id) => deleteDocFromFirestore('projects', id, setProjects, projects);

  const addExperience = (exp) => addDocToFirestore('experiences', exp, setExperiences, experiences);
  const updateExperience = (id, updated) => updateDocInFirestore('experiences', id, updated, setExperiences, experiences);
  const deleteExperience = (id) => deleteDocFromFirestore('experiences', id, setExperiences, experiences);

  const addCertification = (cert) => addDocToFirestore('certifications', cert, setCertifications, certifications);
  const updateCertification = (id, updated) => updateDocInFirestore('certifications', id, updated, setCertifications, certifications);
  const deleteCertification = (id) => deleteDocFromFirestore('certifications', id, setCertifications, certifications);

  const addOther = (item) => addDocToFirestore('others', item, setOthers, others);
  const updateOther = (id, updated) => updateDocInFirestore('others', id, updated, setOthers, others);
  const deleteOther = (id) => deleteDocFromFirestore('others', id, setOthers, others);

  const addGeneratedPortfolio = (portfolio) => addDocToFirestore('generatedPortfolios', { ...portfolio, createdAt: new Date().toISOString() }, setGeneratedPortfolios, generatedPortfolios);
  const deleteGeneratedPortfolio = (id) => deleteDocFromFirestore('generatedPortfolios', id, setGeneratedPortfolios, generatedPortfolios);

  const value = {
    projects, addProject, updateProject, deleteProject,
    experiences, addExperience, updateExperience, deleteExperience,
    certifications, addCertification, updateCertification, deleteCertification,
    others, addOther, updateOther, deleteOther,
    generatedPortfolios, addGeneratedPortfolio, deleteGeneratedPortfolio
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
