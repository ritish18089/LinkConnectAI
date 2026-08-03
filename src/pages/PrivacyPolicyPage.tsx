import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Search, Shield, Info, Database, Lock, Share2, Globe, UserCheck, Clock, ShieldAlert, FileEdit, Mail, ArrowUp } from 'lucide-react';
import { Link } from 'react-router';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SECTIONS = [
  { id: 'introduction', title: '1. Introduction', icon: Info },
  { id: 'information-we-collect', title: '2. Information We Collect', icon: Database },
  { id: 'how-we-use', title: '3. How We Use Your Information', icon: UserCheck },
  { id: 'ai-processing', title: '4. AI Processing', icon: Bot },
  { id: 'file-uploads', title: '5. File Uploads', icon: Database },
  { id: 'data-storage', title: '6. Data Storage', icon: Database },
  { id: 'security', title: '7. Security', icon: Lock },
  { id: 'third-party', title: '8. Third-Party Services', icon: Globe },
  { id: 'cookies', title: '9. Cookies & Local Storage', icon: Database },
  { id: 'user-rights', title: '10. User Rights', icon: Shield },
  { id: 'childrens-privacy', title: '11. Children\'s Privacy', icon: ShieldAlert },
  { id: 'policy-updates', title: '12. Policy Updates', icon: FileEdit },
  { id: 'contact', title: '13. Contact', icon: Mail },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 400);

      // Update active section based on scroll position
      const sections = SECTIONS.map(s => document.getElementById(s.id));
      let currentActive = SECTIONS[0].id;
      
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            currentActive = section.id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const filteredSections = SECTIONS.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 selection:bg-indigo-500/30 overflow-hidden font-sans pb-24 relative">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none opacity-50 blur-[100px]" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800 h-20 flex items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="LinkConnect Logo" className="h-10 w-auto object-contain" />
        </Link>
        <Link to="/" className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white rounded-lg text-sm font-medium transition-colors">
          Back to Home
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        
        {/* Hero Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
              Privacy Policy
            </h1>
            <p className="text-neutral-400 text-lg mb-8">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search privacy policy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-neutral-500"
              />
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar TOC (Desktop) */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4 px-3">
                Contents
              </h3>
              {filteredSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                    activeSection === section.id 
                      ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-indigo-400' : 'text-neutral-500'}`} />
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-16"
            >
              
              <section id="introduction" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Info className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">1. Introduction</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>
                    Welcome to LinkConnect AI. We respect your privacy and are committed to protecting your personal data. LinkConnect AI is an AI-powered career development platform designed to help you build ATS-friendly resumes, analyze your profile, generate cover letters and READMEs, and prepare for placements. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our platform.
                  </p>
                </div>
              </section>

              <section id="information-we-collect" className="scroll-mt-32 mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Database className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>We collect the following types of information to provide you with a comprehensive career development experience:</p>
                  <ul className="space-y-2 list-disc pl-5 mt-4">
                    <li><strong>Personal Details:</strong> Full Name, Email Address, Phone Number, and Location.</li>
                    <li><strong>Professional Profiles:</strong> LinkedIn Profile, GitHub Profile, and Portfolio Website links.</li>
                    <li><strong>Documents:</strong> Resume Uploads (PDF/DOCX), generated Cover Letters, and generated README Files.</li>
                    <li><strong>User Preferences:</strong> Profile Information, Account Preferences, Language Preferences, and Notifications settings.</li>
                    <li><strong>Activity Data:</strong> Interview Responses, Assessment Data, and Placement Progress.</li>
                  </ul>
                </div>
              </section>

              <section id="how-we-use" className="scroll-mt-32 mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>Your information is used strictly to deliver and enhance our platform's capabilities, including:</p>
                  <ul className="space-y-2 list-disc pl-5 mt-4">
                    <li>Generating ATS-friendly resumes and analyzing uploaded resumes.</li>
                    <li>Generating customized Cover Letters and GitHub Profile/Project READMEs.</li>
                    <li>Conducting AI-driven HR Interviews, Mock Interviews, and Group Discussions.</li>
                    <li>Generating personalized AI responses for career assistance.</li>
                    <li>Tracking your placement progress and saving your user history.</li>
                    <li>Improving overall application performance and user experience.</li>
                  </ul>
                </div>
              </section>

              <section id="ai-processing" className="scroll-mt-32 mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">4. AI Processing</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>
                    As an AI-first platform, we utilize advanced artificial intelligence models to process specific data for generating requested outputs. We process the following through our AI services:
                  </p>
                  <ul className="space-y-2 list-disc pl-5 mt-4">
                    <li>Resume data and Job descriptions for tailoring and analysis.</li>
                    <li>Cover Letter and README requests.</li>
                    <li>Interview conversations during mock sessions.</li>
                  </ul>
                  <p className="mt-4 text-sm text-neutral-500 italic">Note: AI processing is exclusively used for generating your requested outputs and providing personalized feedback.</p>
                </div>
              </section>

              <section id="file-uploads" className="scroll-mt-32 mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Database className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">5. File Uploads</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>
                    We provide secure handling of your uploaded files, including PDF and DOCX formats. Your resume files and parsed data are processed securely and are only accessed by the system to perform analysis and generation tasks.
                  </p>
                </div>
              </section>

              <section id="data-storage" className="scroll-mt-32 mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Database className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">6. Data Storage</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>
                    To provide a seamless experience across sessions, your generated content and user preferences may be securely stored in our databases. This includes:
                  </p>
                  <ul className="space-y-2 list-disc pl-5 mt-4">
                    <li>Saved Templates, Resume History, README History, and Cover Letter History.</li>
                    <li>Notifications, Profile Settings, Language Preferences, and Progress Tracking.</li>
                  </ul>
                </div>
              </section>

              <section id="security" className="scroll-mt-32 mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">7. Security</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>
                    We employ industry-standard security practices, including data encryption in transit and at rest, strict access controls, and secure authentication mechanisms to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
              </section>

              <section id="third-party" className="scroll-mt-32 mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">8. Third-Party Services</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>
                    We may use trusted third-party providers to facilitate our platform's capabilities. These services include:
                  </p>
                  <ul className="space-y-2 list-disc pl-5 mt-4">
                    <li><strong>AI Services:</strong> For processing text, generating documents, and handling conversational interactions.</li>
                    <li><strong>Infrastructure:</strong> For Authentication, Cloud Database hosting, and File Storage.</li>
                    <li><strong>Analytics:</strong> To understand user behavior and improve platform performance.</li>
                  </ul>
                </div>
              </section>

              <section id="cookies" className="scroll-mt-32 mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Database className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">9. Cookies & Local Storage</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>
                    LinkConnect AI uses cookies and local storage technologies to ensure the platform functions properly and to improve your user experience. These are used specifically for:
                  </p>
                  <ul className="space-y-2 list-disc pl-5 mt-4">
                    <li>Maintaining Authentication state securely.</li>
                    <li>Storing Theme and Language Preferences.</li>
                    <li>Remembering general user settings for an improved experience.</li>
                  </ul>
                </div>
              </section>

              <section id="user-rights" className="scroll-mt-32 mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">10. User Rights</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>You maintain full control over your data within LinkConnect AI. You have the right to:</p>
                  <ul className="space-y-2 list-disc pl-5 mt-4">
                    <li>View and Edit your Profile information.</li>
                    <li>Delete Saved Documents and Saved Templates from your history.</li>
                    <li>Manage your Notifications and Change application Settings.</li>
                    <li>Request full Account Deletion, which permanently removes your data from our systems.</li>
                  </ul>
                </div>
              </section>

              <section id="childrens-privacy" className="scroll-mt-32 mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">11. Children's Privacy</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>
                    LinkConnect AI is designed and intended for students, graduates, and professionals. We do not knowingly collect or solicit personal information from children under the applicable age of consent.
                  </p>
                </div>
              </section>

              <section id="policy-updates" className="scroll-mt-32 mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <FileEdit className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">12. Policy Updates</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                  <p>
                    This Privacy Policy may be updated periodically to reflect changes in our platform's features, data practices, or legal requirements. We encourage you to review this page occasionally. Your continued use of the platform constitutes your agreement to any updated terms.
                  </p>
                </div>
              </section>

              <section id="contact" className="scroll-mt-32 mt-16 mb-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-semibold">13. Contact</h2>
                </div>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400 bg-neutral-900/30 p-6 rounded-2xl border border-neutral-800">
                  <p>
                    If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please visit our Support or Contact page to reach out to our team.
                  </p>
                  <p className="mt-4">
                    <Link to="/contact" className="text-indigo-400 hover:text-indigo-300 font-medium">Contact Support &rarr;</Link>
                  </p>
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Back to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
