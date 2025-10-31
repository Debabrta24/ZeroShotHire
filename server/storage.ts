import { 
  type User, 
  type InsertUser,
  type LinkedInProfile,
  type Resume,
  type CareerRoadmap,
  type UserRoadmapProgress,
  type InterviewQuestion,
  type InterviewCategory,
  type InterviewTip,
  type Mentor,
  type SalaryInsight,
  type NegotiationTip,
  type JobApplication,
  type BookBookmark,
  type EventbriteEvent,
} from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface CareerAnalysisResult {
  id: string;
  userId: string;
  skills: string[];
  interests: string[];
  education: string;
  careerGoals: string[];
  workStyle: string;
  location: string;
  salaryExpectation: string;
  recommendations: any[];
  analyzedAt: string;
}

export interface IStorage {
  sessionStore: session.Store;
  
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getLinkedInProfile(userId: string): Promise<LinkedInProfile | undefined>;
  createLinkedInProfile(profile: Omit<LinkedInProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<LinkedInProfile>;
  updateLinkedInProfile(id: string, profile: Partial<LinkedInProfile>): Promise<LinkedInProfile | undefined>;
  
  getResume(userId: string): Promise<Resume | undefined>;
  getResumeById(id: string): Promise<Resume | undefined>;
  createResume(resume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resume>;
  updateResume(id: string, resume: Partial<Resume>): Promise<Resume | undefined>;
  
  getRoadmaps(): Promise<CareerRoadmap[]>;
  getRoadmapById(id: string): Promise<CareerRoadmap | undefined>;
  getUserRoadmapProgress(userId: string, roadmapId: string): Promise<UserRoadmapProgress | undefined>;
  createUserRoadmapProgress(progress: Omit<UserRoadmapProgress, 'id'>): Promise<UserRoadmapProgress>;
  updateUserRoadmapProgress(id: string, progress: Partial<UserRoadmapProgress>): Promise<UserRoadmapProgress | undefined>;
  
  getInterviewCategories(): Promise<InterviewCategory[]>;
  getInterviewQuestions(category?: string): Promise<InterviewQuestion[]>;
  getInterviewTips(): Promise<InterviewTip[]>;
  
  getMentors(): Promise<Mentor[]>;
  
  getSalaryInsights(role?: string): Promise<SalaryInsight[]>;
  getNegotiationTips(): Promise<NegotiationTip[]>;
  
  getJobApplications(userId: string): Promise<JobApplication[]>;
  createJobApplication(application: Omit<JobApplication, 'id'>): Promise<JobApplication>;
  updateJobApplication(id: string, application: Partial<JobApplication>): Promise<JobApplication | undefined>;
  deleteJobApplication(id: string): Promise<boolean>;
  
  saveCareerAnalysis(analysis: Omit<CareerAnalysisResult, 'id'>): Promise<CareerAnalysisResult>;
  getCareerAnalysis(userId: string): Promise<CareerAnalysisResult | undefined>;
  
  getBookBookmarks(userId: string): Promise<BookBookmark[]>;
  createBookBookmark(bookmark: Omit<BookBookmark, 'id'>): Promise<BookBookmark>;
  deleteBookBookmark(id: string): Promise<boolean>;
  updateBookBookmark(id: string, bookmark: Partial<BookBookmark>): Promise<BookBookmark | undefined>;
  
  getCachedEvents(): Promise<{ events: EventbriteEvent[], cachedAt: string } | undefined>;
  setCachedEvents(events: EventbriteEvent[]): Promise<void>;
}

export class MemStorage implements IStorage {
  public sessionStore: session.Store;
  private users: Map<string, User>;
  private linkedInProfiles: Map<string, LinkedInProfile>;
  private resumes: Map<string, Resume>;
  private roadmaps: Map<string, CareerRoadmap>;
  private userRoadmapProgress: Map<string, UserRoadmapProgress>;
  private interviewCategories: Map<string, InterviewCategory>;
  private interviewQuestions: Map<string, InterviewQuestion>;
  private interviewTips: Map<string, InterviewTip>;
  private mentors: Map<string, Mentor>;
  private salaryInsights: Map<string, SalaryInsight>;
  private negotiationTips: Map<string, NegotiationTip>;
  private jobApplications: Map<string, JobApplication>;
  private careerAnalyses: Map<string, CareerAnalysisResult>;
  private bookBookmarks: Map<string, BookBookmark>;
  private eventCache: { events: EventbriteEvent[], cachedAt: string } | undefined;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.users = new Map();
    this.linkedInProfiles = new Map();
    this.resumes = new Map();
    this.roadmaps = new Map();
    this.userRoadmapProgress = new Map();
    this.interviewCategories = new Map();
    this.interviewQuestions = new Map();
    this.interviewTips = new Map();
    this.mentors = new Map();
    this.salaryInsights = new Map();
    this.negotiationTips = new Map();
    this.jobApplications = new Map();
    this.careerAnalyses = new Map();
    this.bookBookmarks = new Map();
    this.eventCache = undefined;
    this.initializeRoadmaps();
    this.initializeInterviewData();
    this.initializeMentors();
    this.initializeSalaryData();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLinkedInProfile(userId: string): Promise<LinkedInProfile | undefined> {
    return Array.from(this.linkedInProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createLinkedInProfile(profile: Omit<LinkedInProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<LinkedInProfile> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const linkedInProfile: LinkedInProfile = { 
      ...profile, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.linkedInProfiles.set(id, linkedInProfile);
    return linkedInProfile;
  }

  async updateLinkedInProfile(id: string, profile: Partial<LinkedInProfile>): Promise<LinkedInProfile | undefined> {
    const existing = this.linkedInProfiles.get(id);
    if (!existing) return undefined;
    
    const updated: LinkedInProfile = {
      ...existing,
      ...profile,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };
    this.linkedInProfiles.set(id, updated);
    return updated;
  }

  async getResume(userId: string): Promise<Resume | undefined> {
    return Array.from(this.resumes.values()).find(
      (resume) => resume.userId === userId
    );
  }

  async getResumeById(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async createResume(resume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resume> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newResume: Resume = { 
      ...resume, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.resumes.set(id, newResume);
    return newResume;
  }

  async updateResume(id: string, resume: Partial<Resume>): Promise<Resume | undefined> {
    const existing = this.resumes.get(id);
    if (!existing) return undefined;
    
    const updated: Resume = {
      ...existing,
      ...resume,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };
    this.resumes.set(id, updated);
    return updated;
  }

  async getRoadmaps(): Promise<CareerRoadmap[]> {
    return Array.from(this.roadmaps.values());
  }

  async getRoadmapById(id: string): Promise<CareerRoadmap | undefined> {
    return this.roadmaps.get(id);
  }

  async getUserRoadmapProgress(userId: string, roadmapId: string): Promise<UserRoadmapProgress | undefined> {
    return Array.from(this.userRoadmapProgress.values()).find(
      (progress) => progress.userId === userId && progress.roadmapId === roadmapId
    );
  }

  async createUserRoadmapProgress(progress: Omit<UserRoadmapProgress, 'id'>): Promise<UserRoadmapProgress> {
    const id = randomUUID();
    const userProgress: UserRoadmapProgress = { ...progress, id };
    this.userRoadmapProgress.set(id, userProgress);
    return userProgress;
  }

  async updateUserRoadmapProgress(id: string, progress: Partial<UserRoadmapProgress>): Promise<UserRoadmapProgress | undefined> {
    const existing = this.userRoadmapProgress.get(id);
    if (!existing) return undefined;
    
    const updated: UserRoadmapProgress = {
      ...existing,
      ...progress,
      id: existing.id
    };
    this.userRoadmapProgress.set(id, updated);
    return updated;
  }

  private initializeRoadmaps() {
    const webDevRoadmap: CareerRoadmap = {
      id: "web-dev-roadmap",
      title: "Web Developer",
      description: "Become a full-stack web developer and build modern web applications",
      category: "Web Development",
      difficulty: "Beginner",
      estimatedDuration: 12,
      durationUnit: "months",
      requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL"],
      salaryRange: { min: 70000, max: 130000, currency: "USD" },
      jobDemand: 95,
      milestones: [
        {
          id: "wdm-1",
          order: 1,
          title: "HTML & CSS Fundamentals",
          description: "Master the building blocks of web pages",
          duration: 4,
          durationUnit: "weeks",
          skills: ["HTML5", "CSS3", "Flexbox", "Grid"],
          tasks: [
            "Learn HTML structure and semantic elements",
            "Master CSS styling and layouts",
            "Build 3 responsive web pages",
            "Understand accessibility basics"
          ],
          resources: [
            {
              id: "r1",
              title: "HTML & CSS Course",
              type: "course",
              provider: "freeCodeCamp",
              isFree: true,
              estimatedTime: 20
            }
          ],
          isCompleted: false
        },
        {
          id: "wdm-2",
          order: 2,
          title: "JavaScript Fundamentals",
          description: "Learn core JavaScript programming",
          duration: 8,
          durationUnit: "weeks",
          skills: ["JavaScript", "ES6+", "DOM Manipulation", "Async/Await"],
          tasks: [
            "Understand variables, functions, and scope",
            "Master arrays, objects, and loops",
            "Learn DOM manipulation",
            "Build 5 interactive projects"
          ],
          resources: [
            {
              id: "r2",
              title: "JavaScript Complete Guide",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 50
            }
          ],
          isCompleted: false
        },
        {
          id: "wdm-3",
          order: 3,
          title: "React & Modern Frontend",
          description: "Build dynamic user interfaces with React",
          duration: 8,
          durationUnit: "weeks",
          skills: ["React", "Hooks", "State Management", "React Router"],
          tasks: [
            "Learn React components and props",
            "Master hooks and state management",
            "Build a multi-page React application",
            "Implement routing and authentication"
          ],
          resources: [
            {
              id: "r3",
              title: "React - The Complete Guide",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 60
            }
          ],
          isCompleted: false
        },
        {
          id: "wdm-4",
          order: 4,
          title: "Backend with Node.js",
          description: "Create server-side applications",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Node.js", "Express", "REST APIs", "Authentication"],
          tasks: [
            "Set up Node.js server",
            "Build RESTful APIs",
            "Implement authentication",
            "Connect to databases"
          ],
          resources: [
            {
              id: "r4",
              title: "Node.js Complete Guide",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 45
            }
          ],
          isCompleted: false
        },
        {
          id: "wdm-5",
          order: 5,
          title: "Databases & Deployment",
          description: "Store data and deploy applications",
          duration: 6,
          durationUnit: "weeks",
          skills: ["PostgreSQL", "MongoDB", "Git", "Docker", "Cloud Deployment"],
          tasks: [
            "Learn SQL and database design",
            "Master Git version control",
            "Deploy applications to cloud",
            "Build and deploy full-stack project"
          ],
          resources: [
            {
              id: "r5",
              title: "Database Fundamentals",
              type: "course",
              provider: "Coursera",
              isFree: true,
              estimatedTime: 30
            }
          ],
          isCompleted: false
        }
      ]
    };

    const dataScienceRoadmap: CareerRoadmap = {
      id: "data-science-roadmap",
      title: "Data Scientist",
      description: "Master data analysis, machine learning, and AI to drive business insights",
      category: "Data Science",
      difficulty: "Intermediate",
      estimatedDuration: 18,
      durationUnit: "months",
      requiredSkills: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"],
      salaryRange: { min: 90000, max: 160000, currency: "USD" },
      jobDemand: 92,
      milestones: [
        {
          id: "dsm-1",
          order: 1,
          title: "Python Programming",
          description: "Master Python for data science",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Python", "NumPy", "Pandas", "Jupyter"],
          tasks: [
            "Learn Python syntax and basics",
            "Master NumPy for numerical computing",
            "Learn Pandas for data manipulation",
            "Complete 10 data analysis exercises"
          ],
          resources: [
            {
              id: "ds-r1",
              title: "Python for Data Science",
              type: "course",
              provider: "Coursera",
              isFree: true,
              estimatedTime: 40
            }
          ],
          isCompleted: false
        },
        {
          id: "dsm-2",
          order: 2,
          title: "Statistics & Probability",
          description: "Understand statistical foundations",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Statistics", "Probability", "Hypothesis Testing", "A/B Testing"],
          tasks: [
            "Learn descriptive statistics",
            "Master probability distributions",
            "Understand hypothesis testing",
            "Perform statistical analysis on datasets"
          ],
          resources: [
            {
              id: "ds-r2",
              title: "Statistics Fundamentals",
              type: "course",
              provider: "Khan Academy",
              isFree: true,
              estimatedTime: 50
            }
          ],
          isCompleted: false
        },
        {
          id: "dsm-3",
          order: 3,
          title: "Machine Learning Basics",
          description: "Learn fundamental ML algorithms",
          duration: 12,
          durationUnit: "weeks",
          skills: ["Scikit-learn", "Supervised Learning", "Unsupervised Learning", "Model Evaluation"],
          tasks: [
            "Understand regression and classification",
            "Learn clustering and dimensionality reduction",
            "Master model evaluation techniques",
            "Build 5 ML projects"
          ],
          resources: [
            {
              id: "ds-r3",
              title: "Machine Learning A-Z",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 70
            }
          ],
          isCompleted: false
        },
        {
          id: "dsm-4",
          order: 4,
          title: "Data Visualization",
          description: "Create compelling data visualizations",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Matplotlib", "Seaborn", "Plotly", "Tableau"],
          tasks: [
            "Master visualization libraries",
            "Create interactive dashboards",
            "Design effective charts and graphs",
            "Build data storytelling portfolio"
          ],
          resources: [
            {
              id: "ds-r4",
              title: "Data Visualization Guide",
              type: "course",
              provider: "DataCamp",
              isFree: false,
              estimatedTime: 35
            }
          ],
          isCompleted: false
        },
        {
          id: "dsm-5",
          order: 5,
          title: "Deep Learning & Advanced ML",
          description: "Master neural networks and deep learning",
          duration: 12,
          durationUnit: "weeks",
          skills: ["TensorFlow", "PyTorch", "Neural Networks", "NLP", "Computer Vision"],
          tasks: [
            "Learn neural network fundamentals",
            "Build CNNs for image processing",
            "Implement NLP models",
            "Create capstone ML project"
          ],
          resources: [
            {
              id: "ds-r5",
              title: "Deep Learning Specialization",
              type: "course",
              provider: "Coursera",
              isFree: false,
              estimatedTime: 80
            }
          ],
          isCompleted: false
        }
      ]
    };

    const mobileDevRoadmap: CareerRoadmap = {
      id: "mobile-dev-roadmap",
      title: "Mobile Developer",
      description: "Build native and cross-platform mobile applications for iOS and Android",
      category: "Mobile Development",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Swift", "Kotlin", "React Native", "Mobile UI/UX", "API Integration"],
      salaryRange: { min: 75000, max: 140000, currency: "USD" },
      jobDemand: 88,
      milestones: [
        {
          id: "mdm-1",
          order: 1,
          title: "Mobile Development Fundamentals",
          description: "Understand mobile app architecture and platform differences",
          duration: 4,
          durationUnit: "weeks",
          skills: ["Mobile Architecture", "UI Guidelines", "App Lifecycle"],
          tasks: [
            "Learn iOS and Android platform differences",
            "Understand mobile app lifecycle",
            "Study mobile UI/UX principles",
            "Set up development environments"
          ],
          resources: [
            {
              id: "md-r1",
              title: "Mobile Development Basics",
              type: "course",
              provider: "Udacity",
              isFree: true,
              estimatedTime: 25
            }
          ],
          isCompleted: false
        },
        {
          id: "mdm-2",
          order: 2,
          title: "Native iOS Development",
          description: "Build iOS apps with Swift and SwiftUI",
          duration: 10,
          durationUnit: "weeks",
          skills: ["Swift", "SwiftUI", "UIKit", "Xcode"],
          tasks: [
            "Master Swift programming language",
            "Learn SwiftUI for modern iOS apps",
            "Implement navigation and data flow",
            "Build 3 iOS applications"
          ],
          resources: [
            {
              id: "md-r2",
              title: "iOS Development Bootcamp",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 60
            }
          ],
          isCompleted: false
        },
        {
          id: "mdm-3",
          order: 3,
          title: "Android Development",
          description: "Create Android apps with Kotlin",
          duration: 10,
          durationUnit: "weeks",
          skills: ["Kotlin", "Jetpack Compose", "Android Studio", "Material Design"],
          tasks: [
            "Learn Kotlin programming",
            "Master Jetpack Compose",
            "Implement MVVM architecture",
            "Build 3 Android applications"
          ],
          resources: [
            {
              id: "md-r3",
              title: "Android Kotlin Developer",
              type: "course",
              provider: "Google",
              isFree: true,
              estimatedTime: 55
            }
          ],
          isCompleted: false
        },
        {
          id: "mdm-4",
          order: 4,
          title: "Cross-Platform Development",
          description: "Build apps for both platforms with React Native",
          duration: 8,
          durationUnit: "weeks",
          skills: ["React Native", "Expo", "Cross-Platform UI", "State Management"],
          tasks: [
            "Learn React Native fundamentals",
            "Master cross-platform navigation",
            "Implement native modules",
            "Build production-ready app"
          ],
          resources: [
            {
              id: "md-r4",
              title: "React Native Guide",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 45
            }
          ],
          isCompleted: false
        }
      ]
    };

    const mlEngineerRoadmap: CareerRoadmap = {
      id: "ml-engineer-roadmap",
      title: "Machine Learning Engineer",
      description: "Design, build, and deploy production ML systems at scale",
      category: "Machine Learning",
      difficulty: "Advanced",
      estimatedDuration: 11,
      durationUnit: "months",
      requiredSkills: ["Python", "TensorFlow", "PyTorch", "MLOps", "Cloud Platforms", "System Design"],
      salaryRange: { min: 110000, max: 200000, currency: "USD" },
      jobDemand: 94,
      milestones: [
        {
          id: "mle-1",
          order: 1,
          title: "ML Fundamentals & Mathematics",
          description: "Build strong mathematical foundation",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Linear Algebra", "Calculus", "Statistics", "Python"],
          tasks: [
            "Master linear algebra and calculus",
            "Learn probability and statistics",
            "Implement ML algorithms from scratch",
            "Complete mathematical foundations"
          ],
          resources: [
            {
              id: "mle-r1",
              title: "Mathematics for ML",
              type: "course",
              provider: "Coursera",
              isFree: true,
              estimatedTime: 50
            }
          ],
          isCompleted: false
        },
        {
          id: "mle-2",
          order: 2,
          title: "Deep Learning & Neural Networks",
          description: "Master modern deep learning architectures",
          duration: 12,
          durationUnit: "weeks",
          skills: ["TensorFlow", "PyTorch", "CNNs", "RNNs", "Transformers"],
          tasks: [
            "Learn neural network architectures",
            "Implement CNNs and RNNs",
            "Master attention mechanisms",
            "Build deep learning projects"
          ],
          resources: [
            {
              id: "mle-r2",
              title: "Deep Learning Specialization",
              type: "course",
              provider: "Coursera",
              isFree: false,
              estimatedTime: 90
            }
          ],
          isCompleted: false
        },
        {
          id: "mle-3",
          order: 3,
          title: "MLOps & Production Systems",
          description: "Deploy and maintain ML models in production",
          duration: 10,
          durationUnit: "weeks",
          skills: ["MLflow", "Docker", "Kubernetes", "CI/CD", "Model Monitoring"],
          tasks: [
            "Learn ML pipeline development",
            "Master model deployment",
            "Implement monitoring systems",
            "Build end-to-end ML system"
          ],
          resources: [
            {
              id: "mle-r3",
              title: "MLOps Fundamentals",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 40
            }
          ],
          isCompleted: false
        },
        {
          id: "mle-4",
          order: 4,
          title: "Advanced Topics & Specialization",
          description: "Specialize in NLP, Computer Vision, or RL",
          duration: 12,
          durationUnit: "weeks",
          skills: ["NLP", "Computer Vision", "Reinforcement Learning", "LLMs"],
          tasks: [
            "Choose specialization area",
            "Master advanced techniques",
            "Build portfolio projects",
            "Create capstone ML system"
          ],
          resources: [
            {
              id: "mle-r4",
              title: "Advanced ML Topics",
              type: "course",
              provider: "Stanford",
              isFree: true,
              estimatedTime: 80
            }
          ],
          isCompleted: false
        }
      ]
    };

    const devOpsRoadmap: CareerRoadmap = {
      id: "devops-roadmap",
      title: "DevOps Engineer",
      description: "Automate infrastructure, enable CI/CD, and ensure system reliability",
      category: "DevOps",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS/Azure", "Terraform"],
      salaryRange: { min: 95000, max: 170000, currency: "USD" },
      jobDemand: 91,
      milestones: [
        {
          id: "dvm-1",
          order: 1,
          title: "Linux & Scripting",
          description: "Master Linux administration and shell scripting",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Linux", "Bash", "Python", "Networking"],
          tasks: [
            "Learn Linux system administration",
            "Master Bash scripting",
            "Understand networking fundamentals",
            "Automate system tasks"
          ],
          resources: [
            {
              id: "dv-r1",
              title: "Linux for DevOps",
              type: "course",
              provider: "Linux Academy",
              isFree: false,
              estimatedTime: 40
            }
          ],
          isCompleted: false
        },
        {
          id: "dvm-2",
          order: 2,
          title: "Containerization & Orchestration",
          description: "Deploy applications with Docker and Kubernetes",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Docker", "Kubernetes", "Container Security", "Helm"],
          tasks: [
            "Master Docker containerization",
            "Learn Kubernetes orchestration",
            "Implement container security",
            "Deploy microservices architecture"
          ],
          resources: [
            {
              id: "dv-r2",
              title: "Docker & Kubernetes Guide",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 50
            }
          ],
          isCompleted: false
        },
        {
          id: "dvm-3",
          order: 3,
          title: "CI/CD Pipelines",
          description: "Automate build, test, and deployment",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Jenkins", "GitLab CI", "GitHub Actions", "ArgoCD"],
          tasks: [
            "Set up CI/CD pipelines",
            "Implement automated testing",
            "Configure deployment automation",
            "Build complete CI/CD workflow"
          ],
          resources: [
            {
              id: "dv-r3",
              title: "CI/CD Mastery",
              type: "course",
              provider: "Coursera",
              isFree: true,
              estimatedTime: 35
            }
          ],
          isCompleted: false
        },
        {
          id: "dvm-4",
          order: 4,
          title: "Cloud & Infrastructure as Code",
          description: "Manage cloud infrastructure programmatically",
          duration: 10,
          durationUnit: "weeks",
          skills: ["AWS", "Terraform", "Ansible", "CloudFormation"],
          tasks: [
            "Learn cloud platforms (AWS/Azure)",
            "Master Terraform for IaC",
            "Implement configuration management",
            "Build scalable cloud infrastructure"
          ],
          resources: [
            {
              id: "dv-r4",
              title: "Terraform & AWS",
              type: "course",
              provider: "A Cloud Guru",
              isFree: false,
              estimatedTime: 45
            }
          ],
          isCompleted: false
        }
      ]
    };

    const cloudArchitectRoadmap: CareerRoadmap = {
      id: "cloud-architect-roadmap",
      title: "Cloud Solutions Architect",
      description: "Design scalable, secure, and cost-effective cloud architectures",
      category: "Cloud Computing",
      difficulty: "Advanced",
      estimatedDuration: 9,
      durationUnit: "months",
      requiredSkills: ["AWS/Azure/GCP", "System Design", "Security", "Networking", "Cost Optimization"],
      salaryRange: { min: 120000, max: 190000, currency: "USD" },
      jobDemand: 89,
      milestones: [
        {
          id: "cam-1",
          order: 1,
          title: "Cloud Fundamentals",
          description: "Understand cloud computing concepts and services",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Cloud Concepts", "AWS/Azure Basics", "Compute", "Storage"],
          tasks: [
            "Learn cloud service models",
            "Understand compute services",
            "Master storage solutions",
            "Get AWS/Azure certification"
          ],
          resources: [
            {
              id: "ca-r1",
              title: "AWS Cloud Practitioner",
              type: "course",
              provider: "AWS Training",
              isFree: true,
              estimatedTime: 30
            }
          ],
          isCompleted: false
        },
        {
          id: "cam-2",
          order: 2,
          title: "Advanced Cloud Services",
          description: "Master databases, networking, and serverless",
          duration: 10,
          durationUnit: "weeks",
          skills: ["RDS", "VPC", "Lambda", "API Gateway", "CloudFront"],
          tasks: [
            "Learn database services",
            "Master cloud networking",
            "Implement serverless architectures",
            "Build multi-tier applications"
          ],
          resources: [
            {
              id: "ca-r2",
              title: "AWS Solutions Architect",
              type: "course",
              provider: "A Cloud Guru",
              isFree: false,
              estimatedTime: 60
            }
          ],
          isCompleted: false
        },
        {
          id: "cam-3",
          order: 3,
          title: "Security & Compliance",
          description: "Implement cloud security best practices",
          duration: 8,
          durationUnit: "weeks",
          skills: ["IAM", "Security Groups", "Encryption", "Compliance"],
          tasks: [
            "Master identity management",
            "Implement security controls",
            "Ensure compliance requirements",
            "Design secure architectures"
          ],
          resources: [
            {
              id: "ca-r3",
              title: "Cloud Security",
              type: "course",
              provider: "Coursera",
              isFree: false,
              estimatedTime: 40
            }
          ],
          isCompleted: false
        },
        {
          id: "cam-4",
          order: 4,
          title: "Architecture Design & Optimization",
          description: "Design resilient and cost-effective solutions",
          duration: 10,
          durationUnit: "weeks",
          skills: ["Well-Architected Framework", "Cost Optimization", "High Availability"],
          tasks: [
            "Learn architecture patterns",
            "Master cost optimization",
            "Design for high availability",
            "Create architecture proposals"
          ],
          resources: [
            {
              id: "ca-r4",
              title: "Well-Architected Framework",
              type: "course",
              provider: "AWS",
              isFree: true,
              estimatedTime: 35
            }
          ],
          isCompleted: false
        }
      ]
    };

    const cybersecurityRoadmap: CareerRoadmap = {
      id: "cybersecurity-roadmap",
      title: "Cybersecurity Specialist",
      description: "Protect systems and data from cyber threats and vulnerabilities",
      category: "Cybersecurity",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Network Security", "Penetration Testing", "SIEM", "Compliance", "Incident Response"],
      salaryRange: { min: 85000, max: 155000, currency: "USD" },
      jobDemand: 93,
      milestones: [
        {
          id: "csm-1",
          order: 1,
          title: "Security Fundamentals",
          description: "Learn core security concepts and principles",
          duration: 6,
          durationUnit: "weeks",
          skills: ["CIA Triad", "Cryptography", "Network Security", "Security Policies"],
          tasks: [
            "Understand security principles",
            "Learn cryptography basics",
            "Master network security",
            "Get Security+ certification"
          ],
          resources: [
            {
              id: "cs-r1",
              title: "Security+ Certification",
              type: "course",
              provider: "CompTIA",
              isFree: false,
              estimatedTime: 50
            }
          ],
          isCompleted: false
        },
        {
          id: "csm-2",
          order: 2,
          title: "Ethical Hacking & Pentesting",
          description: "Learn offensive security techniques",
          duration: 10,
          durationUnit: "weeks",
          skills: ["Kali Linux", "Metasploit", "Web Application Security", "Exploit Development"],
          tasks: [
            "Master penetration testing tools",
            "Learn vulnerability assessment",
            "Practice on HackTheBox/TryHackMe",
            "Get CEH certification"
          ],
          resources: [
            {
              id: "cs-r2",
              title: "Ethical Hacking Course",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 65
            }
          ],
          isCompleted: false
        },
        {
          id: "csm-3",
          order: 3,
          title: "Security Operations",
          description: "Monitor and respond to security incidents",
          duration: 8,
          durationUnit: "weeks",
          skills: ["SIEM", "Log Analysis", "Incident Response", "Threat Hunting"],
          tasks: [
            "Learn SIEM tools",
            "Master incident response",
            "Implement security monitoring",
            "Practice threat hunting"
          ],
          resources: [
            {
              id: "cs-r3",
              title: "SOC Analyst Training",
              type: "course",
              provider: "Cybrary",
              isFree: true,
              estimatedTime: 45
            }
          ],
          isCompleted: false
        },
        {
          id: "csm-4",
          order: 4,
          title: "Advanced Security & Compliance",
          description: "Master governance and compliance frameworks",
          duration: 8,
          durationUnit: "weeks",
          skills: ["GDPR", "HIPAA", "ISO 27001", "Risk Management"],
          tasks: [
            "Learn compliance frameworks",
            "Implement security controls",
            "Conduct risk assessments",
            "Build security program"
          ],
          resources: [
            {
              id: "cs-r4",
              title: "Security Governance",
              type: "course",
              provider: "SANS",
              isFree: false,
              estimatedTime: 50
            }
          ],
          isCompleted: false
        }
      ]
    };

    const uxDesignerRoadmap: CareerRoadmap = {
      id: "ux-designer-roadmap",
      title: "UI/UX Designer",
      description: "Create beautiful, intuitive user experiences for digital products",
      category: "UI/UX Design",
      difficulty: "Beginner",
      estimatedDuration: 7,
      durationUnit: "months",
      requiredSkills: ["Figma", "User Research", "Wireframing", "Prototyping", "Visual Design"],
      salaryRange: { min: 65000, max: 125000, currency: "USD" },
      jobDemand: 87,
      milestones: [
        {
          id: "uxm-1",
          order: 1,
          title: "Design Fundamentals",
          description: "Master visual design principles",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Color Theory", "Typography", "Layout", "Design Systems"],
          tasks: [
            "Learn design principles",
            "Study color and typography",
            "Understand visual hierarchy",
            "Create design compositions"
          ],
          resources: [
            {
              id: "ux-r1",
              title: "Graphic Design Basics",
              type: "course",
              provider: "Skillshare",
              isFree: false,
              estimatedTime: 20
            }
          ],
          isCompleted: false
        },
        {
          id: "uxm-2",
          order: 2,
          title: "UX Research & Strategy",
          description: "Learn user research methodologies",
          duration: 8,
          durationUnit: "weeks",
          skills: ["User Research", "Personas", "Journey Mapping", "Usability Testing"],
          tasks: [
            "Conduct user interviews",
            "Create user personas",
            "Map user journeys",
            "Perform usability tests"
          ],
          resources: [
            {
              id: "ux-r2",
              title: "UX Research Methods",
              type: "course",
              provider: "Nielsen Norman Group",
              isFree: false,
              estimatedTime: 30
            }
          ],
          isCompleted: false
        },
        {
          id: "uxm-3",
          order: 3,
          title: "UI Design & Tools",
          description: "Master design tools and create interfaces",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
          tasks: [
            "Master Figma design tool",
            "Create wireframes and mockups",
            "Build interactive prototypes",
            "Design mobile and web interfaces"
          ],
          resources: [
            {
              id: "ux-r3",
              title: "Figma UI/UX Design",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 40
            }
          ],
          isCompleted: false
        },
        {
          id: "uxm-4",
          order: 4,
          title: "Portfolio & Specialization",
          description: "Build portfolio and specialize",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Portfolio Design", "Case Studies", "Design Thinking"],
          tasks: [
            "Create 5 portfolio projects",
            "Write case studies",
            "Build design portfolio site",
            "Practice design challenges"
          ],
          resources: [
            {
              id: "ux-r4",
              title: "UX Portfolio Guide",
              type: "article",
              provider: "Medium",
              isFree: true,
              estimatedTime: 15
            }
          ],
          isCompleted: false
        }
      ]
    };

    const productManagerRoadmap: CareerRoadmap = {
      id: "product-manager-roadmap",
      title: "Product Manager",
      description: "Lead product strategy, development, and launch successful products",
      category: "Product Management",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Product Strategy", "Analytics", "User Stories", "Agile", "Stakeholder Management"],
      salaryRange: { min: 90000, max: 165000, currency: "USD" },
      jobDemand: 85,
      milestones: [
        {
          id: "pmm-1",
          order: 1,
          title: "Product Management Fundamentals",
          description: "Learn core PM concepts and frameworks",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Product Lifecycle", "Market Research", "Product Vision", "Roadmapping"],
          tasks: [
            "Understand PM role and responsibilities",
            "Learn product development lifecycle",
            "Create product roadmaps",
            "Study successful products"
          ],
          resources: [
            {
              id: "pm-r1",
              title: "Product Management 101",
              type: "course",
              provider: "Product School",
              isFree: true,
              estimatedTime: 25
            }
          ],
          isCompleted: false
        },
        {
          id: "pmm-2",
          order: 2,
          title: "User Research & Analytics",
          description: "Make data-driven product decisions",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Analytics", "A/B Testing", "User Interviews", "Metrics"],
          tasks: [
            "Master product analytics tools",
            "Learn A/B testing frameworks",
            "Conduct user research",
            "Define success metrics (KPIs)"
          ],
          resources: [
            {
              id: "pm-r2",
              title: "Data-Driven PM",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 35
            }
          ],
          isCompleted: false
        },
        {
          id: "pmm-3",
          order: 3,
          title: "Agile & Execution",
          description: "Lead agile teams and ship products",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Scrum", "User Stories", "Prioritization", "Sprint Planning"],
          tasks: [
            "Learn Agile methodologies",
            "Write effective user stories",
            "Master prioritization frameworks",
            "Lead sprint planning"
          ],
          resources: [
            {
              id: "pm-r3",
              title: "Agile Product Management",
              type: "course",
              provider: "Coursera",
              isFree: true,
              estimatedTime: 30
            }
          ],
          isCompleted: false
        },
        {
          id: "pmm-4",
          order: 4,
          title: "Strategy & Leadership",
          description: "Develop product strategy and lead teams",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Product Strategy", "Stakeholder Management", "Go-to-Market", "Leadership"],
          tasks: [
            "Create product strategy",
            "Manage stakeholders",
            "Plan product launches",
            "Lead cross-functional teams"
          ],
          resources: [
            {
              id: "pm-r4",
              title: "Strategic Product Leadership",
              type: "book",
              provider: "Amazon",
              isFree: false,
              estimatedTime: 20
            }
          ],
          isCompleted: false
        }
      ]
    };

    const gameDevRoadmap: CareerRoadmap = {
      id: "game-dev-roadmap",
      title: "Game Developer",
      description: "Create engaging games for PC, console, and mobile platforms",
      category: "Game Development",
      difficulty: "Intermediate",
      estimatedDuration: 9,
      durationUnit: "months",
      requiredSkills: ["Unity", "Unreal Engine", "C#", "C++", "Game Design", "3D Graphics"],
      salaryRange: { min: 60000, max: 130000, currency: "USD" },
      jobDemand: 78,
      milestones: [
        {
          id: "gdm-1",
          order: 1,
          title: "Game Development Basics",
          description: "Learn fundamental game development concepts",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Game Design", "Unity Basics", "C# Programming", "2D Games"],
          tasks: [
            "Learn game design principles",
            "Master C# programming",
            "Create 2D games in Unity",
            "Understand game loops and physics"
          ],
          resources: [
            {
              id: "gd-r1",
              title: "Unity Game Development",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 40
            }
          ],
          isCompleted: false
        },
        {
          id: "gdm-2",
          order: 2,
          title: "3D Game Development",
          description: "Build immersive 3D game experiences",
          duration: 10,
          durationUnit: "weeks",
          skills: ["3D Modeling", "Animation", "Lighting", "Shaders"],
          tasks: [
            "Learn 3D game development",
            "Master character animation",
            "Implement lighting systems",
            "Create 3D game project"
          ],
          resources: [
            {
              id: "gd-r2",
              title: "3D Game Programming",
              type: "course",
              provider: "Coursera",
              isFree: false,
              estimatedTime: 55
            }
          ],
          isCompleted: false
        },
        {
          id: "gdm-3",
          order: 3,
          title: "Advanced Game Systems",
          description: "Implement AI, multiplayer, and optimization",
          duration: 10,
          durationUnit: "weeks",
          skills: ["Game AI", "Multiplayer", "Optimization", "Audio"],
          tasks: [
            "Implement game AI systems",
            "Build multiplayer functionality",
            "Optimize game performance",
            "Create complete game prototype"
          ],
          resources: [
            {
              id: "gd-r3",
              title: "Advanced Unity",
              type: "course",
              provider: "Unity Learn",
              isFree: true,
              estimatedTime: 50
            }
          ],
          isCompleted: false
        },
        {
          id: "gdm-4",
          order: 4,
          title: "Game Polish & Publishing",
          description: "Polish games and publish to platforms",
          duration: 8,
          durationUnit: "weeks",
          skills: ["UI/UX", "Sound Design", "Publishing", "Marketing"],
          tasks: [
            "Polish game UI/UX",
            "Implement sound and music",
            "Publish to app stores",
            "Market your game"
          ],
          resources: [
            {
              id: "gd-r4",
              title: "Game Publishing Guide",
              type: "article",
              provider: "Gamasutra",
              isFree: true,
              estimatedTime: 20
            }
          ],
          isCompleted: false
        }
      ]
    };

    const blockchainDevRoadmap: CareerRoadmap = {
      id: "blockchain-dev-roadmap",
      title: "Blockchain Developer",
      description: "Build decentralized applications and smart contracts",
      category: "Blockchain",
      difficulty: "Advanced",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Solidity", "Ethereum", "Web3.js", "Smart Contracts", "Cryptography"],
      salaryRange: { min: 100000, max: 180000, currency: "USD" },
      jobDemand: 82,
      milestones: [
        {
          id: "bdm-1",
          order: 1,
          title: "Blockchain Fundamentals",
          description: "Understand blockchain technology and cryptocurrencies",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Blockchain Concepts", "Cryptography", "Bitcoin", "Consensus"],
          tasks: [
            "Learn blockchain fundamentals",
            "Understand cryptography basics",
            "Study Bitcoin and Ethereum",
            "Explore consensus mechanisms"
          ],
          resources: [
            {
              id: "bd-r1",
              title: "Blockchain Basics",
              type: "course",
              provider: "Coursera",
              isFree: true,
              estimatedTime: 30
            }
          ],
          isCompleted: false
        },
        {
          id: "bdm-2",
          order: 2,
          title: "Smart Contract Development",
          description: "Write and deploy smart contracts on Ethereum",
          duration: 10,
          durationUnit: "weeks",
          skills: ["Solidity", "Remix", "Truffle", "Hardhat"],
          tasks: [
            "Master Solidity programming",
            "Write smart contracts",
            "Test and debug contracts",
            "Deploy to testnets"
          ],
          resources: [
            {
              id: "bd-r2",
              title: "Ethereum Smart Contracts",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 50
            }
          ],
          isCompleted: false
        },
        {
          id: "bdm-3",
          order: 3,
          title: "DApp Development",
          description: "Build decentralized applications",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Web3.js", "Ethers.js", "IPFS", "MetaMask"],
          tasks: [
            "Learn Web3.js library",
            "Connect frontend to blockchain",
            "Implement wallet integration",
            "Build full DApp"
          ],
          resources: [
            {
              id: "bd-r3",
              title: "DApp Development",
              type: "course",
              provider: "ConsenSys",
              isFree: true,
              estimatedTime: 40
            }
          ],
          isCompleted: false
        },
        {
          id: "bdm-4",
          order: 4,
          title: "Advanced Blockchain & Security",
          description: "Master security and advanced topics",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Security", "DeFi", "NFTs", "Layer 2"],
          tasks: [
            "Learn smart contract security",
            "Explore DeFi protocols",
            "Build NFT marketplace",
            "Study Layer 2 solutions"
          ],
          resources: [
            {
              id: "bd-r4",
              title: "Blockchain Security",
              type: "course",
              provider: "OpenZeppelin",
              isFree: true,
              estimatedTime: 35
            }
          ],
          isCompleted: false
        }
      ]
    };

    const qaEngineerRoadmap: CareerRoadmap = {
      id: "qa-engineer-roadmap",
      title: "QA Engineer",
      description: "Ensure software quality through testing and automation",
      category: "Software Architecture",
      difficulty: "Beginner",
      estimatedDuration: 7,
      durationUnit: "months",
      requiredSkills: ["Test Automation", "Selenium", "API Testing", "Performance Testing", "CI/CD"],
      salaryRange: { min: 60000, max: 110000, currency: "USD" },
      jobDemand: 84,
      milestones: [
        {
          id: "qam-1",
          order: 1,
          title: "Testing Fundamentals",
          description: "Learn software testing principles and methodologies",
          duration: 4,
          durationUnit: "weeks",
          skills: ["Test Planning", "Test Cases", "Bug Tracking", "QA Process"],
          tasks: [
            "Understand testing types",
            "Write test cases and plans",
            "Learn bug tracking tools",
            "Practice manual testing"
          ],
          resources: [
            {
              id: "qa-r1",
              title: "Software Testing Fundamentals",
              type: "course",
              provider: "ISTQB",
              isFree: true,
              estimatedTime: 25
            }
          ],
          isCompleted: false
        },
        {
          id: "qam-2",
          order: 2,
          title: "Test Automation",
          description: "Automate tests with Selenium and frameworks",
          duration: 10,
          durationUnit: "weeks",
          skills: ["Selenium", "Python/Java", "Test Frameworks", "Page Object Model"],
          tasks: [
            "Learn Selenium WebDriver",
            "Master test automation frameworks",
            "Implement Page Object Model",
            "Build automated test suites"
          ],
          resources: [
            {
              id: "qa-r2",
              title: "Selenium Automation",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 45
            }
          ],
          isCompleted: false
        },
        {
          id: "qam-3",
          order: 3,
          title: "API & Performance Testing",
          description: "Test APIs and application performance",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Postman", "JMeter", "API Testing", "Load Testing"],
          tasks: [
            "Master API testing with Postman",
            "Learn performance testing",
            "Conduct load and stress tests",
            "Analyze performance metrics"
          ],
          resources: [
            {
              id: "qa-r3",
              title: "API Testing Guide",
              type: "course",
              provider: "Test Automation University",
              isFree: true,
              estimatedTime: 30
            }
          ],
          isCompleted: false
        },
        {
          id: "qam-4",
          order: 4,
          title: "CI/CD & Advanced Testing",
          description: "Integrate tests into CI/CD pipelines",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Jenkins", "GitHub Actions", "Docker", "Test Strategy"],
          tasks: [
            "Set up CI/CD pipelines",
            "Integrate automated tests",
            "Implement test reporting",
            "Develop test strategies"
          ],
          resources: [
            {
              id: "qa-r4",
              title: "CI/CD for QA",
              type: "course",
              provider: "LinkedIn Learning",
              isFree: false,
              estimatedTime: 25
            }
          ],
          isCompleted: false
        }
      ]
    };

    const fullStackDevRoadmap: CareerRoadmap = {
      id: "fullstack-dev-roadmap",
      title: "Full-Stack Developer",
      description: "Master both frontend and backend development for complete web applications",
      category: "Web Development",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
      salaryRange: { min: 80000, max: 150000, currency: "USD" },
      jobDemand: 96,
      milestones: [
        {
          id: "fsm-1",
          order: 1,
          title: "Frontend Mastery",
          description: "Build modern, responsive user interfaces",
          duration: 8,
          durationUnit: "weeks",
          skills: ["React", "TypeScript", "Tailwind CSS", "State Management"],
          tasks: [
            "Master React and TypeScript",
            "Learn modern CSS frameworks",
            "Implement state management",
            "Build responsive applications"
          ],
          resources: [
            {
              id: "fs-r1",
              title: "Modern React with TypeScript",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 50
            }
          ],
          isCompleted: false
        },
        {
          id: "fsm-2",
          order: 2,
          title: "Backend Development",
          description: "Create robust server-side applications",
          duration: 10,
          durationUnit: "weeks",
          skills: ["Node.js", "Express", "PostgreSQL", "Authentication", "APIs"],
          tasks: [
            "Build REST APIs with Node.js",
            "Implement authentication systems",
            "Design database schemas",
            "Handle file uploads and processing"
          ],
          resources: [
            {
              id: "fs-r2",
              title: "Node.js Backend Development",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 55
            }
          ],
          isCompleted: false
        },
        {
          id: "fsm-3",
          order: 3,
          title: "DevOps & Deployment",
          description: "Deploy and maintain production applications",
          duration: 6,
          durationUnit: "weeks",
          skills: ["Docker", "CI/CD", "AWS", "Nginx", "Monitoring"],
          tasks: [
            "Containerize applications",
            "Set up CI/CD pipelines",
            "Deploy to cloud platforms",
            "Implement monitoring and logging"
          ],
          resources: [
            {
              id: "fs-r3",
              title: "DevOps for Developers",
              type: "course",
              provider: "Coursera",
              isFree: true,
              estimatedTime: 40
            }
          ],
          isCompleted: false
        },
        {
          id: "fsm-4",
          order: 4,
          title: "Advanced Topics & Portfolio",
          description: "Build production-ready applications",
          duration: 8,
          durationUnit: "weeks",
          skills: ["GraphQL", "WebSockets", "Microservices", "Testing"],
          tasks: [
            "Learn GraphQL and WebSockets",
            "Implement comprehensive testing",
            "Build microservices architecture",
            "Create portfolio projects"
          ],
          resources: [
            {
              id: "fs-r4",
              title: "Advanced Full-Stack",
              type: "course",
              provider: "Frontend Masters",
              isFree: false,
              estimatedTime: 60
            }
          ],
          isCompleted: false
        }
      ]
    };

    const backendDevRoadmap: CareerRoadmap = {
      id: "backend-dev-roadmap",
      title: "Backend Developer",
      description: "Build scalable server-side systems and APIs",
      category: "Web Development",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Python/Node.js", "SQL", "Redis", "Microservices", "System Design"],
      salaryRange: { min: 75000, max: 145000, currency: "USD" },
      jobDemand: 90,
      milestones: [
        {
          id: "bem-1",
          order: 1,
          title: "Backend Fundamentals",
          description: "Learn server-side programming and databases",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Python/Node.js", "SQL", "REST APIs", "Authentication"],
          tasks: [
            "Master backend programming language",
            "Learn database fundamentals",
            "Build REST APIs",
            "Implement authentication"
          ],
          resources: [
            {
              id: "be-r1",
              title: "Backend Development Bootcamp",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 45
            }
          ],
          isCompleted: false
        },
        {
          id: "bem-2",
          order: 2,
          title: "Databases & Caching",
          description: "Master data storage and optimization",
          duration: 8,
          durationUnit: "weeks",
          skills: ["PostgreSQL", "MongoDB", "Redis", "Query Optimization"],
          tasks: [
            "Design efficient database schemas",
            "Optimize database queries",
            "Implement caching strategies",
            "Work with NoSQL databases"
          ],
          resources: [
            {
              id: "be-r2",
              title: "Database Design & Optimization",
              type: "course",
              provider: "Coursera",
              isFree: true,
              estimatedTime: 40
            }
          ],
          isCompleted: false
        },
        {
          id: "bem-3",
          order: 3,
          title: "Microservices & APIs",
          description: "Build distributed systems",
          duration: 8,
          durationUnit: "weeks",
          skills: ["Microservices", "Message Queues", "gRPC", "API Gateway"],
          tasks: [
            "Design microservices architecture",
            "Implement message queues",
            "Build gRPC services",
            "Set up API gateways"
          ],
          resources: [
            {
              id: "be-r3",
              title: "Microservices Architecture",
              type: "course",
              provider: "Udemy",
              isFree: false,
              estimatedTime: 50
            }
          ],
          isCompleted: false
        },
        {
          id: "bem-4",
          order: 4,
          title: "System Design & Scalability",
          description: "Design scalable backend systems",
          duration: 6,
          durationUnit: "weeks",
          skills: ["System Design", "Load Balancing", "Scalability", "Performance"],
          tasks: [
            "Learn system design patterns",
            "Implement load balancing",
            "Design for scalability",
            "Build high-performance APIs"
          ],
          resources: [
            {
              id: "be-r4",
              title: "System Design Interview",
              type: "course",
              provider: "Educative",
              isFree: false,
              estimatedTime: 55
            }
          ],
          isCompleted: false
        }
      ]
    };

    this.roadmaps.set(webDevRoadmap.id, webDevRoadmap);
    this.roadmaps.set(dataScienceRoadmap.id, dataScienceRoadmap);
    this.roadmaps.set(mobileDevRoadmap.id, mobileDevRoadmap);
    this.roadmaps.set(mlEngineerRoadmap.id, mlEngineerRoadmap);
    this.roadmaps.set(devOpsRoadmap.id, devOpsRoadmap);
    this.roadmaps.set(cloudArchitectRoadmap.id, cloudArchitectRoadmap);
    this.roadmaps.set(cybersecurityRoadmap.id, cybersecurityRoadmap);
    this.roadmaps.set(uxDesignerRoadmap.id, uxDesignerRoadmap);
    this.roadmaps.set(productManagerRoadmap.id, productManagerRoadmap);
    this.roadmaps.set(gameDevRoadmap.id, gameDevRoadmap);
    this.roadmaps.set(blockchainDevRoadmap.id, blockchainDevRoadmap);
    this.roadmaps.set(qaEngineerRoadmap.id, qaEngineerRoadmap);
    this.roadmaps.set(fullStackDevRoadmap.id, fullStackDevRoadmap);
    this.roadmaps.set(backendDevRoadmap.id, backendDevRoadmap);
  }

  private initializeInterviewData() {
    const categories: InterviewCategory[] = [
      { id: "behavioral", name: "Behavioral", description: "Questions about your past experiences and how you handle situations", icon: "users", questionCount: 15 },
      { id: "technical", name: "Technical", description: "Programming, algorithms, and system design questions", icon: "code", questionCount: 20 },
      { id: "leadership", name: "Leadership", description: "Questions about team management and decision-making", icon: "crown", questionCount: 10 },
      { id: "problem-solving", name: "Problem Solving", description: "Questions testing your analytical and critical thinking", icon: "brain", questionCount: 12 }
    ];

    categories.forEach(cat => this.interviewCategories.set(cat.id, cat));

    const questions: InterviewQuestion[] = [
      {
        id: "q1",
        category: "behavioral",
        subcategory: "Teamwork",
        difficulty: "Medium",
        question: "Tell me about a time when you had to work with a difficult team member.",
        answer: "Use the STAR method: Situation - describe the context; Task - explain your responsibility; Action - detail what you did; Result - share the outcome. Focus on how you maintained professionalism, communicated effectively, and found a solution.",
        tips: ["Be specific with examples", "Show empathy and understanding", "Highlight positive outcomes", "Don't badmouth others"],
        relatedTopics: ["Communication", "Conflict Resolution", "Team Dynamics"]
      },
      {
        id: "q2",
        category: "behavioral",
        subcategory: "Problem Solving",
        difficulty: "Medium",
        question: "Describe a situation where you had to solve a complex problem under pressure.",
        answer: "Explain your problem-solving process: how you assessed the situation, gathered information, considered options, made a decision, and implemented the solution. Emphasize staying calm and methodical.",
        tips: ["Show your analytical thinking", "Demonstrate composure under pressure", "Explain your decision-making process", "Highlight the positive result"],
        relatedTopics: ["Critical Thinking", "Decision Making", "Time Management"]
      },
      {
        id: "q3",
        category: "technical",
        subcategory: "Data Structures",
        difficulty: "Easy",
        question: "What is the difference between an array and a linked list?",
        answer: "Arrays store elements in contiguous memory with O(1) access time but O(n) insertion/deletion. Linked lists use non-contiguous memory with O(n) access but O(1) insertion/deletion at known positions. Arrays are better for random access; linked lists for frequent insertions/deletions.",
        tips: ["Discuss time complexity", "Mention space considerations", "Provide use cases", "Draw diagrams if possible"],
        relatedTopics: ["Memory Management", "Algorithm Complexity", "Data Structures"]
      },
      {
        id: "q4",
        category: "technical",
        subcategory: "Algorithms",
        difficulty: "Hard",
        question: "How would you design a URL shortener like bit.ly?",
        answer: "Key components: 1) Hash function to generate short codes from long URLs, 2) Database to store mappings, 3) Redirect service, 4) Analytics tracking. Consider: collision handling, scalability (distributed hashing), custom URLs, expiration, and rate limiting.",
        tips: ["Start with requirements", "Discuss trade-offs", "Consider scale", "Address edge cases"],
        relatedTopics: ["System Design", "Distributed Systems", "Databases", "Scalability"]
      },
      {
        id: "q5",
        category: "leadership",
        subcategory: "Management",
        difficulty: "Hard",
        question: "How do you handle team members who consistently miss deadlines?",
        answer: "1) Have a private conversation to understand root causes, 2) Identify if it's skill, time management, or external issues, 3) Provide support and resources, 4) Set clear expectations and checkpoints, 5) Document performance, 6) Follow up consistently. Balance empathy with accountability.",
        tips: ["Show empathy first", "Focus on solutions", "Demonstrate accountability", "Mention documentation"],
        relatedTopics: ["Performance Management", "Communication", "Coaching"]
      }
    ];

    questions.forEach(q => this.interviewQuestions.set(q.id, q));

    const tips: InterviewTip[] = [
      {
        id: "tip1",
        category: "general",
        title: "The STAR Method",
        description: "A proven framework for answering behavioral interview questions",
        tips: [
          "Situation: Set the context for your story",
          "Task: Describe your responsibility in that situation",
          "Action: Explain the steps you took",
          "Result: Share the outcomes and what you learned"
        ]
      },
      {
        id: "tip2",
        category: "preparation",
        title: "Before the Interview",
        description: "Essential preparation steps",
        tips: [
          "Research the company thoroughly",
          "Review the job description and match your experience",
          "Prepare 5-7 strong examples using STAR",
          "Prepare questions to ask the interviewer",
          "Test your tech setup for virtual interviews"
        ]
      }
    ];

    tips.forEach(tip => this.interviewTips.set(tip.id, tip));
  }

  private initializeMentors() {
    const mentors: Mentor[] = [
      {
        id: "m1",
        name: "Sarah Chen",
        role: "Senior Software Engineer",
        company: "Google",
        expertise: ["System Design", "Backend Development", "Career Growth"],
        experience: 8,
        bio: "Passionate about helping junior engineers navigate their careers. Specialized in distributed systems and scalability.",
        availability: "Available",
        rating: 4.9,
        sessionsCompleted: 45
      },
      {
        id: "m2",
        name: "Michael Rodriguez",
        role: "Engineering Manager",
        company: "Microsoft",
        expertise: ["Leadership", "Team Building", "Technical Strategy"],
        experience: 12,
        bio: "Former IC who transitioned to management. Love mentoring engineers looking to grow into leadership roles.",
        availability: "Limited",
        rating: 4.8,
        sessionsCompleted: 62
      },
      {
        id: "m3",
        name: "Priya Patel",
        role: "Product Designer",
        company: "Figma",
        expertise: ["UI/UX Design", "Design Systems", "Career Transition"],
        experience: 6,
        bio: "Transitioned from development to design. Happy to help others make similar pivots or improve their design skills.",
        availability: "Available",
        rating: 4.7,
        sessionsCompleted: 28
      },
      {
        id: "m4",
        name: "James Kim",
        role: "Data Scientist",
        company: "Netflix",
        expertise: ["Machine Learning", "Data Analytics", "Python"],
        experience: 7,
        bio: "Focus on practical ML applications. Help aspiring data scientists break into the field.",
        availability: "Busy",
        rating: 4.9,
        sessionsCompleted: 51
      }
    ];

    mentors.forEach(m => this.mentors.set(m.id, m));
  }

  private initializeSalaryData() {
    const salaryInsights: SalaryInsight[] = [
      {
        id: "s1",
        role: "Software Engineer",
        level: "Entry",
        location: "San Francisco, CA",
        averageSalary: 120000,
        minSalary: 90000,
        maxSalary: 150000,
        currency: "USD",
        benefits: ["Health Insurance", "401k Match", "Stock Options", "Remote Work"],
        marketTrend: "Rising"
      },
      {
        id: "s2",
        role: "Software Engineer",
        level: "Mid",
        location: "San Francisco, CA",
        averageSalary: 165000,
        minSalary: 130000,
        maxSalary: 200000,
        currency: "USD",
        benefits: ["Health Insurance", "401k Match", "Stock Options", "Remote Work", "Learning Budget"],
        marketTrend: "Rising"
      },
      {
        id: "s3",
        role: "Data Scientist",
        level: "Mid",
        location: "New York, NY",
        averageSalary: 145000,
        minSalary: 115000,
        maxSalary: 180000,
        currency: "USD",
        benefits: ["Health Insurance", "401k Match", "Bonus", "Remote Work"],
        marketTrend: "Stable"
      },
      {
        id: "s4",
        role: "Product Manager",
        level: "Senior",
        location: "Seattle, WA",
        averageSalary: 185000,
        minSalary: 150000,
        maxSalary: 220000,
        currency: "USD",
        benefits: ["Health Insurance", "401k Match", "Stock Options", "Flexible Schedule"],
        marketTrend: "Rising"
      }
    ];

    salaryInsights.forEach(s => this.salaryInsights.set(s.id, s));

    const negotiationTips: NegotiationTip[] = [
      {
        id: "n1",
        category: "preparation",
        title: "Research Market Rates",
        description: "Know your worth before negotiating",
        dosList: [
          "Use salary comparison sites (Levels.fyi, Glassdoor)",
          "Consider your experience level and location",
          "Factor in total compensation (not just base salary)",
          "Talk to people in similar roles"
        ],
        dontsList: [
          "Rely on a single data point",
          "Forget to account for cost of living",
          "Ignore benefits and stock options",
          "Compare without context"
        ]
      },
      {
        id: "n2",
        category: "timing",
        title: "When to Negotiate",
        description: "Choose the right moment to discuss compensation",
        dosList: [
          "Wait for the initial offer",
          "Negotiate after receiving a written offer",
          "Ask for time to review the offer",
          "Be prompt but thoughtful in your response"
        ],
        dontsList: [
          "Bring up salary too early in the process",
          "Negotiate before the offer is made",
          "Take too long to respond",
          "Give ultimatums"
        ]
      }
    ];

    negotiationTips.forEach(n => this.negotiationTips.set(n.id, n));
  }

  async getInterviewCategories(): Promise<InterviewCategory[]> {
    return Array.from(this.interviewCategories.values());
  }

  async getInterviewQuestions(category?: string): Promise<InterviewQuestion[]> {
    const questions = Array.from(this.interviewQuestions.values());
    if (category) {
      return questions.filter(q => q.category === category);
    }
    return questions;
  }

  async getInterviewTips(): Promise<InterviewTip[]> {
    return Array.from(this.interviewTips.values());
  }

  async getMentors(): Promise<Mentor[]> {
    return Array.from(this.mentors.values());
  }

  async getSalaryInsights(role?: string): Promise<SalaryInsight[]> {
    const insights = Array.from(this.salaryInsights.values());
    if (role) {
      return insights.filter(s => s.role.toLowerCase().includes(role.toLowerCase()));
    }
    return insights;
  }

  async getNegotiationTips(): Promise<NegotiationTip[]> {
    return Array.from(this.negotiationTips.values());
  }

  async getJobApplications(userId: string): Promise<JobApplication[]> {
    return Array.from(this.jobApplications.values()).filter(app => app.userId === userId);
  }

  async createJobApplication(application: Omit<JobApplication, 'id'>): Promise<JobApplication> {
    const id = randomUUID();
    const newApplication: JobApplication = { ...application, id };
    this.jobApplications.set(id, newApplication);
    return newApplication;
  }

  async updateJobApplication(id: string, application: Partial<JobApplication>): Promise<JobApplication | undefined> {
    const existing = this.jobApplications.get(id);
    if (!existing) return undefined;
    
    const updated: JobApplication = {
      ...existing,
      ...application,
      id: existing.id
    };
    this.jobApplications.set(id, updated);
    return updated;
  }

  async deleteJobApplication(id: string): Promise<boolean> {
    return this.jobApplications.delete(id);
  }

  async saveCareerAnalysis(analysis: Omit<CareerAnalysisResult, 'id'>): Promise<CareerAnalysisResult> {
    const id = randomUUID();
    const careerAnalysis: CareerAnalysisResult = { ...analysis, id };
    
    const existingAnalysis = Array.from(this.careerAnalyses.values()).find(
      a => a.userId === analysis.userId
    );
    
    if (existingAnalysis) {
      this.careerAnalyses.set(existingAnalysis.id, careerAnalysis);
      return careerAnalysis;
    }
    
    this.careerAnalyses.set(id, careerAnalysis);
    return careerAnalysis;
  }

  async getCareerAnalysis(userId: string): Promise<CareerAnalysisResult | undefined> {
    return Array.from(this.careerAnalyses.values()).find(
      a => a.userId === userId
    );
  }

  async getBookBookmarks(userId: string): Promise<BookBookmark[]> {
    return Array.from(this.bookBookmarks.values()).filter(
      bookmark => bookmark.userId === userId
    );
  }

  async createBookBookmark(bookmark: Omit<BookBookmark, 'id'>): Promise<BookBookmark> {
    const id = randomUUID();
    const newBookmark: BookBookmark = { ...bookmark, id };
    this.bookBookmarks.set(id, newBookmark);
    return newBookmark;
  }

  async deleteBookBookmark(id: string): Promise<boolean> {
    return this.bookBookmarks.delete(id);
  }

  async updateBookBookmark(id: string, bookmark: Partial<BookBookmark>): Promise<BookBookmark | undefined> {
    const existing = this.bookBookmarks.get(id);
    if (!existing) return undefined;
    
    const updated: BookBookmark = {
      ...existing,
      ...bookmark,
      id: existing.id
    };
    this.bookBookmarks.set(id, updated);
    return updated;
  }

  async getCachedEvents(): Promise<{ events: EventbriteEvent[], cachedAt: string } | undefined> {
    return this.eventCache;
  }

  async setCachedEvents(events: EventbriteEvent[]): Promise<void> {
    this.eventCache = {
      events,
      cachedAt: new Date().toISOString()
    };
  }
}

import { MongoStorage } from "./db/MongoStorage";

// Use MongoDB storage if MONGODB_URI is configured, otherwise use in-memory storage
export const storage = process.env.MONGODB_URI ? new MongoStorage() : new MemStorage();
