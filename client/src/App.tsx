// ==================== APP ROUTING CONFIGURATION ====================
// Main application router - handles all page routing and layout structure
// This file orchestrates navigation between all features of the career guide

// Import routing utilities from wouter (lightweight React router)
import { Switch, Route, Redirect } from "wouter";
import { useState, useEffect } from "react";

// Import React Query for server state management
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

// Import UI components from shadcn
import { Toaster } from "@/components/ui/toaster";           // Toast notifications
import { TooltipProvider } from "@/components/ui/tooltip";   // Tooltip wrapper
import { ThemeProvider } from "@/components/theme-provider"; // Dark/light theme
import { ThemeToggle } from "@/components/theme-toggle";     // Theme switcher button
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"; // Sidebar components
import { AppSidebar } from "@/components/app-sidebar";       // Custom sidebar with navigation
import { LoadingScreen } from "@/components/loading-screen"; // Loading screen component
import { AuthProvider, useAuth } from "@/hooks/use-auth";    // Authentication provider

// ===== CORE FEATURE PAGES =====
import Landing from "@/pages/landing";                       // Landing page (public)
import Dashboard from "@/pages/dashboard";                   // Main dashboard (overview)
import CareerAnalysis from "@/pages/career-analysis";        // Career analysis form
import Recommendations from "@/pages/recommendations";       // Career recommendations
import LearningPath from "@/pages/learning-path";            // Learning courses
import Progress from "@/pages/progress";                     // Progress tracking
import Jobs from "@/pages/jobs";                             // Job matches
import Profile from "@/pages/profile";                       // User profile
import Settings from "@/pages/settings";                     // App settings
import LinkedInBooster from "@/pages/linkedin-booster";      // LinkedIn optimizer
import ResumeBuilder from "@/pages/resume-builder";          // Resume builder
import CareerRoadmaps from "@/pages/career-roadmaps";        // Career roadmaps

// ===== NEW ADVANCED FEATURE PAGES =====
import AICoach from "@/pages/ai-coach";                      // AI career coach chatbot
import Assessments from "@/pages/assessments";               // Skill assessment quizzes
import SalaryCalculator from "@/pages/salary-calculator";    // Salary comparison tool
import InterviewSimulator from "@/pages/interview-simulator"; // Mock interview practice
import NetworkingEvents from "@/pages/events";               // Career events calendar
import CareerComparison from "@/pages/career-comparison";    // Career path comparison
import GoalTracker from "@/pages/goals";                     // Goal & milestone tracker
import CompanyMatcher from "@/pages/company-matcher";        // Company culture matcher
import CareerNews from "@/pages/news";                       // Industry news feed

// ===== CAREER TOOLS PAGES =====
import Internship from "@/pages/internship";                 // Internship opportunities
import DSA from "@/pages/dsa";                               // DSA practice platform
import SpokenEnglish from "@/pages/spoken-english";          // Spoken English courses
import BookStore from "@/pages/book-store";                  // Career book recommendations
import Books from "@/pages/books";                           // Free programming books

// ===== AUTH PAGE =====
import AuthPage from "@/pages/auth-page";                    // Login & Register page

// 404 Not Found page
import NotFound from "@/pages/not-found";

// Main router component - defines all application routes
// This component is rendered inside the main layout with sidebar
function Router() {
  return (
    <Switch>
      {/* ===== CORE FEATURES ===== */}
      <Route path="/dashboard" component={Dashboard} />                   {/* Main dashboard */}
      <Route path="/recommendations" component={Recommendations} />       {/* Recommendations */}
      <Route path="/learning" component={LearningPath} />                 {/* Learning path */}
      <Route path="/roadmaps" component={CareerRoadmaps} />               {/* Career roadmaps */}
      <Route path="/progress" component={Progress} />                     {/* Progress tracking */}
      <Route path="/jobs" component={Jobs} />                             {/* Job matches */}
      <Route path="/linkedin-booster" component={LinkedInBooster} />      {/* LinkedIn booster */}
      <Route path="/resume-builder" component={ResumeBuilder} />          {/* Resume builder */}
      <Route path="/profile" component={Profile} />                       {/* User profile */}
      <Route path="/settings" component={Settings} />                     {/* Settings */}
      
      {/* ===== NEW ADVANCED FEATURES ===== */}
      <Route path="/ai-coach" component={AICoach} />                      {/* AI career coach */}
      <Route path="/assessments" component={Assessments} />               {/* Skill assessments */}
      <Route path="/salary-calculator" component={SalaryCalculator} />    {/* Salary calculator */}
      <Route path="/interview-simulator" component={InterviewSimulator} /> {/* Interview practice */}
      <Route path="/events" component={NetworkingEvents} />               {/* Networking events */}
      <Route path="/career-comparison" component={CareerComparison} />    {/* Career comparison */}
      <Route path="/goals" component={GoalTracker} />                     {/* Goal tracker */}
      <Route path="/company-matcher" component={CompanyMatcher} />        {/* Company matcher */}
      <Route path="/news" component={CareerNews} />                       {/* Career news */}
      
      {/* ===== CAREER TOOLS ===== */}
      <Route path="/internship" component={Internship} />                 {/* Internship opportunities */}
      <Route path="/dsa" component={DSA} />                               {/* DSA practice */}
      <Route path="/spoken-english" component={SpokenEnglish} />          {/* Spoken English */}
      <Route path="/book-store" component={BookStore} />                  {/* Book store */}
      <Route path="/books" component={Books} />                           {/* Free programming books */}
      
      {/* 404 - Not found (catch-all route) */}
      <Route component={NotFound} />
    </Switch>
  );
}

