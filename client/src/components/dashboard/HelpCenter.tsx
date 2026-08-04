import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Book, MessageCircle, ChevronRight, FileText, Activity, Mail, Bot, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Linkedin = ({ className }: { className?: string }) => (
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


export default function HelpCenter() {
  const { t } = useTranslation();

  const faqs = [
    { question: 'How to create a resume?', answer: 'Navigate to the Resume Builder section from the dashboard, select a template, and fill in your professional details.' },
    { question: 'How does Resume Analysis work?', answer: 'Upload your existing resume in the Resume Analyzer section. Our AI will evaluate it against industry standards and provide actionable feedback.' },
    { question: 'How to generate a Cover Letter?', answer: 'Go to the Cover Letter section, provide the job description and your relevant experience, and our AI will generate a tailored cover letter.' },
    { question: 'How to use the AI Career Assistant?', answer: 'Access the AI Assistant from the sidebar. You can chat with it for career advice, interview tips, or networking strategies.' },
    { question: 'How to connect a LinkedIn account?', answer: 'Currently, LinkedIn connection is available during sign-up or login via the "Continue with LinkedIn" button.' },
    { question: 'How to reset the password?', answer: 'Go to Settings > Security Settings and enter your new password, or use the "Forgot Password" link on the login page if you are logged out.' }
  ];

  const guides = [
    { title: 'Getting Started', icon: <Book className="w-5 h-5" /> },
    { title: 'Resume Builder Guide', icon: <FileText className="w-5 h-5" /> },
    { title: 'Resume Analysis Guide', icon: <Activity className="w-5 h-5" /> },
    { title: 'AI Career Assistant Guide', icon: <Bot className="w-5 h-5" /> },
    { title: 'LinkedIn Assistant Guide', icon: <Linkedin className="w-5 h-5" /> },
    { title: 'Interview Preparation Guide', icon: <MessageCircle className="w-5 h-5" /> }
  ];

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.help_center', 'Help Center')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-8 space-y-6"
        >
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 hover:border-indigo-500/50 transition-colors">
                    <h3 className="text-base font-semibold text-white mb-2">{faq.question}</h3>
                    <p className="text-sm text-neutral-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Guides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl overflow-hidden relative">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Book className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">User Guide</h2>
              </div>

              <div className="space-y-3">
                {guides.map((guide, index) => (
                  <button key={index} className="w-full flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-xl hover:bg-neutral-800 hover:border-neutral-700 transition-all group">
                    <div className="flex items-center gap-3 text-neutral-300 group-hover:text-white">
                      <div className="text-purple-400">
                        {guide.icon}
                      </div>
                      <span className="text-sm font-medium text-left">{guide.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
