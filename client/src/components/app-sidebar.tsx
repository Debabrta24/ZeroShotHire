// Import router utilities for navigation between pages
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
// Import all icon components we'll use in the sidebar
import {
  Home,         // Dashboard icon
  Sparkles,     // Career Analysis icon
  BookOpen,     // Learning Path icon
  TrendingUp,   // Progress/Trending icon
  Briefcase,    // Job Matches icon
  Settings,     // Settings icon
  User,         // Profile icon
  Lightbulb,    // Brand logo icon
  LinkedinIcon, // LinkedIn icon
  FileText,     // Resume icon
  Map,          // Roadmaps icon
  MessageSquare, // Chat/AI Coach icon
  GraduationCap, // Quiz/Assessment icon
  DollarSign,   // Salary Calculator icon
  Video,        // Interview Simulator icon
  Calendar,     // Events icon
  GitCompare,   // Career Comparison icon
  Target,       // Goals icon
  Building2,    // Company matcher icon
  Newspaper,    // News Feed icon
  Trophy,       // Internship icon
  Code,         // DSA icon
  Languages,    // Spoken English icon
} from "lucide-react";
// Import sidebar UI components from shadcn
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

// Main navigation menu items - core features
const menuItems = [
  {
    title: "Dashboard",              // Home dashboard with overview
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Career Analysis",        // Initial career analysis form
    url: "/analysis",
    icon: Sparkles,
  },
  {
    title: "Recommendations",        // Career recommendations based on analysis
    url: "/recommendations",
    icon: TrendingUp,
  },
  {
    title: "Career Roadmaps",        // Step-by-step career roadmaps
    url: "/roadmaps",
    icon: Map,
  },
  {
    title: "Progress",               // Track learning progress
    url: "/progress",
    icon: TrendingUp,
  },
  {
    title: "Job Matches",            // Job listings and matches
    url: "/jobs",
    icon: Briefcase,
  },
];

// Career tools menu items - utility features
const toolsMenuItems = [
  {
    title: "LinkedIn Booster",       // Optimize LinkedIn profile
    url: "/linkedin-booster",
    icon: LinkedinIcon,
  },
  {
    title: "Resume Builder",         // Build and download resume
    url: "/resume-builder",
    icon: FileText,
  },
  {
    title: "Internship",             // Internship opportunities
    url: "/internship",
    icon: Trophy,
  },
  {
    title: "DSA",                    // Data Structures & Algorithms
    url: "/dsa",
    icon: Code,
  },
  {
    title: "Spoken English",         // Spoken English practice
    url: "/spoken-english",
    icon: Languages,
  },
  {
    title: "Free Books",             // Free programming books
    url: "/books",
    icon: BookOpen,
  },
];

// NEW ADVANCED FEATURES - Unique features added for enhanced functionality
const advancedMenuItems = [
  {
    title: "AI Career Coach",        // Chat with AI for career advice
    url: "/ai-coach",
    icon: MessageSquare,
  },
  {
    title: "Skill Assessments",      // Take quizzes to test skills
    url: "/assessments",
    icon: GraduationCap,
  },
  {
    title: "Salary Calculator",      // Compare salaries across roles
    url: "/salary-calculator",
    icon: DollarSign,
  },
  {
    title: "Interview Simulator",    // Practice mock interviews
    url: "/interview-simulator",
    icon: Video,
  },
  {
    title: "Networking Events",      // Browse and register for events
    url: "/events",
    icon: Calendar,
  },
  {
    title: "Career Comparison",      // Compare multiple career paths
    url: "/career-comparison",
    icon: GitCompare,
  },
  {
    title: "Goal Tracker",           // Track career goals visually
    url: "/goals",
    icon: Target,
  },
  {
    title: "Company Matcher",        // Find companies matching your values
    url: "/company-matcher",
    icon: Building2,
  },
  {
    title: "Career News",            // Latest industry news and trends
    url: "/news",
    icon: Newspaper,
  },
];

// Main AppSidebar component - renders the navigation sidebar
export function AppSidebar() {
  // Get current location to highlight active menu item
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  // Track whether career analysis has been completed
  const [isAnalysisCompleted, setIsAnalysisCompleted] = useState(false);

  // Check localStorage on mount and listen for completion events
  useEffect(() => {
    const checkAnalysisStatus = () => {
      const completed = localStorage.getItem('careerAnalysisCompleted') === 'true';
      setIsAnalysisCompleted(completed);
    };

    // Check initial state
    checkAnalysisStatus();

    // Listen for career analysis completion event
    window.addEventListener('careerAnalysisComplete', checkAnalysisStatus);

    return () => {
      window.removeEventListener('careerAnalysisComplete', checkAnalysisStatus);
    };
  }, []);

  // Filter out Career Analysis menu item if completed
  const visibleMenuItems = isAnalysisCompleted
    ? menuItems.filter(item => item.url !== '/analysis')
    : menuItems;

  return (
    <Sidebar>
      {/* Sidebar header with brand logo and name */}
      <SidebarHeader className="p-4">
        <Link href="/">
          {/* Brand logo - clickable to return to landing page */}
          <div className="flex items-center gap-2 px-2 hover-elevate rounded-md p-2 cursor-pointer">
            <Lightbulb className="h-6 w-6 text-primary" />
            <span className="text-lg font-heading font-bold">ZeroShotHire</span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Main sidebar content with all navigation groups */}
      <SidebarContent>
        {/* Primary navigation group - core features */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Map through visible menu items array to create navigation links */}
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url} // Highlight if current page
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Career tools group - utility features */}
        <SidebarGroup>
          <SidebarGroupLabel>Career Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Map through toolsMenuItems for career tools */}
              {toolsMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* NEW: Advanced Features group - unique enhanced features */}
        <SidebarGroup>
          <SidebarGroupLabel>Advanced Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Map through advancedMenuItems for new advanced features */}
              {advancedMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account group - user profile and settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Profile link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-testid="link-profile">
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Settings link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-testid="link-settings">
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar footer with auth and copyright */}
      <SidebarFooter className="p-4 space-y-2">
        {user ? (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground px-2">
              Logged in as <span className="font-medium text-foreground">{user.username}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => setLocation("/auth")}
            data-testid="button-login"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        )}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          © 2025 ZeroShotHire
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
