import React from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { FileText, History, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import CoverLetterForm from './CoverLetterForm';
import CoverLetterHistory from './CoverLetterHistory';

export default function CoverLetterHome() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">AI Cover Letter Generator</h1>
              <p className="text-neutral-400">Generate professional ATS-friendly cover letters tailored to any company and job role.</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/cover-letter/history')}
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <History className="w-4 h-4" /> History
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create New Cover Letter Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard/cover-letter/new')}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 cursor-pointer hover:border-indigo-500/50 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all"></div>
              
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-indigo-400" />
              </div>
              
              <h2 className="text-xl font-bold text-white mb-3">Create New Cover Letter</h2>
              <p className="text-neutral-400 mb-8 line-clamp-2">
                Generate a highly personalized cover letter by entering your details or uploading your resume.
              </p>
              
              <div className="flex items-center text-indigo-400 font-medium text-sm group-hover:translate-x-2 transition-transform">
                Get Started <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          </div>
        </div>
      } />
      
      <Route path="new" element={<CoverLetterForm />} />
      <Route path="history" element={<CoverLetterHistory />} />
    </Routes>
  );
}
