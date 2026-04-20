import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialProjects = [
  { id: '1', title: 'E-commerce Platform', description: 'Built a full-stack platform with Next.js and Stripe.', tags: ['React', 'Next.js', 'Stripe', 'Node.js'] },
  { id: '2', title: 'AI Portfolio Builder', description: 'Developed a responsive generator using React and Firebase.', tags: ['React', 'Firebase', 'Tailwind', 'AI'] },
];

const initialExperiences = [
  { id: '1', role: 'Frontend Developer Intern', company: 'TechNova', description: 'Optimized web performance and built interactive UI components.', tags: ['React', 'Performance', 'UI/UX'] }
];

const initialCertifications = [
  { id: '1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', tags: ['AWS', 'Cloud', 'Architecture'] }
];

const initialOthers = [
  { id: '1', title: 'Open Source Contributor', description: 'Contributed to React core repository.', tags: ['React', 'Open Source'] }
];

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [others, setOthers] = useState([]);
  const [generatedPortfolios, setGeneratedPortfolios] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data when user changes
  useEffect(() => {
    if (currentUser?.email) {
      const savedData = localStorage.getItem(`portify_data_${currentUser.email}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setProjects(parsed.projects || []);
        setExperiences(parsed.experiences || []);
        setCertifications(parsed.certifications || []);
        setOthers(parsed.others || []);
        setGeneratedPortfolios(parsed.generatedPortfolios || []);
      } else {
        // New user gets initial random data
        setProjects(initialProjects);
        setExperiences(initialExperiences);
        setCertifications(initialCertifications);
        setOthers(initialOthers);
        setGeneratedPortfolios([]);
      }
      setIsLoaded(true);
    } else {
      // Clear data if logged out
      setProjects([]);
      setExperiences([]);
      setCertifications([]);
      setOthers([]);
      setGeneratedPortfolios([]);
      setIsLoaded(false);
    }
  }, [currentUser]);

  // Save data whenever it changes
  useEffect(() => {
    if (isLoaded && currentUser?.email) {
      const dataToSave = { projects, experiences, certifications, others, generatedPortfolios };
      localStorage.setItem(`portify_data_${currentUser.email}`, JSON.stringify(dataToSave));
    }
  }, [projects, experiences, certifications, others, generatedPortfolios, currentUser, isLoaded]);

  const addProject = (project) => setProjects([...projects, { ...project, id: Date.now().toString() }]);
  const updateProject = (id, updated) => setProjects(projects.map(p => p.id === id ? { ...p, ...updated } : p));
  const deleteProject = (id) => setProjects(projects.filter(p => p.id !== id));

  const addExperience = (exp) => setExperiences([...experiences, { ...exp, id: Date.now().toString() }]);
  const updateExperience = (id, updated) => setExperiences(experiences.map(e => e.id === id ? { ...e, ...updated } : e));
  const deleteExperience = (id) => setExperiences(experiences.filter(e => e.id !== id));

  const addCertification = (cert) => setCertifications([...certifications, { ...cert, id: Date.now().toString() }]);
  const updateCertification = (id, updated) => setCertifications(certifications.map(c => c.id === id ? { ...c, ...updated } : c));
  const deleteCertification = (id) => setCertifications(certifications.filter(c => c.id !== id));

  const addOther = (item) => setOthers([...others, { ...item, id: Date.now().toString() }]);
  const updateOther = (id, updated) => setOthers(others.map(o => o.id === id ? { ...o, ...updated } : o));
  const deleteOther = (id) => setOthers(others.filter(o => o.id !== id));

  const addGeneratedPortfolio = (portfolio) => setGeneratedPortfolios([...generatedPortfolios, { ...portfolio, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
  const deleteGeneratedPortfolio = (id) => setGeneratedPortfolios(generatedPortfolios.filter(p => p.id !== id));

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
