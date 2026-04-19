import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedLayout from '../components/layout/AnimatedLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useData } from '../context/DataContext';
import { generatePortfolioId, matchKeywords } from '../utils/matching';

const loadingTexts = [
  "Analyzing your experience...",
  "Matching skills with job role...",
  "Scoring projects and certifications...",
  "Building your personalized portfolio..."
];

const Builder = () => {
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const { projects, experiences } = useData();
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate engaging loading state
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < loadingTexts.length) {
        setLoadingStep(step);
      } else {
        clearInterval(interval);
        
        // Execute matching logic
        const matchedProjects = matchKeywords(`${role} ${description}`, projects).slice(0, 3);
        const matchedExperiences = matchKeywords(`${role} ${description}`, experiences).slice(0, 3);
        
        const portfolioId = generatePortfolioId();
        // In a real app, save this generated portfolio to DB with the ID
        // For demo, we'll pass state via navigation or assume the Portfolio page does the matching.
        // Actually, passing via React Router state is easiest for this demo.
        navigate(`/portfolio/${portfolioId}`, { 
          state: { 
            role, 
            matchedProjects, 
            matchedExperiences 
          } 
        });
      }
    }, 1500); // 1.5s per step
  };

  return (
    <AnimatedLayout>
      <div className="flex-1 flex items-center justify-center p-6 w-full">
        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-2xl"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Generate Portfolio</h1>
                <p className="text-[var(--color-text-muted)]">
                  Enter the job details and we'll match your best projects and experiences.
                </p>
              </div>

              <Card hover={false} className="p-8">
                <form onSubmit={handleGenerate} className="space-y-6">
                  <Input 
                    label="Target Job Role" 
                    placeholder="e.g. Senior Frontend Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">Job Description (Optional, for better matching)</label>
                    <textarea 
                      className="bg-black/30 border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-[var(--color-text-main)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                      rows="5"
                      placeholder="Paste the job description here..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full py-3 text-lg mt-4">
                    Generate My Portfolio
                  </Button>
                </form>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 border-4 border-[var(--color-border-subtle)] border-t-[var(--color-primary)] rounded-full mb-8"
              />
              <AnimatePresence mode="wait">
                <motion.h3
                  key={loadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl font-medium text-[var(--color-primary)]"
                >
                  {loadingTexts[loadingStep]}
                </motion.h3>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedLayout>
  );
};

export default Builder;
