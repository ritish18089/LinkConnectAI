import { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  MessageSquarePlus,
  History,
  Bookmark,
  Settings,
  LogOut,
  Bot,
  Menu,
  BookOpen,
  FileText,
  Target,
  Mic,
  BarChart,
  User,
  BookOpenText
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// Components
import Overview from "../components/dashboard/Overview";
import TemplateLibrary from "../components/dashboard/TemplateLibrary";
import SavedTemplates from "../components/dashboard/SavedTemplates";
import SettingsComponent from "../components/dashboard/Settings";
import AIAssistant from "../components/dashboard/AIAssistant";
import ResumeTemplatesLibrary from "../components/dashboard/ResumeTemplatesLibrary";
import ResumeEditor from "../components/dashboard/ResumeEditor";
import PlacementSupportHome from "../components/dashboard/placement/PlacementSupportHome";
import MCQAssessment from "../components/dashboard/placement/MCQAssessment";
import GroupDiscussion from "../components/dashboard/placement/GroupDiscussion";
import HRInterview from "../components/dashboard/placement/HRInterview";
import MockInterviewHome from "../components/dashboard/mock-interview/MockInterviewHome";
import MockInterviewRoom from "../components/dashboard/mock-interview/MockInterviewRoom";
import MockInterviewReport from "../components/dashboard/mock-interview/MockInterviewReport";
import MockInterviewHistory from "../components/dashboard/mock-interview/MockInterviewHistory";
import ResumeAnalyzerHome from "../components/dashboard/resume-analyzer/ResumeAnalyzerHome";
import ProfileHome from "../components/dashboard/profile/ProfileHome";
import ReadmeGeneratorHome from "../components/dashboard/readme-generator/ReadmeGeneratorHome";
import CoverLetterHome from "../components/dashboard/cover-letter/CoverLetterHome";
import HelpCenter from "../components/dashboard/HelpCenter";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user, logout, profileUser } = useAuthStore();

  const navItems = [
    {
      icon: LayoutDashboard,
      label: t("dashboard.overview"),
      path: "/dashboard",
    },
    {
      icon: BookOpen,
      label: t("nav.browse_templates", "Browse Templates"),
      path: "/dashboard/browse",
    },
    {
      icon: Bot,
      label: t("nav.ai_assistant", "AI Assistant"),
      path: "/dashboard/ai",
    },
    {
      icon: FileText,
      label: t("nav.resume_templates", "Resume Templates"),
      path: "/dashboard/resume-templates",
    },
    {
      icon: Target,
      label: t("nav.placement_support", "Placement Support"),
      path: "/dashboard/placement",
    },
    {
      icon: Mic,
      label: t("nav.mock_interview", "Mock Interview"),
      path: "/dashboard/mock-interview",
    },
    {
      icon: BarChart,
      label: t("nav.resume_analyzer", "Resume Analyzer"),
      path: "/dashboard/resume-analyzer",
    },
    {
      icon: BookOpenText,
      label: t("nav.readme_generator", "README Generator"),
      path: "/dashboard/readme-generator",
    },
    {
      icon: FileText,
      label: t("nav.cover_letter_generator", "Cover Letter Generator"),
      path: "/dashboard/cover-letter",
    },
    {
      icon: Bookmark,
      label: t("nav.saved_templates", "Saved Templates"),
      path: "/dashboard/templates",
    },
    {
      icon: User,
      label: t("nav.profile", "Profile"),
      path: "/dashboard/profile",
    },
    {
      icon: Settings,
      label: t("nav.settings", "Settings"),
      path: "/dashboard/settings",
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const pageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Overview";
      case "/dashboard/browse":
        return "Professional Templates";
      case "/dashboard/ai":
        return "AI Networking Assistant";
      case "/dashboard/resume-templates":
        return "Resume Templates";
      case "/dashboard/templates":
        return "Saved Templates";
      case "/dashboard/placement":
        return "Placement Support";
      case "/dashboard/placement/mcq":
        return "MCQ Assessment";
      case "/dashboard/placement/gd":
        return "Group Discussion";
      case "/dashboard/placement/hr":
        return "HR Interview";
      case "/dashboard/mock-interview":
        return "Mock Interview";
      case "/dashboard/mock-interview/room":
        return "Mock Interview Room";
      case "/dashboard/mock-interview/report":
        return "Mock Interview Report";
      case "/dashboard/mock-interview/history":
        return "Interview History";
      case "/dashboard/resume-analyzer":
        return "Resume Analyzer";
      case "/dashboard/readme-generator":
        return "README Generator";
      case "/dashboard/profile":
        return "Profile";
      case "/dashboard/settings":
        return "Settings";
      case "/dashboard/help":
        return "Help Center";
      default:
        if (location.pathname.startsWith("/dashboard/resume-templates/edit")) return "Resume Editor";
        return "Dashboard";
    }
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 260 : 80,
          x: 0
        }}
        transition={{ duration: 0.25 }}
        className={`fixed md:relative z-50 h-full flex-col border-r border-neutral-800 bg-neutral-900/95 md:bg-neutral-900/40 backdrop-blur-xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0 flex' : '-translate-x-full md:translate-x-0 md:flex hidden'}`}
      >
        <div className="h-24 flex items-center px-5 border-b border-neutral-800 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 overflow-hidden group w-full"
          >
            <img 
              src="/logo.png" 
              alt="LinkConnect Logo" 
              className={`h-11 w-11 object-contain transition-all duration-300 shrink-0 ${!sidebarOpen ? 'mx-auto' : ''}`} 
            />
            
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col flex-1 min-w-0"
              >
                <span className="text-xl font-bold text-white tracking-tight truncate leading-tight">
                  LinkConnect
                </span>
                <span className="text-[11px] font-medium text-neutral-400 truncate leading-tight">
                  Connect. Personalize. Engage.
                </span>
              </motion.div>
            )}
          </Link>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path !== "/dashboard" &&
                location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${active
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  } ${item.label === 'Placement Support' ? 'relative -left-[2px]' : ''}`}
              >
                <item.icon className="w-5 h-5" />

                {sidebarOpen && (
                  <span>{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />

            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-20 border-b border-neutral-800 flex items-center justify-between px-8 bg-neutral-950/70 backdrop-blur-xl">

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-neutral-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-xl font-semibold">
              {pageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">
                {user?.user_metadata?.full_name || "User"}
              </p>

              <p className="text-xs text-neutral-500">
                {user?.email}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {profileUser?.profile_image_url ? (
                <img 
                  src={profileUser.profile_image_url} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full object-cover border border-indigo-500/30" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-semibold uppercase text-indigo-300">
                  {profileUser?.full_name?.charAt(0) ||
                    user?.user_metadata?.full_name?.charAt(0) ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">

          <div className="max-w-7xl mx-auto">

            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/browse" element={<TemplateLibrary />} />
              <Route path="/ai" element={<AIAssistant />} />
              <Route path="/resume-templates" element={<ResumeTemplatesLibrary />} />
              <Route path="/resume-templates/edit/:id" element={<ResumeEditor />} />
              <Route path="/templates" element={<SavedTemplates />} />
              <Route path="/placement" element={<PlacementSupportHome />} />
              <Route path="/placement/mcq" element={<MCQAssessment />} />
              <Route path="/placement/gd" element={<GroupDiscussion />} />
              <Route path="/placement/hr" element={<HRInterview />} />
              <Route path="/mock-interview" element={<MockInterviewHome />} />
              <Route path="/mock-interview/room" element={<MockInterviewRoom />} />
              <Route path="/mock-interview/report" element={<MockInterviewReport />} />
              <Route path="/mock-interview/history" element={<MockInterviewHistory />} />
              <Route path="/resume-analyzer/*" element={<ResumeAnalyzerHome />} />
              <Route path="/readme-generator/*" element={<ReadmeGeneratorHome />} />
              <Route path="/cover-letter/*" element={<CoverLetterHome />} />
              <Route path="/profile" element={<ProfileHome />} />
              <Route path="/settings" element={<SettingsComponent />} />
              <Route path="/help" element={<HelpCenter />} />
            </Routes>

          </div>

        </main>

      </div>

    </div>
  );
}
