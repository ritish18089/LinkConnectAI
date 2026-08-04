import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Mail, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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



  return (
    <div className="space-y-8 pb-12 px-4 sm:px-0 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.help_center', 'Help Center')}</h1>
      </div>

      <div className="space-y-8">
        
        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
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

      </div>
    </div>
  );
}
