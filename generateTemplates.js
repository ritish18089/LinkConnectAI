import fs from 'fs';

const templates = [];

const sampleITContent = {
  personalInfo: { name: 'Alex Johnson', jobTitle: 'Senior Software Engineer', email: 'alex.johnson@example.com', phone: '+1 (555) 123-4567', address: 'San Francisco, CA', linkedin: 'linkedin.com/in/alexj', portfolio: 'alexj.dev', github: 'github.com/alexj' },
  summary: 'Results-driven Senior Software Engineer with over 6 years of experience in developing scalable web applications. Proficient in React, Node.js, and cloud technologies (AWS). Adept at leading high-performing teams, optimizing performance, and delivering robust software solutions in agile environments.',
  skills: ['System Design', 'Agile Methodologies', 'CI/CD', 'Problem Solving', 'Team Leadership'],
  technicalSkills: ['JavaScript/TypeScript', 'React.js', 'Node.js', 'Python', 'AWS (EC2, S3, Lambda)', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB'],
  experience: [
    { id: '1', company: 'TechNova Solutions', position: 'Senior Software Engineer', startDate: 'Mar 2021', endDate: 'Present', current: true, description: '• Spearheaded the migration of a legacy monolithic application to a microservices architecture, improving system scalability by 40%.\n• Mentored a team of 5 junior developers, conducting code reviews and pair programming sessions.\n• Implemented automated CI/CD pipelines using GitHub Actions, reducing deployment times by 50%.' },
    { id: '2', company: 'DataStream Inc', position: 'Full Stack Developer', startDate: 'Jun 2018', endDate: 'Feb 2021', current: false, description: '• Developed and maintained 3 high-traffic React applications serving over 100k daily active users.\n• Optimized database queries and API endpoints, resulting in a 30% reduction in average page load time.\n• Collaborated closely with the UI/UX team to implement responsive and accessible design systems.' }
  ],
  education: [
    { id: '1', institution: 'University of California, Berkeley', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', startDate: 'Sep 2014', endDate: 'May 2018', description: 'Graduated with Honors (3.8 GPA). Relevant Coursework: Data Structures, Algorithms, Distributed Systems.' }
  ],
  projects: [
    { id: '1', name: 'E-Commerce Platform Redesign', description: 'Led the frontend rebuild of a major e-commerce platform using Next.js and Tailwind CSS, improving Lighthouse performance score to 98.', link: 'github.com/alexj/ecommerce', technologies: ['Next.js', 'React', 'Tailwind', 'Stripe'] },
    { id: '2', name: 'Real-time Analytics Dashboard', description: 'Built a real-time dashboard for monitoring server metrics using WebSockets and D3.js.', link: '', technologies: ['Node.js', 'Socket.io', 'D3.js'] }
  ],
  certifications: [
    { id: '1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', issueDate: 'Oct 2022', expiryDate: 'Oct 2025', credentialId: 'AWS-12345', credentialUrl: 'aws.amazon.com/verify' },
    { id: '2', name: 'Meta Front-End Developer', issuer: 'Coursera', issueDate: 'Jan 2021', expiryDate: '', credentialId: 'META-9876', credentialUrl: '' }
  ],
  additionalInfo: [
    { id: '1', title: 'Awards', description: '• Best Innovation Award, DataStream Inc (2020)\n• Hackathon Winner, TechNova (2022)' }
  ]
};

const sampleNonITContent = {
  personalInfo: { name: 'Sarah Miller', jobTitle: 'Marketing Manager', email: 'sarah.miller@example.com', phone: '+1 (555) 987-6543', address: 'New York, NY', linkedin: 'linkedin.com/in/sarahm', portfolio: 'sarahportfolio.com', github: '' },
  summary: 'Dynamic and creative Marketing Manager with over 8 years of experience driving multi-channel marketing campaigns. Proven track record of increasing brand awareness, generating leads, and maximizing ROI. Skilled in digital marketing, content strategy, and team leadership.',
  skills: ['Digital Marketing', 'Content Strategy', 'SEO & SEM', 'Social Media Management', 'Campaign Analytics', 'Brand Development'],
  technicalSkills: ['Google Analytics', 'HubSpot', 'Salesforce', 'Mailchimp', 'Adobe Creative Suite', 'WordPress'],
  experience: [
    { id: '1', company: 'Global Brands Media', position: 'Marketing Manager', startDate: 'Jan 2020', endDate: 'Present', current: true, description: '• Developed and executed a comprehensive digital marketing strategy that increased lead generation by 45% year-over-year.\n• Managed a marketing budget of $500k, consistently delivering campaigns below budget while exceeding KPI targets.\n• Led a team of 4 marketing specialists, overseeing content creation, SEO optimization, and social media outreach.' },
    { id: '2', company: 'Creative Horizons', position: 'Digital Marketing Specialist', startDate: 'Aug 2016', endDate: 'Dec 2019', current: false, description: '• Launched 3 successful email marketing campaigns that yielded an average open rate of 28% and a 12% conversion rate.\n• Managed corporate social media accounts, growing the total follower base by 150% across platforms.\n• Collaborated with sales teams to create cohesive promotional materials and landing pages.' }
  ],
  education: [
    { id: '1', institution: 'New York University', degree: 'Bachelor of Business Administration', fieldOfStudy: 'Marketing', startDate: 'Sep 2012', endDate: 'May 2016', description: 'Vice President of the NYU Marketing Club.' }
  ],
  projects: [
    { id: '1', name: 'Q4 Product Launch Campaign', description: 'Coordinated the go-to-market strategy for a flagship product, resulting in $2M in revenue within the first quarter.', link: '', technologies: ['HubSpot', 'Google Ads'] }
  ],
  certifications: [
    { id: '1', name: 'Google Analytics Individual Qualification', issuer: 'Google', issueDate: 'Mar 2021', expiryDate: 'Mar 2024', credentialId: 'GA-999', credentialUrl: 'google.com/verify' },
    { id: '2', name: 'HubSpot Content Marketing', issuer: 'HubSpot', issueDate: 'Jul 2019', expiryDate: '', credentialId: 'HS-444', credentialUrl: '' }
  ],
  additionalInfo: [
    { id: '1', title: 'Publications', description: 'Featured in "Modern Marketing Weekly" for innovative campaign strategies (2022).' }
  ]
};

// Design Configuration Options
const fonts = ['Inter', 'Roboto', 'Lora', 'Merriweather', 'Playfair Display', 'Poppins', 'Montserrat', 'Lato', 'Open Sans', 'Nunito'];
const colors = ['#4F46E5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#3b82f6'];
const headerStyles = ['center', 'left', 'split', 'minimal'];
const dividerStyles = ['solid', 'dashed', 'none', 'thick'];
const timelineStyles = ['classic', 'modern', 'minimal', 'dotted'];
const skillStyles = ['tags', 'comma', 'bullets'];
const spacings = ['compact', 'normal', 'relaxed'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateConfig() {
  return {
    fontFamily: `${getRandomItem(fonts)}, sans-serif`,
    accentColor: getRandomItem(colors),
    headerStyle: getRandomItem(headerStyles),
    dividerStyle: getRandomItem(dividerStyles),
    timelineStyle: getRandomItem(timelineStyles),
    skillStyle: getRandomItem(skillStyles),
    spacing: getRandomItem(spacings)
  };
}

// Generate 10 IT Templates
for (let i = 1; i <= 10; i++) {
  templates.push({
    id: `it-template-${i}`,
    name: `IT Template ${i}`,
    category: 'IT',
    thumbnail: `https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80`,
    isModern: Math.random() > 0.5,
    isAtsFriendly: true,
    atsRating: Math.floor(Math.random() * 10) + 90, // 90-99
    defaultContent: sampleITContent,
    designConfig: generateConfig()
  });
}

// Generate 10 Non-IT Templates
for (let i = 1; i <= 10; i++) {
  templates.push({
    id: `non-it-template-${i}`,
    name: `Non-IT Template ${i}`,
    category: 'Non-IT',
    thumbnail: `https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80`,
    isModern: Math.random() > 0.5,
    isAtsFriendly: true,
    atsRating: Math.floor(Math.random() * 10) + 90, // 90-99
    defaultContent: sampleNonITContent,
    designConfig: generateConfig()
  });
}

fs.writeFileSync('src/data/resumeTemplates.json', JSON.stringify(templates, null, 2));
console.log("Generated 20 uniquely configured templates with rich placeholder content!");
