import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Bookmark, 
  CheckCircle2, XCircle, Clock, Play, RotateCcw,
  Monitor, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';
import { MCQ_BANK, MCQQuestion } from './data/mcqBank';

export default function MCQAssessment() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Selection States
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'Practice' | 'Mock Test' | null>(null);
  
  // Test States
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins for 25 questions

  // Filtered Questions
  const filteredQuestions = MCQ_BANK.filter(q => q.subject === selectedSubject);

  // Timer logic for Mock Test
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasStarted && !isFinished && selectedMode === 'Mock Test' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !isFinished && selectedMode === 'Mock Test') {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [hasStarted, isFinished, timeLeft, selectedMode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx: number) => {
    if (selectedMode === 'Practice') {
      // In practice mode, don't allow changing answer if already answered? 
      // User can change, but let's just record it.
      if (answers[currentQIdx] === undefined) {
        setAnswers(prev => ({ ...prev, [currentQIdx]: optIdx }));
      }
    } else {
      setAnswers(prev => ({ ...prev, [currentQIdx]: optIdx }));
    }
  };

  const toggleBookmark = () => {
    setBookmarked(prev => 
      prev.includes(currentQIdx) 
        ? prev.filter(i => i !== currentQIdx)
        : [...prev, currentQIdx]
    );
  };

  const handleFinish = async () => {
    setIsFinished(true);
    
    // Calculate Score
    let correct = 0;
    filteredQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });
    
    // Save to Supabase
    if (user && selectedField && selectedSubject) {
      try {
        const { data: existing } = await supabase
          .from('mcq_user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('field', selectedField)
          .eq('subject', selectedSubject)
          .single();

        const currentScorePercent = (correct / filteredQuestions.length) * 100;
        
        if (existing) {
          const newTotal = existing.total_attempted + filteredQuestions.length;
          const newCorrect = existing.correct_answers + correct;
          const newAvg = (existing.average_score * existing.total_attempted + currentScorePercent * filteredQuestions.length) / newTotal;
          const newHighest = Math.max(existing.highest_score, currentScorePercent);

          await supabase
            .from('mcq_user_progress')
            .update({
              total_attempted: newTotal,
              correct_answers: newCorrect,
              highest_score: newHighest,
              average_score: newAvg,
              last_attempt_date: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('mcq_user_progress')
            .insert({
              user_id: user.id,
              field: selectedField,
              subject: selectedSubject,
              total_attempted: filteredQuestions.length,
              correct_answers: correct,
              highest_score: currentScorePercent,
              average_score: currentScorePercent
            });
        }
      } catch (err) {
        console.error("Failed to save progress", err);
      }
    }
  };

  const resetSelection = () => {
    setSelectedField(null);
    setSelectedSubject(null);
    setSelectedMode(null);
    setHasStarted(false);
    setIsFinished(false);
    setAnswers({});
    setBookmarked([]);
    setCurrentQIdx(0);
    setTimeLeft(1500);
  };

  // STEP 1: Select Field
  if (!selectedField) {
    return (
      <div className="max-w-4xl mx-auto pb-12">
        <button onClick={() => navigate('/dashboard/placement')} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Placement Support
        </button>
        
        <h2 className="text-3xl font-bold text-white mb-8">Select Your Field</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => setSelectedField('IT Field')}
            className="bg-neutral-900 border border-neutral-800 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center text-center transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Monitor className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">IT Field</h3>
            <p className="text-neutral-400">Practice questions for Java, Python, React, SQL, and other technical roles.</p>
          </button>

          <button 
            onClick={() => setSelectedField('Non-IT Field')}
            className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center text-center transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Non-IT Field</h3>
            <p className="text-neutral-400">Practice questions for Marketing, Sales, Telecaller, and other business roles.</p>
          </button>
        </div>
      </div>
    );
  }

  // STEP 2: Select Subject
  if (!selectedSubject) {
    const subjects = [...new Set(MCQ_BANK.filter(q => q.field === selectedField).map(q => q.subject))];
    
    return (
      <div className="max-w-6xl mx-auto pb-12">
        <button onClick={() => setSelectedField(null)} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Fields
        </button>
        
        <h2 className="text-3xl font-bold text-white mb-8">Select Subject ({selectedField})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map(sub => (
            <button 
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className="bg-neutral-900 border border-neutral-800 hover:border-indigo-500 hover:bg-neutral-800/50 rounded-xl p-6 text-left transition-all group"
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400">{sub}</h3>
              <p className="text-neutral-500 text-sm">25 Questions Available</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // STEP 3: Select Mode
  if (!selectedMode) {
    return (
      <div className="max-w-4xl mx-auto pb-12">
        <button onClick={() => setSelectedSubject(null)} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Subjects
        </button>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">{selectedSubject} Assessment</h2>
          <p className="text-neutral-400">Choose how you want to attempt this subject.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => { setSelectedMode('Practice'); setHasStarted(true); }}
            className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 rounded-2xl p-8 flex flex-col transition-all group text-left"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Practice Mode</h3>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-3 text-neutral-400"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> No timer</li>
              <li className="flex items-center gap-3 text-neutral-400"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Immediate explanations</li>
              <li className="flex items-center gap-3 text-neutral-400"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Unlimited attempts</li>
            </ul>
            <div className="w-full py-3 bg-neutral-800 group-hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors text-center">
              Start Practice
            </div>
          </button>

          <button 
            onClick={() => { setSelectedMode('Mock Test'); setHasStarted(true); }}
            className="bg-neutral-900 border border-neutral-800 hover:border-red-500 rounded-2xl p-8 flex flex-col transition-all group text-left"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Mock Test Mode</h3>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-3 text-neutral-400"><CheckCircle2 className="w-5 h-5 text-red-500"/> 25 Minute Timer</li>
              <li className="flex items-center gap-3 text-neutral-400"><CheckCircle2 className="w-5 h-5 text-red-500"/> Hidden answers until end</li>
              <li className="flex items-center gap-3 text-neutral-400"><CheckCircle2 className="w-5 h-5 text-red-500"/> Final score assessment</li>
            </ul>
            <div className="w-full py-3 bg-neutral-800 group-hover:bg-red-600 text-white rounded-xl font-medium transition-colors text-center">
              Start Mock Test
            </div>
          </button>
        </div>
      </div>
    );
  }

  // FINISHED STATE
  if (isFinished) {
    const score = Object.keys(answers).reduce((acc, idx) => {
      const numIdx = Number(idx);
      return acc + (answers[numIdx] === filteredQuestions[numIdx].correctAnswer ? 1 : 0);
    }, 0);
    
    const passThreshold = Math.ceil(filteredQuestions.length * 0.6); // 60% to pass

    return (
      <div className="max-w-4xl mx-auto pb-12">
        <button onClick={resetSelection} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Exit to Dashboard
        </button>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Assessment Complete!</h2>
          <p className="text-neutral-400 mb-6">{selectedSubject} - {selectedMode}</p>
          
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="text-5xl font-bold text-white">{score} <span className="text-2xl text-neutral-500">/ {filteredQuestions.length}</span></div>
            <div className={`px-4 py-1 rounded-full font-bold uppercase ${score >= passThreshold ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {score >= passThreshold ? 'Pass' : 'Fail'}
            </div>
          </div>

          <div className="w-full bg-neutral-800 rounded-full h-4 mb-8 overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${score >= passThreshold ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${(score / filteredQuestions.length) * 100}%` }}></div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-4">Review Answers</h3>
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const isCorrect = answers[idx] === q.correctAnswer;
            const isAttempted = answers[idx] !== undefined;

            return (
              <div key={q.id} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : isAttempted ? 'bg-red-500/5 border-red-500/20' : 'bg-neutral-900 border-neutral-800'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Question {idx + 1}</span>
                      <span className="px-2 py-1 bg-neutral-800 rounded text-xs font-medium text-neutral-400">{q.difficulty}</span>
                    </div>
                    
                    <p className="text-white font-medium mb-4">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className={`p-3 rounded-lg border text-sm ${oIdx === q.correctAnswer ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : answers[idx] === oIdx ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-sm text-blue-200"><span className="font-semibold">Explanation:</span> {q.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // TEST IN PROGRESS STATE
  const question = filteredQuestions[currentQIdx];
  const isPractice = selectedMode === 'Practice';
  const hasAnsweredCurrent = answers[currentQIdx] !== undefined;
  const isCorrectCurrent = hasAnsweredCurrent && answers[currentQIdx] === question.correctAnswer;

  return (
    <div className="max-w-5xl mx-auto pb-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white">{selectedSubject}</h3>
            {selectedMode === 'Mock Test' && (
              <span className={`text-sm font-mono font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                {formatTime(timeLeft)}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-5 gap-2 mb-8">
            {filteredQuestions.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isCurrent = currentQIdx === idx;
              const isMarked = bookmarked.includes(idx);
              
              // In practice mode, color code correct/incorrect
              let btnClass = 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700';
              if (isAnswered) {
                if (isPractice) {
                  btnClass = answers[idx] === filteredQuestions[idx].correctAnswer ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white';
                } else {
                  btnClass = 'bg-blue-600 text-white';
                }
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQIdx(idx)}
                  className={`
                    h-8 rounded-md text-xs font-medium transition-all relative
                    ${isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900' : ''}
                    ${btnClass}
                  `}
                >
                  {idx + 1}
                  {isMarked && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-neutral-900"></div>}
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-neutral-400 mb-2">
              <span>Progress</span>
              <span>{Object.keys(answers).length} / {filteredQuestions.length}</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-2">
              <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${(Object.keys(answers).length / filteredQuestions.length) * 100}%` }}></div>
            </div>
          </div>

          <button 
            onClick={handleFinish}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-lg text-xs font-semibold">Question {currentQIdx + 1}</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                question.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                question.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>{question.difficulty}</span>
            </div>
            
            <button 
              onClick={toggleBookmark}
              className={`p-2 rounded-lg transition-colors ${bookmarked.includes(currentQIdx) ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'}`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked.includes(currentQIdx) ? 'fill-amber-400' : ''}`} />
            </button>
          </div>

          <h3 className="text-xl font-medium text-white mb-8">
            {question.question}
          </h3>

          <div className="space-y-3 mb-8">
            {question.options.map((opt, oIdx) => {
              const isSelected = answers[currentQIdx] === oIdx;
              
              // Practice Mode Styling
              let optionClass = 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-600';
              let dotClass = 'border-neutral-600';
              
              if (isPractice && hasAnsweredCurrent) {
                if (oIdx === question.correctAnswer) {
                  optionClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-200';
                  dotClass = 'border-emerald-500 bg-emerald-500';
                } else if (isSelected) {
                  optionClass = 'bg-red-500/10 border-red-500 text-red-200';
                  dotClass = 'border-red-500 bg-red-500';
                }
              } else if (isSelected) {
                optionClass = 'bg-blue-500/10 border-blue-500 text-blue-200';
                dotClass = 'border-blue-500';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  disabled={isPractice && hasAnsweredCurrent}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${optionClass} ${isPractice && hasAnsweredCurrent ? 'cursor-default' : ''}`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${dotClass}`}>
                    {isSelected && !isPractice && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                  </div>
                  {opt}
                </button>
              );
            })}
          </div>
          
          {/* Practice Mode Instant Explanation */}
          <AnimatePresence>
            {isPractice && hasAnsweredCurrent && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`mb-8 p-4 rounded-xl border ${isCorrectCurrent ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}
              >
                <div className="flex items-center gap-2 mb-2 font-bold">
                  {isCorrectCurrent ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-amber-500" />}
                  <span className={isCorrectCurrent ? 'text-emerald-400' : 'text-amber-400'}>
                    {isCorrectCurrent ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm text-neutral-300"><span className="font-semibold text-white">Explanation: </span>{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto pt-6 border-t border-neutral-800 flex justify-between">
            <button
              onClick={() => setCurrentQIdx(prev => Math.max(0, prev - 1))}
              disabled={currentQIdx === 0}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setCurrentQIdx(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
              disabled={currentQIdx === filteredQuestions.length - 1}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
