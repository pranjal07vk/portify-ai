import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Paperclip, LogOut, Camera, X, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedLayout from '../components/layout/AnimatedLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const typeColors = {
  project: { border: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  experience: { border: 'border-pink-500', bg: 'bg-pink-500/10', text: 'text-pink-400' },
  other: { border: 'border-yellow-500', bg: 'bg-yellow-500/10', text: 'text-yellow-400' }
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {
    projects, addProject, deleteProject,
    experiences, addExperience, deleteExperience,
    others, addOther, deleteOther,
    generatedPortfolios
  } = useData();
  const { currentUser, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Unified Form States
  const [showForm, setShowForm] = useState(false);
  const [itemType, setItemType] = useState('project');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');
  const [attachment, setAttachment] = useState(null);

  // Profile Edit States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.displayName || '');
  const [profileCity, setProfileCity] = useState(currentUser?.city || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');
  const [profileSkills, setProfileSkills] = useState(currentUser?.skills || '');

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateProfile({ profileImage: imageUrl });
    }
  };

  const handleSaveProfile = () => {
    updateProfile({
      displayName: profileName,
      city: profileCity,
      phone: profilePhone,
      bio: profileBio,
      skills: profileSkills
    });
    setIsEditingProfile(false);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const newTags = tags.split(',').map(t => t.trim()).filter(t => t !== '');
    const newItem = {
      description: desc,
      tags: newTags,
      attachment: attachment ? attachment.name : null,
      type: itemType
    };

    if (itemType === 'project') {
      addProject({ title, ...newItem });
    } else if (itemType === 'experience') {
      addExperience({ role: title, ...newItem });
    } else {
      addOther({ title, ...newItem });
    }

    setTitle('');
    setDesc('');
    setTags('');
    setAttachment(null);
    setShowForm(false);
  };

  const getItems = () => {
    const allProjects = projects.map(p => ({ ...p, _type: 'project' }));
    const allExperiences = experiences.map(e => ({ ...e, _type: 'experience', title: e.role }));
    const allOthers = others.map(o => ({ ...o, _type: 'other' }));

    if (activeTab === 'all') return [...allProjects, ...allExperiences, ...allOthers];
    if (activeTab === 'projects') return allProjects;
    if (activeTab === 'experiences') return allExperiences;
    if (activeTab === 'others') return allOthers;
    return [];
  };

  const handleDelete = (id, type) => {
    if (type === 'project') deleteProject(id);
    else if (type === 'experience') deleteExperience(id);
    else deleteOther(id);
  };

  return (
    <AnimatedLayout>
      <div className="min-h-screen flex flex-col w-full relative">

        {/* Top Navigation Bar */}
        <header className="glass sticky top-0 z-40 w-full px-6 py-4 flex justify-between items-center border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-dark)]/80 backdrop-blur-md">
          <h1 className="text-2xl font-bold tracking-tight">Task Dashboard</h1>

          <div className="flex items-center gap-4">
            <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg">
              <Plus size={16} /> <span className="hidden sm:inline">Add Item</span>
            </Button>

            <Button onClick={() => navigate('/generate')} className="hidden sm:flex bg-gradient-to-r from-[var(--color-primary)] to-indigo-600 border-none shadow-lg shadow-[var(--color-primary)]/20 px-5 py-2">
              ✨ Generate Portfolio
            </Button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-primary)] hover:scale-105 transition-transform"
            >
              {currentUser?.profileImage ? (
                <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center font-bold text-lg">
                  {currentUser?.displayName?.charAt(0) || 'U'}
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Profile Slide-out Drawer */}
        <AnimatePresence>
          {isProfileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsProfileOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--color-bg-dark)] border-l border-[var(--color-border-subtle)] shadow-2xl z-50 flex flex-col p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">Profile Settings</h2>
                  <button onClick={() => setIsProfileOpen(false)} className="text-[var(--color-text-muted)] hover:text-white p-2">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col items-center mb-8">
                  <div className="relative group cursor-pointer mb-4">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[var(--color-primary)]/20 bg-[var(--color-bg-dark)]">
                      {currentUser?.profileImage ? (
                        <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl text-[var(--color-primary)]">
                          {currentUser?.displayName?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white" size={24} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                    </label>
                  </div>

                  {!isEditingProfile && (
                    <div className="text-center w-full">
                      <h3 className="text-xl font-bold">{currentUser?.displayName || 'User'}</h3>
                      <p className="text-[var(--color-text-muted)] text-sm mb-1">{currentUser?.email}</p>
                      <p className="text-[var(--color-text-muted)] text-sm mb-4">{currentUser?.city} {currentUser?.phone && `• ${currentUser.phone}`}</p>

                      <button onClick={() => setIsEditingProfile(true)} className="text-sm text-[var(--color-primary)] hover:underline border border-[var(--color-primary)]/30 px-4 py-1.5 rounded-full">
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>

                {isEditingProfile ? (
                  <div className="flex flex-col space-y-4 flex-1">
                    <Input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Full Name" />
                    <Input value={profileCity} onChange={e => setProfileCity(e.target.value)} placeholder="City" />
                    <Input value={profilePhone} onChange={e => setProfilePhone(e.target.value)} placeholder="Phone Number" />
                    <textarea
                      value={profileBio}
                      onChange={e => setProfileBio(e.target.value)}
                      placeholder="About Me / Bio"
                      className="w-full bg-black/30 border border-[var(--color-border-subtle)] rounded-lg px-4 py-2 text-[var(--color-text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                      rows={4}
                    />
                    <Input value={profileSkills} onChange={e => setProfileSkills(e.target.value)} placeholder="Skills (comma separated)" />
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleSaveProfile} className="flex-1">Save</Button>
                      <Button variant="ghost" onClick={() => setIsEditingProfile(false)} className="flex-1">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 space-y-6">
                    {currentUser?.bio && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">About</h4>
                        <p className="text-sm text-[var(--color-text-main)] bg-white/5 p-4 rounded-xl leading-relaxed">{currentUser.bio}</p>
                      </div>
                    )}
                    
                    <div 
                      onClick={() => navigate('/portfolios')}
                      className="cursor-pointer bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/20 transition-colors p-4 rounded-xl flex justify-between items-center"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">Generated Portfolios</h4>
                        <p className="text-2xl font-bold text-white">{generatedPortfolios?.length || 0}</p>
                      </div>
                      <div className="text-[var(--color-primary)]">
                        &rarr;
                      </div>
                    </div>
                    {currentUser?.skills && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentUser.skills.split(',').map(s => s.trim()).filter(s => s).map((s, i) => (
                            <span key={i} className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-1 rounded-md">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-[var(--color-border-subtle)]">
                  <Button onClick={() => navigate('/generate')} className="w-full mb-3 sm:hidden bg-gradient-to-r from-[var(--color-primary)] to-indigo-600 border-none">
                    ✨ Generate Portfolio
                  </Button>
                  <Button variant="danger" onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors py-3">
                    <LogOut size={16} /> Logout Securely
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Dashboard Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">

          {/* Unified Add Form (Slides down when 'Add Item' is clicked) */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-8"
              >
                <Card hover={false} className="border border-[var(--color-primary)]/30 p-6 md:p-8">
                  <form onSubmit={handleAddItem} className="space-y-4 max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">Add New Task Item</h3>
                      <button type="button" onClick={() => setShowForm(false)} className="p-2 text-[var(--color-text-muted)] hover:text-white"><X size={20} /></button>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-[var(--color-text-muted)]">Category Type</label>
                      <select
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        className="bg-black/30 border border-[var(--color-border-subtle)] rounded-lg px-4 py-3 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        <option value="project">Project</option>
                        <option value="experience">Experience / Work</option>
                        <option value="other">Other Achievement</option>
                      </select>
                    </div>

                    <Input
                      label="Title / Role"
                      value={title} onChange={(e) => setTitle(e.target.value)} required
                    />

                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-[var(--color-text-muted)]">Description</label>
                      <textarea
                        className="bg-black/30 border border-[var(--color-border-subtle)] rounded-lg px-4 py-3 text-[var(--color-text-main)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        rows="3" value={desc} onChange={(e) => setDesc(e.target.value)} required
                      />
                    </div>

                    <Input
                      label="Tags (comma separated)"
                      placeholder="React, UI/UX, Leadership"
                      value={tags} onChange={(e) => setTags(e.target.value)} required
                    />

                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-[var(--color-text-muted)]">Attachment (Optional)</label>
                      <input
                        type="file"
                        onChange={(e) => setAttachment(e.target.files[0])}
                        className="text-sm text-[var(--color-text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)]/20 file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary)]/30 transition-colors"
                      />
                    </div>

                    <Button type="submit" className="w-full py-3 mt-4">Save Item to Board</Button>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Kanban / Task Manager Tabs */}
          <div className="flex space-x-2 mb-8 border-b border-[var(--color-border-subtle)] pb-4 overflow-x-auto hide-scrollbar">
            {['all', 'projects', 'experiences', 'others'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-lg capitalize font-medium transition-all whitespace-nowrap ${activeTab === tab
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                    : 'bg-transparent text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            <AnimatePresence>
              {getItems().map((item) => {
                const colors = typeColors[item._type] || typeColors.project;
                return (
                  <motion.div
                    key={`${item._type}-${item.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`h-full flex flex-col relative overflow-hidden group border-t-4 ${colors.border}`}>

                      {/* Color Coded Badge */}
                      <div className={`absolute top-4 right-4 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full ${colors.bg} ${colors.text}`}>
                        {item._type}
                      </div>

                      <div className="flex justify-between items-start mb-4 pr-16 mt-1">
                        <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                      </div>

                      <p className="text-[var(--color-text-muted)] mb-6 flex-1 text-sm line-clamp-4 leading-relaxed">{item.description}</p>

                      {item.attachment && (
                        <div className={`flex items-center gap-2 text-xs w-fit px-3 py-1.5 rounded-lg mb-4 ${colors.bg} ${colors.text}`}>
                          <Paperclip size={12} />
                          <span className="truncate max-w-[150px]">{item.attachment}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-[var(--color-border-subtle)]/50">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded bg-white/5 text-[var(--color-text-main)] border border-white/10">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Delete Overlay Button */}
                      <button
                        onClick={() => handleDelete(item.id, item._type)}
                        className="absolute bottom-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white translate-y-2 group-hover:translate-y-0 shadow-lg"
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {getItems().length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-[var(--color-border-subtle)] rounded-2xl bg-white/5">
                <div className="w-16 h-16 rounded-full bg-[var(--color-border-subtle)] flex items-center justify-center mb-4 text-[var(--color-text-muted)]">
                  <Menu size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">No items found</h3>
                <p className="text-[var(--color-text-muted)] mb-6">Your board is looking a little empty.</p>
                <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                  <Plus size={16} /> Add First Item
                </Button>
              </div>
            )}
          </div>

        </main>
      </div>
    </AnimatedLayout>
  );
};

export default Dashboard;
