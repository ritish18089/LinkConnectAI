import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Download, Copy, AlertTriangle, FileCheck, Loader2 } from 'lucide-react';
interface Props {
  result: any;
  resumeName: string;
  onBack: () => void;
}

const convertColorToRgb = (colorStr: string) => {
  if (!colorStr || (!colorStr.includes('oklch') && !colorStr.includes('color(') && !colorStr.includes('lch') && !colorStr.includes('lab'))) {
    return colorStr;
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return colorStr;
    ctx.fillStyle = colorStr;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
  } catch (e) {
    return colorStr;
  }
};

export default function AnalysisResult({ result, resumeName, onBack }: Props) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById('report-content');
    
    if (!element) {
      console.error("PDF ERROR: Report content element not found.");
      alert("Error: Report content element not found. Please try again.");
      return;
    }
    
    setIsGeneratingPdf(true);
    try {
      // 1. Wait a moment to ensure all React components, icons, and animations are fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // 2. Dynamically import html2canvas and jsPDF to ensure compatibility
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);
      
      const html2canvas: any = ('default' in html2canvasModule ? (html2canvasModule as any).default : html2canvasModule);
      const jsPDF: any = ('jsPDF' in jsPDFModule ? (jsPDFModule as any).jsPDF : ('default' in jsPDFModule ? (jsPDFModule as any).default : jsPDFModule));

      if (!html2canvas || !jsPDF) {
        throw new Error(`Failed to load PDF libraries. html2canvas: ${!!html2canvas}, jsPDF: ${!!jsPDF}`);
      }

      // 3. Clone and sanitize DOM for html2canvas to fix OKLCH/Tailwind v4 color issues
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = `${element.offsetWidth}px`; // Preserve layout width
      document.body.appendChild(clone);
      
      const originalElements = [element, ...Array.from(element.querySelectorAll('*'))];
      const clonedElements = [clone, ...Array.from(clone.querySelectorAll('*'))];
      
      const cssPropsToConvert = [
        'color', 'backgroundColor', 'borderColor', 'borderTopColor', 
        'borderRightColor', 'borderBottomColor', 'borderLeftColor', 
        'outlineColor', 'textDecorationColor', 'fill', 'stroke'
      ];
      
      for (let i = 0; i < originalElements.length; i++) {
        const origEl = originalElements[i];
        const cloneEl = clonedElements[i] as HTMLElement | SVGElement;
        const computedStyle = window.getComputedStyle(origEl);
        
        cssPropsToConvert.forEach(prop => {
          const val = (computedStyle as any)[prop];
          if (val && (val.includes('oklch') || val.includes('color(') || val.includes('lch') || val.includes('lab'))) {
            cloneEl.style.setProperty(
              prop.replace(/([A-Z])/g, '-$1').toLowerCase(), 
              convertColorToRgb(val), 
              'important'
            );
          }
        });
      }

      // 4. Generate Canvas
      const canvas = await html2canvas(clone, {
        scale: 2, // High quality
        useCORS: true, // Crucial for loading external images/icons
        backgroundColor: '#ffffff', // Ensure white background
        logging: false
      });
      
      // Cleanup clone
      document.body.removeChild(clone);
      
      // 4. Generate PDF with multi-page support
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      // Additional pages
      while (heightLeft > 0) {
        position = position - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      // 5. Download
      const sanitizedName = resumeName.replace(/[^a-zA-Z0-9.-]/g, '_');
      pdf.save(`Resume_Analysis_${sanitizedName}.pdf`);
      
    } catch (error: any) {
      console.error("=== PDF GENERATION ERROR ===");
      console.error("Exact error message:", error?.message || error);
      console.error("Stack trace:", error?.stack);
      console.error("Report element exists:", !!document.getElementById('report-content'));
      console.error("Browser information:", navigator.userAgent);
      console.error("Full error object:", error);
      
      alert(`PDF Generation Failed:\n${error?.message || 'Unknown error'}\n\nPlease check the console for exact details.`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyKeywords = () => {
    if (result.missingKeywords) {
      navigator.clipboard.writeText(result.missingKeywords.join(', '));
      alert("Keywords copied to clipboard!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700">
          ← Back to Analyzer
        </button>
        <button 
          onClick={handleDownload} 
          disabled={isGeneratingPdf}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed transition-colors"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Download Report
            </>
          )}
        </button>
      </div>

      <div id="report-content" className="space-y-8 bg-neutral-950 p-2">
        
        {/* Header */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Resume Analysis Report</h1>
          <p className="text-neutral-400">File: {resumeName}</p>
          
          <div className="mt-8 flex justify-center items-center gap-12">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" className="stroke-neutral-800" strokeWidth="12" fill="none" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    className="stroke-indigo-500 transition-all duration-1000 ease-out" 
                    strokeWidth="12" fill="none" 
                    strokeDasharray="351.8" 
                    strokeDashoffset={351.8 - (351.8 * (result.atsScore || 0)) / 100}
                  />
                </svg>
                <span className="text-3xl font-bold text-white">{result.atsScore || 0}%</span>
              </div>
              <p className="mt-4 text-lg font-medium text-white">ATS Score</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" className="stroke-neutral-800" strokeWidth="12" fill="none" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    className="stroke-green-500 transition-all duration-1000 ease-out" 
                    strokeWidth="12" fill="none" 
                    strokeDasharray="351.8" 
                    strokeDashoffset={351.8 - (351.8 * (result.overallMatch || 0)) / 100}
                  />
                </svg>
                <span className="text-3xl font-bold text-white">{result.overallMatch || 0}%</span>
              </div>
              <p className="mt-4 text-lg font-medium text-white">Overall Match</p>
            </div>
          </div>
        </div>

        {/* Match Breakdown */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Match Breakdown</h2>
          <div className="space-y-4">
            {[
              { label: 'Technical Skills Match', score: result.technicalMatch || 0 },
              { label: 'Soft Skills Match', score: result.softSkillsMatch || 0 },
              { label: 'Experience Match', score: result.experienceMatch || 0 },
              { label: 'Education Match', score: result.educationMatch || 0 },
              { label: 'Keyword Match', score: result.keywordMatch || 0 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-300">{item.label}</span>
                  <span className="text-sm font-medium text-white">{item.score}%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2.5">
                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${item.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Missing Keywords</h2>
            <button onClick={handleCopyKeywords} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 text-sm">
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords?.length > 0 ? (
              result.missingKeywords.map((kw: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm">
                  {kw}
                </span>
              ))
            ) : (
              <p className="text-neutral-400">No major keywords missing!</p>
            )}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> Strengths
            </h2>
            <ul className="space-y-3">
              {result.strengths?.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-neutral-300">
                  <span className="text-green-500 mt-1">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" /> Weaknesses
            </h2>
            <ul className="space-y-3">
              {result.weaknesses?.map((w: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-neutral-300">
                  <span className="text-orange-500 mt-1">•</span> {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">AI Suggestions for Improvement</h2>
          <div className="space-y-4">
            {result.suggestions?.map((s: string, i: number) => (
              <div key={i} className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-200">
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* ATS Checklist */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-500" /> ATS Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.checklist?.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                {item.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
                <span className={item.passed ? "text-neutral-300" : "text-neutral-400"}>
                  {item.item}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
