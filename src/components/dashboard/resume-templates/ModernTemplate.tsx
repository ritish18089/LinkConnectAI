import React from 'react';
import { ResumeData } from '../../../types/resume';

interface ModernTemplateProps {
  data: ResumeData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <div className="bg-white text-gray-900 p-10 min-h-[1056px] w-full max-w-[816px] mx-auto shadow-sm" id="resume-preview">
      {/* Header */}
      <header className="border-b-2 border-gray-900 pb-6 mb-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">{data.personalInfo.name || 'Your Name'}</h1>
          <h2 className="text-xl text-indigo-700 font-medium mb-3">{data.personalInfo.jobTitle || 'Job Title'}</h2>
          
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-700 font-medium">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo.portfolio && <span>{data.personalInfo.portfolio}</span>}
            {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
          </div>
        </div>
      </header>

      {/* Main Content - Single Column ATS Layout */}
      <div className="flex flex-col space-y-6">
        
        {/* Summary */}
        {data.summary && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Professional Summary</h3>
            <p className="text-gray-800 text-sm leading-relaxed">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wider">Experience</h3>
            <div className="space-y-5">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 text-base">{exp.position}</h4>
                    <span className="text-sm text-gray-700 font-medium">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-indigo-700 font-semibold text-sm mb-2">{exp.company}</div>
                  <p className="text-gray-800 text-sm whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wider">Projects</h3>
            <div className="space-y-5">
              {data.projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 text-base">{proj.name}</h4>
                    {proj.link && <a href={proj.link} className="text-sm text-indigo-600 hover:underline">{proj.link}</a>}
                  </div>
                  <p className="text-gray-800 text-sm mb-2 leading-relaxed">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {proj.technologies.map((tech, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-800 border border-gray-200 px-2 py-1 rounded font-medium">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills */}
        {data.technicalSkills && data.technicalSkills.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.technicalSkills.map((skill, idx) => (
                <span key={idx} className="text-sm text-gray-800 font-medium bg-gray-100 px-3 py-1.5 rounded border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wider">Education</h3>
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 text-base">{edu.degree} in {edu.fieldOfStudy}</h4>
                    <span className="text-sm text-gray-700 font-medium">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="text-indigo-700 font-semibold text-sm">{edu.institution}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Certifications</h3>
            <div className="space-y-4">
              {data.certifications.map(cert => (
                <div key={cert.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 text-base">{cert.name}</h4>
                    <span className="text-sm text-gray-700 font-medium">
                      {cert.issueDate} {cert.expiryDate ? `- ${cert.expiryDate}` : ''}
                    </span>
                  </div>
                  <div className="text-indigo-700 font-semibold text-sm">
                    {cert.issuer}
                    {cert.credentialId && <span className="ml-2 text-gray-600 font-normal">| Credential ID: {cert.credentialId}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Info */}
        {data.additionalInfo && data.additionalInfo.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Additional Information</h3>
            <ul className="list-disc list-outside ml-5 space-y-1">
              {data.additionalInfo.map((info, idx) => (
                <li key={idx} className="text-gray-800 text-sm leading-relaxed">
                  {info.title && <span className="font-semibold">{info.title}: </span>}
                  {info.description}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
