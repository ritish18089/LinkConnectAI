import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft,
  Briefcase,
  UploadCloud,
  FileText,
  Loader2,
  Mic,
  StopCircle,
  Volume2,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Radio
} from 'lucide-react';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';

// Setup SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  speaker: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
}

export default function HRInterview() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [step, setStep] = useState<'upload' | 'interview' | 'evaluation'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState('AI HR Recruiter');
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  const [liveTranscript, setLiveTranscript] = useState('');
  const liveTranscriptRef = useRef('');
  const isRecordingRef = useRef(false);
  
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Fixed 45 mins duration
  const DURATION_MINS = 45;
  const [timeLeft, setTimeLeft] = useState(DURATION_MINS * 60);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Resume Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      alert("Please upload a PDF or DOCX file.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await fetch('http://localhost:3000/api/parse-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setResumeText(data.text);
        startInterview(data.text);
      } else {
        alert("Failed to parse resume: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while uploading the resume.");
    } finally {
      setIsUploading(false);
    }
  };

  const startInterview = async (parsedResume: string) => {
    setStep('interview');
    setStartTime(Date.now());
    
    const introText = "Hello, welcome to today's HR interview. I have received your resume and I'm looking forward to learning more about you. To start, could you please tell me a little bit about yourself?";
    addMessage('AI HR Recruiter', 'ai', introText);
    
    // Slight delay to allow UI to mount before speaking
    setTimeout(async () => {
      await speakText(introText);
      setCurrentSpeaker('You (Candidate)');
    }, 1000);
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        
        if (final) {
          liveTranscriptRef.current = (liveTranscriptRef.current + ' ' + final).trim();
        }
        setLiveTranscript((liveTranscriptRef.current + ' ' + interim).trim());
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
           isRecordingRef.current = false;
           setIsRecording(false);
        }
      };

      recognition.onend = () => {
        if (isRecordingRef.current) {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.error("Speech Recognition not supported in this browser.");
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (step !== 'interview') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const addMessage = (speaker: string, role: 'ai' | 'user', content: string) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      speaker,
      role,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const speakText = (text: string) => {
    return new Promise<void>((resolve) => {
      setIsAiSpeaking(true);
      if (synthRef.current) {
        synthRef.current.cancel(); 
        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = synthRef.current.getVoices();
        if (voices.length > 0) {
          utterance.voice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Female')) || voices[0];
        }
        
        utterance.rate = 0.95;
        
        utterance.onend = () => {
          setIsAiSpeaking(false);
          resolve();
        };
        
        utterance.onerror = () => {
          setIsAiSpeaking(false);
          resolve();
        };

        synthRef.current.speak(utterance);
      } else {
        setIsAiSpeaking(false);
        resolve();
      }
    });
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // AI Turn Handling
  useEffect(() => {
    if (step !== 'interview' || isEvaluating) return;

    if (currentSpeaker === 'AI HR Recruiter' && messages.length > 1) {
      const fetchAIResponse = async () => {
        try {
          const res = await fetch('http://localhost:3000/api/hr-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resumeText,
              messages
            })
          });
          const data = await res.json();
          if (data.success) {
            addMessage('AI HR Recruiter', 'ai', data.reply);
            await speakText(data.reply);
          } else {
            const fallback = "Thank you for sharing that. Could you elaborate a bit more?";
            addMessage('AI HR Recruiter', 'ai', fallback);
            await speakText(fallback);
          }
        } catch (e) {
          const fallback = "I see. How did that experience shape your career goals?";
          addMessage('AI HR Recruiter', 'ai', fallback);
          await speakText(fallback);
        }
        
        if (!isEvaluating) {
          setCurrentSpeaker('You (Candidate)');
        }
      };
      
      setTimeout(fetchAIResponse, 500);
    }
  }, [currentSpeaker, step, isEvaluating]);

  const toggleRecording = () => {
    if (isAiSpeaking || currentSpeaker !== 'You (Candidate)' || isEvaluating) return;
    
    if (isRecording) {
      isRecordingRef.current = false;
      setIsRecording(false);
      recognitionRef.current?.stop();
      
      const finalMsg = liveTranscriptRef.current || liveTranscript;
      if (finalMsg.trim()) {
        addMessage('You (Candidate)', 'user', finalMsg.trim());
        setCurrentSpeaker('AI HR Recruiter');
      }
      liveTranscriptRef.current = '';
      setLiveTranscript('');
    } else {
      liveTranscriptRef.current = '';
      setLiveTranscript('');
      isRecordingRef.current = true;
      setIsRecording(true);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const endInterview = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    if (synthRef.current) synthRef.current.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
    
    setCurrentSpeaker('AI HR Recruiter');
    const endText = 'Thank you for your time today. That concludes our interview. I will now process your evaluation report.';
    addMessage('AI HR Recruiter', 'ai', endText);
    await speakText(endText);
    
    setStep('evaluation');
    
    try {
      const res = await fetch('http://localhost:3000/api/hr-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      const data = await res.json();
      if (data.success) {
        setEvaluation(data.evaluation);
        saveProgress(data.evaluation);
      }
    } catch (e) {
      console.error(e);
      setEvaluation({
        score: 75,
        strengths: ["Good communication", "Professional tone"],
        weaknesses: ["Could provide more specific examples"],
        improvementAreas: ["Use the STAR method for behavioral answers"],
        recommendedAnswers: ["Focus on measurable impact in previous roles."],
        interviewReadinessLevel: "Needs Improvement"
      });
    }
  };

  const saveProgress = async (evalData: any) => {
    if (!user || !startTime) return;
    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      await supabase.from('hr_interview_sessions').insert({
        user_id: user.id,
        resume_text: resumeText,
        duration_selected: DURATION_MINS,
        messages,
        score: evalData.score,
        feedback: evalData
      });

      const { data: existing } = await supabase
        .from('placement_user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (existing) {
        await supabase
          .from('placement_user_progress')
          .update({
            time_spent_minutes: existing.time_spent_minutes + Math.ceil(durationSeconds / 60)
          })
          .eq('user_id', user.id);
      }
    } catch (e) {
      console.error("Failed saving HR session", e);
    }
  };

  // RENDER UPLOAD STEP
  if (step === 'upload') {
    return (
      <div className="max-w-4xl mx-auto pb-12 text-center">
        <button onClick={() => navigate('/dashboard/placement')} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Placement Support
        </button>
        
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Voice-Based HR Interview</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Experience a realistic, 45-minute behavioral interview with our AI HR Recruiter. 
            No typing allowed—just speak naturally. Please upload your latest resume to begin.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <input 
            type="file" 
            accept=".pdf,.docx" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-neutral-900 border-2 border-dashed border-neutral-700 hover:border-purple-500 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 transition-all group disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-10 h-10" />
              </div>
            )}
            
            <div>
              <span className="text-xl font-bold text-white block mb-2">
                {isUploading ? 'Analyzing Resume...' : 'Upload Resume'}
              </span>
              <span className="text-sm text-neutral-500">
                Supports PDF and DOCX
              </span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // RENDER EVALUATION STEP
  if (step === 'evaluation' && evaluation) {
    return (
      <div className="max-w-4xl mx-auto pb-12">
        <button onClick={() => navigate('/dashboard/placement')} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Placement Support
        </button>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-8 text-center">
          <Award className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">HR Interview Evaluation Report</h2>
          <p className="text-neutral-400 mb-6">Duration: {DURATION_MINS} Minutes</p>
          
          <div className="flex justify-center gap-6 mb-8">
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 min-w-[200px]">
              <div className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Overall Score</div>
              <div className="text-6xl font-bold text-white">{evaluation.score} <span className="text-2xl text-neutral-600">/100</span></div>
            </div>
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 min-w-[200px] flex flex-col justify-center">
              <div className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Readiness Level</div>
              <div className={`text-2xl font-bold ${evaluation.interviewReadinessLevel === 'Hire Ready' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {evaluation.interviewReadinessLevel}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
            <h4 className="flex items-center gap-2 font-bold text-emerald-400 mb-4">
              <CheckCircle2 className="w-5 h-5" /> Strengths
            </h4>
            <ul className="space-y-3">
              {evaluation.strengths.map((s: string, i: number) => (
                <li key={i} className="text-sm text-neutral-300 flex items-start gap-2"><span className="text-emerald-500 mt-1">•</span> {s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
            <h4 className="flex items-center gap-2 font-bold text-red-400 mb-4">
              <XCircle className="w-5 h-5" /> Weaknesses
            </h4>
            <ul className="space-y-3">
              {evaluation.weaknesses.map((w: string, i: number) => (
                <li key={i} className="text-sm text-neutral-300 flex items-start gap-2"><span className="text-red-500 mt-1">•</span> {w}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6 mb-8">
          <h4 className="flex items-center gap-2 font-bold text-purple-400 mb-4">
            <Lightbulb className="w-5 h-5" /> Areas for Improvement & Recommendations
          </h4>
          <ul className="space-y-3 mb-6">
            {evaluation.improvementAreas.map((a: string, i: number) => (
              <li key={i} className="text-sm text-neutral-300 flex items-start gap-2"><span className="text-purple-500 mt-1">•</span> {a}</li>
            ))}
          </ul>
          
          <h5 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Recommended Answer Strategies:</h5>
          <ul className="space-y-3">
            {evaluation.recommendedAnswers?.map((a: string, i: number) => (
              <li key={i} className="text-sm text-neutral-400 italic bg-neutral-900 border border-neutral-800 rounded-xl p-4">"{a}"</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  if (step === 'evaluation' && !evaluation) {
    return (
      <div className="max-w-4xl mx-auto pb-12 flex justify-center items-center h-64">
        <div className="flex items-center gap-3 px-8 py-4 bg-neutral-900 rounded-full border border-neutral-800 text-purple-400 text-lg font-medium">
          <Loader2 className="w-6 h-6 animate-spin" /> Generating HR Evaluation Report...
        </div>
      </div>
    );
  }

  // RENDER INTERVIEW ROOM
  return (
    <div className="max-w-6xl mx-auto pb-12 flex flex-col md:flex-row gap-8 h-[calc(100vh-120px)]">
      
      {/* Left Sidebar: Topic & Participants */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <button onClick={() => {
          if (synthRef.current) synthRef.current.cancel();
          navigate('/dashboard/placement');
        }} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Exit Interview
        </button>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex-1 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-semibold inline-flex items-center gap-2">
              <Radio className="w-3 h-3 animate-pulse" /> Live HR Interview
            </span>
          </div>
          
          <div className="mb-6 space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-neutral-400">Time Elapsed:</span>
              <span className="text-white">{formatTime(DURATION_MINS * 60 - timeLeft)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-neutral-400">Time Remaining:</span>
              <span className="text-red-400">{formatTime(timeLeft)}</span>
            </div>
            
            <div className="w-full bg-neutral-800 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((DURATION_MINS * 60 - timeLeft) / (DURATION_MINS * 60)) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-sm font-medium mt-4 pt-4 border-t border-neutral-800">
              <span className="text-neutral-400">Questions Asked:</span>
              <span className="text-white bg-neutral-800 px-2 py-1 rounded-md">{Math.floor(messages.length / 2)}</span>
            </div>
          </div>
          
          <div className="mb-6 border-b border-neutral-800 pb-6">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-3">Participants</span>
            <div className="space-y-3">
              {['AI HR Recruiter', 'You (Candidate)'].map(speaker => (
                <div key={speaker} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${currentSpeaker === speaker ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-neutral-950/50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      speaker === 'AI HR Recruiter' ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {speaker === 'AI HR Recruiter' ? <Briefcase className="w-5 h-5"/> : 'U'}
                    </div>
                    <span className={`text-sm ${currentSpeaker === speaker ? 'text-white font-medium' : 'text-neutral-400'}`}>{speaker}</span>
                  </div>
                  {currentSpeaker === speaker && (isAiSpeaking || isRecording) && (
                    <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-auto pt-4">
            <button 
              onClick={endInterview}
              disabled={isEvaluating}
              className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium transition-colors flex justify-center items-center gap-2 text-sm disabled:opacity-50"
            >
              <StopCircle className="w-4 h-4" /> {isEvaluating ? 'Evaluating...' : 'End Interview'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col overflow-hidden relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 mb-[120px]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-medium text-neutral-400">{msg.speaker}</span>
                  <span className="text-[10px] text-neutral-600">{msg.timestamp}</span>
                </div>
                <div className={`p-5 rounded-2xl text-[15px] leading-relaxed shadow-lg ${
                  isUser ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/10' : 
                  'bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700 shadow-black/20'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Input Area (Voice Only) */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent flex flex-col items-center justify-end">
          {/* Live Transcript Display */}
          <AnimatePresence>
            {isRecording && liveTranscript && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full max-w-2xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-xl p-4 mb-6 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Live Transcript</span>
                </div>
                <p className="text-white text-[15px] leading-relaxed">{liveTranscript}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-4 text-sm font-medium">
            {currentSpeaker === 'You (Candidate)' ? (
              <span className="text-emerald-400 animate-pulse">🎤 Your Turn to Answer</span>
            ) : isEvaluating ? (
              <span className="text-neutral-500">Interview Ended</span>
            ) : (
              <span className="text-purple-400 flex items-center gap-2">
                <Volume2 className="w-4 h-4 animate-pulse" /> {currentSpeaker} is speaking...
              </span>
            )}
          </div>
          
          <button
            onClick={toggleRecording}
            disabled={currentSpeaker !== 'You (Candidate)' || isAiSpeaking || isEvaluating}
            className={`
              relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
              ${currentSpeaker !== 'You (Candidate)' || isAiSpeaking || isEvaluating
                ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                : isRecording 
                  ? 'bg-red-500 text-white scale-110 shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:scale-105'
              }
            `}
          >
            {isRecording ? (
              <>
                <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-20"></div>
                <StopCircle className="w-8 h-8" />
              </>
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
          
          <span className="mt-3 text-xs text-neutral-500 font-medium">
            {isRecording ? 'Click to Stop Recording' : currentSpeaker === 'You (Candidate)' ? 'Click to Start Speaking' : 'Microphone disabled'}
          </span>
        </div>
      </div>
    </div>
  );
}
