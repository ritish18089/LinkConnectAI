import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Bot, Network, Briefcase, Handshake, Users, Sparkles, MapPin, Mail, Phone, ArrowRight, Zap, Target, Bookmark, MessageSquare, CheckCircle, LayoutGrid, FileText, Mic, BookOpen, Settings, Languages, Loader2 } from 'lucide-react';
export default function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { name: '', email: '', subject: '', message: '' };
    let hasError = false;

    if (!formData.name.trim()) { newErrors.name = 'Name is required'; hasError = true; }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email must be valid';
      hasError = true;
    }
    if (!formData.subject.trim()) { newErrors.subject = 'Subject is required'; hasError = true; }
    if (!formData.message.trim()) { newErrors.message = 'Message is required'; hasError = true; }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(true);
    setToast(null);

    try {
      const baseUrl = (import.meta.env.VITE_API_URL || 'https://linkconnect-ai-backend.onrender.com/api/contact').replace(/\/+$/, '');
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText || response.statusText}`);
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.success) {
          setToast({ type: 'success', message: "Your message has been sent successfully." });
          setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
          setToast({ type: 'error', message: data.message || "Unable to send your message." });
        }
      } else {
        throw new Error("Unexpected response format from server.");
      }
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || "Unable to send your message. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 selection:bg-indigo-500/30 overflow-hidden font-sans">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none opacity-50 blur-[100px]" />

      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo.png" alt="LinkConnect Logo" className="h-10 w-auto object-contain" />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <a href="#home" className="hover:text-white transition-colors">Home</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/login" className="px-4 py-2 bg-white text-neutral-950 rounded-full hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10">
            Login
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section id="home" className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Networking Assistant</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Connect Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
              An AI-powered career platform that helps students and job seekers create professional resumes, prepare for interviews, improve ATS scores, and accelerate placement success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#services" className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white rounded-full font-medium transition-all">
                Learn More
              </a>
            </div>
          </motion.div>

        </section>

        <section id="about" className="max-w-7xl mx-auto px-6 py-24 border-t border-neutral-900 flex flex-col items-center">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch mb-24 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-left flex flex-col justify-center"
            >
              <div className="mb-6 flex flex-col items-center sm:items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  <Target className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-[36px] md:text-[42px] lg:text-[48px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 leading-tight tracking-tight text-center sm:text-left">
                  ABOUT LINKCONNECT AI
                </h2>
                <div className="h-0.5 w-32 bg-gradient-to-r from-blue-500 to-transparent mt-4" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">Connect Smarter. Network Better. Grow Faster.</h3>
              <div className="text-neutral-400 text-lg leading-relaxed">
                <p>
                  LinkConnect AI is an AI-powered career preparation platform that helps users build ATS-friendly resumes, analyze resumes, generate cover letters and GitHub READMEs, and prepare for placements through mock interviews, HR interviews, group discussions, and technical assessments. It provides an all-in-one, personalized environment to enhance job readiness, improve interview performance, and increase placement success.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full h-full min-h-[350px] rounded-[24px] overflow-hidden flex items-center justify-center bg-neutral-900/20 border border-neutral-800/50 group shadow-[0_0_40px_rgba(99,102,241,0.1)] hover:shadow-[0_0_60px_rgba(99,102,241,0.15)] transition-shadow duration-700"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 z-10 opacity-50 mix-blend-overlay pointer-events-none group-hover:opacity-70 transition-opacity duration-700" />

              <motion.img
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                src="/dash2.png"
                alt="LinkConnect AI Dashboard Mockup"
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 transform backdrop-blur-sm"
                loading="lazy"
              />

              {/* Subtle glassmorphism overlay to blend with dark theme */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[24px] pointer-events-none" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <li className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 bg-neutral-900/30 border border-neutral-800 p-8 rounded-3xl hover:bg-neutral-900/50 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0"><Bot className="w-7 h-7" /></div>
                <div>
                  <h5 className="text-xl font-bold text-white mb-2">AI Career Assistant</h5>
                  <p className="text-neutral-400 text-sm leading-relaxed">Get AI-powered assistance for resumes, cover letters, interview preparation, README generation, and placement guidance—all in one platform.</p>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 bg-neutral-900/30 border border-neutral-800 p-8 rounded-3xl hover:bg-neutral-900/50 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0"><Target className="w-7 h-7" /></div>
                <div>
                  <h5 className="text-xl font-bold text-white mb-2">Complete Placement Preparation</h5>
                  <p className="text-neutral-400 text-sm leading-relaxed">Practice MCQ assessments, mock interviews, HR interviews, group discussions, and resume analysis to prepare confidently for placements.</p>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 bg-neutral-900/30 border border-neutral-800 p-8 rounded-3xl hover:bg-neutral-900/50 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0"><Zap className="w-7 h-7" /></div>
                <div>
                  <h5 className="text-xl font-bold text-white mb-2">Smart Resume & ATS Tools</h5>
                  <p className="text-neutral-400 text-sm leading-relaxed">Build ATS-friendly resumes, analyze resume scores, generate cover letters, and create professional GitHub README files with AI.</p>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 bg-neutral-900/30 border border-neutral-800 p-8 rounded-3xl hover:bg-neutral-900/50 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center flex-shrink-0"><Bookmark className="w-7 h-7" /></div>
                <div>
                  <h5 className="text-xl font-bold text-white mb-2">Progress Tracking & Career Growth</h5>
                  <p className="text-neutral-400 text-sm leading-relaxed">Monitor your placement journey with personalized insights, activity history, saved templates, notifications, and continuous skill improvement.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </section>

        <section id="services" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Services</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Everything you need to grow your professional network effectively.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              icon={<LayoutGrid className="w-6 h-6 text-cyan-400" />}
              title="Browse Templates"
              description="Generate highly personalized LinkedIn connection requests based on templates."
            />
            <ServiceCard
              icon={<Bot className="w-6 h-6 text-green-400" />}
              title="AI Assistant"
              description="Get AI-powered assistance for resumes, interviews, career guidance, and professional writing."
            />
            <ServiceCard
              icon={<FileText className="w-6 h-6 text-purple-400" />}
              title="Resume Templates"
              description="Create, edit, customize, and download professional ATS-friendly resumes with ease."
            />
            <ServiceCard
              icon={<Target className="w-6 h-6 text-orange-400" />}
              title="Placement Support"
              description="Practice MCQs, group discussions, and HR interviews to improve placement readiness."
            />
            <ServiceCard
              icon={<Mic className="w-6 h-6 text-yellow-400" />}
              title="Mock Interview"
              description="Experience realistic AI-powered mock interviews with voice interaction and personalized feedback."
            />
            <ServiceCard
              icon={<Sparkles className="w-6 h-6 text-pink-400" />}
              title="Resume Analyzer"
              description="Analyze your resume against job descriptions and receive ATS scores with AI-driven improvement suggestions."
            />
            <ServiceCard
              icon={<BookOpen className="w-6 h-6 text-indigo-400" />}
              title="README Generator"
              description="Generate professional GitHub Profile and Project README files instantly using AI."
            />
            <ServiceCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Cover Letter Generator"
              description="Create personalized, ATS-friendly cover letters tailored to your target company and role."
            />

            <ServiceCard
              icon={<Bookmark className="w-6 h-6 text-emerald-400" />}
              title="Saved Templates"
              description="Store and quickly access your favorite resumes, cover letters, and generated documents."
            />

            <ServiceCard
              icon={<Users className="w-6 h-6 text-sky-400" />}
              title="Profile"
              description="Manage your personal information, career progress, notifications, and account settings."
            />
            <ServiceCard
              icon={<Settings className="w-6 h-6 text-gray-400" />}
              title="Settings"
              description="Customize your application preferences, language, theme, and account configuration."
            />
            <ServiceCard
              icon={<Languages className="w-6 h-6 text-teal-400" />}
              title="App Language"
              description="Use LinkConnect AI in your preferred language with seamless multilingual support."
            />
          </div>
        </section>

        <section id="contact" className="max-w-7xl mx-auto px-6 py-24 border-t border-neutral-900">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in touch</h2>
              <p className="text-neutral-400 mb-8 max-w-md">Have questions about our enterprise plans or need support? Reach out to our team.</p>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-neutral-300">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>ritish1808@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 text-neutral-300">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>+91 9019854584</span>
                </div>
                <div className="flex items-center gap-4 text-neutral-300">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>Bengaluru, India</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-8 rounded-2xl">
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                {toast && (
                  <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : null}
                    {toast.message}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="How can we help?"
                  />
                  {errors.subject && <p className="text-red-400 text-xs">{errors.subject}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Message</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Your message..."
                  />
                  {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
                </div>
                <button
                  disabled={isSubmitting}
                  className="w-full py-3 bg-white text-neutral-950 rounded-lg font-medium hover:bg-neutral-200 transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-900 py-12 text-center text-neutral-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          <div className="flex justify-center md:justify-start gap-6">
            <a
              href="https://www.linkedin.com/in/ritishkannur/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-blue-500 hover:scale-110 transition-all duration-300 cursor-pointer"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/ritish1808/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-pink-500 hover:scale-110 transition-all duration-300 cursor-pointer"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <div className="flex justify-center">
            <p>© 2026 LinkConnect AI. All rights reserved.</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link to="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl hover:bg-neutral-800/50 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
