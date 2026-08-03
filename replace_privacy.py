import re

with open('src/pages/PrivacyPolicyPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_content_sections = '''<section id="introduction" className="scroll-mt-32">
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
              </section>'''

content = re.sub(r'<section id="introduction" className="scroll-mt-32">.*?</section>\s*</motion\.div>', new_content_sections + '\n            </motion.div>', content, flags=re.DOTALL)

with open('src/pages/PrivacyPolicyPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement successful")