// AppContent component - handles the app layout structure
// Determines whether to show career analysis or main app layout with sidebar
function AppContent() {
  const { user, isLoading } = useAuth();
  const [isAnalysisCompleted, setIsAnalysisCompleted] = useState(() => {
    return localStorage.getItem('careerAnalysisCompleted') === 'true';
  });

  useEffect(() => {
    const handleCompletionChange = () => {
      setIsAnalysisCompleted(localStorage.getItem('careerAnalysisCompleted') === 'true');
    };

    window.addEventListener('careerAnalysisComplete', handleCompletionChange);
    window.addEventListener('storage', handleCompletionChange);

    return () => {
      window.removeEventListener('careerAnalysisComplete', handleCompletionChange);
      window.removeEventListener('storage', handleCompletionChange);
    };
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full">
      <Switch>
        {/* Root path - always show landing page without sidebar (public page) */}
        <Route path="/">
          {() => <Landing />}
        </Route>
        
        {/* Career analysis page - shown without sidebar initially, requires authentication */}
        <Route path="/analysis">
          {() => {
            // Redirect to auth if not logged in
            if (!user) {
              return <Redirect to="/auth" />;
            }

            // If analysis not completed, show without sidebar
            if (!isAnalysisCompleted) {
              return (
                <div className="flex h-screen w-full">
                  <div className="flex flex-col flex-1">
                    {/* Top header bar with theme switcher only */}
                    <header className="flex items-center justify-end p-2 sm:p-4 border-b">
                      <ThemeToggle />
                    </header>
                    {/* Main content area (scrollable) */}
                    <main className="flex-1 overflow-auto">
                      <CareerAnalysis />
                    </main>
                  </div>
                </div>
              );
            }
            
            // If analysis completed, show with sidebar
            return (
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 min-w-0">
                  <header className="flex items-center justify-between p-2 sm:p-4 border-b">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <ThemeToggle />
                  </header>
                  <main className="flex-1 overflow-auto">
                    <CareerAnalysis />
                  </main>
                </div>
              </div>
            );
          }}
        </Route>
        
        {/* Auth page - public route */}
        <Route path="/auth">
          {() => <AuthPage />}
        </Route>

        {/* All other routes - shown with sidebar only if authenticated AND analysis is completed */}
        <Route path="/:rest*">
          {() => {
            // Redirect to auth if not logged in
            if (!user) {
              return <Redirect to="/auth" />;
            }

            // If analysis not completed, redirect to analysis page
            if (!isAnalysisCompleted) {
              return <Redirect to="/analysis" />;
            }
            
            // Standard layout for all authenticated pages
            return (
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 min-w-0">
                  <header className="flex items-center justify-between p-2 sm:p-4 border-b">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <ThemeToggle />
                  </header>
                  <main className="flex-1 overflow-auto">
                    <Router />
                  </main>
                </div>
              </div>
            );
          }}
        </Route>
      </Switch>
    </div>
  );
}

// Main App component - root of the entire application
// Sets up all providers and global configuration
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Show loading screen for a brief moment on app startup
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show loading screen for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Custom sidebar width configuration
  // CSS variables for sidebar dimensions
  const style = {
    "--sidebar-width": "16rem",           // Sidebar width when expanded (256px)
    "--sidebar-width-icon": "3rem",       // Sidebar width when collapsed (48px)
  };

  // Show loading screen during initial load
  if (isLoading) {
    return (
      <ThemeProvider>
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  return (
    // QueryClientProvider - enables React Query for data fetching
    <QueryClientProvider client={queryClient}>
      {/* AuthProvider - manages user authentication state */}
      <AuthProvider>
        {/* ThemeProvider - manages dark/light theme state */}
        <ThemeProvider>
          {/* TooltipProvider - enables tooltips throughout the app */}
          <TooltipProvider>
            {/* SidebarProvider - manages sidebar state and configuration */}
            <SidebarProvider style={style as React.CSSProperties}>
              {/* Main app content with routing */}
              <AppContent />
            </SidebarProvider>
            {/* Toaster - global toast notification system */}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
