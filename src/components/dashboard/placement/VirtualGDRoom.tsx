import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft,
  Users,
  Award,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  StopCircle,
  Mic,
  MicOff,
  Radio,
  Volume2,
  Loader2
} from 'lucide-react';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';
import { GDTopic } from './GroupDiscussion';

// Setup SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VirtualGDRoomProps {
  topic: GDTopic;
  durationMins: number;
  onExit: () => void;
}

interface Message {
  id: string;
  speaker: string;
  role: 'moderator' | 'ai' | 'user';
  content: string;
  timestamp: string;
}

export default function VirtualGDRoom({ topic, durationMins, onExit }: VirtualGDRoomProps) {
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState('Moderator');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(durationMins * 60);

  // Audio / Speech States
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const stopRequestedRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  const speakers = ['Moderator', 'You (Candidate)', 'AI Supporter', 'AI Opposer', 'AI Neutral'];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("Speech Started");
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += transcript + ' ';
          } else {
            interimStr += transcript;
          }
        }
        
        if (finalStr) {
          console.log("Final Transcript:", finalStr.trim());
          setFinalTranscript(prev => prev + finalStr);
        }
        
        if (interimStr) {
          console.log("Interim Transcript:", interimStr);
        }
        
        setInterimTranscript(interimStr);
        console.log("Speech Result processed.");
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
      };

      recognition.onend = () => {
        console.log("Speech Stopped");
        if (!stopRequestedRef.current) {
          console.log("Speech Restarted");
          try {
            recognition.start();
          } catch (e) {
            console.error("Failed to restart speech recognition", e);
          }
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.error("Speech Recognition not supported in this browser.");
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) {
        stopRequestedRef.current = true;
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Timer countdown
  useEffect(() => {
    if (isEvaluating || evaluation) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endDiscussion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isEvaluating, evaluation]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const addMessage = (speaker: string, role: 'moderator' | 'ai' | 'user', content: string) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      speaker,
      role,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const getNextSpeaker = (current: string) => {
    const idx = speakers.indexOf(current);
    if (idx === speakers.length - 1) return speakers[1]; // Skip moderator in regular loop
    return speakers[idx + 1];
  };

  const speakText = (text: string, role: string) => {
    return new Promise<void>((resolve) => {
      setIsAiSpeaking(true);
      if (synthRef.current) {
        synthRef.current.cancel(); // stop previous
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to pick different voices based on role
        const voices = synthRef.current.getVoices();
        if (voices.length > 0) {
          if (role === 'Moderator') {
            utterance.voice = voices.find(v => v.name.includes('Google UK English Male')) || voices[0];
          } else if (role === 'AI Supporter') {
            utterance.voice = voices.find(v => v.name.includes('Google US English')) || voices[0];
          } else if (role === 'AI Opposer') {
            utterance.voice = voices.find(v => v.name.includes('Google UK English Female')) || voices[0];
          } else {
            utterance.voice = voices[Math.floor(Math.random() * voices.length)];
          }
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

  // Start Discussion
  useEffect(() => {
    const init = async () => {
      await new Promise(r => setTimeout(r, 1000));
      const introText = `Welcome everyone. Today's topic is: "${topic.title}". Let's begin. You (Candidate), you may start with your opinion.`;
      addMessage('Moderator', 'moderator', introText);
      await speakText(introText, 'Moderator');
      setCurrentSpeaker('You (Candidate)');
    };
    
    // Load voices workaround for Chrome
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => { init(); };
    } else {
      init();
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // AI Turn Handling
  useEffect(() => {
    if (evaluation || isEvaluating) return;

    if (currentSpeaker !== 'You (Candidate)' && currentSpeaker !== 'Moderator') {
      const fetchAIResponse = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/gd-chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              topic,
              messages,
              nextSpeaker: currentSpeaker
            })
          });
          const data = await res.json();
          if (data.success) {
            addMessage(currentSpeaker, 'ai', data.reply);
            await speakText(data.reply, currentSpeaker);
          } else {
            addMessage(currentSpeaker, 'ai', 'I agree with the points made so far.');
            await speakText('I agree with the points made so far.', currentSpeaker);
          }
        } catch (e) {
          addMessage(currentSpeaker, 'ai', 'I think we need to look at both sides of the coin here.');
          await speakText('I think we need to look at both sides of the coin here.', currentSpeaker);
        }
        
        if (!isEvaluating) {
          setCurrentSpeaker(getNextSpeaker(currentSpeaker));
        }
      };
      
      // Small delay before AI speaks
      setTimeout(fetchAIResponse, 500);
    }
  }, [currentSpeaker, evaluation]);

  const toggleRecording = () => {
    if (isAiSpeaking || currentSpeaker !== 'You (Candidate)' || isEvaluating) return;
    
    if (isRecording) {
      stopRequestedRef.current = true;
      recognitionRef.current?.stop();
      setIsRecording(false);
      
      const fullTranscript = (finalTranscript + ' ' + interimTranscript).trim();
      if (fullTranscript) {
        console.log("Transcript Sent to AI:", fullTranscript);
        addMessage('You (Candidate)', 'user', fullTranscript);
        setCurrentSpeaker(getNextSpeaker('You (Candidate)'));
      }
      setFinalTranscript('');
      setInterimTranscript('');
    } else {
      stopRequestedRef.current = false;
      setFinalTranscript('');
      setInterimTranscript('');
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Failed to start recording:", e);
      }
    }
  };

  const endDiscussion = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    if (synthRef.current) synthRef.current.cancel();
    if (recognitionRef.current) {
      stopRequestedRef.current = true;
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    
    setCurrentSpeaker('Moderator');
    const endText = 'Thank you everyone. The discussion is now concluded. I will now generate the final evaluation report.';
    addMessage('Moderator', 'moderator', endText);
    await speakText(endText, 'Moderator');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/gd-evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, messages })
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
        strengths: ["Participated in the discussion"],
        weaknesses: ["Could have spoken more clearly"],
        improvementAreas: ["Structure arguments better"],
        modelAnswer: "Focus on presenting balanced viewpoints."
      });
    }
  };

  const saveProgress = async (evalData: any) => {
    if (!user) return;
    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      await supabase.from('gd_virtual_sessions').insert({
        user_id: user.id,
        topic_title: topic.title,
        messages,
        score: evalData.score,
        feedback: evalData,
        duration_seconds: durationSeconds
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
            gd_topics_practiced: existing.gd_topics_practiced + 1,
            time_spent_minutes: existing.time_spent_minutes + Math.ceil(durationSeconds / 60)
          })
          .eq('user_id', user.id);
      }
    } catch (e) {
      console.error("Failed saving GD session", e);
    }
  };

  if (evaluation) {
    return (
      <div className="max-w-4xl mx-auto pb-12">
        <button onClick={onExit} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to GD Topics
        </button>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-8 text-center">
          <Award className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Voice Performance Evaluation</h2>
          <p className="text-neutral-400 mb-6">Topic: {topic.title}</p>
          
          <div className="inline-block bg-neutral-950 border border-neutral-800 rounded-2xl p-6 mb-8">
            <div className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Overall Score</div>
            <div className="text-6xl font-bold text-white">{evaluation.score} <span className="text-2xl text-neutral-600">/100</span></div>
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

        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 mb-8">
          <h4 className="flex items-center gap-2 font-bold text-indigo-400 mb-4">
            <Lightbulb className="w-5 h-5" /> Areas for Improvement
          </h4>
          <ul className="space-y-3 mb-6">
            {evaluation.improvementAreas.map((a: string, i: number) => (
              <li key={i} className="text-sm text-neutral-300 flex items-start gap-2"><span className="text-indigo-500 mt-1">•</span> {a}</li>
            ))}
          </ul>
          
          <h5 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Suggested Model Answer:</h5>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-neutral-300 italic text-sm leading-relaxed">
            "{evaluation.modelAnswer}"
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 flex flex-col md:flex-row gap-8 h-[calc(100vh-120px)]">
      
      {/* Left Sidebar: Topic & Participants */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <button onClick={onExit} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Exit Room
        </button>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex-1 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-semibold inline-flex items-center gap-2">
              <Radio className="w-3 h-3 animate-pulse" /> Voice-Only GD
            </span>
            <div className="flex items-center gap-2 text-red-400 font-mono font-bold bg-red-500/10 px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
            </div>
          </div>
          <h3 className="font-bold text-white leading-snug mb-6">{topic.title}</h3>
          
          <div className="mb-6 border-b border-neutral-800 pb-6">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-3">Participants</span>
            <div className="space-y-3">
              {speakers.map(speaker => (
                <div key={speaker} className={`flex items-center justify-between p-2 rounded-lg transition-colors ${currentSpeaker === speaker ? 'bg-indigo-500/10 border border-indigo-500/30' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      speaker === 'Moderator' ? 'bg-amber-500/20 text-amber-500' :
                      speaker === 'You (Candidate)' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {speaker.charAt(0)}
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
              onClick={endDiscussion}
              disabled={isEvaluating}
              className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium transition-colors flex justify-center items-center gap-2 text-sm disabled:opacity-50"
            >
              <StopCircle className="w-4 h-4" /> {isEvaluating ? 'Evaluating...' : 'End Discussion'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col overflow-hidden relative">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 mb-[120px]">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            const isModerator = msg.role === 'moderator';
            
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
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  isUser ? 'bg-indigo-600 text-white rounded-br-none' : 
                  isModerator ? 'bg-amber-500/10 border border-amber-500/20 text-amber-100 rounded-bl-none' :
                  'bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            );
          })}
          
          {isEvaluating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center my-8">
              <div className="flex items-center gap-3 px-6 py-3 bg-neutral-800 rounded-full border border-neutral-700 text-indigo-400 text-sm font-medium">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating AI Evaluation Report...
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area (Voice Only) */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent flex flex-col items-center justify-end">
          
          {(finalTranscript || interimTranscript) && isRecording && (
            <div className="mb-6 w-full max-w-2xl bg-neutral-900/80 backdrop-blur-md border border-neutral-700 p-4 rounded-xl text-center shadow-lg">
              <p className="text-white text-sm leading-relaxed">
                {finalTranscript} <span className="text-neutral-400">{interimTranscript}</span>
              </p>
            </div>
          )}

          <div className="mb-4 text-sm font-medium">
            {currentSpeaker === 'You (Candidate)' ? (
              <span className="text-emerald-400 animate-pulse">🎤 Your Turn to Speak</span>
            ) : isEvaluating ? (
              <span className="text-neutral-500">Discussion Ended</span>
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
