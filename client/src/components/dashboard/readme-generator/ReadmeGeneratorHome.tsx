import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, Routes, Route } from 'react-router';
import { User, FolderGit2, History, ChevronRight } from 'lucide-react';
import ProfileReadmeForm from './ProfileReadmeForm';
import ProjectReadmeForm from './ProjectReadmeForm';
import ReadmeHistory from './ReadmeHistory';

export default function ReadmeGeneratorHome() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">README Generator</h1>
              <p className="text-neutral-400">Generate professional GitHub READMEs powered by AI.</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/readme-generator/history')}
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <History className="w-4 h-4" /> History
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile README Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard/readme-generator/profile')}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 cursor-pointer hover:border-indigo-500/50 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all"></div>
              
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <User className="w-7 h-7 text-indigo-400" />
              </div>
              
              <h2 className="text-xl font-bold text-white mb-3">Profile README Generator</h2>
              <p className="text-neutral-400 mb-8 line-clamp-2">
                Create a stunning personal GitHub profile README to showcase your skills, projects, and connect with the community.
              </p>
              
              <div className="flex items-center text-indigo-400 font-medium text-sm group-hover:translate-x-2 transition-transform">
                Get Started <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>

            {/* Project README Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard/readme-generator/project')}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 cursor-pointer hover:border-emerald-500/50 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all"></div>
              
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <FolderGit2 className="w-7 h-7 text-emerald-400" />
              </div>
              
              <h2 className="text-xl font-bold text-white mb-3">Project README Generator</h2>
              <p className="text-neutral-400 mb-8 line-clamp-2">
                Generate a comprehensive README for your repository including installation, usage, tech stack, and API documentation.
              </p>
              
              <div className="flex items-center text-emerald-400 font-medium text-sm group-hover:translate-x-2 transition-transform">
                Get Started <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          </div>
        </div>
      } />
      
      <Route path="profile" element={<ProfileReadmeForm />} />
      <Route path="project" element={<ProjectReadmeForm />} />
      <Route path="history" element={<ReadmeHistory />} />
    </Routes>
  );
}
