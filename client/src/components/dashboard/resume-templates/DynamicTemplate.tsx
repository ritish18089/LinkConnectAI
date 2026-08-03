import React from 'react';
import { ResumeData, DesignConfig } from '../../../types/resume';

interface DynamicTemplateProps {
  data: ResumeData;
  designConfig?: DesignConfig;
}

const DEFAULT_CONFIG: DesignConfig = {
  fontFamily: 'Inter, sans-serif',
  accentColor: '#4F46E5',
  headerStyle: 'center',
  dividerStyle: 'solid',
  timelineStyle: 'classic',
  skillStyle: 'tags',
  spacing: 'normal'
};

export default function DynamicTemplate({ data, designConfig = DEFAULT_CONFIG }: DynamicTemplateProps) {
  const config = { ...DEFAULT_CONFIG, ...designConfig };

  const getSpacingClass = () => {
    switch(config.spacing) {
      case 'compact': return 'space-y-3';
      case 'relaxed': return 'space-y-6';
      default: return 'space-y-4';
    }
  };

  const getHeaderClasses = () => {
    switch(config.headerStyle) {
      case 'left': return 'text-left flex flex-row items-center gap-6';
      case 'split': return 'flex justify-between items-end';
      case 'minimal': return 'text-left border-b-4 border-gray-900 pb-4';
      default: return 'text-center flex flex-col items-center'; // center
    }
  };

  const getDividerStyle = () => {
    switch(config.dividerStyle) {
      case 'dashed': return 'border-b border-dashed border-gray-300';
      case 'thick': return 'border-b-2 border-gray-900';
      case 'none': return 'pb-2';
      default: return 'border-b border-gray-300';
    }
  };

  const renderSkills = (skills: string[]) => {
    if (!skills || skills.length === 0) return null;
    if (config.skillStyle === 'comma') {
      return <p className="text-sm text-gray-700 leading-relaxed">{skills.join(', ')}</p>;
    }
    if (config.skillStyle === 'bullets') {
      return (
        <ul className="list-disc list-inside text-sm text-gray-700 grid grid-cols-2 gap-1">
          {skills.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      );
    }
    // tags
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200">
            {skill}
          </span>
        ))}
      </div>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <h3 
      className={`text-lg font-bold text-gray-900 pb-1 mb-3 uppercase tracking-wider ${getDividerStyle()}`}
      style={{ color: config.headerStyle === 'minimal' ? config.accentColor : '#111827' }}
    >
      {title}
    </h3>
  );

  return (
    <div 
      className="bg-white text-gray-800 p-8 w-full max-w-[816px] mx-auto shadow-sm relative h-auto" 
      id="resume-preview"
      style={{ fontFamily: config.fontFamily }}
    >
      {/* Dynamic Header */}
      <header className={`pb-6 mb-6 border-b border-gray-200 ${getHeaderClasses()}`}>
        <div className={config.headerStyle === 'center' ? 'text-center' : 'flex-1'}>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-1" style={{ color: config.headerStyle === 'split' ? config.accentColor : '#111827' }}>
            {data.personalInfo?.name || 'Your Name'}
          </h1>
          <h2 className="text-xl font-medium mb-3" style={{ color: config.accentColor }}>
            {data.personalInfo?.jobTitle || 'Job Title'}
          </h2>
          
          <div className={`flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 ${config.headerStyle === 'center' ? 'justify-center' : ''}`}>
            {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo?.address && <span>{data.personalInfo.address}</span>}
            {data.personalInfo?.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo?.github && <span>{data.personalInfo.github}</span>}
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-col gap-6">
        
        {/* Summary */}
        {data.summary && (
          <section>
            <SectionHeader title="Professional Summary" />
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <SectionHeader title="Experience" />
            <div className={getSpacingClass()}>
              {data.experience.map((exp, idx) => (
                <div key={exp.id || idx} className={config.timelineStyle === 'modern' ? 'pl-4 border-l-2 border-gray-200 relative' : ''}>
                  {config.timelineStyle === 'modern' && <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-400" style={{ backgroundColor: config.accentColor }}></div>}
                  
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-800">{exp.position}</h4>
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="font-medium text-sm mb-2" style={{ color: config.accentColor }}>{exp.company}</div>
                  <p className="text-gray-700 text-sm whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <SectionHeader title="Projects" />
            <div className={getSpacingClass()}>
              {data.projects.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-800">{proj.name}</h4>
                    {proj.link && <span className="text-xs text-gray-500">{proj.link}</span>}
                  </div>
                  <p className="text-gray-700 text-sm mb-2 whitespace-pre-line">{proj.description}</p>
                  {renderSkills(proj.technologies || [])}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills */}
        {data.technicalSkills && data.technicalSkills.length > 0 && (
          <section>
            <SectionHeader title="Technical Skills" />
            {renderSkills(data.technicalSkills)}
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section>
            <SectionHeader title="Education" />
            <div className={getSpacingClass()}>
              {data.education.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <h4 className="font-bold text-gray-800 text-sm">{edu.degree} in {edu.fieldOfStudy}</h4>
                  <div className="text-gray-600 text-sm">{edu.institution}</div>
                  <div className="text-xs text-gray-500 mt-1">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <SectionHeader title="Certifications" />
            <div className={getSpacingClass()}>
              {data.certifications.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-800 text-sm">{cert.name}</h4>
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap ml-4">
                      {cert.issueDate} {cert.expiryDate ? `- ${cert.expiryDate}` : ''}
                    </span>
                  </div>
                  <div className="text-gray-600 text-sm">{cert.issuer}</div>
                  {(cert.credentialId || cert.credentialUrl) && (
                    <div className="text-xs text-gray-500 mt-1">
                      {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                      {cert.credentialId && cert.credentialUrl && <span className="mx-2">|</span>}
                      {cert.credentialUrl && <span>URL: {cert.credentialUrl}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Info */}
        {data.additionalInfo && data.additionalInfo.length > 0 && (
          <section>
            <SectionHeader title="Additional Information" />
            <div className={getSpacingClass()}>
              {data.additionalInfo.map((info, idx) => (
                <div key={info.id || idx}>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{info.title}</h4>
                  <p className="text-gray-700 text-sm whitespace-pre-line">{info.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
