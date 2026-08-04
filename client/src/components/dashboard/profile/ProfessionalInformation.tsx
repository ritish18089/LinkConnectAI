import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Save, X, Plus, Trash2, Briefcase, Target, Award, Calendar, Heart } from 'lucide-react';
import { supabase } from '../../../db/supabase';

interface ProfessionalInformationProps {
  profile: any;
  setProfile: (profile: any) => void;
  userId: string;
}

export default function ProfessionalInformation({ profile, setProfile, userId }: ProfessionalInformationProps) {
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [isEditingCertifications, setIsEditingCertifications] = useState(false);
  const [isEditingParticipation, setIsEditingParticipation] = useState(false);
  const [isEditingHobbies, setIsEditingHobbies] = useState(false);

  const [experienceForm, setExperienceForm] = useState<any[]>(profile.experience || []);
  const [interestsForm, setInterestsForm] = useState<string[]>(profile.career_interests || []);
  const [certificationsForm, setCertificationsForm] = useState<any[]>(profile.certifications || []);
  const [participationForm, setParticipationForm] = useState<any[]>(profile.participation || []);
  const [hobbiesForm, setHobbiesForm] = useState<string[]>(profile.hobbies || []);

  const [newInterest, setNewInterest] = useState('');
  const [newHobby, setNewHobby] = useState('');

  const [saving, setSaving] = useState(false);

  // Sync state if profile changes from parent
  React.useEffect(() => {
    setExperienceForm(profile.experience || []);
    setInterestsForm(profile.career_interests || []);
    setCertificationsForm(profile.certifications || []);
    setParticipationForm(profile.participation || []);
    setHobbiesForm(profile.hobbies || []);
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

  const handleAddItem = (form: any[], setForm: any, defaultObject: any) => {
    setForm([...form, defaultObject]);
  };

  const handleUpdateItem = (form: any[], setForm: any, index: number, field: string, value: string) => {
    const updated = [...form];
    updated[index] = { ...updated[index], [field]: value };
    setForm(updated);
  };

  const handleRemoveItem = (form: any[], setForm: any, index: number) => {
    const updated = form.filter((_, i) => i !== index);
    setForm(updated);
  };

  const handleAddStringItem = (newStr: string, setNewStr: any, form: string[], setForm: any) => {
    if (newStr.trim() && !form.includes(newStr.trim())) {
      setForm([...form, newStr.trim()]);
      setNewStr('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-8"
    >
      <h3 className="text-xl font-bold text-white mb-2 border-b border-neutral-800 pb-4">Professional Information</h3>

      {/* EXPERIENCE */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" /> Experience
          </h4>
          {isEditingExperience ? (
            <div className="flex items-center gap-2">
              <button onClick={() => { setIsEditingExperience(false); setExperienceForm(profile.experience || []); }} className="p-1.5 text-neutral-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <button onClick={() => handleSave('experience', experienceForm, setIsEditingExperience)} disabled={saving} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditingExperience(true)} className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditingExperience ? (
          <div className="space-y-4">
            {experienceForm.map((exp, idx) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3 relative group">
                <button 
                  onClick={() => handleRemoveItem(experienceForm, setExperienceForm, idx)}
                  className="absolute top-3 right-3 p-1.5 text-neutral-500 hover:text-red-400 bg-neutral-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <input 
                  type="text" 
                  value={exp.company || ''}
                  onChange={(e) => handleUpdateItem(experienceForm, setExperienceForm, idx, 'company', e.target.value)}
                  placeholder="Company Name"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 pr-10"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    value={exp.role || ''}
                    onChange={(e) => handleUpdateItem(experienceForm, setExperienceForm, idx, 'role', e.target.value)}
                    placeholder="Role"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input 
                    type="text" 
                    value={exp.type || ''}
                    onChange={(e) => handleUpdateItem(experienceForm, setExperienceForm, idx, 'type', e.target.value)}
                    placeholder="Employment Type (e.g. Full-time)"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <input 
                  type="text" 
                  value={exp.duration || ''}
                  onChange={(e) => handleUpdateItem(experienceForm, setExperienceForm, idx, 'duration', e.target.value)}
                  placeholder="Duration (e.g. Jan 2022 - Present)"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <textarea 
                  value={exp.description || ''}
                  onChange={(e) => handleUpdateItem(experienceForm, setExperienceForm, idx, 'description', e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 custom-scrollbar"
                />
                <input 
                  type="text" 
                  value={exp.technologies || ''}
                  onChange={(e) => handleUpdateItem(experienceForm, setExperienceForm, idx, 'technologies', e.target.value)}
                  placeholder="Technologies Used (comma separated)"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
            <button 
              onClick={() => handleAddItem(experienceForm, setExperienceForm, { company: '', role: '', type: '', duration: '', description: '', technologies: '' })}
              className="w-full py-3 border border-dashed border-neutral-700 hover:border-indigo-500 text-neutral-400 hover:text-indigo-400 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {(profile.experience || []).length > 0 ? (
              (profile.experience || []).map((exp: any, idx: number) => (
                <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
                  <h5 className="font-bold text-white text-sm">{exp.role} <span className="text-neutral-400 font-normal">at {exp.company}</span></h5>
                  <p className="text-neutral-500 text-xs mb-2">{exp.type} • {exp.duration}</p>
                  <p className="text-neutral-400 text-xs mb-3">{exp.description}</p>
                  
                  {exp.technologies && (
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.split(',').map((tech: string, i: number) => (
                        <span key={i} className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-sm">No experience added yet.</p>
            )}
          </div>
        )}
      </div>

      {/* CAREER INTERESTS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" /> Career Interests
          </h4>
          {isEditingInterests ? (
            <div className="flex items-center gap-2">
              <button onClick={() => { setIsEditingInterests(false); setInterestsForm(profile.career_interests || []); }} className="p-1.5 text-neutral-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <button onClick={() => handleSave('career_interests', interestsForm, setIsEditingInterests)} disabled={saving} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditingInterests(true)} className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditingInterests ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddStringItem(newInterest, setNewInterest, interestsForm, setInterestsForm)}
                placeholder="e.g. Full Stack Developer"
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button onClick={() => handleAddStringItem(newInterest, setNewInterest, interestsForm, setInterestsForm)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interestsForm.map((interest, idx) => (
                <div key={idx} className="bg-neutral-800 text-neutral-200 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-neutral-700">
                  {interest}
                  <button onClick={() => setInterestsForm(interestsForm.filter((_, i) => i !== idx))} className="text-neutral-500 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(profile.career_interests || []).length > 0 ? (
              (profile.career_interests || []).map((interest: string, idx: number) => (
                <span key={idx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-3 py-1.5 rounded-full">
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-neutral-500 text-sm">No career interests added yet.</p>
            )}
          </div>
        )}
      </div>

      {/* CERTIFICATIONS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" /> Certifications
          </h4>
          {isEditingCertifications ? (
            <div className="flex items-center gap-2">
              <button onClick={() => { setIsEditingCertifications(false); setCertificationsForm(profile.certifications || []); }} className="p-1.5 text-neutral-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <button onClick={() => handleSave('certifications', certificationsForm, setIsEditingCertifications)} disabled={saving} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditingCertifications(true)} className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditingCertifications ? (
          <div className="space-y-4">
            {certificationsForm.map((cert, idx) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3 relative group">
                <button 
                  onClick={() => handleRemoveItem(certificationsForm, setCertificationsForm, idx)}
                  className="absolute top-3 right-3 p-1.5 text-neutral-500 hover:text-red-400 bg-neutral-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <input 
                  type="text" 
                  value={cert.name || ''}
                  onChange={(e) => handleUpdateItem(certificationsForm, setCertificationsForm, idx, 'name', e.target.value)}
                  placeholder="Certificate Name"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 pr-10"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    value={cert.organization || ''}
                    onChange={(e) => handleUpdateItem(certificationsForm, setCertificationsForm, idx, 'organization', e.target.value)}
                    placeholder="Organization"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input 
                    type="text" 
                    value={cert.date || ''}
                    onChange={(e) => handleUpdateItem(certificationsForm, setCertificationsForm, idx, 'date', e.target.value)}
                    placeholder="Issue Date"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    value={cert.credential_id || ''}
                    onChange={(e) => handleUpdateItem(certificationsForm, setCertificationsForm, idx, 'credential_id', e.target.value)}
                    placeholder="Credential ID (optional)"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input 
                    type="text" 
                    value={cert.url || ''}
                    onChange={(e) => handleUpdateItem(certificationsForm, setCertificationsForm, idx, 'url', e.target.value)}
                    placeholder="Certificate URL (optional)"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={() => handleAddItem(certificationsForm, setCertificationsForm, { name: '', organization: '', date: '', credential_id: '', url: '' })}
              className="w-full py-3 border border-dashed border-neutral-700 hover:border-indigo-500 text-neutral-400 hover:text-indigo-400 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Certification
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {(profile.certifications || []).length > 0 ? (
              (profile.certifications || []).map((cert: any, idx: number) => (
                <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
                  <h5 className="font-bold text-white text-sm mb-1">{cert.name}</h5>
                  <p className="text-neutral-400 text-xs mb-2">{cert.organization} • {cert.date}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                    {cert.credential_id && (
                      <span className="text-neutral-500">Credential ID: {cert.credential_id}</span>
                    )}
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        View Certificate
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-sm">No certifications added yet.</p>
            )}
          </div>
        )}
      </div>

      {/* PARTICIPATION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" /> Participation
          </h4>
          {isEditingParticipation ? (
            <div className="flex items-center gap-2">
              <button onClick={() => { setIsEditingParticipation(false); setParticipationForm(profile.participation || []); }} className="p-1.5 text-neutral-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <button onClick={() => handleSave('participation', participationForm, setIsEditingParticipation)} disabled={saving} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditingParticipation(true)} className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditingParticipation ? (
          <div className="space-y-4">
            {participationForm.map((part, idx) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3 relative group">
                <button 
                  onClick={() => handleRemoveItem(participationForm, setParticipationForm, idx)}
                  className="absolute top-3 right-3 p-1.5 text-neutral-500 hover:text-red-400 bg-neutral-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <input 
                  type="text" 
                  value={part.name || ''}
                  onChange={(e) => handleUpdateItem(participationForm, setParticipationForm, idx, 'name', e.target.value)}
                  placeholder="Event Name (e.g. Hackathon XYZ)"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 pr-10"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    value={part.organizer || ''}
                    onChange={(e) => handleUpdateItem(participationForm, setParticipationForm, idx, 'organizer', e.target.value)}
                    placeholder="Organizer"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input 
                    type="text" 
                    value={part.date || ''}
                    onChange={(e) => handleUpdateItem(participationForm, setParticipationForm, idx, 'date', e.target.value)}
                    placeholder="Date"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <textarea 
                  value={part.description || ''}
                  onChange={(e) => handleUpdateItem(participationForm, setParticipationForm, idx, 'description', e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 custom-scrollbar"
                />
              </div>
            ))}
            <button 
              onClick={() => handleAddItem(participationForm, setParticipationForm, { name: '', organizer: '', date: '', description: '' })}
              className="w-full py-3 border border-dashed border-neutral-700 hover:border-indigo-500 text-neutral-400 hover:text-indigo-400 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Participation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {(profile.participation || []).length > 0 ? (
              (profile.participation || []).map((part: any, idx: number) => (
                <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
                  <h5 className="font-bold text-white text-sm mb-1">{part.name}</h5>
                  <p className="text-neutral-400 text-xs mb-2">{part.organizer} • {part.date}</p>
                  <p className="text-neutral-400 text-xs">{part.description}</p>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-sm">No participation added yet.</p>
            )}
          </div>
        )}
      </div>

      {/* HOBBIES & INTERESTS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-indigo-400" /> Hobbies & Interests
          </h4>
          {isEditingHobbies ? (
            <div className="flex items-center gap-2">
              <button onClick={() => { setIsEditingHobbies(false); setHobbiesForm(profile.hobbies || []); }} className="p-1.5 text-neutral-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <button onClick={() => handleSave('hobbies', hobbiesForm, setIsEditingHobbies)} disabled={saving} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditingHobbies(true)} className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditingHobbies ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddStringItem(newHobby, setNewHobby, hobbiesForm, setHobbiesForm)}
                placeholder="e.g. Coding"
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button onClick={() => handleAddStringItem(newHobby, setNewHobby, hobbiesForm, setHobbiesForm)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {hobbiesForm.map((hobby, idx) => (
                <div key={idx} className="bg-neutral-800 text-neutral-200 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-neutral-700">
                  {hobby}
                  <button onClick={() => setHobbiesForm(hobbiesForm.filter((_, i) => i !== idx))} className="text-neutral-500 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(profile.hobbies || []).length > 0 ? (
              (profile.hobbies || []).map((hobby: string, idx: number) => (
                <span key={idx} className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs px-3 py-1.5 rounded-full">
                  {hobby}
                </span>
              ))
            ) : (
              <p className="text-neutral-500 text-sm">No hobbies added yet.</p>
            )}
          </div>
        )}
      </div>

    </motion.div>
  );
}
