import React, { createContext, useContext, useState, useEffect } from 'react';

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

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [experiences, setExperiences] = useState(initialExperiences);
  const [certifications, setCertifications] = useState(initialCertifications);

  const addProject = (project) => setProjects([...projects, { ...project, id: Date.now().toString() }]);
  const updateProject = (id, updated) => setProjects(projects.map(p => p.id === id ? { ...p, ...updated } : p));
  const deleteProject = (id) => setProjects(projects.filter(p => p.id !== id));

  const addExperience = (exp) => setExperiences([...experiences, { ...exp, id: Date.now().toString() }]);
  const updateExperience = (id, updated) => setExperiences(experiences.map(e => e.id === id ? { ...e, ...updated } : e));
  const deleteExperience = (id) => setExperiences(experiences.filter(e => e.id !== id));

  const addCertification = (cert) => setCertifications([...certifications, { ...cert, id: Date.now().toString() }]);
  const updateCertification = (id, updated) => setCertifications(certifications.map(c => c.id === id ? { ...c, ...updated } : c));
  const deleteCertification = (id) => setCertifications(certifications.filter(c => c.id !== id));

  const value = {
    projects, addProject, updateProject, deleteProject,
    experiences, addExperience, updateExperience, deleteExperience,
    certifications, addCertification, updateCertification, deleteCertification
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
