import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import type { CareerAnalysisResult, IStorage } from "../storage";
import type {
  User,
  InsertUser,
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
} from "@shared/schema";
import {
  UserModel,
  LinkedInProfileModel,
  ResumeModel,
  CareerRoadmapModel,
  UserRoadmapProgressModel,
  InterviewCategoryModel,
  InterviewQuestionModel,
  InterviewTipModel,
  MentorModel,
  SalaryInsightModel,
  NegotiationTipModel,
  JobApplicationModel,
  CareerAnalysisModel,
  BookBookmarkModel,
  EventCacheModel,
} from "./models";

const MemoryStore = createMemoryStore(session);

export class MongoStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ id }).lean();
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username }).lean();
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    await UserModel.create(user);
    return user;
  }

  // LinkedIn Profile methods
  async getLinkedInProfile(userId: string): Promise<LinkedInProfile | undefined> {
    const profile = await LinkedInProfileModel.findOne({ userId }).lean();
    return profile || undefined;
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
    await LinkedInProfileModel.create(linkedInProfile);
    return linkedInProfile;
  }

  async updateLinkedInProfile(id: string, profile: Partial<LinkedInProfile>): Promise<LinkedInProfile | undefined> {
    const existing = await LinkedInProfileModel.findOne({ id }).lean();
    if (!existing) return undefined;

    const updated: LinkedInProfile = {
      ...existing,
      ...profile,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };
    await LinkedInProfileModel.updateOne({ id }, updated);
    return updated;
  }

  // Resume methods
  async getResume(userId: string): Promise<Resume | undefined> {
    const resume = await ResumeModel.findOne({ userId }).lean();
    return resume || undefined;
  }

  async getResumeById(id: string): Promise<Resume | undefined> {
    const resume = await ResumeModel.findOne({ id }).lean();
    return resume || undefined;
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
    await ResumeModel.create(newResume);
    return newResume;
  }

  async updateResume(id: string, resume: Partial<Resume>): Promise<Resume | undefined> {
    const existing = await ResumeModel.findOne({ id }).lean();
    if (!existing) return undefined;

    const updated: Resume = {
      ...existing,
      ...resume,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };
    await ResumeModel.updateOne({ id }, updated);
    return updated;
  }

  // Career Roadmap methods
  async getRoadmaps(): Promise<CareerRoadmap[]> {
    const roadmaps = await CareerRoadmapModel.find({}).lean();
    return roadmaps;
  }

  async getRoadmapById(id: string): Promise<CareerRoadmap | undefined> {
    const roadmap = await CareerRoadmapModel.findOne({ id }).lean();
    return roadmap || undefined;
  }

  async getUserRoadmapProgress(userId: string, roadmapId: string): Promise<UserRoadmapProgress | undefined> {
    const progress = await UserRoadmapProgressModel.findOne({ userId, roadmapId }).lean();
    return progress || undefined;
  }

  async createUserRoadmapProgress(progress: Omit<UserRoadmapProgress, 'id'>): Promise<UserRoadmapProgress> {
    const id = randomUUID();
    const userProgress: UserRoadmapProgress = { ...progress, id };
    await UserRoadmapProgressModel.create(userProgress);
    return userProgress;
  }

  async updateUserRoadmapProgress(id: string, progress: Partial<UserRoadmapProgress>): Promise<UserRoadmapProgress | undefined> {
    const existing = await UserRoadmapProgressModel.findOne({ id }).lean();
    if (!existing) return undefined;

    const updated: UserRoadmapProgress = {
      ...existing,
      ...progress,
      id: existing.id
    };
    await UserRoadmapProgressModel.updateOne({ id }, updated);
    return updated;
  }

  // Interview methods
  async getInterviewCategories(): Promise<InterviewCategory[]> {
    const categories = await InterviewCategoryModel.find({}).lean();
    return categories;
  }

  async getInterviewQuestions(category?: string): Promise<InterviewQuestion[]> {
    const filter = category ? { category } : {};
    const questions = await InterviewQuestionModel.find(filter).lean();
    return questions;
  }

  async getInterviewTips(): Promise<InterviewTip[]> {
    const tips = await InterviewTipModel.find({}).lean();
    return tips;
  }

  // Mentor methods
  async getMentors(): Promise<Mentor[]> {
    const mentors = await MentorModel.find({}).lean();
    return mentors;
  }

  // Salary methods
  async getSalaryInsights(role?: string): Promise<SalaryInsight[]> {
    const filter = role ? { role } : {};
    const insights = await SalaryInsightModel.find(filter).lean();
    return insights;
  }

  async getNegotiationTips(): Promise<NegotiationTip[]> {
    const tips = await NegotiationTipModel.find({}).lean();
    return tips;
  }

  // Job Application methods
  async getJobApplications(userId: string): Promise<JobApplication[]> {
    const applications = await JobApplicationModel.find({ userId }).lean();
    return applications;
  }

  async createJobApplication(application: Omit<JobApplication, 'id'>): Promise<JobApplication> {
    const id = randomUUID();
    const newApplication: JobApplication = { ...application, id };
    await JobApplicationModel.create(newApplication);
    return newApplication;
  }

  async updateJobApplication(id: string, application: Partial<JobApplication>): Promise<JobApplication | undefined> {
    const existing = await JobApplicationModel.findOne({ id }).lean();
    if (!existing) return undefined;

    const updated: JobApplication = {
      ...existing,
      ...application,
      id: existing.id
    };
    await JobApplicationModel.updateOne({ id }, updated);
    return updated;
  }

  async deleteJobApplication(id: string): Promise<boolean> {
    const result = await JobApplicationModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Career Analysis methods
  async saveCareerAnalysis(analysis: Omit<CareerAnalysisResult, 'id'>): Promise<CareerAnalysisResult> {
    const id = randomUUID();
    const newAnalysis: CareerAnalysisResult = { ...analysis, id };
    await CareerAnalysisModel.create(newAnalysis);
    return newAnalysis;
  }

  async getCareerAnalysis(userId: string): Promise<CareerAnalysisResult | undefined> {
    const analysis = await CareerAnalysisModel.findOne({ userId }).sort({ analyzedAt: -1 }).lean();
    return analysis || undefined;
  }

  // Book Bookmark methods
  async getBookBookmarks(userId: string): Promise<BookBookmark[]> {
    const bookmarks = await BookBookmarkModel.find({ userId }).lean();
    return bookmarks;
  }

  async createBookBookmark(bookmark: Omit<BookBookmark, 'id'>): Promise<BookBookmark> {
    const id = randomUUID();
    const newBookmark: BookBookmark = { ...bookmark, id };
    await BookBookmarkModel.create(newBookmark);
    return newBookmark;
  }

  async deleteBookBookmark(id: string): Promise<boolean> {
    const result = await BookBookmarkModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async updateBookBookmark(id: string, bookmark: Partial<BookBookmark>): Promise<BookBookmark | undefined> {
    const existing = await BookBookmarkModel.findOne({ id }).lean();
    if (!existing) return undefined;

    const updated: BookBookmark = {
      ...existing,
      ...bookmark,
      id: existing.id
    };
    await BookBookmarkModel.updateOne({ id }, updated);
    return updated;
  }

  // Event Cache methods
  async getCachedEvents(): Promise<{ events: EventbriteEvent[], cachedAt: string } | undefined> {
    const cache = await EventCacheModel.findOne({}).lean();
    return cache as { events: EventbriteEvent[], cachedAt: string } | null || undefined;
  }

  async setCachedEvents(events: EventbriteEvent[]): Promise<void> {
    const cachedAt = new Date().toISOString();
    await EventCacheModel.deleteMany({});
    await EventCacheModel.create({ events, cachedAt });
  }
}
