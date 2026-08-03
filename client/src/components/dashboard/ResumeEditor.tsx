import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Download, Save, ArrowLeft, Loader2, Check, Copy, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../db/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { ResumeData, ResumeTemplateMeta, DesignConfig } from '../../types/resume';
import resumeTemplatesData from '../../data/resumeTemplates.json';
import DynamicTemplate from './resume-templates/DynamicTemplate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const DEFAULT_RESUME_DATA: ResumeData = {
  personalInfo: { name: '', jobTitle: '', email: '', phone: '', address: '', linkedin: '', portfolio: '', github: '' },
  summary: '',
  skills: [],
  technicalSkills: [],
  softSkills: [],
  experience: [],
  education: [],
  projects: [],
  internships: [],
  certifications: [],
  languages: [],
  interests: [],
  volunteerWork: [],
  references: [],
  additionalInfo: [],
};

export default function ResumeEditor() {
  const { id: templateId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
  const [activeConfig, setActiveConfig] = useState<DesignConfig | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (user && templateId) loadResumeData();
  }, [user, templateId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (resumeData !== DEFAULT_RESUME_DATA && user) saveResumeData(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [resumeData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadResumeData = async () => {
    let templateConfig: DesignConfig | undefined = undefined;
    const template = (resumeTemplatesData as ResumeTemplateMeta[]).find(t => t.id === templateId);
    if (template && template.designConfig) {
      templateConfig = template.designConfig;
      setActiveConfig(templateConfig);
    }

    try {
      const { data } = await supabase.from('user_resume_templates').select('resume_data').eq('user_id', user!.id).eq('template_id', templateId).single();
      if (data && data.resume_data) {
        setResumeData({ ...DEFAULT_RESUME_DATA, ...(data.resume_data as any) });
      } else if (template && template.defaultContent) {
        setResumeData({ ...DEFAULT_RESUME_DATA, ...template.defaultContent });
      }
    } catch (error) {
      console.log('No existing user data. Using template default content if available.');
      if (template && template.defaultContent) {
        setResumeData({ ...DEFAULT_RESUME_DATA, ...template.defaultContent });
      }
    }
  };

  const saveResumeData = async (isAutoSave = false) => {
    if (!user || !templateId) return;
    setSaveStatus('saving');
    if (!isAutoSave) setIsSaving(true);

    try {
      const { data: existing } = await supabase.from('user_resume_templates').select('id').eq('user_id', user.id).eq('template_id', templateId).single();
      const now = new Date().toISOString();
      if (existing) {
        await supabase.from('user_resume_templates').update({ resume_data: resumeData, last_updated: now }).eq('id', existing.id);
      } else {
        await supabase.from('user_resume_templates').insert({ user_id: user.id, template_id: templateId, resume_data: resumeData, last_updated: now, created_at: now });
      }
      setSaveStatus('saved');
      if (!isAutoSave) showToast('Resume saved successfully!');
    } catch (error: any) {
      setSaveStatus('error');
      if (!isAutoSave) showToast('Failed to save resume.');
    } finally {
      if (!isAutoSave) setIsSaving(false);
      setTimeout(() => { if (setSaveStatus) setSaveStatus('idle') }, 2000);
    }
  };

  const deleteResume = async () => {
    if (!user || !templateId) return;
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await supabase.from('user_resume_templates').delete().match({ user_id: user.id, template_id: templateId });
      showToast('Resume deleted.');
      setTimeout(() => navigate('/dashboard/resume-templates'), 1000);
    } catch (e) {
      showToast('Failed to delete resume.');
    }
  };

  const duplicateResume = async () => {
    if (!user || !templateId) return;
    try {
      const newTemplateId = `${templateId}-copy-${Date.now()}`;
      const now = new Date().toISOString();
      await supabase.from('user_resume_templates').insert({
        user_id: user.id,
        template_id: newTemplateId,
        resume_data: { ...resumeData, personalInfo: { ...resumeData.personalInfo, name: resumeData.personalInfo.name + ' (Copy)' } },
        last_updated: now, created_at: now
      });
      showToast('Resume duplicated!');
      navigate(`/dashboard/resume-templates/edit/${newTemplateId}`);
    } catch (e) {
      showToast('Failed to duplicate resume.');
    }
  };

  const convertToSafeColor = (colorStr: string): string => {
    if (!colorStr) return colorStr;
    const isUnsupported = colorStr.includes('oklch') || 
                          colorStr.includes('lch') || 
                          colorStr.includes('lab') || 
                          colorStr.includes('color(') || 
                          colorStr.includes('color-mix');
    
    if (!isUnsupported) return colorStr;

    // Use a temporary canvas to let the browser convert any modern CSS color to standard RGBA
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.fillStyle = colorStr;
      ctx.fillRect(0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      const result = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
      console.log(`Converted ${colorStr} -> ${result}`);
      return result;
    }
    return colorStr;
  };

  const sanitizeElementColors = (element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    
    const colorProps = [
      'color', 
      'backgroundColor', 
      'borderColor', 
      'borderTopColor', 
      'borderRightColor', 
      'borderBottomColor', 
      'borderLeftColor',
      'outlineColor',
      'textDecorationColor'
    ];

    colorProps.forEach(prop => {
      const val = style.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
      if (val && (val.includes('oklch') || val.includes('color') || val.includes('lab') || val.includes('lch'))) {
        (element.style as any)[prop] = convertToSafeColor(val);
      }
    });

    // Handle box-shadow separately as it contains lengths and colors
    const boxShadow = style.boxShadow;
    if (boxShadow && boxShadow !== 'none') {
       // A simplistic approach: if boxShadow contains oklch, we try to regex replace it, 
       // but a full parser is complex. We will just remove it or let canvas try to parse the color part if simple.
       if (boxShadow.includes('oklch') || boxShadow.includes('color')) {
         element.style.boxShadow = 'none'; // Fallback for shadows to avoid breaking html2canvas
       }
    }
  };

  const downloadPDF = async () => {
    console.log('PDF generation started');
    if (isGeneratingPDF) {
      console.log('PDF generation already in progress. Aborting duplicate click.');
      return;
    }
    
    if (!previewRef.current) {
      console.error('Unable to generate PDF because the resume element was not found.');
      showToast('Error: Resume element not found');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      showToast('Generating PDF...');
      
      console.log('Resume element found');

      // Wait for fonts
      if (document.fonts) {
        await document.fonts.ready;
        console.log('Fonts loaded');
      }

      // Wait for all images inside the preview to load
      const images = Array.from(previewRef.current.querySelectorAll('img'));
      if (images.length > 0) {
        await Promise.all(images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
          });
        }));
      }
      console.log('Images loaded');

      // Optional delay to ensure React rendering is totally complete
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(previewRef.current, { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('resume-preview');
          if (clonedElement) {
            console.log('Sanitizing colors in cloned document...');
            const allElements = clonedElement.querySelectorAll('*');
            sanitizeElementColors(clonedElement as HTMLElement);
            allElements.forEach(el => sanitizeElementColors(el as HTMLElement));
          }
        }
      } as any);
      
      console.log('Canvas created');

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const ratio = pdfWidth / canvas.width;
      const totalPdfHeight = canvas.height * ratio;
      
      let heightLeft = totalPdfHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
      heightLeft -= pdfHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - totalPdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
        heightLeft -= pdfHeight;
      }
      
      console.log('PDF created (Multi-page handled)');
      
      console.log('Download started');
      pdf.save(`Resume_${resumeData.personalInfo.name || 'Export'}.pdf`);
      
      console.log('PDF generation completed');
      showToast('PDF downloaded successfully!');
    } catch (error: any) {
      console.error('PDF Generation Failed:', error);
      console.error('Stack Trace:', error.stack);
      
      const errorMessage = error.message || 'Unknown error occurred during generation';
      if (process.env.NODE_ENV === 'development') {
        showToast(`PDF Error: ${errorMessage}`);
      } else {
        showToast('Unable to generate PDF. Please try again or check for unsupported images.');
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadDOCX = async () => {
    try {
      showToast('Generating DOCX...');
      
      const children: any[] = [];
      
      // Header
      if (resumeData.personalInfo) {
        children.push(new Paragraph({ children: [new TextRun({ text: resumeData.personalInfo.name || '', bold: true, size: 32 })] }));
        children.push(new Paragraph({ text: resumeData.personalInfo.jobTitle || '' }));
        children.push(new Paragraph({ text: `${resumeData.personalInfo.email || ''} | ${resumeData.personalInfo.phone || ''} | ${resumeData.personalInfo.address || ''}` }));
        children.push(new Paragraph({ text: "" }));
      }
      
      // Summary
      if (resumeData.summary) {
        children.push(new Paragraph({ children: [new TextRun({ text: 'Professional Summary', bold: true, size: 28 })] }));
        children.push(new Paragraph({ text: resumeData.summary }));
        children.push(new Paragraph({ text: "" }));
      }
      
      // Experience
      if (resumeData.experience && resumeData.experience.length > 0) {
        children.push(new Paragraph({ children: [new TextRun({ text: 'Experience', bold: true, size: 28 })] }));
        resumeData.experience.forEach((exp: any) => {
          children.push(new Paragraph({ children: [new TextRun({ text: exp.position || '', bold: true })] }));
          children.push(new Paragraph({ text: `${exp.company || ''} | ${exp.startDate || ''} - ${exp.endDate || 'Present'}` }));
          if (exp.description) {
            exp.description.split('\n').forEach((line: string) => {
              if (line.trim()) children.push(new Paragraph({ text: line.trim(), bullet: { level: 0 } }));
            });
          }
          children.push(new Paragraph({ text: "" }));
        });
      }

      // Projects
      if (resumeData.projects && resumeData.projects.length > 0) {
        children.push(new Paragraph({ children: [new TextRun({ text: 'Projects', bold: true, size: 28 })] }));
        resumeData.projects.forEach((proj: any) => {
          children.push(new Paragraph({ children: [new TextRun({ text: proj.name || '', bold: true })] }));
          if (proj.description) {
            proj.description.split('\n').forEach((line: string) => {
              if (line.trim()) children.push(new Paragraph({ text: line.trim(), bullet: { level: 0 } }));
            });
          }
          children.push(new Paragraph({ text: "" }));
        });
      }

      // Technical Skills
      if (resumeData.technicalSkills && resumeData.technicalSkills.length > 0) {
        children.push(new Paragraph({ children: [new TextRun({ text: 'Technical Skills', bold: true, size: 28 })] }));
        children.push(new Paragraph({ text: resumeData.technicalSkills.join(', ') }));
        children.push(new Paragraph({ text: "" }));
      }

      // Education
      if (resumeData.education && resumeData.education.length > 0) {
        children.push(new Paragraph({ children: [new TextRun({ text: 'Education', bold: true, size: 28 })] }));
        resumeData.education.forEach((edu: any) => {
          children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree || ''} in ${edu.fieldOfStudy || ''}`, bold: true })] }));
          children.push(new Paragraph({ text: `${edu.institution || ''} | ${edu.startDate || ''} - ${edu.endDate || ''}` }));
          children.push(new Paragraph({ text: "" }));
        });
      }

      // Certifications
      if (resumeData.certifications && resumeData.certifications.length > 0) {
        children.push(new Paragraph({ children: [new TextRun({ text: 'Certifications', bold: true, size: 28 })] }));
        resumeData.certifications.forEach((cert: any) => {
          children.push(new Paragraph({ children: [new TextRun({ text: cert.name || '', bold: true })] }));
          let details = `${cert.issuer || ''} | ${cert.issueDate || ''}`;
          if (cert.expiryDate) details += ` - ${cert.expiryDate}`;
          children.push(new Paragraph({ text: details }));
          if (cert.credentialId || cert.credentialUrl) {
            let cred = '';
            if (cert.credentialId) cred += `ID: ${cert.credentialId} `;
            if (cert.credentialUrl) cred += `URL: ${cert.credentialUrl}`;
            children.push(new Paragraph({ text: cred.trim() }));
          }
          children.push(new Paragraph({ text: "" }));
        });
      }

      // Additional Info
      if (resumeData.additionalInfo && resumeData.additionalInfo.length > 0) {
        children.push(new Paragraph({ children: [new TextRun({ text: 'Additional Information', bold: true, size: 28 })] }));
        resumeData.additionalInfo.forEach((info: any) => {
          children.push(new Paragraph({ children: [new TextRun({ text: info.title || '', bold: true })] }));
          if (info.description) {
            info.description.split('\n').forEach((line: string) => {
              if (line.trim()) children.push(new Paragraph({ text: line.trim(), bullet: { level: 0 } }));
            });
          }
          children.push(new Paragraph({ text: "" }));
        });
      }

      const doc = new Document({
        sections: [{ properties: {}, children }],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Resume_${resumeData.personalInfo.name || 'Export'}.docx`);
      showToast('DOCX downloaded successfully!');
    } catch (error) {
      showToast('Failed to generate DOCX.');
    }
  };

  const moveItem = (arrayName: keyof ResumeData, index: number, direction: 'up' | 'down') => {
    const newArray = [...(resumeData[arrayName] as any[])];
    const temp = newArray[index];
    
    if (direction === 'up' && index > 0) {
      newArray[index] = newArray[index - 1];
      newArray[index - 1] = temp;
    } else if (direction === 'down' && index < newArray.length - 1) {
      newArray[index] = newArray[index + 1];
      newArray[index + 1] = temp;
    }
    setResumeData({ ...resumeData, [arrayName]: newArray });
  };

  const renderArraySection = (arrayName: keyof ResumeData, title: string, itemTitleFields: string[], defaultItem: any) => {
    const items = (resumeData[arrayName] as any[]) || [];
    return (
      <div className="space-y-4">
        <button onClick={() => setResumeData({...resumeData, [arrayName]: [...items, { ...defaultItem, id: Date.now().toString() }]})} className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-sm font-medium rounded-lg transition-colors">
          Add {title}
        </button>
        {items.map((item, idx) => (
          <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm relative group">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={(e) => { e.preventDefault(); moveItem(arrayName, idx, 'up'); }} disabled={idx === 0} className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30"><ArrowUp className="w-3 h-3"/></button>
              <button type="button" onClick={(e) => { e.preventDefault(); moveItem(arrayName, idx, 'down'); }} disabled={idx === items.length - 1} className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30"><ArrowDown className="w-3 h-3"/></button>
              <button type="button" onClick={(e) => { e.preventDefault(); setResumeData({...resumeData, [arrayName]: items.filter((_, i) => i !== idx)}); }} className="p-1 rounded bg-red-500/20 text-red-500 hover:bg-red-500/40"><Trash2 className="w-3 h-3"/></button>
            </div>
            
            {itemTitleFields.map(field => (
              <input key={field} type="text" placeholder={field} value={item[field] || ''} onChange={e => {
                const newItems = [...items];
                newItems[idx][field] = e.target.value;
                setResumeData({...resumeData, [arrayName]: newItems});
              }} className="w-full bg-transparent border-b border-neutral-800 mb-2 pb-1 outline-none focus:border-indigo-500 font-bold" />
            ))}
            <textarea placeholder="Description" value={item.description || ''} onChange={e => {
              const newItems = [...items];
              newItems[idx].description = e.target.value;
              setResumeData({...resumeData, [arrayName]: newItems});
            }} className="w-full bg-transparent outline-none resize-none text-xs text-neutral-400 mt-2" rows={3}></textarea>
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'technicalSkills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'additionalInfo', label: 'Additional Info' },
  ];

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white overflow-hidden">
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }} className="fixed top-4 right-4 z-[100] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Check className="w-5 h-5" />
            <span className="font-medium text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/resume-templates')} className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Resume Editor</h1>
          {saveStatus === 'saving' && <span className="text-xs text-neutral-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Auto-saving...</span>}
          {saveStatus === 'saved' && <span className="text-xs text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3"/> Saved</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button 
              onClick={downloadPDF} 
              disabled={isGeneratingPDF}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center gap-2"
            >
              {isGeneratingPDF ? (
                <><Loader2 className="w-4 h-4 animate-spin"/> Generating PDF...</>
              ) : (
                <><Download className="w-4 h-4"/> PDF</>
              )}
            </button>
            <button onClick={downloadDOCX} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center gap-2">
              <Download className="w-4 h-4"/> DOCX
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Editor Sidebar */}
        <div className="w-[400px] border-r border-neutral-800 bg-neutral-900 flex flex-col overflow-hidden shrink-0">
          <div className="flex gap-1 p-4 border-b border-neutral-800 overflow-x-auto shrink-0 scrollbar-hide">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-indigo-500 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {activeTab === 'personal' && (
              <div className="space-y-4">
                {['name', 'jobTitle', 'email', 'phone', 'address', 'linkedin', 'github'].map(field => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-neutral-400 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <input type={field === 'email' ? 'email' : 'text'} value={(resumeData.personalInfo as any)[field] || ''} onChange={e => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, [field]: e.target.value}})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Professional Summary</label>
                  <textarea rows={10} value={resumeData.summary} onChange={e => setResumeData({...resumeData, summary: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none resize-none"></textarea>
                </div>
              </div>
            )}

            {activeTab === 'technicalSkills' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Technical Skills (comma separated)</label>
                  <textarea rows={5} value={(resumeData.technicalSkills || []).join(', ')} onChange={e => setResumeData({...resumeData, technicalSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none resize-none"></textarea>
                </div>
              </div>
            )}

            {activeTab === 'experience' && renderArraySection('experience', 'Experience', ['company', 'position'], { company: '', position: '', description: '' })}
            {activeTab === 'projects' && renderArraySection('projects', 'Projects', ['name', 'link'], { name: '', link: '', description: '' })}
            {activeTab === 'education' && renderArraySection('education', 'Education', ['institution', 'degree'], { institution: '', degree: '', description: '' })}
            {activeTab === 'certifications' && (
              <div className="space-y-4">
                <button type="button" onClick={() => setResumeData({...resumeData, certifications: [...(resumeData.certifications || []), { id: Date.now().toString(), name: '', issuer: '', issueDate: '' }]})} className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-sm font-medium rounded-lg transition-colors">
                  Add Certification
                </button>
                {(resumeData.certifications || []).map((cert: any, idx: number) => (
                  <div key={cert.id} className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm relative group">
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={(e) => { e.preventDefault(); moveItem('certifications', idx, 'up'); }} disabled={idx === 0} className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30"><ArrowUp className="w-3 h-3"/></button>
                      <button type="button" onClick={(e) => { e.preventDefault(); moveItem('certifications', idx, 'down'); }} disabled={idx === (resumeData.certifications?.length || 0) - 1} className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30"><ArrowDown className="w-3 h-3"/></button>
                      <button type="button" onClick={(e) => {
                        e.preventDefault();
                        const newCerts = [...(resumeData.certifications || [])];
                        newCerts.splice(idx, 1);
                        setResumeData({ ...resumeData, certifications: newCerts });
                      }} className="p-1 rounded bg-red-500/20 text-red-500 hover:bg-red-500/40"><Trash2 className="w-3 h-3"/></button>
                    </div>
                    
                    <input type="text" placeholder="Certification Name" value={cert.name || ''} onChange={e => {
                      const newItems = [...(resumeData.certifications || [])];
                      newItems[idx].name = e.target.value;
                      setResumeData({...resumeData, certifications: newItems});
                    }} className="w-full bg-transparent border-b border-neutral-800 mb-2 pb-1 outline-none focus:border-indigo-500 font-bold" />
                    
                    <input type="text" placeholder="Issuing Organization" value={cert.issuer || ''} onChange={e => {
                      const newItems = [...(resumeData.certifications || [])];
                      newItems[idx].issuer = e.target.value;
                      setResumeData({...resumeData, certifications: newItems});
                    }} className="w-full bg-transparent border-b border-neutral-800 mb-2 pb-1 outline-none focus:border-indigo-500" />
                    
                    <div className="flex gap-2 mb-2">
                      <input type="text" placeholder="Issue Date (e.g. Mar 2021)" value={cert.issueDate || ''} onChange={e => {
                        const newItems = [...(resumeData.certifications || [])];
                        newItems[idx].issueDate = e.target.value;
                        setResumeData({...resumeData, certifications: newItems});
                      }} className="w-full bg-transparent border-b border-neutral-800 pb-1 outline-none focus:border-indigo-500" />
                      <input type="text" placeholder="Expiry Date (Optional)" value={cert.expiryDate || ''} onChange={e => {
                        const newItems = [...(resumeData.certifications || [])];
                        newItems[idx].expiryDate = e.target.value;
                        setResumeData({...resumeData, certifications: newItems});
                      }} className="w-full bg-transparent border-b border-neutral-800 pb-1 outline-none focus:border-indigo-500" />
                    </div>

                    <div className="flex gap-2">
                      <input type="text" placeholder="Credential ID (Optional)" value={cert.credentialId || ''} onChange={e => {
                        const newItems = [...(resumeData.certifications || [])];
                        newItems[idx].credentialId = e.target.value;
                        setResumeData({...resumeData, certifications: newItems});
                      }} className="w-full bg-transparent border-b border-neutral-800 pb-1 outline-none focus:border-indigo-500 text-xs text-neutral-400" />
                      <input type="text" placeholder="Credential URL (Optional)" value={cert.credentialUrl || ''} onChange={e => {
                        const newItems = [...(resumeData.certifications || [])];
                        newItems[idx].credentialUrl = e.target.value;
                        setResumeData({...resumeData, certifications: newItems});
                      }} className="w-full bg-transparent border-b border-neutral-800 pb-1 outline-none focus:border-indigo-500 text-xs text-neutral-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'additionalInfo' && renderArraySection('additionalInfo', 'Additional Information', ['title'], { title: '', description: '' })}

          </div>
        </div>

        {/* Live Preview */}
        <div className="flex-1 bg-neutral-950 overflow-y-auto p-8 flex justify-center items-start">
          <div ref={previewRef} className="bg-white shadow-2xl rounded-sm overflow-hidden shrink-0" style={{ width: '210mm', height: 'max-content' }}>
            <DynamicTemplate data={resumeData} designConfig={activeConfig} />
          </div>
        </div>

      </div>
    </div>
  );
}
