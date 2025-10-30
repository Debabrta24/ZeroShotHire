import { z } from "zod";

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currentRole?: string;
  education: string;
  skills: string[];
  interests: string[];
  careerGoals: string[];
  workPreferences: {
    workStyle: string;
    location: string;
    salary: string;
  };
  createdAt: string;
}

// Career Recommendation
export interface CareerRecommendation {
  id: string;
  title: string;
  description: string;
  matchPercentage: number;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  growthPotential: 'High' | 'Medium' | 'Low';
  requiredSkills: string[];
  industryDemand: number;
  workLifeBalance: number;
  remoteOpportunities: number;
  educationRequired: string;
  averageYearsToMaster: number;
  topCompanies: string[];
  relatedRoles: string[];
}

// Skill
export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  progress: number;
  isUserSkill: boolean;
}

// Skill Gap Analysis
export interface SkillGap {
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  recommendedCourses: string[];
}

// Learning Course
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  durationUnit: 'hours' | 'weeks' | 'months';
  provider: string;
  rating: number;
  skillsTaught: string[];
  progress: number;
  isCompleted: boolean;
  isEnrolled: boolean;
}

// Learning Path Phase
export interface LearningPhase {
  id: string;
  title: string;
  description: string;
  order: number;
  courses: Course[];
  estimatedDuration: number;
  isCompleted: boolean;
  isCurrent: boolean;
}

// Learning Roadmap
export interface LearningRoadmap {
  id: string;
  careerGoal: string;
  phases: LearningPhase[];
  totalDuration: number;
  overallProgress: number;
  startDate: string;
  estimatedCompletionDate: string;
}

// Achievement Badge
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Learning' | 'Skill' | 'Streak' | 'Milestone';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  requirement: number;
}

// Progress Stats
export interface ProgressStats {
  totalCoursesCompleted: number;
  totalHoursLearned: number;
  currentStreak: number;
  longestStreak: number;
  skillsMastered: number;
  achievementsUnlocked: number;
  weeklyActivity: {
    date: string;
    hoursLearned: number;
  }[];
}

// Career Analysis Form Data
export const careerAnalysisSchema = z.object({
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  education: z.string().min(1, "Select your education level"),
  careerGoals: z.array(z.string()).min(1, "Select at least one career goal"),
  workStyle: z.string().min(1, "Select your preferred work style"),
  location: z.string().min(1, "Select your location preference"),
  salaryExpectation: z.string().min(1, "Select your salary expectation"),
});

export type CareerAnalysisFormData = z.infer<typeof careerAnalysisSchema>;

// Interest Categories
export const interestCategories = [
  "Technology & Programming",
  "Data & Analytics",
  "Design & Creativity",
  "Business & Management",
  "Marketing & Sales",
  "Healthcare & Medicine",
  "Education & Training",
  "Finance & Accounting",
  "Engineering",
  "Arts & Entertainment",
  "Science & Research",
  "Legal & Compliance",
] as const;

// Education Levels
export const educationLevels = [
  "High School",
  "Some College",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Bootcamp/Certification",
] as const;

// Career Goal Options
export const careerGoalOptions = [
  "High Salary",
  "Work-Life Balance",
  "Remote Work",
  "Leadership Role",
  "Continuous Learning",
  "Innovation & Creativity",
  "Social Impact",
  "Job Security",
  "Entrepreneurship",
  "Flexible Schedule",
] as const;

// Work Style Options
export const workStyleOptions = [
  "Individual Contributor",
  "Team Collaboration",
  "Leadership & Management",
  "Hybrid",
] as const;

// Location Preferences
export const locationOptions = [
  "On-site",
  "Remote",
  "Hybrid",
  "No Preference",
] as const;

// Salary Ranges
export const salaryRanges = [
  "Entry Level ($40k-$60k)",
  "Mid Level ($60k-$90k)",
  "Senior Level ($90k-$130k)",
  "Executive Level ($130k+)",
] as const;

