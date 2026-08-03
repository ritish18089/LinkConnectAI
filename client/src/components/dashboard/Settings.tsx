import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Key, LogOut, CheckCircle2, XCircle, Loader2, Camera, Eye, EyeOff, Smartphone, Globe } from 'lucide-react';
import { supabase } from '../../db/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { user, profileUser, linkedinProfile, initialize, logout } = useAuthStore();
  const navigate = useNavigate();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    headline: '',
    company: '',
    job_title: '',
    industry: '',
    location: '',
    linkedin_url: '',
    bio: '',
    website: '',
    phone: '',
    city: '',
    country: '',
    experience_level: '',
    skills: '',
    app_language: 'en'
  });

  const [savingProfile, setSavingProfile] = useState(false);
  
  // Custom Avatar Upload State
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Security Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Toasts
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (profileUser) {
      setProfileForm({
        full_name: profileUser.full_name || '',
        headline: profileUser.headline || '',
        company: profileUser.company || '',
        job_title: profileUser.job_title || '',
        industry: profileUser.industry || '',
        location: profileUser.location || '',
        linkedin_url: profileUser.linkedin_url || '',
        bio: profileUser.bio || '',
        website: profileUser.website || '',
        phone: profileUser.phone || '',
        city: profileUser.city || '',
        country: profileUser.country || '',
        experience_level: profileUser.experience_level || '',
        skills: profileUser.skills ? profileUser.skills.join(', ') : '',
        app_language: profileUser.app_language || 'en'
      });
    }
  }, [profileUser]);

  const { t, i18n } = useTranslation();

  const SUPPORTED_LANGUAGES = [
    { code: 'en', label: '🇺🇸 English' },
    { code: 'hi', label: '🇮🇳 Hindi (हिन्दी)' },
    { code: 'kn', label: '🇮🇳 Kannada (ಕನ್ನಡ)' },
    { code: 'te', label: '🇮🇳 Telugu (తెలుగు)' },
    { code: 'ta', label: '🇮🇳 Tamil (தமிழ்)' },
    { code: 'ml', label: '🇮🇳 Malayalam (മലയാളം)' },
    { code: 'mr', label: '🇮🇳 Marathi (मराठी)' },
    { code: 'bn', label: '🇮🇳 Bengali (বাংলা)' },
    { code: 'gu', label: '🇮🇳 Gujarati (ગુજરાતી)' },
    { code: 'pa', label: '🇮🇳 Punjabi (ਪੰਜਾਬੀ)' }
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
    
    // Instantly update i18n when language is selected
    if (name === 'app_language') {
      i18n.changeLanguage(value);
      localStorage.setItem('i18nextLng', value);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);

    try {
      const skillsArray = profileForm.skills
        ? profileForm.skills.split(',').map(s => s.trim()).filter(s => s)
        : null;

      await useAuthStore.getState().updateProfileData({
        full_name: profileForm.full_name,
        headline: profileForm.headline,
        company: profileForm.company,
        job_title: profileForm.job_title,
        industry: profileForm.industry,
        location: profileForm.location,
        linkedin_url: profileForm.linkedin_url,
        bio: profileForm.bio,
        website: profileForm.website,
        phone: profileForm.phone,
        city: profileForm.city,
        country: profileForm.country,
        experience_level: profileForm.experience_level,
        skills: skillsArray
      });

      await supabase.auth.updateUser({
        data: { full_name: profileForm.full_name }
      });

      showToast('success', 'Profile updated successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'File size exceeds 5MB limit');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('error', 'Unsupported file format. Please use JPG, PNG, or WEBP.');
      return;
    }

    setUploadingAvatar(true);
    try {
      const currentUrl = useAuthStore.getState().profileUser?.profile_image_url;
      if (currentUrl) {
        const oldPath = currentUrl.split('/profile-images/').pop();
        if (oldPath) {
          await supabase.storage.from('profile-images').remove([oldPath]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}_${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
      
      await useAuthStore.getState().updateProfileImage(data.publicUrl);
      showToast('success', 'Profile picture updated successfully.');
    } catch (error: any) {
      showToast('error', error.message || 'Failed to upload profile picture.');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    setUploadingAvatar(true);
    try {
      const currentUrl = useAuthStore.getState().profileUser?.profile_image_url;
      if (currentUrl) {
        const oldPath = currentUrl.split('/profile-images/').pop();
        if (oldPath) {
          await supabase.storage.from('profile-images').remove([oldPath]);
        }
      }
      await useAuthStore.getState().removeProfileImage();
      showToast('success', 'Profile picture removed.');
    } catch (error: any) {
      showToast('error', error.message || 'Failed to remove profile picture.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('error', 'New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;
      showToast('success', 'Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err: any) {
      showToast('error', 'Failed to sign out');
    }
  };

  // Determine provider
  const isLinkedInOIDC = user?.app_metadata?.provider === 'linkedin_oidc';
  const lastLogin = linkedinProfile?.last_login_at 
    ? new Date(linkedinProfile.last_login_at).toLocaleString()
    : 'Unknown';

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              toastMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-medium">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.settings', 'Settings')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-8 space-y-6"
        >
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
            
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{t('settings.profile_settings', 'Profile Settings')}</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                
                {/* Avatar Upload */}
                <div className="flex items-center gap-6 pb-6 border-b border-neutral-800/50">
                  <div 
                    className="relative group cursor-pointer"
                    onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                  >
                    {profileUser?.profile_image_url ? (
                      <img src={profileUser.profile_image_url} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-neutral-800 group-hover:ring-indigo-500 transition-all" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-neutral-800 flex items-center justify-center text-3xl font-bold text-neutral-500 ring-2 ring-neutral-800 group-hover:ring-indigo-500 transition-all">
                        {profileForm.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                    
                    <div className={`absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center transition-opacity ${uploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {uploadingAvatar ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-neutral-300 mb-1">Profile Picture</h3>
                    <p className="text-xs text-neutral-500 mb-3">JPG, PNG, WEBP up to 5MB.</p>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        disabled={uploadingAvatar}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        Change Photo
                      </button>
                      {profileUser?.profile_image_url && (
                        <button 
                          type="button"
                          disabled={uploadingAvatar}
                          onClick={handleRemoveAvatar}
                          className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/jpeg,image/jpg,image/png,image/webp" 
                      onChange={handleAvatarUpload}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={profileForm.full_name}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-neutral-950/50 border border-neutral-800/50 rounded-xl px-4 py-2.5 text-neutral-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Professional Headline</label>
                  <input
                    type="text"
                    name="headline"
                    value={profileForm.headline}
                    onChange={handleProfileChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                    placeholder="e.g. Senior Software Engineer at Tech Corp"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Current Company</label>
                    <input
                      type="text"
                      name="company"
                      value={profileForm.company}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Job Title / Designation</label>
                    <input
                      type="text"
                      name="job_title"
                      value={profileForm.job_title}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={profileForm.industry}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={profileForm.location}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={profileForm.linkedin_url}
                    onChange={handleProfileChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow resize-none"
                    placeholder="Tell us a little about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={profileForm.website}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={profileForm.city}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={profileForm.country}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Experience Level</label>
                    <input
                      type="text"
                      name="experience_level"
                      value={profileForm.experience_level}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                      placeholder="e.g. Senior, Mid-level, Entry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={profileForm.skills}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                      placeholder="React, TypeScript, Node.js"
                    />
                  </div>
                </div>

                {/* App Language Setting */}
                <div className="pt-6 border-t border-neutral-800/50">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" /> {t('settings.app_language', 'App Language')}
                  </h3>
                  <div className="max-w-md">
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      {t('settings.select_language', 'Select your preferred language')}
                    </label>
                    <select
                      name="app_language"
                      value={profileForm.app_language}
                      onChange={handleProfileChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                    >
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800/50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => initialize()}
                    className="px-5 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl overflow-hidden relative">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-rose-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{t('settings.security_settings', 'Security Settings')}</h2>
              </div>

              {!isLinkedInOIDC && (
                <div className="mb-8 pb-8 border-b border-neutral-800/50">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-neutral-400" /> Change Password
                  </h3>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={6}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300">
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Confirm New Password</label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}

              {/* 2FA */}
              <div className="mb-8 pb-8 border-b border-neutral-800/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-neutral-400" /> Two-Factor Auth
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400">Coming Soon</span>
                </div>
                <p className="text-sm text-neutral-500 mb-4">Add an extra layer of security to your account.</p>
                <div className="w-12 h-6 bg-neutral-800 rounded-full relative opacity-50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-neutral-600 rounded-full absolute left-1 top-1" />
                </div>
              </div>

              {/* Active Session */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-white mb-4">Active Session</h3>
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-neutral-400">Provider</span>
                    <span className="text-sm font-medium text-white bg-neutral-800 px-2 py-1 rounded-md">
                      {isLinkedInOIDC ? 'LinkedIn' : 'Email & Password'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Last Login</span>
                    <span className="text-sm text-neutral-300">{lastLogin}</span>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>

            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
