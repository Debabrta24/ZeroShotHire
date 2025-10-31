// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID as randomUUID2 } from "crypto";
import session2 from "express-session";
import createMemoryStore2 from "memorystore";

// server/db/MongoStorage.ts
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

// server/db/models.ts
import mongoose, { Schema } from "mongoose";
var userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
var UserModel = mongoose.model("User", userSchema);
var linkedInProfileSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  headline: { type: String, required: true },
  summary: { type: String, required: true },
  experience: [{
    id: String,
    title: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String
  }],
  skills: [String],
  recommendations: [String],
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});
var LinkedInProfileModel = mongoose.model("LinkedInProfile", linkedInProfileSchema);
var resumeSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  templateId: { type: String, required: true },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String,
    photo: String
  },
  summary: { type: String, required: true },
  experience: [{
    id: String,
    title: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
    achievements: [String]
  }],
  education: [{
    id: String,
    degree: String,
    institution: String,
    location: String,
    graduationDate: String,
    gpa: String,
    honors: String
  }],
  skills: [{
    id: String,
    name: String,
    category: String,
    level: String
  }],
  projects: [{
    id: String,
    title: String,
    description: String,
    technologies: [String],
    link: String
  }],
  certifications: [{
    id: String,
    name: String,
    issuer: String,
    issueDate: String,
    expiryDate: String,
    credentialId: String
  }],
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});
var ResumeModel = mongoose.model("Resume", resumeSchema);
var careerRoadmapSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  estimatedDuration: { type: Number, required: true },
  durationUnit: { type: String, required: true },
  milestones: [{
    id: String,
    order: Number,
    title: String,
    description: String,
    duration: Number,
    durationUnit: String,
    skills: [String],
    tasks: [String],
    resources: [{
      id: String,
      title: String,
      type: String,
      provider: String,
      isFree: Boolean,
      estimatedTime: Number
    }],
    isCompleted: Boolean
  }],
  requiredSkills: [String],
  salaryRange: {
    min: Number,
    max: Number,
    currency: String
  },
  jobDemand: { type: Number, required: true }
});
var CareerRoadmapModel = mongoose.model("CareerRoadmap", careerRoadmapSchema);
var userRoadmapProgressSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  roadmapId: { type: String, required: true, index: true },
  startedAt: { type: String, required: true },
  completedMilestones: [String],
  currentMilestone: String,
  overallProgress: { type: Number, required: true }
});
userRoadmapProgressSchema.index({ userId: 1, roadmapId: 1 });
var UserRoadmapProgressModel = mongoose.model("UserRoadmapProgress", userRoadmapProgressSchema);
var interviewCategorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  questionCount: { type: Number, required: true }
});
var InterviewCategoryModel = mongoose.model("InterviewCategory", interviewCategorySchema);
var interviewQuestionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, required: true },
  difficulty: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  tips: [String],
  relatedTopics: [String]
});
var InterviewQuestionModel = mongoose.model("InterviewQuestion", interviewQuestionSchema);
var interviewTipSchema = new Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tips: [String]
});
var InterviewTipModel = mongoose.model("InterviewTip", interviewTipSchema);
var mentorSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  expertise: [String],
  experience: { type: Number, required: true },
  avatar: String,
  bio: { type: String, required: true },
  availability: { type: String, required: true },
  rating: { type: Number, required: true },
  sessionsCompleted: { type: Number, required: true }
});
var MentorModel = mongoose.model("Mentor", mentorSchema);
var salaryInsightSchema = new Schema({
  id: { type: String, required: true, unique: true },
  role: { type: String, required: true, index: true },
  level: { type: String, required: true },
  location: { type: String, required: true },
  averageSalary: { type: Number, required: true },
  minSalary: { type: Number, required: true },
  maxSalary: { type: Number, required: true },
  currency: { type: String, required: true },
  benefits: [String],
  marketTrend: { type: String, required: true }
});
var SalaryInsightModel = mongoose.model("SalaryInsight", salaryInsightSchema);
var negotiationTipSchema = new Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dosList: [String],
  dontsList: [String]
});
var NegotiationTipModel = mongoose.model("NegotiationTip", negotiationTipSchema);
var jobApplicationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, required: true },
  applicationDate: { type: String, required: true },
  status: { type: String, required: true },
  salary: String,
  notes: String,
  nextSteps: String,
  contacts: [{
    name: String,
    role: String,
    email: String,
    phone: String
  }],
  interviews: [{
    id: String,
    date: String,
    time: String,
    type: String,
    interviewers: [String],
    location: String,
    notes: String,
    feedback: String
  }]
});
var JobApplicationModel = mongoose.model("JobApplication", jobApplicationSchema);
var careerAnalysisSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  skills: [String],
  interests: [String],
  education: { type: String, required: true },
  careerGoals: [String],
  workStyle: { type: String, required: true },
  location: { type: String, required: true },
  salaryExpectation: { type: String, required: true },
  recommendations: [Schema.Types.Mixed],
  analyzedAt: { type: String, required: true }
});
var CareerAnalysisModel = mongoose.model("CareerAnalysis", careerAnalysisSchema);
var bookBookmarkSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  bookId: { type: String, required: true },
  bookData: {
    id: String,
    title: String,
    author: String,
    description: String,
    coverImage: String,
    publisher: String,
    publishedDate: String,
    pageCount: Number,
    categories: [String],
    averageRating: Number,
    language: String,
    previewLink: String,
    infoLink: String
  },
  bookmarkedAt: { type: String, required: true },
  lastReadPage: Number,
  notes: String
});
var BookBookmarkModel = mongoose.model("BookBookmark", bookBookmarkSchema);
var eventCacheSchema = new Schema({
  events: [{
    id: String,
    name: String,
    description: String,
    url: String,
    start: String,
    end: String,
    created: String,
    isOnline: Boolean,
    isFree: Boolean,
    venue: {
      name: String,
      address: String,
      city: String,
      region: String,
      country: String
    },
    logo: {
      url: String
    },
    category: String,
    capacity: Number
  }],
  cachedAt: { type: String, required: true }
});
var EventCacheModel = mongoose.model("EventCache", eventCacheSchema);

