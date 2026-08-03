import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Mic, ArrowRight, UserCircle, Briefcase, FileText } from 'lucide-react';
import { supabase } from '../../../db/supabase';

export default function MockInterviewHome() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    jobRole: '',
    companyName: '',
    experienceLevel: 'Fresher',
    interviewType: 'HR Interview',
    difficulty: 'Medium',
    durationMins: 15
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [resumeText, setResumeText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    
    // Parse resume
    setParsing(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await fetch('http://localhost:3000/api/parse-resume', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.text) {
        setResumeText(data.text);
      }
    } catch (err) {
      console.error("Failed to parse resume", err);
    }
    setParsing(false);
  };

  const startInterview = () => {
    // Validate
    if (!formData.fullName || !formData.email || !formData.jobRole) {
      alert("Please fill all required fields.");
      return;
    }
    
    // Pass state to room
    navigate('/dashboard/mock-interview/room', {
      state: {
        candidateDetails: {
          ...formData,
          resumeText
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="text-center mb-12">
        <Mic className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-4">Mock Interview</h1>
        <p className="text-neutral-400 text-lg">
          Practice realistic AI-powered interviews tailored to your preferred job role and experience level.
        </p>
        
        <div className="mt-6 flex justify-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/mock-interview/history')}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" /> View History
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-indigo-500" /> Candidate Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name *</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Email *</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Job Role Applying For *</label>
            <input 
              type="text" 
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Company Name (Optional)</label>
            <input 
              type="text" 
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              placeholder="Google"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Experience Level *</label>
            <select 
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Fresher">Fresher</option>
              <option value="0-1 Years">0–1 Years</option>
              <option value="1-3 Years">1–3 Years</option>
              <option value="3-5 Years">3–5 Years</option>
              <option value="5+ Years">5+ Years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Interview Type *</label>
            <select 
              name="interviewType"
              value={formData.interviewType}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="HR Interview">HR Interview</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="Managerial Interview">Managerial Interview</option>
              <option value="Behavioral Interview">Behavioral Interview</option>
              <option value="Mixed Interview">Mixed Interview</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Difficulty Level *</label>
            <select 
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Interview Duration *</label>
            <select 
              name="durationMins"
              value={formData.durationMins}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-neutral-400 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Upload Resume (Optional)
          </label>
          <input 
            type="file" 
            accept=".pdf,.docx" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-neutral-950 border border-neutral-800 border-dashed rounded-xl px-4 py-8 text-neutral-400 hover:text-white hover:border-indigo-500 transition-colors flex flex-col items-center justify-center gap-2"
          >
            {resumeFile ? (
              <span className="text-indigo-400 font-medium">{resumeFile.name}</span>
            ) : (
              <>
                <FileText className="w-6 h-6" />
                <span>Click to upload PDF or DOCX</span>
              </>
            )}
            {parsing && <span className="text-xs text-indigo-500 animate-pulse mt-2">Parsing resume...</span>}
            {resumeText && !parsing && <span className="text-xs text-emerald-500 mt-2">Resume parsed successfully</span>}
          </button>
        </div>

        <button 
          onClick={startInterview}
          disabled={!formData.fullName || !formData.email || !formData.jobRole || parsing}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 group"
        >
          Start Mock Interview
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
