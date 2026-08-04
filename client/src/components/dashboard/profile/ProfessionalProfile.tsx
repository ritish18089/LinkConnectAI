import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Save, X, Plus, Trash2, Code, Languages, FolderGit2 } from 'lucide-react';
import { supabase } from '../../../db/supabase';

interface ProfessionalProfileProps {
  profile: any;
  setProfile: (profile: any) => void;
  userId: string;
}

export default function ProfessionalProfile({ profile, setProfile, userId }: ProfessionalProfileProps) {
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingLanguages, setIsEditingLanguages] = useState(false);
  const [isEditingProjects, setIsEditingProjects] = useState(false);

  const [skillsForm, setSkillsForm] = useState<string[]>(profile.technical_skills || []);
  const [languagesForm, setLanguagesForm] = useState<string[]>(profile.languages_known || []);
  const [projectsForm, setProjectsForm] = useState<any[]>(profile.projects || []);

  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const [saving, setSaving] = useState(false);

  // Sync state if profile changes from parent
  React.useEffect(() => {
    setSkillsForm(profile.technical_skills || []);
    setLanguagesForm(profile.languages_known || []);
    setProjectsForm(profile.projects || []);
  }, [profile]);

  const handleSave = async (field: string, value: any, setEditState: (val: boolean) => void) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profile_users')
        .update({ [field]: value })
        .eq('user_id', userId);

      if (!error) {
        setProfile({ ...profile, [field]: value });
        setEditState(false);
      } else {
        console.error("Failed to save", error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsForm.includes(newSkill.trim())) {
      setSkillsForm([...skillsForm, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !languagesForm.includes(newLanguage.trim())) {
      setLanguagesForm([...languagesForm, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleAddProject = () => {
    setProjectsForm([...projectsForm, {
      name: '',
      description: '',
      technologies: '',
      github_url: '',
      live_url: ''
    }]);
  };

  const handleUpdateProject = (index: number, field: string, value: string) => {
    const updated = [...projectsForm];
    updated[index] = { ...updated[index], [field]: value };
    setProjectsForm(updated);
  };

  const handleRemoveProject = (index: number) => {
    const updated = projectsForm.filter((_, i) => i !== index);
    setProjectsForm(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-8"
    >
      <h3 className="text-lg font-bold text-white mb-2 border-b border-neutral-800 pb-4">Professional Profile</h3>

      {/* TECHNICAL SKILLS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" /> Technical Skills
          </h4>
          {isEditingSkills ? (
            <div className="flex items-center gap-2">
              <button onClick={() => { setIsEditingSkills(false); setSkillsForm(profile.technical_skills || []); }} className="p-1.5 text-neutral-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <button onClick={() => handleSave('technical_skills', skillsForm, setIsEditingSkills)} disabled={saving} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditingSkills(true)} className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditingSkills ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="e.g. React.js"
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button onClick={handleAddSkill} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsForm.map((skill, idx) => (
                <div key={idx} className="bg-neutral-800 text-neutral-200 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-neutral-700">
                  {skill}
                  <button onClick={() => setSkillsForm(skillsForm.filter((_, i) => i !== idx))} className="text-neutral-500 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(profile.technical_skills || []).length > 0 ? (
              (profile.technical_skills || []).map((skill: string, idx: number) => (
                <span key={idx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-3 py-1.5 rounded-full">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-neutral-500 text-sm">No skills added yet.</p>
            )}
          </div>
        )}
      </div>

      {/* LANGUAGES KNOWN */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-400" /> Languages Known
          </h4>
          {isEditingLanguages ? (
            <div className="flex items-center gap-2">
              <button onClick={() => { setIsEditingLanguages(false); setLanguagesForm(profile.languages_known || []); }} className="p-1.5 text-neutral-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <button onClick={() => handleSave('languages_known', languagesForm, setIsEditingLanguages)} disabled={saving} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditingLanguages(true)} className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditingLanguages ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddLanguage()}
                placeholder="e.g. English"
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button onClick={handleAddLanguage} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {languagesForm.map((lang, idx) => (
                <div key={idx} className="bg-neutral-800 text-neutral-200 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-neutral-700">
                  {lang}
                  <button onClick={() => setLanguagesForm(languagesForm.filter((_, i) => i !== idx))} className="text-neutral-500 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(profile.languages_known || []).length > 0 ? (
              (profile.languages_known || []).map((lang: string, idx: number) => (
                <span key={idx} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs px-3 py-1.5 rounded-full">
                  {lang}
                </span>
              ))
            ) : (
              <p className="text-neutral-500 text-sm">No languages added yet.</p>
            )}
          </div>
        )}
      </div>

      {/* PROJECTS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-400" /> Projects
          </h4>
          {isEditingProjects ? (
            <div className="flex items-center gap-2">
              <button onClick={() => { setIsEditingProjects(false); setProjectsForm(profile.projects || []); }} className="p-1.5 text-neutral-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <button onClick={() => handleSave('projects', projectsForm, setIsEditingProjects)} disabled={saving} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditingProjects(true)} className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditingProjects ? (
          <div className="space-y-4">
            {projectsForm.map((project, idx) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3 relative group">
                <button
                  onClick={() => handleRemoveProject(idx)}
                  className="absolute top-3 right-3 p-1.5 text-neutral-500 hover:text-red-400 bg-neutral-900 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={project.name || ''}
                  onChange={(e) => handleUpdateProject(idx, 'name', e.target.value)}
                  placeholder="Project Name"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 pr-10"
                />
                <textarea
                  value={project.description || ''}
                  onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                  placeholder="Short Description"
                  rows={2}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 custom-scrollbar"
                />
                <input
                  type="text"
                  value={project.technologies || ''}
                  onChange={(e) => handleUpdateProject(idx, 'technologies', e.target.value)}
                  placeholder="Technologies Used (comma separated)"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={project.github_url || ''}
                    onChange={(e) => handleUpdateProject(idx, 'github_url', e.target.value)}
                    placeholder="GitHub URL"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={project.live_url || ''}
                    onChange={(e) => handleUpdateProject(idx, 'live_url', e.target.value)}
                    placeholder="Live Demo URL (optional)"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={handleAddProject}
              className="w-full py-3 border border-dashed border-neutral-700 hover:border-indigo-500 text-neutral-400 hover:text-indigo-400 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {(profile.projects || []).length > 0 ? (
              (profile.projects || []).map((project: any, idx: number) => (
                <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
                  <h5 className="font-bold text-white text-sm mb-1">{project.name}</h5>
                  <p className="text-neutral-400 text-xs mb-3">{project.description}</p>

                  {project.technologies && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.technologies.split(',').map((tech: string, i: number) => (
                        <span key={i} className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        GitHub
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-sm">No projects added yet.</p>
            )}
          </div>
        )}
      </div>

    </motion.div>
  );
}