// server/db/MongoStorage.ts
var MemoryStore = createMemoryStore(session);
var MongoStorage = class {
  sessionStore;
  memStorageFallback;
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
    });
    this.memStorageFallback = new MemStorage();
  }
  // User methods
  async getUser(id) {
    const user = await UserModel.findOne({ id }).lean();
    return user || void 0;
  }
  async getUserByUsername(username) {
    const user = await UserModel.findOne({ username }).lean();
    return user || void 0;
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    await UserModel.create(user);
    return user;
  }
  // LinkedIn Profile methods
  async getLinkedInProfile(userId) {
    const profile = await LinkedInProfileModel.findOne({ userId }).lean();
    return profile || void 0;
  }
  async createLinkedInProfile(profile) {
    const id = randomUUID();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const linkedInProfile = {
      ...profile,
      id,
      createdAt: now,
      updatedAt: now
    };
    await LinkedInProfileModel.create(linkedInProfile);
    return linkedInProfile;
  }
  async updateLinkedInProfile(id, profile) {
    const existing = await LinkedInProfileModel.findOne({ id }).lean();
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...profile,
      id: existing.id,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await LinkedInProfileModel.updateOne({ id }, updated);
    return updated;
  }
  // Resume methods
  async getResume(userId) {
    const resume = await ResumeModel.findOne({ userId }).lean();
    return resume || void 0;
  }
  async getResumeById(id) {
    const resume = await ResumeModel.findOne({ id }).lean();
    return resume || void 0;
  }
  async createResume(resume) {
    const id = randomUUID();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newResume = {
      ...resume,
      id,
      createdAt: now,
      updatedAt: now
    };
    await ResumeModel.create(newResume);
    return newResume;
  }
  async updateResume(id, resume) {
    const existing = await ResumeModel.findOne({ id }).lean();
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...resume,
      id: existing.id,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await ResumeModel.updateOne({ id }, updated);
    return updated;
  }
  // Career Roadmap methods
  async getRoadmaps() {
    const roadmaps = await CareerRoadmapModel.find({}).lean();
    if (roadmaps.length === 0) {
      return this.memStorageFallback.getRoadmaps();
    }
    return roadmaps;
  }
  async getRoadmapById(id) {
    const roadmap = await CareerRoadmapModel.findOne({ id }).lean();
    if (!roadmap) {
      return this.memStorageFallback.getRoadmapById(id);
    }
    return roadmap || void 0;
  }
  async getUserRoadmapProgress(userId, roadmapId) {
    const progress = await UserRoadmapProgressModel.findOne({ userId, roadmapId }).lean();
    return progress || void 0;
  }
  async createUserRoadmapProgress(progress) {
    const id = randomUUID();
    const userProgress = { ...progress, id };
    await UserRoadmapProgressModel.create(userProgress);
    return userProgress;
  }
  async updateUserRoadmapProgress(id, progress) {
    const existing = await UserRoadmapProgressModel.findOne({ id }).lean();
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...progress,
      id: existing.id
    };
    await UserRoadmapProgressModel.updateOne({ id }, updated);
    return updated;
  }
  // Interview methods
  async getInterviewCategories() {
    const categories = await InterviewCategoryModel.find({}).lean();
    if (categories.length === 0) {
      return this.memStorageFallback.getInterviewCategories();
    }
    return categories;
  }
  async getInterviewQuestions(category) {
    const filter = category ? { category } : {};
    const questions = await InterviewQuestionModel.find(filter).lean();
    if (questions.length === 0) {
      return this.memStorageFallback.getInterviewQuestions(category);
    }
    return questions;
  }
  async getInterviewTips() {
    const tips = await InterviewTipModel.find({}).lean();
    if (tips.length === 0) {
      return this.memStorageFallback.getInterviewTips();
    }
    return tips;
  }
  // Mentor methods
  async getMentors() {
    const mentors = await MentorModel.find({}).lean();
    if (mentors.length === 0) {
      return this.memStorageFallback.getMentors();
    }
    return mentors;
  }
  // Salary methods
  async getSalaryInsights(role) {
    const filter = role ? { role } : {};
    const insights = await SalaryInsightModel.find(filter).lean();
    if (insights.length === 0) {
      return this.memStorageFallback.getSalaryInsights(role);
    }
    return insights;
  }
  async getNegotiationTips() {
    const tips = await NegotiationTipModel.find({}).lean();
    if (tips.length === 0) {
      return this.memStorageFallback.getNegotiationTips();
    }
    return tips;
  }
  // Job Application methods
  async getJobApplications(userId) {
    const applications = await JobApplicationModel.find({ userId }).lean();
    return applications;
  }
  async createJobApplication(application) {
    const id = randomUUID();
    const newApplication = { ...application, id };
    await JobApplicationModel.create(newApplication);
    return newApplication;
  }
  async updateJobApplication(id, application) {
    const existing = await JobApplicationModel.findOne({ id }).lean();
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...application,
      id: existing.id
    };
    await JobApplicationModel.updateOne({ id }, updated);
    return updated;
  }
  async deleteJobApplication(id) {
    const result = await JobApplicationModel.deleteOne({ id });
    return result.deletedCount > 0;
  }
  // Career Analysis methods
  async saveCareerAnalysis(analysis) {
    const id = randomUUID();
    const newAnalysis = { ...analysis, id };
    await CareerAnalysisModel.create(newAnalysis);
    return newAnalysis;
  }
  async getCareerAnalysis(userId) {
    const analysis = await CareerAnalysisModel.findOne({ userId }).sort({ analyzedAt: -1 }).lean();
    return analysis || void 0;
  }
  // Book Bookmark methods
  async getBookBookmarks(userId) {
    const bookmarks = await BookBookmarkModel.find({ userId }).lean();
    return bookmarks;
  }
  async createBookBookmark(bookmark) {
    const id = randomUUID();
    const newBookmark = { ...bookmark, id };
    await BookBookmarkModel.create(newBookmark);
    return newBookmark;
  }
  async deleteBookBookmark(id) {
    const result = await BookBookmarkModel.deleteOne({ id });
    return result.deletedCount > 0;
  }
  async updateBookBookmark(id, bookmark) {
    const existing = await BookBookmarkModel.findOne({ id }).lean();
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...bookmark,
      id: existing.id
    };
    await BookBookmarkModel.updateOne({ id }, updated);
    return updated;
  }
  // Event Cache methods
  async getCachedEvents() {
    const cache = await EventCacheModel.findOne({}).lean();
    return cache || void 0;
  }
  async setCachedEvents(events) {
    const cachedAt = (/* @__PURE__ */ new Date()).toISOString();
    await EventCacheModel.deleteMany({});
    await EventCacheModel.create({ events, cachedAt });
  }
};

