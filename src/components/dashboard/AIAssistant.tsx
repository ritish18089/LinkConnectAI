import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Send, Plus, MoreVertical, Trash2, Edit2, Download, MessageSquare, 
  Copy, RefreshCw, StopCircle, Zap, User, FileText, Settings, X, Loader2, Check,
  Paperclip, ThumbsUp, ThumbsDown, Search, Pin, Archive, BarChart2, Star, Save
} from 'lucide-react';
import { useAIAssistantStore } from '../../store/useAIAssistantStore';
import { useAuthStore } from '../../store/useAuthStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AI_MODES = [
  '💼 Recruiter Assistant',
  '📄 Resume Reviewer',
  '💬 LinkedIn Coach',
  '🎯 Interview Coach',
  '✉️ Cover Letter Writer',
  '🌐 Career Advisor'
];

const SUGGESTED_PROMPTS = [
  { icon: Zap, label: "Write Recruiter Message", prompt: "Write a professional LinkedIn message to a recruiter about a software engineering role." },
  { icon: User, label: "Improve LinkedIn Headline", prompt: "Help me rewrite my LinkedIn Headline to stand out to tech recruiters." },
  { icon: FileText, label: "Review Resume", prompt: "Review my resume (I will paste it next) and give me ATS and wording suggestions." },
  { icon: MessageSquare, label: "Prepare Java Interview", prompt: "Ask me 3 tough Java interview questions and evaluate my answers." },
  { icon: MessageSquare, label: "Prepare React Interview", prompt: "Ask me 3 senior-level React interview questions." },
  { icon: Zap, label: "Generate Cover Letter", prompt: "Write a cover letter for a Frontend Developer position at a fast-paced startup." }
];