// LinkedIn Profile Models
export interface LinkedInProfile {
  id: string;
  userId: string;
  headline: string;
  summary: string;
  experience: LinkedInExperience[];
  skills: string[];
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LinkedInExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
}

export const linkedInProfileSchema = z.object({
  headline: z.string().min(1, "Headline is required").max(220, "Headline must be 220 characters or less"),
  summary: z.string().min(50, "Summary should be at least 50 characters").max(2600, "Summary must be 2600 characters or less"),
  currentRole: z.string().optional(),
  experience: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    achievements: z.array(z.string()).optional(),
  })).optional(),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
});

export type LinkedInProfileFormData = z.infer<typeof linkedInProfileSchema>;

// Resume Models
export interface Resume {
  id: string;
  userId: string;
  templateId: string;
  personalInfo: ResumePersonalInfo;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects?: ResumeProject[];
  certifications?: ResumeCertification[];
  createdAt: string;
  updatedAt: string;
}

export interface ResumePersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photo?: string;
}

export interface ResumeExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface ResumeEducation {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

export interface ResumeSkill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ResumeProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export const resumePersonalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  photo: z.string().optional(),
});

export const resumeExperienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(1, "Description is required"),
  achievements: z.array(z.string()).default([]),
});

export const resumeEducationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().min(1, "Location is required"),
  graduationDate: z.string().min(1, "Graduation date is required"),
  gpa: z.string().optional(),
  honors: z.string().optional(),
});

// Career Roadmap Models
export interface CareerRoadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: number;
  durationUnit: 'months' | 'years';
  milestones: RoadmapMilestone[];
  requiredSkills: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  jobDemand: number;
}

export interface RoadmapMilestone {
  id: string;
  order: number;
  title: string;
  description: string;
  duration: number;
  durationUnit: 'weeks' | 'months';
  skills: string[];
  resources: RoadmapResource[];
  tasks: string[];
  isCompleted: boolean;
}

export interface RoadmapResource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'article' | 'video' | 'project';
  url?: string;
  provider?: string;
  isFree: boolean;
  estimatedTime?: number;
}

export interface UserRoadmapProgress {
  id: string;
  userId: string;
  roadmapId: string;
  startedAt: string;
  completedMilestones: string[];
  currentMilestone?: string;
  overallProgress: number;
}

// Career path categories
export const careerPathCategories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
  "UI/UX Design",
  "Product Management",
  "Software Architecture",
  "Game Development",
  "Blockchain",
] as const;

// User model (for authentication)
export interface User {
  id: string;
  username: string;
  password: string;
}

export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Interview Preparation Models
export interface InterviewQuestion {
  id: string;
  category: string;
  subcategory: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  answer: string;
  tips: string[];
  relatedTopics: string[];
}

export interface InterviewCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
}

export interface InterviewTip {
  id: string;
  category: string;
  title: string;
  description: string;
  tips: string[];
}

export interface UserInterviewProgress {
  id: string;
  userId: string;
  questionId: string;
  practiced: boolean;
  confident: boolean;
  notes?: string;
  lastPracticedAt: string;
}

// Networking Models
export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  experience: number;
  avatar?: string;
  bio: string;
  availability: 'Available' | 'Busy' | 'Limited';
  rating: number;
  sessionsCompleted: number;
}

export interface NetworkingConnection {
  id: string;
  userId: string;
  mentorId: string;
  status: 'Pending' | 'Connected' | 'Declined';
  createdAt: string;
}

// Salary Negotiation Models
export interface SalaryInsight {
  id: string;
  role: string;
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Principal';
  location: string;
  averageSalary: number;
  minSalary: number;
  maxSalary: number;
  currency: string;
  benefits: string[];
  marketTrend: 'Rising' | 'Stable' | 'Declining';
}

