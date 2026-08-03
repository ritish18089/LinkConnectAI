import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { BarChart, Upload, FileText, Loader2, History } from 'lucide-react';
import AnalysisResult from './AnalysisResult';
import AnalysisHistory from './AnalysisHistory';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';

export default function ResumeAnalyzerHome() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  const [view, setView] = useState<'home' | 'result' | 'history'>('home');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Max size is 10MB.");
      return;
    }
    setResumeFile(file);
  };

  const analyzeResume = async () => {
    if (!resumeFile) {
      alert("Please upload a resume first.");
      return;
    }
    if (jobDescription.length < 100) {
      alert("Job description must be at least 100 characters.");
      return;
    }

    setLoading(true);
    try {
      // 1. Parse Resume
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const parseRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/parse-resume`, {
        method: 'POST',
        body: formData
      });
      const parseData = await parseRes.json();

      if (!parseData.success) {
        throw new Error(parseData.error || "Failed to parse resume");
      }
      const resumeText = parseData.text;

      // 2. Analyze
      const analyzeRes = await fetch(`${import.meta.env.VITE_API_URL || "https://linkconnect-ai-backend.onrender.com"}/api/analyze-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription })
      });
      const analyzeData = await analyzeRes.json();

      if (!analyzeData.success) {
        throw new Error(analyzeData.error || "Failed to analyze resume");
      }

      setResult(analyzeData.data);
      setView('result');

      // 3. Save to History
      if (user) {
        await supabase.from('resume_analyses').insert({
          user_id: user.id,
          resume_name: resumeFile.name,
          job_description: jobDescription,
          ats_score: analyzeData.data.atsScore,
          overall_match: analyzeData.data.overallMatch,
          analysis_data: analyzeData.data
        });
      }

    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  if (view === 'result') {
    return <AnalysisResult result={result} resumeName={resumeFile?.name || 'Resume'} onBack={() => setView('home')} />;
  }

  if (view === 'history') {
    return <AnalysisHistory onBack={() => setView('home')} />;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="text-center mb-12">
        <BarChart className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-4">Resume Analyzer</h1>
        <p className="text-neutral-400 text-lg">
          Analyze your resume against a job description, calculate an ATS score, identify missing keywords, and receive AI-powered improvement suggestions.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setView('history')}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
          >
            <History className="w-4 h-4" /> View History
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Upload className="w-6 h-6 text-indigo-500" /> Upload Resume
        </h2>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-700 hover:border-indigo-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-neutral-950"
        >
          {resumeFile ? (
            <div className="flex flex-col items-center">
              <FileText className="w-10 h-10 text-indigo-400 mb-2" />
              <p className="text-white font-medium">{resumeFile.name}</p>
              <p className="text-green-400 text-sm mt-1">✓ Upload Success</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-10 h-10 text-neutral-500 mb-2" />
              <p className="text-white font-medium">Click to upload or drag and drop</p>
              <p className="text-neutral-500 text-sm mt-1">PDF or DOCX (Max 10MB)</p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx"
            className="hidden"
          />
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-500" /> Paste Job Description
          </h2>
          <button
            onClick={() => setJobDescription('')}
            className="text-sm text-neutral-400 hover:text-white"
          >
            Clear
          </button>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the complete job description here..."
          className="w-full h-64 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          maxLength={20000}
        />
        <div className="text-right text-sm text-neutral-500 mt-2">
          {jobDescription.length} / 20000 characters
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={analyzeResume}
          disabled={loading || !resumeFile || jobDescription.length < 100}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <BarChart className="w-6 h-6" />
              Analyze Resume
            </>
          )}
        </button>
      </div>

    </div>
  );
}
