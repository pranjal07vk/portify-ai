import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedLayout from '../components/layout/AnimatedLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <AnimatedLayout>
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl text-center z-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-[var(--color-primary)] bg-[var(--color-bg-card)] backdrop-blur-sm text-sm font-medium text-[var(--color-primary)]"
          >
            Introducing CareerFolio 1.0
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            The intelligent way to build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-blue-400">Portfolio</span>
          </h1>
          
          <p className="text-xl text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto">
            Store your professional activities. Generate tailored, role-specific portfolios instantly using keyword matching. Impress recruiters with adaptive profiles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!currentUser ? (
              <Button onClick={() => navigate('/auth')} className="text-lg px-8 py-3">
                Get Started
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => navigate('/dashboard')} className="text-lg px-8 py-3">
                Go to Dashboard
              </Button>
            )}
          </div>
        </motion.div>

        {/* Abstract shapes for background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] z-0 pointer-events-none opacity-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full border border-white/5 border-dashed"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] rounded-full border border-white/5 border-dashed"
          />
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Home;