export interface NegotiationTip {
  id: string;
  category: string;
  title: string;
  description: string;
  dosList: string[];
  dontsList: string[];
}

// Job Application Tracker Models
export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  position: string;
  location: string;
  applicationDate: string;
  status: 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted';
  salary?: string;
  notes?: string;
  nextSteps?: string;
  contacts?: ApplicationContact[];
  interviews?: Interview[];
}

export interface ApplicationContact {
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface Interview {
  id: string;
  date: string;
  type: 'Phone' | 'Video' | 'On-site' | 'Technical';
  interviewer?: string;
  notes?: string;
  outcome?: 'Passed' | 'Failed' | 'Pending';
}

// ==================== NEW ADVANCED FEATURES ====================

// AI Career Coach - Chat conversation for personalized career guidance
export interface ChatMessage {
  id: string; // Unique identifier for each message
  role: 'user' | 'assistant'; // Who sent the message - user or AI
  content: string; // The actual text content of the message
  timestamp: string; // When the message was sent (ISO format)
  isStreaming?: boolean; // Whether the message is currently being streamed
}

export interface ChatConversation {
  id: string; // Unique identifier for the conversation
  userId: string; // The user who owns this conversation
  title: string; // Title/summary of the conversation
  messages: ChatMessage[]; // Array of all messages in this conversation
  createdAt: string; // When the conversation was created
  updatedAt: string; // When the conversation was last updated
}

// Skill Assessment Quiz - Interactive quizzes to evaluate user skills
export interface QuizQuestion {
  id: string; // Unique identifier for the question
  category: string; // Skill category (e.g., "JavaScript", "Python")
  difficulty: 'Easy' | 'Medium' | 'Hard'; // Difficulty level
  question: string; // The actual question text
  options: string[]; // Array of possible answers
  correctAnswer: number; // Index of the correct answer in options array
  explanation: string; // Explanation of why the answer is correct
  points: number; // Points awarded for correct answer
}

export interface QuizAttempt {
  id: string; // Unique identifier for this quiz attempt
  userId: string; // User who took the quiz
  category: string; // Which skill was being tested
  questions: QuizQuestion[]; // Questions that were asked
  userAnswers: number[]; // User's answers (indices of selected options)
  score: number; // Final score achieved
  totalPoints: number; // Maximum possible points
  completedAt: string; // When the quiz was completed
  timeTaken: number; // Time taken to complete (in seconds)
}

// Networking Events - Virtual career events and webinars
export interface NetworkingEvent {
  id: string; // Unique identifier for the event
  title: string; // Event name/title
  description: string; // Detailed description of the event
  type: 'Webinar' | 'Workshop' | 'Networking' | 'Conference' | 'Meetup'; // Type of event
  host: string; // Name of the host/organizer
  hostAvatar?: string; // URL to host's avatar image
  date: string; // Event date (ISO format)
  duration: number; // Duration in minutes
  attendees: number; // Current number of attendees
  maxAttendees?: number; // Maximum capacity (optional)
  topics: string[]; // Array of topics covered
  isVirtual: boolean; // Whether it's online or in-person
  location?: string; // Location (URL for virtual, address for physical)
  isPremium: boolean; // Whether it requires premium access
  registrationDeadline: string; // Last date to register
}

export interface EventRegistration {
  id: string; // Unique identifier for the registration
  userId: string; // User who registered
  eventId: string; // Event they registered for
  registeredAt: string; // When they registered
  status: 'Registered' | 'Attended' | 'Cancelled'; // Registration status
  reminderSent: boolean; // Whether reminder was sent
}

// Eventbrite API Event - Events fetched from Eventbrite
export interface EventbriteEvent {
  id: string; // Eventbrite event ID
  name: string; // Event name
  description: string; // Event description (HTML)
  url: string; // Event URL on Eventbrite
  start: string; // Start date/time (ISO format)
  end: string; // End date/time (ISO format)
  created: string; // When event was created
  isOnline: boolean; // Whether event is online
  isFree: boolean; // Whether event is free
  venue?: {
    name?: string;
    address?: string;
    city?: string;
    region?: string;
    country?: string;
  };
  logoUrl?: string; // Event logo/image
  organizerName?: string; // Organizer name
  category?: string; // Event category
}

export const eventbriteEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string().url(),
  start: z.string(),
  end: z.string(),
  created: z.string(),
  isOnline: z.boolean(),
  isFree: z.boolean(),
  venue: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  logoUrl: z.string().optional(),
  organizerName: z.string().optional(),
  category: z.string().optional(),
});

