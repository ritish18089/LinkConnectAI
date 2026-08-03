import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, Save, Download, Copy, RefreshCw } from 'lucide-react';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectReadmeForm() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    features: '',
    techStack: '',
    installation: '',
    usage: '',
    apiInfo: '',
    envVars: '',
    license: '',
    author: '',
    githubRepo: '',
    liveDemo: ''
  });

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/generate-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'project', data: formData })
      });
      
      const text = await res.text();
      if (!res.ok) {
        let errorMsg = text;
        try { const j = JSON.parse(text); errorMsg = j.error || errorMsg; } catch(e){}
        throw new Error(errorMsg);
      }
      
      const json = JSON.parse(text);
      if (json.success && json.content) {
        setMarkdown(json.content);
        setActiveTab('preview');
      } else {
        throw new Error(json.error || 'Generation failed');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message || 'connecting to the server.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!markdown || !user) return;
    try {
      setSaving(true);
      await supabase.from('readme_history').insert({
        user_id: user.id,
        title: `${formData.projectName || 'My'} Project README`,
        type: 'project',
        content: markdown
      });
      alert('Saved to history!');
    } catch (err) {
      console.error(err);
      alert('Error saving.');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    alert('Copied to clipboard!');
  };

  const downloadFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `README.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/dashboard/readme-generator')} className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Project README Generator</h1>
          <p className="text-neutral-400 text-sm">Provide details about your repository to generate a professional README.</p>
        </div>
      </div>

      <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1 w-max mb-6">
        <button onClick={() => setActiveTab('form')} className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'form' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}>Form</button>
        <button onClick={() => setActiveTab('preview')} className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'preview' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}>Preview</button>
      </div>

      {activeTab === 'form' ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Project Name</label>
              <input type="text" value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="LinkConnect AI" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Live Demo URL</label>
              <input type="text" value={formData.liveDemo} onChange={e => setFormData({...formData, liveDemo: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="https://linkconnect.ai" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Project Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="An AI-powered platform helping students with placement preparation..." />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Features</label>
            <textarea value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="AI Resume Analysis, Virtual Mock Interviews, GD Simulator..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Tech Stack (comma separated)</label>
              <input type="text" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="React, Node.js, PostgreSQL" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Environment Variables</label>
              <input type="text" value={formData.envVars} onChange={e => setFormData({...formData, envVars: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="VITE_SUPABASE_URL, OPENAI_API_KEY" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Installation Instructions</label>
              <input type="text" value={formData.installation} onChange={e => setFormData({...formData, installation: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="npm install, npm run dev" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">License</label>
              <input type="text" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="MIT" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleGenerate} 
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
              {loading ? 'Generating...' : 'Generate README'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col h-[700px] overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <h3 className="font-medium text-white">Preview</h3>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving || !markdown} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save to History
              </button>
              <button onClick={copyToClipboard} disabled={!markdown} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors disabled:opacity-50">
                <Copy className="w-3.5 h-3.5" /> Copy Markdown
              </button>
              <button onClick={downloadFile} disabled={!markdown} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
          <div className="p-8 overflow-y-auto flex-1 prose prose-invert max-w-none">
            {markdown ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                <p>No README generated yet.</p>
                <button onClick={() => setActiveTab('form')} className="mt-4 text-indigo-400 hover:underline">Go back to form</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
