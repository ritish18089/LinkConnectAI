import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, RefreshCw, Loader2, Save, Copy, Download, Upload, FileText, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';

export default function CoverLetterForm() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    companyName: '',
    jobRole: '',
    experience: '',
    linkedin: '',
    github: '',
    portfolio: '',
    location: '',
    qualification: '',
    skills: '',
    interest: '',
    additionalInfo: ''
  });

  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const handleGenerate = async () => {
    if (!formData.name || !formData.companyName || !formData.jobRole || !formData.experience || !formData.email || !formData.phone || !formData.location || !formData.qualification || !formData.skills || !formData.interest) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/generate-cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setMarkdown(result.content);
        setActiveTab('preview');
      } else {
        alert(result.error || "Failed to generate cover letter.");
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      alert(`Error connecting to server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !markdown) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('cover_letter_history')
        .insert([{
          user_id: user.id,
          candidate_name: formData.name,
          company_name: formData.companyName,
          job_role: formData.jobRole,
          content: markdown
        }]);

      if (error) throw error;
      alert("Cover Letter saved to history successfully!");
    } catch (err: any) {
      console.error("Save Error:", err.message, err);
      alert(`Failed to save cover letter. Error: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (markdown) {
      navigator.clipboard.writeText(markdown);
      alert("Copied to clipboard!");
    }
  };

  const downloadTXT = () => {
    const element = document.createElement("a");
    const file = new Blob([markdown], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${formData.companyName.replace(/ /g, '_')}_Cover_Letter.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  // We do simple export via html2pdf and Blob for now.
  const downloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.createElement('div');
    element.innerHTML = `<div style="font-family: Arial, sans-serif; padding: 40px; color: black; line-height: 1.6;">${markdown.replace(/\n/g, '<br/>')}</div>`;
    html2pdf().from(element).save(`${formData.companyName}_Cover_Letter.pdf`);
  };

  const downloadDOCX = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Cover Letter</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${markdown.replace(/\n/g, '<br/>')}</div>` + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${formData.companyName}_Cover_Letter.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard/cover-letter')} className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Cover Letter</h1>
          <p className="text-neutral-400 text-sm">Fill in the details to generate a personalized cover letter.</p>
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
              <label className="text-sm font-medium text-neutral-300">Full Name *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Company Name *</label>
              <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="Google" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Job Role / Position *</label>
              <input type="text" value={formData.jobRole} onChange={e => setFormData({...formData, jobRole: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="Frontend Developer" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Years of Experience *</label>
              <input type="text" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="3 Years" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Email Address *</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Phone Number *</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="+1 234 567 8900" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Current Location *</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="New York, USA" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Highest Qualification *</label>
              <input type="text" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="B.S. in Computer Science" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">LinkedIn Profile URL</label>
              <input type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="https://linkedin.com/in/johndoe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">GitHub Profile URL (Optional)</label>
              <input type="url" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="https://github.com/johndoe" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Key Skills *</label>
            <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" placeholder="React, Node.js, TypeScript, UI/UX" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Why are you interested in this company? *</label>
            <textarea value={formData.interest} onChange={e => setFormData({...formData, interest: e.target.value})} rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="I admire the company's innovation in..." />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Additional Information (Optional)</label>
            <textarea value={formData.additionalInfo} onChange={e => setFormData({...formData, additionalInfo: e.target.value})} rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-sm" placeholder="Any extra achievements or notes..." />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleGenerate} 
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
              {loading ? 'Generating...' : '✨ Generate Cover Letter'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col h-[800px] overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 flex-wrap gap-4">
            <h3 className="font-medium text-white">Preview & Edit</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleSave} disabled={saving || !markdown} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
              </button>
              <button onClick={copyToClipboard} disabled={!markdown} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors disabled:opacity-50">
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
              <button onClick={downloadPDF} disabled={!markdown} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors disabled:opacity-50">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button onClick={downloadDOCX} disabled={!markdown} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg transition-colors disabled:opacity-50">
                <Download className="w-3.5 h-3.5" /> DOCX
              </button>
              <button onClick={downloadTXT} disabled={!markdown} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors disabled:opacity-50">
                <Download className="w-3.5 h-3.5" /> TXT
              </button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 lg:flex-row">
            {markdown ? (
              <>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-neutral-400 mb-2">Edit Content</h4>
                  <textarea 
                    value={markdown} 
                    onChange={e => setMarkdown(e.target.value)} 
                    className="w-full h-[calc(100%-2rem)] bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-300 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div className="flex-1 bg-white rounded-xl p-8 overflow-y-auto">
                  <div className="prose max-w-none text-black">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full text-neutral-500">
                <p>No Cover Letter generated yet.</p>
                <button onClick={() => setActiveTab('form')} className="mt-4 text-indigo-400 hover:underline">Go back to form</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