export type EventbriteEventType = z.infer<typeof eventbriteEventSchema>;

// Career Comparison Tool - Compare multiple career paths side by side
export interface CareerPath {
  id: string; // Unique identifier for the career path
  title: string; // Career title (e.g., "Software Engineer")
  category: string; // Industry category
  avgSalary: number; // Average salary
  salaryGrowth: number; // Annual salary growth percentage
  jobOpenings: number; // Current job openings
  workLifeBalance: number; // Rating 1-10
  stressLevel: number; // Rating 1-10 (higher = more stress)
  jobSatisfaction: number; // Rating 1-10
  requiredEducation: string; // Minimum education required
  topSkills: string[]; // Most important skills
  careerGrowth: 'High' | 'Medium' | 'Low'; // Growth potential
  remoteFriendly: boolean; // Whether remote work is common
  pros: string[]; // List of pros for this career
  cons: string[]; // List of cons for this career
}

// Visual Goal Tracker - Track career goals with milestones
export interface CareerGoal {
  id: string; // Unique identifier for the goal
  userId: string; // User who owns this goal
  title: string; // Goal title (e.g., "Become Senior Developer")
  description: string; // Detailed description
  category: string; // Category (e.g., "Career Advancement")
  targetDate: string; // When the goal should be achieved
  priority: 'High' | 'Medium' | 'Low'; // Priority level
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Abandoned'; // Current status
  progress: number; // Progress percentage (0-100)
  milestones: GoalMilestone[]; // Array of milestones to achieve
  createdAt: string; // When the goal was created
  completedAt?: string; // When the goal was completed (if applicable)
}

export interface GoalMilestone {
  id: string; // Unique identifier for the milestone
  title: string; // Milestone title
  description: string; // Detailed description
  dueDate: string; // Target completion date
  completed: boolean; // Whether it's been completed
  completedAt?: string; // When it was completed
  order: number; // Display order
}

// Company Culture Matcher - Match users with companies
export interface Company {
  id: string; // Unique identifier for the company
  name: string; // Company name
  industry: string; // Industry sector
  size: string; // Company size (e.g., "51-200 employees")
  logo?: string; // URL to company logo
  description: string; // Company description
  values: string[]; // Core values
  benefits: string[]; // Employee benefits offered
  workCulture: string; // Description of work culture
  techStack?: string[]; // Technologies used (if applicable)
  careerGrowth: number; // Rating 1-10
  workLifeBalance: number; // Rating 1-10
  compensation: number; // Rating 1-10
  diversityScore: number; // Rating 1-10
  remotePolicy: 'Fully Remote' | 'Hybrid' | 'Office Only'; // Remote work policy
  location: string[]; // Office locations
  openPositions: number; // Current job openings
}

export interface CultureMatch {
  id: string; // Unique identifier for the match
  userId: string; // User who got matched
  companyId: string; // Matched company
  matchScore: number; // Match percentage (0-100)
  matchingFactors: string[]; // Why they matched
  createdAt: string; // When the match was created
}

