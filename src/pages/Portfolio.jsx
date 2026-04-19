import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Briefcase, Folder, Link as LinkIcon, Paperclip, ChevronLeft, Star, Download, User, Mail, Phone, MapPin, Zap } from 'lucide-react';
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
  const [customIntro, setCustomIntro] = useState('');
  const [isEditingIntro, setIsEditingIntro] = useState(false);

  useEffect(() => {
    if (location.state) {
      setData(location.state);
      setCustomIntro(location.state.generatedIntro || '');
    } else {
      setData({ role: 'Unknown Role', user: null, generatedIntro: '', matchedProjects: [], matchedExperiences: [], matchedOthers: [] });
    }
  }, [location.state]);

  if (!data) return null;

  const { user, role, matchedProjects, matchedExperiences, matchedOthers } = data;
  const skillsArray = user?.skills ? user.skills.split(',').map(s => s.trim()).filter(s => s) : [];

  return (
    <AnimatedLayout>
      <div className="min-h-screen bg-[var(--color-bg-dark)] py-12 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[var(--color-primary)]/10 to-transparent blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto w-full relative z-10 print:m-0 print:p-0 print:w-full print:max-w-full">
          <div className="flex justify-between items-center mb-12 print:hidden">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-2 -ml-4"
            >
              <ChevronLeft size={16} /> Back to Dashboard
            </Button>
            <Button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 border-none shadow-lg shadow-green-500/20 text-white"
            >
              <Download size={16} /> Download PDF
            </Button>
          </div>

          {/* Section 1: Cover / Introduction */}
          <motion.header 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="mb-16 flex flex-col items-center text-center border-b border-[var(--color-border-subtle)] pb-16"
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-[var(--color-primary)]/30 mb-6 shadow-xl shadow-[var(--color-primary)]/20" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-indigo-600 mb-6 flex items-center justify-center text-5xl font-bold text-white shadow-xl shadow-[var(--color-primary)]/20">
                {user?.displayName?.charAt(0) || 'U'}
              </div>
            )}
            
            <h1 className="text-5xl font-bold tracking-tight mb-2 text-white">
              {user?.displayName || 'Portfolio'}
            </h1>
            <h2 className="text-2xl font-medium text-[var(--color-primary)] mb-6">
              {role}
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <LinkIcon size={16} /> portify.ai/p/{id}
            </p>
          </motion.header>

          {/* Section 1.5: Editable Generated Introduction */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="mb-16 -mt-8"
          >
            {isEditingIntro ? (
              <div className="bg-black/30 border border-[var(--color-border-subtle)] p-6 rounded-2xl print:hidden">
                <textarea 
                  value={customIntro} 
                  onChange={(e) => setCustomIntro(e.target.value)}
                  className="w-full bg-transparent text-xl text-[var(--color-text-main)] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg resize-none"
                  rows={4}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setIsEditingIntro(false)} className="px-6">Save Intro</Button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => setIsEditingIntro(true)}
                className="group relative text-center max-w-3xl mx-auto cursor-pointer p-6 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-[var(--color-border-subtle)] print:hover:bg-transparent print:hover:border-transparent print:p-0 print:border-none"
                title="Click to edit introduction"
              >
                <p className="text-2xl font-light text-[var(--color-text-main)] leading-relaxed">
                  "{customIntro}"
                </p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[var(--color-primary)] text-sm font-medium bg-[var(--color-primary)]/10 px-3 py-1 rounded-full print:hidden transition-opacity">
                  Edit
                </div>
              </div>
            )}
          </motion.section>

          {/* Section 2: About Me / Bio */}
          {user?.bio && (
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
                  <User size={24} />
                </div>
                <h2 className="text-3xl font-bold">About Me</h2>
              </div>
              <Card hover={false} className="border-l-4 border-l-orange-500">
                <p className="text-xl text-[var(--color-text-main)] leading-relaxed">{user.bio}</p>
                {user.city && (
                  <div className="mt-4 flex items-center gap-2 text-[var(--color-text-muted)]">
                    <MapPin size={16} /> Based in {user.city}
                  </div>
                )}
              </Card>
            </motion.section>
          )}

          {/* Section 3: Services / Skills */}
          {skillsArray.length > 0 && (
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
                  <Zap size={24} />
                </div>
                <h2 className="text-3xl font-bold">Services & Skills</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {skillsArray.map((skill, idx) => (
                  <div key={idx} className="px-5 py-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-medium text-lg">
                    {skill}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 4: Selected Works (Projects) */}
          {matchedProjects.length > 0 && (
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
                <h2 className="text-3xl font-bold">Selected Works</h2>
              </div>
              
              <div className="space-y-8">
                {matchedProjects.map((project) => (
                  <Card key={project.id} hover={false} className="flex flex-col border-t-4 border-t-blue-500 p-8 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-3xl font-bold text-white">{project.title}</h3>
                    </div>
                    
                    <div className="mt-2 mb-6">
                      <h4 className="text-sm uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-2">Context & Results</h4>
                      <p className="text-xl text-[var(--color-text-main)] leading-relaxed whitespace-pre-wrap">{project.description}</p>
                    </div>

                    {project.attachment && (
                      <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 w-fit px-4 py-2 rounded-lg mb-6 border border-blue-500/20">
                        <Paperclip size={16} />
                        <span className="font-medium">Deliverable: {project.attachment}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-sm px-3 py-1 rounded-full bg-white/5 text-[var(--color-text-main)] border border-[var(--color-border-subtle)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 5: Relevant Experience */}
          {matchedExperiences.length > 0 && (
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
                {matchedExperiences.map((exp) => (
                  <Card key={exp.id} hover={false} className="border-l-4 border-l-[var(--color-primary)]">
                    <h3 className="text-2xl font-bold mb-4 text-white">{exp.role}</h3>
                    <p className="text-[var(--color-text-main)] mb-6 text-lg leading-relaxed">{exp.description}</p>
                    {exp.attachment && (
                      <div className="flex items-center gap-2 text-sm text-[var(--color-primary)] bg-[var(--color-primary)]/10 w-fit px-4 py-2 rounded-lg mb-6">
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
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 6: Other Achievements */}
          {matchedOthers?.length > 0 && (
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <Star size={24} />
                </div>
                <h2 className="text-3xl font-bold">Other Achievements</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchedOthers.map((item) => (
                  <Card key={item.id} hover={false} className="h-full flex flex-col border-t-2 border-t-purple-500/50">
                    <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                    <p className="text-[var(--color-text-muted)] mb-6 flex-1 text-base">{item.description}</p>
                    {item.attachment && (
                      <div className="flex items-center gap-2 text-sm text-purple-400 bg-purple-500/10 w-fit px-3 py-1.5 rounded-lg mb-4">
                        <Paperclip size={14} />
                        <span className="truncate max-w-[200px]">{item.attachment}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 7: Contact Information */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="mb-8"
          >
            <Card hover={false} className="bg-gradient-to-br from-[var(--color-bg-dark)] to-[#151520] border border-[var(--color-border-subtle)] p-12 text-center">
              <h2 className="text-4xl font-bold mb-4 text-white">Let's Work Together</h2>
              <p className="text-xl text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto">
                Interested in collaborating or have a project in mind? Feel free to reach out.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {user?.email && (
                  <a href={`mailto:${user.email}`} className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-lg font-medium text-white w-full sm:w-auto justify-center">
                    <Mail className="text-[var(--color-primary)]" size={24} /> {user.email}
                  </a>
                )}
                {user?.phone && (
                  <a href={`tel:${user.phone}`} className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-lg font-medium text-white w-full sm:w-auto justify-center">
                    <Phone className="text-[var(--color-primary)]" size={24} /> {user.phone}
                  </a>
                )}
              </div>
            </Card>
          </motion.section>

        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Portfolio;