// server/storage.ts
var MemoryStore2 = createMemoryStore2(session2);
var MemStorage = class {
  sessionStore;
  users;
  linkedInProfiles;
  resumes;
  roadmaps;
  userRoadmapProgress;
  interviewCategories;
  interviewQuestions;
  interviewTips;
  mentors;
  salaryInsights;
  negotiationTips;
  jobApplications;
  careerAnalyses;
  bookBookmarks;
  eventCache;
  constructor() {
    this.sessionStore = new MemoryStore2({
      checkPeriod: 864e5
    });
    this.users = /* @__PURE__ */ new Map();
    this.linkedInProfiles = /* @__PURE__ */ new Map();
    this.resumes = /* @__PURE__ */ new Map();
    this.roadmaps = /* @__PURE__ */ new Map();
    this.userRoadmapProgress = /* @__PURE__ */ new Map();
    this.interviewCategories = /* @__PURE__ */ new Map();
    this.interviewQuestions = /* @__PURE__ */ new Map();
    this.interviewTips = /* @__PURE__ */ new Map();
    this.mentors = /* @__PURE__ */ new Map();
    this.salaryInsights = /* @__PURE__ */ new Map();
    this.negotiationTips = /* @__PURE__ */ new Map();
    this.jobApplications = /* @__PURE__ */ new Map();
    this.careerAnalyses = /* @__PURE__ */ new Map();
    this.bookBookmarks = /* @__PURE__ */ new Map();
    this.eventCache = void 0;
    this.initializeRoadmaps();
    this.initializeInterviewData();
    this.initializeMentors();
    this.initializeSalaryData();
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID2();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getLinkedInProfile(userId) {
    return Array.from(this.linkedInProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }
  async createLinkedInProfile(profile) {
    const id = randomUUID2();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const linkedInProfile = {
      ...profile,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.linkedInProfiles.set(id, linkedInProfile);
    return linkedInProfile;
  }
  async updateLinkedInProfile(id, profile) {
    const existing = this.linkedInProfiles.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...profile,
      id: existing.id,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.linkedInProfiles.set(id, updated);
    return updated;
  }
  async getResume(userId) {
    return Array.from(this.resumes.values()).find(
      (resume) => resume.userId === userId
    );
  }
  async getResumeById(id) {
    return this.resumes.get(id);
  }
  async createResume(resume) {
    const id = randomUUID2();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newResume = {
      ...resume,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.resumes.set(id, newResume);
    return newResume;
  }
  async updateResume(id, resume) {
    const existing = this.resumes.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...resume,
      id: existing.id,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.resumes.set(id, updated);
    return updated;
  }
  async getRoadmaps() {
    return Array.from(this.roadmaps.values());
  }
  async getRoadmapById(id) {
    return this.roadmaps.get(id);
  }
  async getUserRoadmapProgress(userId, roadmapId) {
    return Array.from(this.userRoadmapProgress.values()).find(
      (progress) => progress.userId === userId && progress.roadmapId === roadmapId
    );
  }
  async createUserRoadmapProgress(progress) {
    const id = randomUUID2();
    const userProgress = { ...progress, id };
    this.userRoadmapProgress.set(id, userProgress);
    return userProgress;
  }
  async updateUserRoadmapProgress(id, progress) {
    const existing = this.userRoadmapProgress.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...progress,
      id: existing.id
    };
    this.userRoadmapProgress.set(id, updated);
    return updated;
  }
  initializeRoadmaps() {
    const webDevRoadmap = {
      id: "web-dev-roadmap",
      title: "Web Developer",
      description: "Become a full-stack web developer and build modern web applications",
      category: "Web Development",
      difficulty: "Beginner",
      estimatedDuration: 12,
      durationUnit: "months",
      requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL"],
      salaryRange: { min: 7e4, max: 13e4, currency: "USD" },
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
    const dataScienceRoadmap = {
      id: "data-science-roadmap",
      title: "Data Scientist",
      description: "Master data analysis, machine learning, and AI to drive business insights",
      category: "Data Science",
      difficulty: "Intermediate",
      estimatedDuration: 18,
      durationUnit: "months",
      requiredSkills: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"],
      salaryRange: { min: 9e4, max: 16e4, currency: "USD" },
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
    const mobileDevRoadmap = {
      id: "mobile-dev-roadmap",
      title: "Mobile Developer",
      description: "Build native and cross-platform mobile applications for iOS and Android",
      category: "Mobile Development",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Swift", "Kotlin", "React Native", "Mobile UI/UX", "API Integration"],
      salaryRange: { min: 75e3, max: 14e4, currency: "USD" },
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
    const mlEngineerRoadmap = {
      id: "ml-engineer-roadmap",
      title: "Machine Learning Engineer",
      description: "Design, build, and deploy production ML systems at scale",
      category: "Machine Learning",
      difficulty: "Advanced",
      estimatedDuration: 11,
      durationUnit: "months",
      requiredSkills: ["Python", "TensorFlow", "PyTorch", "MLOps", "Cloud Platforms", "System Design"],
      salaryRange: { min: 11e4, max: 2e5, currency: "USD" },
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
    const devOpsRoadmap = {
      id: "devops-roadmap",
      title: "DevOps Engineer",
      description: "Automate infrastructure, enable CI/CD, and ensure system reliability",
      category: "DevOps",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS/Azure", "Terraform"],
      salaryRange: { min: 95e3, max: 17e4, currency: "USD" },
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
    const cloudArchitectRoadmap = {
      id: "cloud-architect-roadmap",
      title: "Cloud Solutions Architect",
      description: "Design scalable, secure, and cost-effective cloud architectures",
      category: "Cloud Computing",
      difficulty: "Advanced",
      estimatedDuration: 9,
      durationUnit: "months",
      requiredSkills: ["AWS/Azure/GCP", "System Design", "Security", "Networking", "Cost Optimization"],
      salaryRange: { min: 12e4, max: 19e4, currency: "USD" },
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
    const cybersecurityRoadmap = {
      id: "cybersecurity-roadmap",
      title: "Cybersecurity Specialist",
      description: "Protect systems and data from cyber threats and vulnerabilities",
      category: "Cybersecurity",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Network Security", "Penetration Testing", "SIEM", "Compliance", "Incident Response"],
      salaryRange: { min: 85e3, max: 155e3, currency: "USD" },
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
    const uxDesignerRoadmap = {
      id: "ux-designer-roadmap",
      title: "UI/UX Designer",
      description: "Create beautiful, intuitive user experiences for digital products",
      category: "UI/UX Design",
      difficulty: "Beginner",
      estimatedDuration: 7,
      durationUnit: "months",
      requiredSkills: ["Figma", "User Research", "Wireframing", "Prototyping", "Visual Design"],
      salaryRange: { min: 65e3, max: 125e3, currency: "USD" },
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
    const productManagerRoadmap = {
      id: "product-manager-roadmap",
      title: "Product Manager",
      description: "Lead product strategy, development, and launch successful products",
      category: "Product Management",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Product Strategy", "Analytics", "User Stories", "Agile", "Stakeholder Management"],
      salaryRange: { min: 9e4, max: 165e3, currency: "USD" },
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
    const gameDevRoadmap = {
      id: "game-dev-roadmap",
      title: "Game Developer",
      description: "Create engaging games for PC, console, and mobile platforms",
      category: "Game Development",
      difficulty: "Intermediate",
      estimatedDuration: 9,
      durationUnit: "months",
      requiredSkills: ["Unity", "Unreal Engine", "C#", "C++", "Game Design", "3D Graphics"],
      salaryRange: { min: 6e4, max: 13e4, currency: "USD" },
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
    const blockchainDevRoadmap = {
      id: "blockchain-dev-roadmap",
      title: "Blockchain Developer",
      description: "Build decentralized applications and smart contracts",
      category: "Blockchain",
      difficulty: "Advanced",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Solidity", "Ethereum", "Web3.js", "Smart Contracts", "Cryptography"],
      salaryRange: { min: 1e5, max: 18e4, currency: "USD" },
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
    const qaEngineerRoadmap = {
      id: "qa-engineer-roadmap",
      title: "QA Engineer",
      description: "Ensure software quality through testing and automation",
      category: "Software Architecture",
      difficulty: "Beginner",
      estimatedDuration: 7,
      durationUnit: "months",
      requiredSkills: ["Test Automation", "Selenium", "API Testing", "Performance Testing", "CI/CD"],
      salaryRange: { min: 6e4, max: 11e4, currency: "USD" },
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
    const fullStackDevRoadmap = {
      id: "fullstack-dev-roadmap",
      title: "Full-Stack Developer",
      description: "Master both frontend and backend development for complete web applications",
      category: "Web Development",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
      salaryRange: { min: 8e4, max: 15e4, currency: "USD" },
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
    const backendDevRoadmap = {
      id: "backend-dev-roadmap",
      title: "Backend Developer",
      description: "Build scalable server-side systems and APIs",
      category: "Web Development",
      difficulty: "Intermediate",
      estimatedDuration: 8,
      durationUnit: "months",
      requiredSkills: ["Python/Node.js", "SQL", "Redis", "Microservices", "System Design"],
      salaryRange: { min: 75e3, max: 145e3, currency: "USD" },
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
  initializeInterviewData() {
    const categories = [
      { id: "behavioral", name: "Behavioral", description: "Questions about your past experiences and how you handle situations", icon: "users", questionCount: 15 },
      { id: "technical", name: "Technical", description: "Programming, algorithms, and system design questions", icon: "code", questionCount: 20 },
      { id: "leadership", name: "Leadership", description: "Questions about team management and decision-making", icon: "crown", questionCount: 10 },
      { id: "problem-solving", name: "Problem Solving", description: "Questions testing your analytical and critical thinking", icon: "brain", questionCount: 12 }
    ];
    categories.forEach((cat) => this.interviewCategories.set(cat.id, cat));
    const questions = [
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
    questions.forEach((q) => this.interviewQuestions.set(q.id, q));
    const tips = [
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
    tips.forEach((tip) => this.interviewTips.set(tip.id, tip));
  }
  initializeMentors() {
    const mentors = [
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
    mentors.forEach((m) => this.mentors.set(m.id, m));
  }
  initializeSalaryData() {
    const salaryInsights = [
      {
        id: "s1",
        role: "Software Engineer",
        level: "Entry",
        location: "San Francisco, CA",
        averageSalary: 12e4,
        minSalary: 9e4,
        maxSalary: 15e4,
        currency: "USD",
        benefits: ["Health Insurance", "401k Match", "Stock Options", "Remote Work"],
        marketTrend: "Rising"
      },
      {
        id: "s2",
        role: "Software Engineer",
        level: "Mid",
        location: "San Francisco, CA",
        averageSalary: 165e3,
        minSalary: 13e4,
        maxSalary: 2e5,
        currency: "USD",
        benefits: ["Health Insurance", "401k Match", "Stock Options", "Remote Work", "Learning Budget"],
        marketTrend: "Rising"
      },
      {
        id: "s3",
        role: "Data Scientist",
        level: "Mid",
        location: "New York, NY",
        averageSalary: 145e3,
        minSalary: 115e3,
        maxSalary: 18e4,
        currency: "USD",
        benefits: ["Health Insurance", "401k Match", "Bonus", "Remote Work"],
        marketTrend: "Stable"
      },
      {
        id: "s4",
        role: "Product Manager",
        level: "Senior",
        location: "Seattle, WA",
        averageSalary: 185e3,
        minSalary: 15e4,
        maxSalary: 22e4,
        currency: "USD",
        benefits: ["Health Insurance", "401k Match", "Stock Options", "Flexible Schedule"],
        marketTrend: "Rising"
      }
    ];
    salaryInsights.forEach((s) => this.salaryInsights.set(s.id, s));
    const negotiationTips = [
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
    negotiationTips.forEach((n) => this.negotiationTips.set(n.id, n));
  }
  async getInterviewCategories() {
    return Array.from(this.interviewCategories.values());
  }
  async getInterviewQuestions(category) {
    const questions = Array.from(this.interviewQuestions.values());
    if (category) {
      return questions.filter((q) => q.category === category);
    }
    return questions;
  }
  async getInterviewTips() {
    return Array.from(this.interviewTips.values());
  }
  async getMentors() {
    return Array.from(this.mentors.values());
  }
  async getSalaryInsights(role) {
    const insights = Array.from(this.salaryInsights.values());
    if (role) {
      return insights.filter((s) => s.role.toLowerCase().includes(role.toLowerCase()));
    }
    return insights;
  }
  async getNegotiationTips() {
    return Array.from(this.negotiationTips.values());
  }
  async getJobApplications(userId) {
    return Array.from(this.jobApplications.values()).filter((app2) => app2.userId === userId);
  }
  async createJobApplication(application) {
    const id = randomUUID2();
    const newApplication = { ...application, id };
    this.jobApplications.set(id, newApplication);
    return newApplication;
  }
  async updateJobApplication(id, application) {
    const existing = this.jobApplications.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...application,
      id: existing.id
    };
    this.jobApplications.set(id, updated);
    return updated;
  }
  async deleteJobApplication(id) {
    return this.jobApplications.delete(id);
  }
  async saveCareerAnalysis(analysis) {
    const id = randomUUID2();
    const careerAnalysis = { ...analysis, id };
    const existingAnalysis = Array.from(this.careerAnalyses.values()).find(
      (a) => a.userId === analysis.userId
    );
    if (existingAnalysis) {
      this.careerAnalyses.set(existingAnalysis.id, careerAnalysis);
      return careerAnalysis;
    }
    this.careerAnalyses.set(id, careerAnalysis);
    return careerAnalysis;
  }
  async getCareerAnalysis(userId) {
    return Array.from(this.careerAnalyses.values()).find(
      (a) => a.userId === userId
    );
  }
  async getBookBookmarks(userId) {
    return Array.from(this.bookBookmarks.values()).filter(
      (bookmark) => bookmark.userId === userId
    );
  }
  async createBookBookmark(bookmark) {
    const id = randomUUID2();
    const newBookmark = { ...bookmark, id };
    this.bookBookmarks.set(id, newBookmark);
    return newBookmark;
  }
  async deleteBookBookmark(id) {
    return this.bookBookmarks.delete(id);
  }
  async updateBookBookmark(id, bookmark) {
    const existing = this.bookBookmarks.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...bookmark,
      id: existing.id
    };
    this.bookBookmarks.set(id, updated);
    return updated;
  }
  async getCachedEvents() {
    return this.eventCache;
  }
  async setCachedEvents(events) {
    this.eventCache = {
      events,
      cachedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};
var storage = process.env.MONGODB_URI ? new MongoStorage() : new MemStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session3 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "zeroshothhire-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 1 week
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session3(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// shared/schema.ts
import { z } from "zod";
var careerAnalysisSchema2 = z.object({
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  education: z.string().min(1, "Select your education level"),
  careerGoals: z.array(z.string()).min(1, "Select at least one career goal"),
  workStyle: z.string().min(1, "Select your preferred work style"),
  location: z.string().min(1, "Select your location preference"),
  salaryExpectation: z.string().min(1, "Select your salary expectation")
});
var linkedInProfileSchema2 = z.object({
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
    achievements: z.array(z.string()).optional()
  })).optional(),
  skills: z.array(z.string()).min(1, "Add at least one skill")
});
var resumePersonalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  photo: z.string().optional()
});
var resumeExperienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(1, "Description is required"),
  achievements: z.array(z.string()).default([])
});
var resumeEducationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().min(1, "Location is required"),
  graduationDate: z.string().min(1, "Graduation date is required"),
  gpa: z.string().optional(),
  honors: z.string().optional()
});
var insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
var eventbriteEventSchema = z.object({
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
    country: z.string().optional()
  }).optional(),
  logoUrl: z.string().optional(),
  organizerName: z.string().optional(),
  category: z.string().optional()
});

// server/routes.ts
import OpenAI from "openai";
var openai = null;
if (process.env.A4F_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.A4F_API_KEY,
    baseURL: "https://api.a4f.co/v1"
  });
}
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.post("/api/career-analysis/analyze", async (req, res) => {
    try {
      const { skills, interests, education, careerGoals, workStyle, location, salaryExpectation } = req.body;
      const userId = req.user?.id || "demo-user";
      if (!openai) {
        const mockRecommendations = [
          {
            id: "career-1",
            title: "Full Stack Developer",
            description: "Build end-to-end web applications combining frontend and backend technologies. Perfect for someone with your technical skills and interest in creating complete solutions.",
            matchPercentage: 92,
            salaryRange: { min: 75, max: 130, currency: "USD" },
            growthPotential: "High",
            requiredSkills: skills?.slice(0, 6) || ["JavaScript", "React", "Node.js", "SQL", "Git", "API Design"],
            industryDemand: 95,
            workLifeBalance: 75,
            remoteOpportunities: 90,
            educationRequired: education || "Bachelor's Degree",
            averageYearsToMaster: 3,
            topCompanies: ["Google", "Microsoft", "Amazon", "Meta", "Netflix"],
            relatedRoles: ["Frontend Developer", "Backend Developer", "Software Engineer"]
          },
          {
            id: "career-2",
            title: "Data Analyst",
            description: "Transform raw data into actionable insights that drive business decisions. Ideal for your analytical mindset and problem-solving abilities.",
            matchPercentage: 88,
            salaryRange: { min: 65, max: 110, currency: "USD" },
            growthPotential: "High",
            requiredSkills: ["Python", "SQL", "Data Visualization", "Excel", "Statistics", "Tableau"],
            industryDemand: 90,
            workLifeBalance: 80,
            remoteOpportunities: 85,
            educationRequired: education || "Bachelor's Degree",
            averageYearsToMaster: 2,
            topCompanies: ["Amazon", "Apple", "Netflix", "Spotify", "Airbnb"],
            relatedRoles: ["Business Analyst", "Data Scientist", "Analytics Manager"]
          },
          {
            id: "career-3",
            title: "UX/UI Designer",
            description: "Create beautiful, intuitive user experiences that delight customers. Great match for your creative interests and attention to detail.",
            matchPercentage: 85,
            salaryRange: { min: 70, max: 120, currency: "USD" },
            growthPotential: "Medium",
            requiredSkills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems", "HTML/CSS"],
            industryDemand: 88,
            workLifeBalance: 85,
            remoteOpportunities: 88,
            educationRequired: education || "Bachelor's Degree",
            averageYearsToMaster: 3,
            topCompanies: ["Apple", "Google", "Airbnb", "Adobe", "Figma"],
            relatedRoles: ["Product Designer", "Visual Designer", "Interaction Designer"]
          }
        ];
        const analysisData2 = {
          userId,
          skills,
          interests,
          education,
          careerGoals,
          workStyle,
          location,
          salaryExpectation,
          recommendations: mockRecommendations,
          analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        await storage.saveCareerAnalysis(analysisData2);
        return res.json({ recommendations: mockRecommendations });
      }
      const completion = await openai.chat.completions.create({
        model: "provider-1/deepseek-v3.1-terminus",
        messages: [
          {
            role: "system",
            content: `You are an expert career counselor and analyst. Analyze user profiles and provide highly personalized, data-driven career recommendations. 
            
Your analysis should be tailored, specific, and actionable. Consider:
- User's current skills and how they translate to different careers
- Their interests and passions
- Education level and learning preferences
- Career goals and priorities
- Work style preferences
- Location and salary expectations

Provide 3 career recommendations that are truly personalized to this specific user's profile, not generic suggestions.`
          },
          {
            role: "user",
            content: `Please analyze my profile and recommend 3 personalized career paths:

Skills: ${skills?.join(", ") || "Not specified"}
Interests: ${interests?.join(", ") || "Not specified"}
Education: ${education || "Not specified"}
Career Goals: ${careerGoals?.join(", ") || "Not specified"}
Work Style: ${workStyle || "Not specified"}
Location Preference: ${location || "Not specified"}
Salary Expectation: ${salaryExpectation || "Not specified"}

For each career recommendation, provide:
1. title: The job title
2. description: A compelling 2-3 sentence description
3. matchPercentage: How well it matches my profile (0-100)
4. salaryRange: {min, max, currency: "USD"} in thousands
5. growthPotential: "High", "Medium", or "Low"
6. requiredSkills: Array of 6-8 key skills needed
7. industryDemand: Market demand score (0-100)
8. workLifeBalance: Score (0-100)
9. remoteOpportunities: Remote work availability (0-100)
10. educationRequired: Minimum education needed
11. averageYearsToMaster: Years to become proficient
12. topCompanies: Array of 5 top companies hiring
13. relatedRoles: Array of 3 similar job titles
14. whyThisCareer: 2-3 sentences explaining why this career matches my specific profile

Return ONLY a JSON object with a "recommendations" array containing exactly 3 career objects. No markdown, no explanations, just the JSON.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      });
      const content = completion.choices[0]?.message?.content || "{}";
      let result;
      try {
        result = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[1]);
        } else {
          throw new Error("Failed to parse AI response");
        }
      }
      const analysisData = {
        userId,
        skills,
        interests,
        education,
        careerGoals,
        workStyle,
        location,
        salaryExpectation,
        recommendations: result.recommendations || [],
        analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await storage.saveCareerAnalysis(analysisData);
      res.json(result);
    } catch (error) {
      console.error("Career analysis error:", error);
      res.status(500).json({
        message: "Failed to analyze career profile",
        error: error.message
      });
    }
  });
  app2.get("/api/career-analysis/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const analysis = await storage.getCareerAnalysis(userId);
      if (!analysis) {
        return res.status(404).json({ message: "No career analysis found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch career analysis" });
    }
  });
  app2.get("/api/linkedin-profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getLinkedInProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch LinkedIn profile" });
    }
  });
  app2.post("/api/linkedin-profile", async (req, res) => {
    try {
      const validatedData = linkedInProfileSchema2.parse(req.body);
      const userId = req.body.userId || "demo-user";
      const experienceWithIds = (validatedData.experience || []).map((exp, index) => ({
        ...exp,
        id: `exp-${Date.now()}-${index}`,
        location: exp.location || "",
        achievements: exp.achievements || []
      }));
      const profile = await storage.createLinkedInProfile({
        userId,
        headline: validatedData.headline,
        summary: validatedData.summary,
        experience: experienceWithIds,
        skills: validatedData.skills,
        recommendations: []
      });
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to create LinkedIn profile" });
    }
  });
  app2.post("/api/linkedin-profile/optimize", async (req, res) => {
    try {
      const { headline, summary, skills, targetRole } = req.body;
      if (!openai) {
        return res.json({
          optimizedHeadline: headline,
          optimizedSummary: summary,
          suggestions: [
            "Configure OpenAI API key to get AI-powered suggestions",
            "Add specific metrics and achievements to your headline",
            "Use industry keywords in your summary",
            "Highlight unique value propositions",
            "Keep your profile updated regularly"
          ]
        });
      }
      const completion = await openai.chat.completions.create({
        model: "provider-1/deepseek-v3.1-terminus",
        messages: [
          {
            role: "system",
            content: "You are a LinkedIn profile optimization expert. Provide professional, compelling suggestions to improve LinkedIn profiles."
          },
          {
            role: "user",
            content: `Optimize this LinkedIn profile for a ${targetRole || "professional"} role:
            
Current Headline: ${headline}
Current Summary: ${summary}
Skills: ${skills?.join(", ") || "Not specified"}

Provide:
1. An optimized headline (max 220 characters)
2. An improved summary (engaging, achievement-focused, max 2600 characters)
3. 5 specific improvement suggestions

Format as JSON with keys: optimizedHeadline, optimizedSummary, suggestions (array of strings)`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });
      const content = completion.choices[0]?.message?.content || "{}";
      let result;
      try {
        result = JSON.parse(content);
      } catch {
        result = {
          optimizedHeadline: headline,
          optimizedSummary: summary,
          suggestions: ["Unable to parse AI response. Please try again."]
        };
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: "Failed to optimize profile",
        optimizedHeadline: req.body.headline,
        optimizedSummary: req.body.summary,
        suggestions: ["An error occurred. Please try again."]
      });
    }
  });
  app2.get("/api/resume/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const resume = await storage.getResume(userId);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });
  app2.post("/api/resume", async (req, res) => {
    try {
      const userId = req.body.userId || "demo-user";
      const resume = await storage.createResume({
        userId,
        templateId: req.body.templateId || "modern",
        personalInfo: req.body.personalInfo,
        summary: req.body.summary || "",
        experience: req.body.experience || [],
        education: req.body.education || [],
        skills: req.body.skills || [],
        projects: req.body.projects || [],
        certifications: req.body.certifications || []
      });
      res.json(resume);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to create resume" });
    }
  });
  app2.put("/api/resume/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const resume = await storage.updateResume(id, req.body);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to update resume" });
    }
  });
  app2.post("/api/resume/generate-summary", async (req, res) => {
    try {
      const { experience, skills, targetRole } = req.body;
      if (!openai) {
        return res.json({
          summary: `Experienced professional with expertise in ${skills?.slice(0, 3).join(", ") || "various technologies"}. Passionate about ${targetRole || "technology"} and delivering high-quality results.`
        });
      }
      const completion = await openai.chat.completions.create({
        model: "provider-1/deepseek-v3.1-terminus",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Create compelling professional summaries."
          },
          {
            role: "user",
            content: `Write a professional resume summary (3-4 sentences) for someone targeting a ${targetRole || "professional"} role with these details:

Experience: ${JSON.stringify(experience?.slice(0, 2) || [])}
Skills: ${skills?.join(", ") || "Various skills"}

Make it achievement-focused and compelling.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      const summary = completion.choices[0]?.message?.content || "";
      res.json({ summary });
    } catch (error) {
      res.status(500).json({
        summary: `Experienced professional with expertise in ${req.body.skills?.slice(0, 3).join(", ") || "various technologies"}.`
      });
    }
  });
  app2.post("/api/ai-coach/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      if (!openai) {
        return res.json({
          response: "I'm here to help with your career! While I'm currently in demo mode, I can still provide general career advice. What would you like to know?"
        });
      }
      const messages = [
        {
          role: "system",
          content: "You are a helpful AI career coach. Provide personalized career advice, guidance on skill development, job search strategies, interview preparation, and professional growth. Be supportive, insightful, and actionable in your responses."
        },
        ...conversationHistory || [],
        {
          role: "user",
          content: message
        }
      ];
      const completion = await openai.chat.completions.create({
        model: "provider-1/deepseek-v3.1-terminus",
        messages,
        temperature: 0.7,
        max_tokens: 500
      });
      const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
      res.json({ response });
    } catch (error) {
      res.status(500).json({
        response: "I'm experiencing some technical difficulties. Please try again in a moment."
      });
    }
  });
  app2.get("/api/roadmaps", async (req, res) => {
    try {
      const roadmaps = await storage.getRoadmaps();
      res.json(roadmaps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roadmaps" });
    }
  });
  app2.get("/api/roadmaps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const roadmap = await storage.getRoadmapById(id);
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }
      res.json(roadmap);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roadmap" });
    }
  });
  app2.get("/api/roadmaps/:roadmapId/progress/:userId", async (req, res) => {
    try {
      const { roadmapId, userId } = req.params;
      const progress = await storage.getUserRoadmapProgress(userId, roadmapId);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });
  app2.post("/api/roadmaps/:roadmapId/start", async (req, res) => {
    try {
      const { roadmapId } = req.params;
      const userId = req.body.userId || "demo-user";
      const roadmap = await storage.getRoadmapById(roadmapId);
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }
      const existingProgress = await storage.getUserRoadmapProgress(userId, roadmapId);
      if (existingProgress) {
        return res.json(existingProgress);
      }
      const progress = await storage.createUserRoadmapProgress({
        userId,
        roadmapId,
        startedAt: (/* @__PURE__ */ new Date()).toISOString(),
        completedMilestones: [],
        currentMilestone: roadmap.milestones[0]?.id,
        overallProgress: 0
      });
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to start roadmap" });
    }
  });
  app2.post("/api/roadmaps/:roadmapId/milestone/:milestoneId/complete", async (req, res) => {
    try {
      const { roadmapId, milestoneId } = req.params;
      const userId = req.body.userId || "demo-user";
      const progress = await storage.getUserRoadmapProgress(userId, roadmapId);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      const roadmap = await storage.getRoadmapById(roadmapId);
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }
      const completedMilestonesSet = /* @__PURE__ */ new Set([...progress.completedMilestones, milestoneId]);
      const completedMilestones = Array.from(completedMilestonesSet);
      const currentMilestoneIndex = roadmap.milestones.findIndex((m) => m.id === milestoneId);
      const nextMilestone = roadmap.milestones[currentMilestoneIndex + 1];
      const updatedProgress = await storage.updateUserRoadmapProgress(progress.id, {
        completedMilestones,
        currentMilestone: nextMilestone?.id,
        overallProgress: completedMilestones.length / roadmap.milestones.length * 100
      });
      res.json(updatedProgress);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to complete milestone" });
    }
  });
  app2.get("/api/leetcode/problems", async (req, res) => {
    try {
      const { difficulty, tags, limit = "20", skip = "0" } = req.query;
      const params = new URLSearchParams();
      if (difficulty) params.append("difficulty", difficulty);
      if (tags) params.append("tags", tags);
      if (limit) params.append("limit", limit);
      if (skip) params.append("skip", skip);
      const url = `https://alfa-leetcode-api.onrender.com/problems?${params.toString()}`;
      console.log("Proxying LeetCode request:", url);
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Career-Guidance-Platform/1.0"
        }
      });
      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching LeetCode problems:", error);
      res.status(500).json({
        message: error.message || "Failed to fetch problems",
        problemsetQuestionList: []
      });
    }
  });
  app2.get("/api/leetcode/solution", async (req, res) => {
    try {
      const { titleSlug } = req.query;
      if (!titleSlug) {
        return res.status(400).json({ message: "titleSlug is required" });
      }
      const url = `https://alfa-leetcode-api.onrender.com/officialSolution?titleSlug=${titleSlug}`;
      console.log("Proxying LeetCode solution request:", url);
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Career-Guidance-Platform/1.0"
        }
      });
      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching LeetCode solution:", error);
      res.status(500).json({
        message: error.message || "Failed to fetch solution",
        content: null
      });
    }
  });
  app2.get("/api/news", async (req, res) => {
    try {
      const apiKey = process.env.NEWSDATA_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          message: "News API key not configured",
          articles: []
        });
      }
      const params = new URLSearchParams({
        apikey: apiKey,
        country: "in",
        // India
        category: "business,technology",
        language: "en",
        q: 'career OR jobs OR hiring OR employment OR "tech industry" OR startup'
      });
      const response = await fetch(`https://newsdata.io/api/1/news?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`NewsData API error: ${response.status}`);
      }
      const data = await response.json();
      const articles = (data.results || []).map((article, index) => ({
        id: article.article_id || `news-${index}`,
        title: article.title || "Untitled",
        summary: article.description || article.content?.substring(0, 200) || "No description available",
        content: article.content || article.description || "",
        author: article.creator?.[0] || article.source_name || "Unknown",
        source: article.source_name || article.source_id || "Unknown Source",
        category: article.category || ["Technology"],
        thumbnail: article.image_url,
        publishedAt: article.pubDate || (/* @__PURE__ */ new Date()).toISOString(),
        readTime: Math.ceil((article.content?.length || 500) / 200),
        // Estimate based on word count
        tags: article.keywords || [],
        url: article.link,
        isBookmarked: false,
        views: Math.floor(Math.random() * 1e3) + 100
        // Mock view count
      }));
      res.json({
        articles,
        totalResults: data.totalResults || articles.length,
        nextPage: data.nextPage || null
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({
        message: error.message || "Failed to fetch news",
        articles: []
      });
    }
  });
  app2.get("/api/books/search", async (req, res) => {
    try {
      const { q = "programming", subject, limit = "20", page = "1" } = req.query;
      let query = q;
      if (subject) {
        query += ` subject:${subject}`;
      }
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const params = new URLSearchParams({
        q: query,
        limit,
        offset: offset.toString(),
        fields: "key,title,author_name,first_publish_year,subject,cover_i,edition_count,language,number_of_pages_median"
      });
      const response = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Open Library API error: ${response.status}`);
      }
      const data = await response.json();
      const books = (data.docs || []).map((doc) => ({
        id: doc.key || `book-${Math.random()}`,
        title: doc.title || "Untitled",
        author: doc.author_name || ["Unknown"],
        description: "",
        // Open Library search doesn't include descriptions
        subjects: (doc.subject || []).slice(0, 10),
        coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : void 0,
        publishYear: doc.first_publish_year,
        language: doc.language?.[0] || "eng",
        pageCount: doc.number_of_pages_median,
        readUrl: `https://openlibrary.org${doc.key}`,
        format: ["HTML"],
        // Open Library provides web reader
        isBookmarked: false
      }));
      res.json({
        books,
        total: data.numFound || 0,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({
        message: error.message || "Failed to fetch books",
        books: []
      });
    }
  });
  app2.get("/api/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`https://openlibrary.org${id}.json`);
      if (!response.ok) {
        throw new Error(`Open Library API error: ${response.status}`);
      }
      const data = await response.json();
      const authors = await Promise.all(
        (data.authors || []).map(async (author) => {
          try {
            const authorRes = await fetch(`https://openlibrary.org${author.author.key}.json`);
            const authorData = await authorRes.json();
            return authorData.name || "Unknown";
          } catch {
            return "Unknown";
          }
        })
      );
      const book = {
        id: data.key,
        title: data.title || "Untitled",
        author: authors.length > 0 ? authors : ["Unknown"],
        description: typeof data.description === "string" ? data.description : data.description?.value || "",
        subjects: data.subjects || [],
        coverUrl: data.covers?.[0] ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : void 0,
        publishYear: data.first_publish_date ? parseInt(data.first_publish_date) : void 0,
        language: "eng",
        pageCount: data.number_of_pages,
        readUrl: `https://openlibrary.org${data.key}`,
        format: ["HTML"],
        isBookmarked: false
      };
      res.json(book);
    } catch (error) {
      console.error("Error fetching book details:", error);
      res.status(500).json({
        message: error.message || "Failed to fetch book details"
      });
    }
  });
  app2.get("/api/bookmarks", async (req, res) => {
    try {
      const userId = req.user?.id || "demo-user";
      const bookmarks = await storage.getBookBookmarks(userId);
      res.json({ bookmarks });
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({
        message: error.message || "Failed to fetch bookmarks"
      });
    }
  });
  app2.post("/api/bookmarks", async (req, res) => {
    try {
      const userId = req.user?.id || "demo-user";
      const { bookData } = req.body;
      if (!bookData || !bookData.id) {
        return res.status(400).json({ message: "Valid book data with id is required" });
      }
      const existingBookmarks = await storage.getBookBookmarks(userId);
      const alreadyBookmarked = existingBookmarks.some((b) => b.bookId === bookData.id);
      if (alreadyBookmarked) {
        return res.status(400).json({ message: "Book already bookmarked" });
      }
      const bookmark = await storage.createBookBookmark({
        userId,
        bookId: bookData.id,
        bookData,
        bookmarkedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      res.json({ bookmark });
    } catch (error) {
      console.error("Error creating bookmark:", error);
      res.status(500).json({
        message: error.message || "Failed to create bookmark"
      });
    }
  });
  app2.delete("/api/bookmarks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBookBookmark(id);
      if (!success) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      res.status(500).json({
        message: error.message || "Failed to delete bookmark"
      });
    }
  });
  app2.get("/api/internships", async (req, res) => {
    try {
      const { query, location, employment_type, date_posted, remote_jobs_only } = req.query;
      const apiKey = process.env.RAPIDAPI_KEY;
      if (!apiKey) {
        const mockInternships = [
          {
            job_id: "mock-1",
            job_title: "Software Engineering Intern",
            company_name: "Flipkart",
            job_location: "Bangalore, India",
            job_employment_type: "INTERN",
            job_posted_at_datetime_utc: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString(),
            job_description: "Join Flipkart's engineering team to build scalable e-commerce solutions. Work on backend services, APIs, and microservices architecture.",
            job_apply_link: "https://www.flipkart.com/careers",
            job_is_remote: false,
            job_required_skills: ["Java", "Spring Boot", "MySQL", "REST APIs"],
            job_min_salary: null,
            job_max_salary: null,
            job_salary_currency: "INR",
            job_salary_period: "MONTH"
          },
          {
            job_id: "mock-2",
            job_title: "Data Science Intern",
            company_name: "Razorpay",
            job_location: "Bangalore, India",
            job_employment_type: "INTERN",
            job_posted_at_datetime_utc: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3).toISOString(),
            job_description: "Analyze payment data, build ML models, and generate insights for business decisions. Work with Python, SQL, and data visualization tools.",
            job_apply_link: "https://razorpay.com/jobs",
            job_is_remote: true,
            job_required_skills: ["Python", "SQL", "Machine Learning", "Data Analysis"],
            job_min_salary: 4e4,
            job_max_salary: 5e4,
            job_salary_currency: "INR",
            job_salary_period: "MONTH"
          },
          {
            job_id: "mock-3",
            job_title: "Frontend Developer Intern",
            company_name: "Swiggy",
            job_location: "Bangalore, India",
            job_employment_type: "INTERN",
            job_posted_at_datetime_utc: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString(),
            job_description: "Build delightful user experiences for millions of food lovers. Work with React, TypeScript, and modern frontend technologies.",
            job_apply_link: "https://www.swiggy.com/careers",
            job_is_remote: false,
            job_required_skills: ["React", "TypeScript", "JavaScript", "CSS"],
            job_min_salary: 35e3,
            job_max_salary: 45e3,
            job_salary_currency: "INR",
            job_salary_period: "MONTH"
          }
        ];
        return res.json({ data: mockInternships, demo: true });
      }
      const searchQuery = query || "intern";
      const searchLocation = location || "India";
      const apiUrl = "https://jsearch.p.rapidapi.com/search";
      const params = new URLSearchParams({
        query: `${searchQuery} in ${searchLocation}`,
        page: "1",
        num_pages: "1",
        date_posted: date_posted || "all"
      });
      if (employment_type) {
        params.append("employment_types", employment_type);
      }
      if (remote_jobs_only === "true") {
        params.append("remote_jobs_only", "true");
      }
      const response = await fetch(`${apiUrl}?${params.toString()}`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }
      });
      if (!response.ok) {
        throw new Error(`JSearch API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching internships:", error);
      const mockInternships = [
        {
          job_id: "fallback-1",
          job_title: "Software Engineering Intern",
          company_name: "Tech Company India",
          job_location: "Mumbai, India",
          job_employment_type: "INTERN",
          job_posted_at_datetime_utc: (/* @__PURE__ */ new Date()).toISOString(),
          job_description: "Work on exciting projects and learn from experienced engineers.",
          job_apply_link: "https://example.com",
          job_is_remote: false,
          job_required_skills: ["Programming", "Problem Solving"],
          job_min_salary: null,
          job_max_salary: null,
          job_salary_currency: "INR",
          job_salary_period: "MONTH"
        }
      ];
      res.json({
        data: mockInternships,
        error: error.message,
        fallback: true
      });
    }
  });
  app2.get("/api/events", async (req, res) => {
    try {
      const { search, location, category, online } = req.query;
      const cached = await storage.getCachedEvents();
      const CACHE_DURATION = 30 * 60 * 1e3;
      if (cached) {
        const cacheAge = Date.now() - new Date(cached.cachedAt).getTime();
        if (cacheAge < CACHE_DURATION) {
          let filteredEvents = cached.events;
          if (search) {
            const searchLower = search.toLowerCase();
            filteredEvents = filteredEvents.filter(
              (event) => event.name.toLowerCase().includes(searchLower) || event.description.toLowerCase().includes(searchLower)
            );
          }
          if (online === "true") {
            filteredEvents = filteredEvents.filter((event) => event.isOnline);
          } else if (online === "false") {
            filteredEvents = filteredEvents.filter((event) => !event.isOnline);
          }
          if (category) {
            filteredEvents = filteredEvents.filter(
              (event) => event.category?.toLowerCase() === category.toLowerCase()
            );
          }
          return res.json({ events: filteredEvents, cached: true });
        }
      }
      const apiKey = process.env.EVENTBRITE_API_KEY;
      if (!apiKey) {
        const mockEvents = [
          {
            id: "mock-1",
            name: "Tech Career Networking Mixer - Virtual",
            description: "Join us for an evening of networking with tech professionals from various industries. Perfect for career changers and job seekers looking to expand their network.",
            url: "https://eventbrite.com",
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3 + 2 * 60 * 60 * 1e3).toISOString(),
            created: (/* @__PURE__ */ new Date()).toISOString(),
            isOnline: true,
            isFree: true,
            organizerName: "Tech Network Group",
            category: "Networking"
          },
          {
            id: "mock-2",
            name: "Career Development Workshop: Resume Building",
            description: "Learn how to craft a compelling resume that gets you interviews. Expert career coaches will review resumes and provide personalized feedback.",
            url: "https://eventbrite.com",
            start: new Date(Date.now() + 10 * 24 * 60 * 60 * 1e3).toISOString(),
            end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1e3 + 3 * 60 * 60 * 1e3).toISOString(),
            created: (/* @__PURE__ */ new Date()).toISOString(),
            isOnline: false,
            isFree: false,
            venue: {
              name: "Career Center",
              city: "San Francisco",
              region: "CA",
              country: "US"
            },
            organizerName: "Career Growth Academy",
            category: "Career Development"
          },
          {
            id: "mock-3",
            name: "Software Engineering Career Fair 2025",
            description: "Meet recruiters from top tech companies. Bring your resume and be ready to interview on the spot for software engineering positions.",
            url: "https://eventbrite.com",
            start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3).toISOString(),
            end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3 + 5 * 60 * 60 * 1e3).toISOString(),
            created: (/* @__PURE__ */ new Date()).toISOString(),
            isOnline: false,
            isFree: true,
            venue: {
              name: "Convention Center",
              city: "Austin",
              region: "TX",
              country: "US"
            },
            organizerName: "Tech Careers Unite",
            category: "Job Fair"
          }
        ];
        await storage.setCachedEvents(mockEvents);
        return res.json({ events: mockEvents, cached: false, demo: true });
      }
      try {
        const searchQuery = search || "networking career tech";
        const apiUrl = `https://www.eventbriteapi.com/v3/events/search/?q=${encodeURIComponent(searchQuery)}&expand=venue,organizer,category&sort_by=date`;
        const response = await fetch(apiUrl, {
          headers: {
            "Authorization": `Bearer ${apiKey}`
          }
        });
        if (!response.ok) {
          console.warn(`Eventbrite API error: ${response.status}, falling back to mock data`);
          throw new Error("API failed, using mock data");
        }
        const data = await response.json();
        const events = data.events?.map((event) => ({
          id: event.id,
          name: event.name?.text || event.name,
          description: event.description?.text || event.description || "",
          url: event.url,
          start: event.start?.utc || event.start,
          end: event.end?.utc || event.end,
          created: event.created,
          isOnline: event.online_event || false,
          isFree: event.is_free || false,
          venue: event.venue ? {
            name: event.venue.name,
            address: event.venue.address?.localized_address_display,
            city: event.venue.address?.city,
            region: event.venue.address?.region,
            country: event.venue.address?.country
          } : void 0,
          logoUrl: event.logo?.url,
          organizerName: event.organizer?.name,
          category: event.category?.name
        })) || [];
        await storage.setCachedEvents(events);
        return res.json({ events, cached: false });
      } catch (apiError) {
        console.warn("Using mock events due to API failure:", apiError);
        const mockEvents = [
          {
            id: "mock-1",
            name: "Tech Career Networking Mixer - Virtual",
            description: "Join us for an evening of networking with tech professionals from various industries. Perfect for career changers and job seekers looking to expand their network.",
            url: "https://eventbrite.com",
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3 + 2 * 60 * 60 * 1e3).toISOString(),
            created: (/* @__PURE__ */ new Date()).toISOString(),
            isOnline: true,
            isFree: true,
            organizerName: "Tech Network Group",
            category: "Networking"
          },
          {
            id: "mock-2",
            name: "Career Development Workshop: Resume Building",
            description: "Learn how to craft a compelling resume that gets you interviews. Expert career coaches will review resumes and provide personalized feedback.",
            url: "https://eventbrite.com",
            start: new Date(Date.now() + 10 * 24 * 60 * 60 * 1e3).toISOString(),
            end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1e3 + 3 * 60 * 60 * 1e3).toISOString(),
            created: (/* @__PURE__ */ new Date()).toISOString(),
            isOnline: false,
            isFree: false,
            venue: {
              name: "Career Center",
              city: "San Francisco",
              region: "CA",
              country: "US"
            },
            organizerName: "Career Growth Academy",
            category: "Career Development"
          },
          {
            id: "mock-3",
            name: "Software Engineering Career Fair 2025",
            description: "Meet recruiters from top tech companies. Bring your resume and be ready to interview on the spot for software engineering positions.",
            url: "https://eventbrite.com",
            start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3).toISOString(),
            end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3 + 5 * 60 * 60 * 1e3).toISOString(),
            created: (/* @__PURE__ */ new Date()).toISOString(),
            isOnline: false,
            isFree: true,
            venue: {
              name: "Convention Center",
              city: "Austin",
              region: "TX",
              country: "US"
            },
            organizerName: "Tech Careers Unite",
            category: "Job Fair"
          }
        ];
        await storage.setCachedEvents(mockEvents);
        return res.json({ events: mockEvents, cached: false, demo: true });
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({
        message: error.message || "Failed to fetch events"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/db/mongodb.ts
import mongoose2 from "mongoose";
async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI not found in environment variables");
    }
    await mongoose2.connect(uri);
    console.log("\u2705 MongoDB connected successfully");
    console.log("\u{1F4DD} Database:", mongoose2.connection.db?.databaseName || "Unknown");
    console.log("\u{1F4A1} User data (profiles, job applications, resumes, etc.) will be stored persistently in MongoDB.");
    console.log("\u{1F4A1} Static data (roadmaps, interview questions, mentors, salary insights) will use in-memory fallback if not seeded.");
    mongoose2.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
    mongoose2.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (error) {
    console.error("\u274C MongoDB connection error:", error);
    throw error;
  }
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
(async () => {
  if (process.env.MONGODB_URI) {
    await connectDB();
  } else {
    log("No MONGODB_URI found, using in-memory storage");
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  app.listen(5010, () => {
    console.log(`\u2705 Server running at http://localhost:${5010}`);
  });
})();