// Career News Feed - Curated industry news
export interface NewsArticle {
  id: string; // Unique identifier for the article
  title: string; // Article headline
  summary: string; // Brief summary
  content: string; // Full article content
  author: string; // Article author
  source: string; // News source
  category: string[]; // Categories (e.g., ["Tech", "AI"])
  thumbnail?: string; // Article thumbnail image
  publishedAt: string; // Publication date
  readTime: number; // Estimated read time in minutes
  tags: string[]; // Related tags
  url?: string; // External URL if applicable
  isBookmarked?: boolean; // Whether user bookmarked it
  views: number; // Number of views
}

export interface UserPreferences {
  id: string; // Unique identifier
  userId: string; // User these preferences belong to
  newsCategories: string[]; // News categories of interest
  skillsToImprove: string[]; // Skills user wants to develop
  careerInterests: string[]; // Career paths of interest
  companyPreferences: {
    size?: string; // Preferred company size
    culture?: string; // Preferred culture type
    remotePolicy?: string; // Preferred remote policy
    industries?: string[]; // Preferred industries
  };
  notificationSettings: {
    email: boolean; // Email notifications
    events: boolean; // Event reminders
    newsDigest: boolean; // Daily/weekly news digest
    goalReminders: boolean; // Goal deadline reminders
  };
}

// Interview Simulator - Practice interviews with feedback
export interface MockInterview {
  id: string; // Unique identifier for the interview
  userId: string; // User taking the interview
  type: 'Technical' | 'Behavioral' | 'Case Study' | 'System Design'; // Interview type
  difficulty: 'Easy' | 'Medium' | 'Hard'; // Difficulty level
  questions: InterviewSimQuestion[]; // Array of questions asked
  overallScore: number; // Total score (0-100)
  feedback: string; // Overall AI feedback
  strengths: string[]; // What went well
  improvements: string[]; // Areas to improve
  startedAt: string; // When interview started
  completedAt: string; // When interview completed
  duration: number; // Time taken in minutes
}

export interface InterviewSimQuestion {
  id: string; // Unique identifier for the question
  question: string; // The question text
  expectedAnswer: string; // Model/expected answer
  userAnswer: string; // User's actual answer
  score: number; // Score for this question (0-100)
  feedback: string; // AI feedback on the answer
  category: string; // Question category
}

// Salary Calculator - Advanced salary insights
export interface SalaryData {
  id: string; // Unique identifier
  role: string; // Job role/title
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Principal' | 'Executive'; // Experience level
  location: string; // Geographic location
  industry: string; // Industry sector
  companySize: string; // Size of company
  baseSalary: number; // Base salary amount
  bonus: number; // Average bonus
  equity: number; // Equity/stock value
  totalComp: number; // Total compensation
  benefits: string[]; // Benefits package
  currency: string; // Currency (e.g., "USD")
  yearsExperience: number; // Years of experience required
  updatedAt: string; // When data was last updated
}

export interface SalaryComparison {
  currentRole: SalaryData; // User's current/target role
  comparisons: SalaryData[]; // Other roles to compare
  insights: string[]; // AI-generated insights
  recommendations: string[]; // Career recommendations based on salary data
}

// Free Programming Books - Integrated learning resources
export interface Book {
  id: string; // Unique identifier (from API)
  title: string; // Book title
  author: string[]; // Authors
  description?: string; // Book description
  subjects: string[]; // Topics/subjects (e.g., "JavaScript", "Python")
  coverUrl?: string; // Cover image URL
  publishYear?: number; // Publication year
  language?: string; // Language (default: English)
  pageCount?: number; // Number of pages
  readUrl?: string; // URL to read the book online
  downloadUrl?: string; // URL to download (if available)
  format: string[]; // Available formats (PDF, EPUB, HTML, etc.)
  isBookmarked?: boolean; // Whether user has bookmarked it
}

export interface BookBookmark {
  id: string; // Unique identifier
  userId: string; // User who bookmarked
  bookId: string; // Book that was bookmarked
  bookData: Book; // Full book data for offline access
  bookmarkedAt: string; // When it was bookmarked
  lastReadPage?: number; // Reading progress
  notes?: string; // User's notes about the book
}
