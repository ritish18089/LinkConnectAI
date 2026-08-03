import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft,
  Users,
  Target,
  Clock,
  Play,
  Monitor
} from 'lucide-react';
import VirtualGDRoom from './VirtualGDRoom';

export interface GDTopic {
  id: number;
  title: string;
  focus: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  durationMins: number;
}

const GD_TOPICS: GDTopic[] = [
  {
    id: 1,
    title: 'Will Artificial Intelligence Replace Human Jobs?',
    focus: ['AI', 'Automation', 'Future of Work', 'Upskilling'],
    difficulty: 'Medium',
    durationMins: 10
  },
  {
    id: 2,
    title: 'Remote Work vs Work from Office – Which is Better?',
    focus: ['Productivity', 'Collaboration', 'Work-Life Balance'],
    difficulty: 'Easy',
    durationMins: 10
  },
  {
    id: 3,
    title: 'Should Social Media Be Regulated?',
    focus: ['Fake News', 'Privacy', 'Freedom of Speech', 'Cyber Safety'],
    difficulty: 'Medium',
    durationMins: 10
  },
  {
    id: 4,
    title: "India's Startup Ecosystem – Opportunity or Bubble?",
    focus: ['Entrepreneurship', 'Funding', 'Innovation', 'Employment'],
    difficulty: 'Hard',
    durationMins: 15
  },
  {
    id: 5,
    title: 'Is ChatGPT and Generative AI Good for Students?',
    focus: ['Learning', 'Ethics', 'Plagiarism', 'Productivity'],
    difficulty: 'Easy',
    durationMins: 10
  },
  {
    id: 6,
    title: 'Electric Vehicles (EVs): Are They the Future of Transportation?',
    focus: ['Sustainability', 'Infrastructure', 'Affordability'],
    difficulty: 'Medium',
    durationMins: 10
  },
  {
    id: 7,
    title: 'Data Privacy vs National Security',
    focus: ['Digital Privacy', 'Surveillance', 'Cyber Security'],
    difficulty: 'Hard',
    durationMins: 15
  },
  {
    id: 8,
    title: 'Skill-Based Education vs Degree-Based Education',
    focus: ['Employability', 'Practical Skills', 'Higher Education'],
    difficulty: 'Easy',
    durationMins: 10
  },
  {
    id: 9,
    title: 'Can India Become a Global Technology Leader by 2030?',
    focus: ['Artificial Intelligence', 'Semiconductor Industry', 'Startups', 'Digital Economy'],
    difficulty: 'Hard',
    durationMins: 15
  },
  {
    id: 10,
    title: 'Climate Change: Who Is More Responsible—Governments, Companies, or Individuals?',
    focus: ['Environmental Policies', 'Corporate Responsibility', 'Public Awareness'],
    difficulty: 'Medium',
    durationMins: 15
  }
];

export default function GroupDiscussion() {
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState<GDTopic | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  if (activeTopic && selectedDuration) {
    return (
      <VirtualGDRoom 
        topic={activeTopic} 
        durationMins={selectedDuration}
        onExit={() => { setActiveTopic(null); setSelectedDuration(null); }} 
      />
    );
  }

  if (activeTopic && !selectedDuration) {
    return (
      <div className="max-w-4xl mx-auto pb-12 text-center">
        <button onClick={() => setActiveTopic(null)} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors w-fit mx-auto">
          <ArrowLeft className="w-4 h-4" /> Back to Topics
        </button>
        
        <h2 className="text-3xl font-bold text-white mb-4">Select Discussion Duration</h2>
        <p className="text-neutral-400 mb-12">How long would you like the virtual GD room to last for: "{activeTopic.title}"?</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[5, 10, 15, 20].map(mins => (
            <button 
              key={mins}
              onClick={() => setSelectedDuration(mins)}
              className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center gap-4 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8" />
              </div>
              <span className="text-xl font-bold text-white">{mins} Minutes</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <button onClick={() => navigate('/dashboard/placement')} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Placement Support
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-emerald-500" />
          Group Discussion Practice
        </h2>
        <p className="text-neutral-400 text-lg">Simulate a real 5-person panel GD with intelligent AI participants and get detailed feedback.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GD_TOPICS.map(topic => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all group flex flex-col"
          >
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{topic.title}</h3>
            
            <div className="mb-4">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Focus Areas</span>
              <div className="flex flex-wrap gap-2">
                {topic.focus.map((f, i) => (
                  <span key={i} className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded text-xs">{f}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-400 mt-auto pt-4 border-t border-neutral-800 mb-6">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" /> {topic.difficulty}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {topic.durationMins} Mins
              </span>
            </div>

            <button 
              onClick={() => setActiveTopic(topic)}
              className="w-full py-3 bg-neutral-800 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Monitor className="w-4 h-4" /> Start Discussion
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
