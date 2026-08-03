import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, X, CheckCircle2, XCircle, Settings2, Loader2, Calendar, RefreshCcw } from 'lucide-react';
import { useGoalStore, UserGoal } from '../../store/useGoalStore';
import { useAuthStore } from '../../store/useAuthStore';

interface NetworkingGoalsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NetworkingGoalsSettingsModal({ isOpen, onClose }: NetworkingGoalsSettingsModalProps) {
  const { goal, updateGoal } = useGoalStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    weekly_connection_goal: 10,
    target_templates: 5,
    reset_frequency: 'weekly'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (goal) {
      setFormData({
        weekly_connection_goal: goal.weekly_connection_goal || 10,
        target_templates: goal.target_templates || 5,
        reset_frequency: goal.reset_frequency || 'weekly'
      });
    }
  }, [goal]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    // Validation
    if (formData.weekly_connection_goal < 1 || formData.weekly_connection_goal > 500) {
      showToast('error', 'Weekly Connection Goal must be between 1 and 500.');
      return;
    }
    if (formData.target_templates < 1 || formData.target_templates > 100) {
      showToast('error', 'Weekly Template Goal must be between 1 and 100.');
      return;
    }

    setIsSaving(true);
    try {
      await updateGoal(user.id, {
        weekly_connection_goal: formData.weekly_connection_goal,
        target_templates: formData.target_templates,
        reset_frequency: formData.reset_frequency
      });
      showToast('success', 'Goals updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      showToast('error', 'Failed to save goals.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
        
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-rose-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Networking Goals Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Weekly Connection Goal</label>
              <div className="relative">
                <input
                  type="number"
                  name="weekly_connection_goal"
                  min="1"
                  max="500"
                  value={formData.weekly_connection_goal}
                  onChange={handleChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-rose-500 transition-shadow"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">connections</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">Recommended: 10-50 per week to maintain quality.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Weekly Template Usage Goal</label>
              <div className="relative">
                <input
                  type="number"
                  name="target_templates"
                  min="1"
                  max="100"
                  value={formData.target_templates}
                  onChange={handleChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-rose-500 transition-shadow"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">templates</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Goal Reset Frequency</label>
              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, reset_frequency: 'weekly' }))}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${
                    formData.reset_frequency === 'weekly' 
                      ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' 
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-900'
                  } transition-colors font-medium text-sm`}
                >
                  <RefreshCcw className="w-4 h-4" /> Weekly
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-800/50 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors shadow-lg shadow-rose-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              toastMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-medium">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
