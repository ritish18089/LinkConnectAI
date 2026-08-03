import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { 
  ArrowLeft,
  UserCircle,
  Mic,
  StopCircle,
  Volume2,
  Radio
} from 'lucide-react';

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

export default function MockInterviewRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const candidateDetails = location.state?.candidateDetails;
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  // States
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState('AI Interviewer');
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  const [liveTranscript, setLiveTranscript] = useState('');
  const liveTranscriptRef = useRef('');
  const isRecordingRef = useRef(false);
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const hasInitialized = useRef(false);
  const lastProcessedMessageId = useRef<string | null>(null);
  
  const DURATION_MINS = candidateDetails?.durationMins || 15;
  const [timeLeft, setTimeLeft] = useState(DURATION_MINS * 60);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!candidateDetails) {
      navigate('/dashboard/mock-interview');
      return;
    }
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setStartTime(Date.now());
    
    // Initial fetch to get the first question
    const fetchInitial = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/mock-interview-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateDetails,
            messages: [],
            isInitial: true
          })
        });
        const data = await res.json();
        if (data.success) {
          addMessage('AI Interviewer', 'ai', data.text);
          setTimeout(async () => {
            await speakText(data.text);
            setCurrentSpeaker('You (Candidate)');
          }, 1000);
        }
      } catch (e) {
        console.error(e);
        const fallback = `Hello ${candidateDetails.fullName}, welcome to your mock interview. Could you please start by introducing yourself?`;
        addMessage('AI Interviewer', 'ai', fallback);
        setTimeout(async () => {
          await speakText(fallback);
          setCurrentSpeaker('You (Candidate)');
        }, 1000);
      }
    };
    
    fetchInitial();
  }, [candidateDetails, navigate]);

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
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!startTime || isEvaluating) return;
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
  }, [startTime, isEvaluating]);

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
    if (isEvaluating) return;

    if (currentSpeaker === 'AI Interviewer' && messages.length > 1) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.role === 'ai') return; // Do not reply to own messages
      if (lastProcessedMessageId.current === latestMessage.id) return; // Do not process same message twice
      lastProcessedMessageId.current = latestMessage.id;

      const fetchAIResponse = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/mock-interview-chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              candidateDetails,
              messages,
              isInitial: false
            })
          });
          const data = await res.json();
          if (data.success) {
            addMessage('AI Interviewer', 'ai', data.text);
            await speakText(data.text);
          } else {
            const fallback = "Could you elaborate a bit more on that point?";
            addMessage('AI Interviewer', 'ai', fallback);
            await speakText(fallback);
          }
        } catch (e) {
          const fallback = "I see. Let's move on to the next question.";
          addMessage('AI Interviewer', 'ai', fallback);
          await speakText(fallback);
        }
        
        if (!isEvaluating) {
          setCurrentSpeaker('You (Candidate)');
        }
      };
      
      setTimeout(fetchAIResponse, 500);
    }
  }, [currentSpeaker, isEvaluating]);

  const toggleRecording = () => {
    if (isAiSpeaking || currentSpeaker !== 'You (Candidate)' || isEvaluating) return;
    
    if (isRecording) {
      isRecordingRef.current = false;
      setIsRecording(false);
      recognitionRef.current?.stop();
      
      const finalMsg = liveTranscriptRef.current || liveTranscript;
      if (finalMsg.trim()) {
        addMessage('You (Candidate)', 'user', finalMsg.trim());
        setCurrentSpeaker('AI Interviewer');
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
    
    setCurrentSpeaker('AI Interviewer');
    const endText = 'Thank you for your time. That concludes our mock interview. I will now process your evaluation report.';
    addMessage('AI Interviewer', 'ai', endText);
    await speakText(endText);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/mock-interview-evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, candidateDetails })
      });
      const data = await res.json();
      if (data.success) {
        navigate('/dashboard/mock-interview/report', {
          state: {
            evaluation: data.evaluation,
            messages,
            candidateDetails,
            durationUsed: DURATION_MINS * 60 - timeLeft
          },
          replace: true
        });
      }
    } catch (e) {
      console.error(e);
      // Navigate with dummy on failure
      navigate('/dashboard/mock-interview/report', {
        state: {
          evaluation: {
            score: 75,
            strengths: ["Clear communication"],
            weaknesses: ["Could be more specific"],
            improvementAreas: ["Use structured answers"],
            recommendedAnswers: ["Always use STAR method"],
            interviewReadinessLevel: "Needs Practice"
          },
          messages,
          candidateDetails,
          durationUsed: DURATION_MINS * 60 - timeLeft
        },
        replace: true
      });
    }
  };

  if (!candidateDetails) return null;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col h-full">
          <div className="mb-4 flex items-center justify-between">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-semibold inline-flex items-center gap-2">
              <Radio className="w-3 h-3 animate-pulse" /> Live Mock Interview
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
                className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
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
              {['AI Interviewer', 'You (Candidate)'].map(speaker => (
                <div key={speaker} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${currentSpeaker === speaker ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-neutral-950/50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      speaker === 'AI Interviewer' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {speaker === 'AI Interviewer' ? <UserCircle className="w-5 h-5"/> : 'U'}
                    </div>
                    <span className={`text-sm ${currentSpeaker === speaker ? 'text-white font-medium' : 'text-neutral-400'}`}>{speaker}</span>
                  </div>
                  {currentSpeaker === speaker && (isAiSpeaking || isRecording) && (
                    <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
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
              <StopCircle className="w-4 h-4" /> {isEvaluating ? 'Evaluating...' : 'Finish Interview'}
            </button>
          </div>
        </div>
      </div>

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
                  isUser ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/10' : 
                  'bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700 shadow-black/20'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent flex flex-col items-center justify-end">
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
              <span className="text-emerald-400 animate-pulse">Your Turn to Answer</span>
            ) : isEvaluating ? (
              <span className="text-neutral-500">Interview Ended. Evaluating...</span>
            ) : (
              <span className="text-indigo-400 flex items-center gap-2">
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
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105'
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
