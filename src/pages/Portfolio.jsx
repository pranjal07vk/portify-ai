import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Briefcase, Folder, Link as LinkIcon, Paperclip, ChevronLeft } from 'lucide-react';
import AnimatedLayout from '../components/layout/AnimatedLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Portfolio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch portfolio by ID from DB.
    // Here we use the state passed from Builder.
    if (location.state) {
      setData(location.state);
    } else {
      // If no state, perhaps navigated directly. We should probably redirect or show an error.
      // But for demo, let's just use empty arrays.
      setData({ role: 'Unknown Role', matchedProjects: [], matchedExperiences: [] });
    }
  }, [location.state]);

  if (!data) return null;

  return (
    <AnimatedLayout>
      <div className="min-h-screen bg-[var(--color-bg-dark)] py-12 px-6 sm:px-12 relative overflow-hidden">
        {/* Abstract background effects specific to portfolio */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[var(--color-primary)]/10 to-transparent blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto w-full relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mb-8 flex items-center gap-2 -ml-4"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </Button>

          {/* Header Section */}
          <motion.header 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="mb-16 border-b border-[var(--color-border-subtle)] pb-12"
          >
            <h1 className="text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {data.role} Portfolio
            </h1>
            <p className="text-xl text-[var(--color-text-muted)] flex items-center gap-2">
              <LinkIcon size={18} /> portify.ai/p/{id}
            </p>
          </motion.header>

          {/* Experiences Section */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Briefcase size={24} />
              </div>
              <h2 className="text-3xl font-bold">Relevant Experience</h2>
            </div>
            
            <div className="space-y-6">
              {data.matchedExperiences.length > 0 ? (
                data.matchedExperiences.map((exp) => (
                  <Card key={exp.id} hover={false} className="border-l-4 border-l-[var(--color-primary)]">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold">{exp.role}</h3>
                      <div className="text-sm font-medium px-3 py-1 bg-white/5 rounded-full text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                        {exp.score ? `${Math.round((exp.score / Math.max(exp.tags.length, 1)) * 100)}% Match` : 'Matched'}
                      </div>
                    </div>
                    <p className="text-[var(--color-text-muted)] mb-6 text-lg leading-relaxed">{exp.description}</p>
                    {exp.attachment && (
                      <div className="flex items-center gap-2 text-sm text-[var(--color-primary)] bg-[var(--color-primary)]/10 w-fit px-4 py-2 rounded-lg mb-6 hover:bg-[var(--color-primary)]/20 cursor-pointer transition-colors">
                        <Paperclip size={16} />
                        <span className="font-medium">Attached: {exp.attachment}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {exp.tags.map(tag => (
                        <span key={tag} className="text-sm px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-[var(--color-text-muted)]">No highly relevant experiences found for this role.</p>
              )}
            </div>
          </motion.section>

          {/* Projects Section */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <Folder size={24} />
              </div>
              <h2 className="text-3xl font-bold">Featured Projects</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.matchedProjects.length > 0 ? (
                data.matchedProjects.map((project) => (
                  <Card key={project.id} className="h-full flex flex-col border-t-2 border-t-blue-500/50">
                    <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                    <p className="text-[var(--color-text-muted)] mb-6 flex-1 text-lg">{project.description}</p>
                    {project.attachment && (
                      <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 w-fit px-3 py-1.5 rounded-lg mb-4 cursor-pointer hover:bg-blue-500/20 transition-colors">
                        <Paperclip size={14} />
                        <span className="truncate max-w-[200px]">{project.attachment}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-md bg-white/5 text-[var(--color-text-main)] border border-[var(--color-border-subtle)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-[var(--color-text-muted)] col-span-full">No highly relevant projects found for this role.</p>
              )}
            </div>
          </motion.section>

        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Portfolio;
