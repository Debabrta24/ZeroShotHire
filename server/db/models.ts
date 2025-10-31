import mongoose, { Schema, Document } from 'mongoose';
import type {
  User,
  LinkedInProfile,
  Resume,
  CareerRoadmap,
  UserRoadmapProgress,
  InterviewQuestion,
  InterviewCategory,
  InterviewTip,
  Mentor,
  SalaryInsight,
  NegotiationTip,
  JobApplication,
  BookBookmark,
  EventbriteEvent,
} from '@shared/schema';
import type { CareerAnalysisResult } from '../storage';

// User Model
const userSchema = new Schema<User>({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<User>('User', userSchema);

// LinkedIn Profile Model
const linkedInProfileSchema = new Schema<LinkedInProfile>({
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
    description: String,
  }],
  skills: [String],
  recommendations: [String],
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

export const LinkedInProfileModel = mongoose.model<LinkedInProfile>('LinkedInProfile', linkedInProfileSchema);

// Resume Model
const resumeSchema = new Schema<Resume>({
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
    photo: String,
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
    achievements: [String],
  }],
  education: [{
    id: String,
    degree: String,
    institution: String,
    location: String,
    graduationDate: String,
    gpa: String,
    honors: String,
  }],
  skills: [{
    id: String,
    name: String,
    category: String,
    level: String,
  }],
  projects: [{
    id: String,
    title: String,
    description: String,
    technologies: [String],
    link: String,
  }],
  certifications: [{
    id: String,
    name: String,
    issuer: String,
    issueDate: String,
    expiryDate: String,
    credentialId: String,
  }],
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

export const ResumeModel = mongoose.model<Resume>('Resume', resumeSchema);

// Career Roadmap Model
const careerRoadmapSchema = new Schema<CareerRoadmap>({
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
      estimatedTime: Number,
    }],
    isCompleted: Boolean,
  }],
  requiredSkills: [String],
  salaryRange: {
    min: Number,
    max: Number,
    currency: String,
  },
  jobDemand: { type: Number, required: true },
});

export const CareerRoadmapModel = mongoose.model<CareerRoadmap>('CareerRoadmap', careerRoadmapSchema);

// User Roadmap Progress Model
const userRoadmapProgressSchema = new Schema<UserRoadmapProgress>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  roadmapId: { type: String, required: true, index: true },
  startedAt: { type: String, required: true },
  completedMilestones: [String],
  currentMilestone: String,
  overallProgress: { type: Number, required: true },
});

userRoadmapProgressSchema.index({ userId: 1, roadmapId: 1 });

export const UserRoadmapProgressModel = mongoose.model<UserRoadmapProgress>('UserRoadmapProgress', userRoadmapProgressSchema);

// Interview Category Model
const interviewCategorySchema = new Schema<InterviewCategory>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  questionCount: { type: Number, required: true },
});

export const InterviewCategoryModel = mongoose.model<InterviewCategory>('InterviewCategory', interviewCategorySchema);

// Interview Question Model
const interviewQuestionSchema = new Schema<InterviewQuestion>({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, required: true },
  difficulty: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  tips: [String],
  relatedTopics: [String],
});

export const InterviewQuestionModel = mongoose.model<InterviewQuestion>('InterviewQuestion', interviewQuestionSchema);

// Interview Tip Model
const interviewTipSchema = new Schema<InterviewTip>({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tips: [String],
});

export const InterviewTipModel = mongoose.model<InterviewTip>('InterviewTip', interviewTipSchema);

// Mentor Model
const mentorSchema = new Schema<Mentor>({
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
  sessionsCompleted: { type: Number, required: true },
});

export const MentorModel = mongoose.model<Mentor>('Mentor', mentorSchema);

// Salary Insight Model
const salaryInsightSchema = new Schema<SalaryInsight>({
  id: { type: String, required: true, unique: true },
  role: { type: String, required: true, index: true },
  level: { type: String, required: true },
  location: { type: String, required: true },
  averageSalary: { type: Number, required: true },
  minSalary: { type: Number, required: true },
  maxSalary: { type: Number, required: true },
  currency: { type: String, required: true },
  benefits: [String],
  marketTrend: { type: String, required: true },
});

export const SalaryInsightModel = mongoose.model<SalaryInsight>('SalaryInsight', salaryInsightSchema);

// Negotiation Tip Model
const negotiationTipSchema = new Schema<NegotiationTip>({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dosList: [String],
  dontsList: [String],
});

export const NegotiationTipModel = mongoose.model<NegotiationTip>('NegotiationTip', negotiationTipSchema);

// Job Application Model
const jobApplicationSchema = new Schema<JobApplication>({
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
    phone: String,
  }],
  interviews: [{
    id: String,
    date: String,
    time: String,
    type: String,
    interviewers: [String],
    location: String,
    notes: String,
    feedback: String,
  }],
});

export const JobApplicationModel = mongoose.model<JobApplication>('JobApplication', jobApplicationSchema);

// Career Analysis Model
const careerAnalysisSchema = new Schema<CareerAnalysisResult>({
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
  analyzedAt: { type: String, required: true },
});

export const CareerAnalysisModel = mongoose.model<CareerAnalysisResult>('CareerAnalysis', careerAnalysisSchema);

// Book Bookmark Model
const bookBookmarkSchema = new Schema<BookBookmark>({
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
    infoLink: String,
  },
  bookmarkedAt: { type: String, required: true },
  lastReadPage: Number,
  notes: String,
});

export const BookBookmarkModel = mongoose.model<BookBookmark>('BookBookmark', bookBookmarkSchema);

// Event Cache Model (for caching Eventbrite events)
const eventCacheSchema = new Schema({
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
      country: String,
    },
    logo: {
      url: String,
    },
    category: String,
    capacity: Number,
  }],
  cachedAt: { type: String, required: true },
});

export const EventCacheModel = mongoose.model('EventCache', eventCacheSchema);
