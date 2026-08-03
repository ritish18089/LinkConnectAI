export interface PersonalInfo {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  portfolio: string;
  github: string;
  profilePhoto?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  technologies: string[];
}

export interface Internship {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface VolunteerWork {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  position: string;
  contact: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // e.g., Native, Fluent, Intermediate, Beginner
}

export interface AdditionalInfo {
  id: string;
  title: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string[];
  technicalSkills: string[];
  softSkills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  internships: Internship[];
  certifications: Certification[];
  languages: Language[];
  interests: string[];
  volunteerWork: VolunteerWork[];
  references: Reference[];
  additionalInfo: AdditionalInfo[];
  customSections?: any[];
}

export interface DesignConfig {
  fontFamily: string;
  accentColor: string;
  headerStyle: 'center' | 'left' | 'split' | 'minimal';
  dividerStyle: 'solid' | 'dashed' | 'none' | 'thick';
  timelineStyle: 'classic' | 'modern' | 'minimal' | 'dotted';
  skillStyle: 'tags' | 'comma' | 'bullets';
  spacing: 'compact' | 'normal' | 'relaxed';
}

export interface ResumeTemplateMeta {
  id: string;
  name: string;
  category: string; // 'IT' or 'Non-IT'
  thumbnail: string;
  isModern?: boolean;
  isAtsFriendly?: boolean;
  atsRating?: number;
  defaultContent?: ResumeData;
  designConfig?: DesignConfig;
}
