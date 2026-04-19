import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, Paperclip } from 'lucide-react';
import AnimatedLayout from '../components/layout/AnimatedLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const { projects, addProject, deleteProject, experiences, addExperience, deleteExperience } = useData();

  // Simple form states for demo
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');
  const [attachment, setAttachment] = useState(null);

  const handleAddItem = (e) => {
    e.preventDefault();
    const newTags = tags.split(',').map(t => t.trim()).filter(t => t !== '');
    const newItem = {
      description: desc,
      tags: newTags,
      attachment: attachment ? attachment.name : null
    };
    
    if (activeTab === 'projects') {
      addProject({ title, ...newItem });
    } else {
      addExperience({ role: title, ...newItem });
    }
    setTitle('');
    setDesc('');
    setTags('');
    setAttachment(null);
    setShowForm(false);
  };

  const getItems = () => activeTab === 'projects' ? projects : experiences;
  
  const handleDelete = (id) => {
    if (activeTab === 'projects') deleteProject(id);
    else deleteExperience(id);
  };

  return (
    <AnimatedLayout>
      <div className="max-w-6xl mx-auto w-full px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
            <Plus size={18} /> {showForm ? 'Cancel' : 'Add Item'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-[var(--color-border-subtle)] pb-2">
          {['projects', 'experiences'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize font-medium transition-colors ${activeTab === tab ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <Card hover={false} className="border border-[var(--color-primary)]/30">
                <form onSubmit={handleAddItem} className="space-y-4">
                  <h3 className="text-xl font-bold mb-4">Add New {activeTab === 'projects' ? 'Project' : 'Experience'}</h3>
                  <Input 
                    label={activeTab === 'projects' ? "Project Title" : "Role / Title"}
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
                    placeholder="React, UI/UX, Firebase"
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
                  <Button type="submit">Save</Button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {getItems().map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{item.title || item.role}</h3>
                    <div className="flex space-x-2">
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
            <div className="col-span-full py-12 text-center text-[var(--color-text-muted)]">
              No items found. Click 'Add Item' to create one.
            </div>
          )}
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Dashboard;
