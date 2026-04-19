import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Paperclip, LogOut, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedLayout from '../components/layout/AnimatedLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { 
    projects, addProject, deleteProject, 
    experiences, addExperience, deleteExperience,
    others, addOther, deleteOther 
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

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local object URL for the uploaded image preview
      const imageUrl = URL.createObjectURL(file);
      updateProfile({ profileImage: imageUrl });
    }
  };

  const handleSaveProfile = () => {
    updateProfile({ displayName: profileName, city: profileCity });
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
      <div className="max-w-6xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Profile Section */}
        <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
          <Card className="flex flex-col items-center text-center p-8 sticky top-24">
            <div className="relative mb-6 group cursor-pointer">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-primary)]/20 bg-[var(--color-bg-dark)]">
                {currentUser?.profileImage ? (
                  <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-[var(--color-primary)]">
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              {/* Image upload overlay */}
              <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={24} />
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
              </label>
            </div>

            {isEditingProfile ? (
              <div className="w-full space-y-4 mb-6">
                <Input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Name" />
                <Input value={profileCity} onChange={e => setProfileCity(e.target.value)} placeholder="City" />
                <Button onClick={handleSaveProfile} className="w-full">Save Profile</Button>
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">{currentUser?.displayName || 'User'}</h2>
                <p className="text-[var(--color-text-muted)]">{currentUser?.city || 'City not set'}</p>
                <button onClick={() => setIsEditingProfile(true)} className="text-sm text-[var(--color-primary)] mt-2 hover:underline">
                  Edit Profile
                </button>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-[var(--color-border-subtle)] w-full">
              <Button variant="danger" onClick={handleLogout} className="w-full flex items-center justify-center gap-2">
                <LogOut size={16} /> Logout
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Content: Dashboard Items */}
        <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
              <Plus size={18} /> {showForm ? 'Cancel' : 'Add New'}
            </Button>
          </div>

          {/* Unified Add Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-8"
              >
                <Card hover={false} className="border border-[var(--color-primary)]/30 p-6">
                  <form onSubmit={handleAddItem} className="space-y-4">
                    <h3 className="text-xl font-bold mb-4">Add New Item</h3>
                    
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-[var(--color-text-muted)]">Category Type</label>
                      <select 
                        value={itemType} 
                        onChange={(e) => setItemType(e.target.value)}
                        className="bg-black/30 border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        <option value="project">Project</option>
                        <option value="experience">Experience / Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <Input 
                      label="Title / Role"
                      value={title} onChange={(e) => setTitle(e.target.value)} required 
                    />
                    
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-[var(--color-text-muted)]">Description</label>
                      <textarea 
                        className="bg-black/30 border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-[var(--color-text-main)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
                    
                    <Button type="submit" className="w-full">Save Item</Button>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-[var(--color-border-subtle)] pb-2 overflow-x-auto hide-scrollbar">
            {['all', 'projects', 'experiences', 'others'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 capitalize font-medium transition-colors whitespace-nowrap ${activeTab === tab ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {getItems().map((item) => (
                <motion.div
                  key={`${item._type}-${item.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs rounded-bl-lg capitalize font-medium">
                      {item._type}
                    </div>
                    
                    <div className="flex justify-between items-start mb-4 mt-2">
                      <h3 className="text-xl font-bold pr-16">{item.title}</h3>
                      <button 
                        onClick={() => handleDelete(item.id, item._type)} 
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors absolute right-4 top-10 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-[var(--color-text-muted)] mb-4 flex-1">{item.description}</p>
                    
                    {item.attachment && (
                      <div className="flex items-center gap-2 text-sm text-[var(--color-primary)] bg-[var(--color-primary)]/10 w-fit px-3 py-1.5 rounded-lg mb-4">
                        <Paperclip size={14} />
                        <span className="truncate max-w-[200px]">{item.attachment}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded-md bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {getItems().length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-[var(--color-border-subtle)] rounded-xl">
                <p className="text-xl text-[var(--color-text-muted)] mb-2">No {activeTab === 'all' ? 'items' : activeTab} found.</p>
                <p className="text-sm text-[var(--color-text-muted)]/70">Click 'Add New' to create one.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Dashboard;