export default function AIAssistant() {
  const { user, profileUser, linkedinProfile } = useAuthStore();
  const { 
    conversations, activeConversation, loading, isGenerating,
    initialize, createConversation, setActiveConversation, 
    renameConversation, deleteConversation, sendMessage, 
    stopGeneration, regenerateLastResponse 
  } = useAIAssistantStore();

  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(AI_MODES[5]);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [likedId, setLikedId] = useState<string | null>(null);
  const [dislikedId, setDislikedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      initialize(user.id);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !user || isGenerating) return;
    
    const content = input;
    setInput('');
    
    // Make sure we have created a conversation or updated mode
    if (activeConversation && activeConversation.ai_mode !== selectedMode) {
      // In a real app we'd save mode to DB, here we pass it via store
      activeConversation.ai_mode = selectedMode;
    }

    const userContext = {
      full_name: profileUser?.full_name || linkedinProfile?.full_name || user.user_metadata?.full_name,
      job_title: profileUser?.job_title || linkedinProfile?.headline,
      company: profileUser?.company,
      industry: profileUser?.industry,
      headline: profileUser?.headline || linkedinProfile?.headline,
      skills: profileUser?.skills || []
    };

    await sendMessage(user.id, content, userContext);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveTemplate = (text: string, id: string) => {
    // Ideally calls saveTemplate function from store
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const handleLike = (id: string) => {
    setLikedId(id);
    setDislikedId(null);
    setTimeout(() => setLikedId(null), 2000);
  };

  const handleDislike = (id: string) => {
    setDislikedId(id);
    setLikedId(null);
    setTimeout(() => setDislikedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('http://localhost:3000/api/ai/parse-resume', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setInput(`Please review my resume below and provide ATS suggestions, identify missing skills, and suggest stronger bullet points:\n\n${data.text}`);
        setSelectedMode('📄 Resume Reviewer');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to parse resume');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const exportChat = () => {
    if (!activeConversation) return;
    let exportText = `Conversation: ${activeConversation.title}\nMode: ${activeConversation.ai_mode || 'Default'}\n\n`;
    activeConversation.messages.forEach(m => {
      exportText += `[${m.role.toUpperCase()}]\n${m.content}\n\n`;
    });
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeConversation.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] bg-neutral-950 rounded-3xl border border-neutral-800 flex overflow-hidden">
      
      {/* Sidebar for Conversations */}
      <motion.div 
        animate={{ width: isSidebarOpen ? 300 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="flex-shrink-0 border-r border-neutral-800 bg-neutral-900/50 flex flex-col overflow-hidden"
      >
        <div className="p-4 border-b border-neutral-800 space-y-3">
          <button 
            onClick={() => createConversation(user!.id)}
            className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-rose-500/50"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-neutral-500" /></div>
          ) : (
            filteredConversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  activeConversation?.id === conv.id ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {conv.is_pinned ? <Pin className="w-4 h-4 text-rose-500 flex-shrink-0" /> : <MessageSquare className="w-4 h-4 flex-shrink-0" />}
                  <span className="truncate text-sm font-medium">{conv.title}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    className="p-1 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-neutral-950">
        
        {/* Header */}
        <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-950/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white hidden sm:block">
              {activeConversation ? activeConversation.title : "AI Workspace"}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">

            
            <button 
              onClick={() => setIsStatsOpen(!isStatsOpen)}
              className={`p-2 rounded-lg transition-colors ${isStatsOpen ? 'bg-rose-500/20 text-rose-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
            >
              <BarChart2 className="w-4 h-4" />
            </button>

            {activeConversation && (
              <button 
                onClick={exportChat}
                className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Stats Overlay */}
        <AnimatePresence>
          {isStatsOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-6 z-20 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-5"
            >
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-rose-500" /> AI Dashboard Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                  <div className="text-xs text-neutral-500 mb-1">Total Chats</div>
                  <div className="text-xl font-bold text-white">{conversations.length}</div>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                  <div className="text-xs text-neutral-500 mb-1">Messages</div>
                  <div className="text-xl font-bold text-white">{conversations.reduce((acc, c) => acc + c.messages.length, 0)}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-rose-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                Hello, {profileUser?.full_name?.split(' ')[0] || "there"} 👋
              </h1>
              <p className="text-neutral-400 text-center mb-8 max-w-xl">
                Welcome to your premium AI Workspace. Upload your resume, select an AI mode, or choose a quick action below to get started.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                {SUGGESTED_PROMPTS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(suggestion.prompt);
                      setTimeout(() => handleSend(), 50);
                    }}
                    className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-left hover:border-rose-500/50 hover:bg-neutral-800/80 transition-all group"
                  >
                    <suggestion.icon className="w-5 h-5 text-rose-400 mb-3" />
                    <h3 className="text-white font-medium mb-1 text-sm">{suggestion.label}</h3>
                    <p className="text-neutral-500 text-xs line-clamp-2">{suggestion.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 pb-4">
              {activeConversation.messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-rose-400" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-rose-600 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-lg shadow-rose-900/20' : 'bg-neutral-900 text-neutral-200 rounded-2xl rounded-tl-sm px-5 py-4 border border-neutral-800 shadow-md shadow-black/20'}`}>
                    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-neutral-950 prose-pre:border prose-pre:border-neutral-800 text-[15px]">
                      {msg.content ? (
                         // If it's an error message, display it cleanly
                        msg.content.startsWith("**Error:**") ? (
                          <div className="text-red-400 font-medium flex items-center gap-2">
                            {msg.content}
                          </div>
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        )
                      ) : (
                        <div className="flex gap-1.5 h-6 items-center">
                          <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>
                    
                    {msg.role === 'assistant' && msg.content && !msg.content.startsWith("**Error:**") && (
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-800/50 text-neutral-400">
                        <button 
                          onClick={() => handleCopy(msg.content, `msg-${idx}`)}
                          className="flex items-center gap-1.5 text-xs hover:text-white transition-colors"
                          title="Copy"
                        >
                          {copiedId === `msg-${idx}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleSaveTemplate(msg.content, `msg-${idx}`)}
                          className="flex items-center gap-1.5 text-xs hover:text-white transition-colors"
                          title="Save Template"
                        >
                          {savedId === `msg-${idx}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                        </button>
                        <div className="h-3 w-px bg-neutral-800 mx-1"></div>
                        <button 
                          onClick={() => handleLike(`msg-${idx}`)}
                          className={`transition-colors ${likedId === `msg-${idx}` ? 'text-emerald-400' : 'hover:text-emerald-400'}`} 
                          title="Helpful"
                        >
                          <ThumbsUp className={`w-4 h-4 ${likedId === `msg-${idx}` ? 'fill-emerald-400' : ''}`} />
                        </button>
                        <button 
                          onClick={() => handleDislike(`msg-${idx}`)}
                          className={`transition-colors ${dislikedId === `msg-${idx}` ? 'text-rose-400' : 'hover:text-rose-400'}`} 
                          title="Not Helpful"
                        >
                          <ThumbsDown className={`w-4 h-4 ${dislikedId === `msg-${idx}` ? 'fill-rose-400' : ''}`} />
                        </button>
                        
                        {idx === activeConversation.messages.length - 1 && (
                          <div className="ml-auto">
                            <button 
                              onClick={() => regenerateLastResponse(user!.id)}
                              className="flex items-center gap-1.5 text-xs hover:text-white transition-colors bg-neutral-950 px-2 py-1 rounded border border-neutral-800"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                       {profileUser?.profile_image_url ? (
                        <img src={profileUser.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                        <User className="w-4 h-4 text-neutral-400" />
                       )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex flex-col">
          <div className="max-w-4xl mx-auto w-full relative flex items-end gap-3 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 focus-within:border-rose-500/50 focus-within:ring-1 focus-within:ring-rose-500/50 transition-all">
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-10 h-10 flex-shrink-0 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 flex items-center justify-center transition-colors mb-1 ml-1"
              title="Upload Resume (PDF, DOCX, TXT)"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about networking, resumes, or LinkedIn..."
              className="flex-1 bg-transparent border-none text-white px-2 py-3 min-h-[52px] max-h-48 resize-none focus:outline-none focus:ring-0 text-[15px]"
              rows={1}
            />
            {isGenerating ? (
              <button
                onClick={stopGeneration}
                className="w-12 h-12 flex-shrink-0 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 flex items-center justify-center transition-colors mb-0.5 mr-0.5"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                className="w-12 h-12 flex-shrink-0 rounded-xl bg-rose-600 text-white disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 hover:bg-rose-500 flex items-center justify-center transition-all mb-0.5 mr-0.5 shadow-lg shadow-rose-600/20"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-neutral-500">
            <Bot className="w-3.5 h-3.5" />
            <p>Powered by Google Gemini AI. AI-generated content should always be reviewed before sending to recruiters.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
