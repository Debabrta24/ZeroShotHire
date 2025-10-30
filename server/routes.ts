import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  linkedInProfileSchema,
  resumePersonalInfoSchema,
  resumeExperienceSchema,
  resumeEducationSchema,
} from "@shared/schema";
import OpenAI from "openai";

let openai: OpenAI | null = null;

if (process.env.A4F_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.A4F_API_KEY,
    baseURL: "https://api.a4f.co/v1",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes (register, login, logout, user)
  setupAuth(app);
  
  // Career Analysis Routes
  app.post("/api/career-analysis/analyze", async (req: Request, res: Response) => {
    try {
      const { skills, interests, education, careerGoals, workStyle, location, salaryExpectation } = req.body;
      
      // Use authenticated user ID if available, otherwise use demo-user for anonymous access
      const userId = req.user?.id || "demo-user";
      
      // If OpenAI is not configured, use mock recommendations
      if (!openai) {
        const mockRecommendations = [
          {
            id: "career-1",
            title: "Full Stack Developer",
            description: "Build end-to-end web applications combining frontend and backend technologies. Perfect for someone with your technical skills and interest in creating complete solutions.",
            matchPercentage: 92,
            salaryRange: { min: 75, max: 130, currency: "USD" },
            growthPotential: "High" as const,
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
            growthPotential: "High" as const,
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
            growthPotential: "Medium" as const,
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
        
        const analysisData = {
          userId,
          skills,
          interests,
          education,
          careerGoals,
          workStyle,
          location,
          salaryExpectation,
          recommendations: mockRecommendations,
          analyzedAt: new Date().toISOString()
        };
        
        await storage.saveCareerAnalysis(analysisData);
        
        return res.json({ recommendations: mockRecommendations });
      }
      
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
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

Skills: ${skills?.join(', ') || 'Not specified'}
Interests: ${interests?.join(', ') || 'Not specified'}
Education: ${education || 'Not specified'}
Career Goals: ${careerGoals?.join(', ') || 'Not specified'}
Work Style: ${workStyle || 'Not specified'}
Location Preference: ${location || 'Not specified'}
Salary Expectation: ${salaryExpectation || 'Not specified'}

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
        max_tokens: 2500,
      });

      const content = completion.choices[0]?.message?.content || "{}";
      let result;
      
      try {
        result = JSON.parse(content);
      } catch (parseError) {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[1]);
        } else {
          throw new Error("Failed to parse AI response");
        }
      }
      
      // Save to session/storage for personalization
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
        analyzedAt: new Date().toISOString()
      };
      
      // Store in memory for later retrieval
      await storage.saveCareerAnalysis(analysisData);
      
      res.json(result);
    } catch (error: any) {
      console.error("Career analysis error:", error);
      res.status(500).json({ 
        message: "Failed to analyze career profile",
        error: error.message
      });
    }
  });

  app.get("/api/career-analysis/:userId", async (req: Request, res: Response) => {
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
  
  // LinkedIn Profile Routes
  app.get("/api/linkedin-profile/:userId", async (req: Request, res: Response) => {
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

  app.post("/api/linkedin-profile", async (req: Request, res: Response) => {
    try {
      const validatedData = linkedInProfileSchema.parse(req.body);
      const userId = req.body.userId || "demo-user";
      
      const experienceWithIds = (validatedData.experience || []).map((exp, index) => ({
        ...exp,
        id: `exp-${Date.now()}-${index}`,
        location: exp.location || "",
        achievements: exp.achievements || [],
      }));
      
      const profile = await storage.createLinkedInProfile({
        userId,
        headline: validatedData.headline,
        summary: validatedData.summary,
        experience: experienceWithIds,
        skills: validatedData.skills,
        recommendations: [],
      });
      
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create LinkedIn profile" });
    }
  });

  app.post("/api/linkedin-profile/optimize", async (req: Request, res: Response) => {
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
            content: `Optimize this LinkedIn profile for a ${targetRole || 'professional'} role:
            
Current Headline: ${headline}
Current Summary: ${summary}
Skills: ${skills?.join(', ') || 'Not specified'}

Provide:
1. An optimized headline (max 220 characters)
2. An improved summary (engaging, achievement-focused, max 2600 characters)
3. 5 specific improvement suggestions

Format as JSON with keys: optimizedHeadline, optimizedSummary, suggestions (array of strings)`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
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
    } catch (error: any) {
      res.status(500).json({ 
        message: "Failed to optimize profile",
        optimizedHeadline: req.body.headline,
        optimizedSummary: req.body.summary,
        suggestions: ["An error occurred. Please try again."]
      });
    }
  });

  // Resume Routes
  app.get("/api/resume/:userId", async (req: Request, res: Response) => {
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

  app.post("/api/resume", async (req: Request, res: Response) => {
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
        certifications: req.body.certifications || [],
      });
      
      res.json(resume);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create resume" });
    }
  });

  app.put("/api/resume/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const resume = await storage.updateResume(id, req.body);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update resume" });
    }
  });

  app.post("/api/resume/generate-summary", async (req: Request, res: Response) => {
    try {
      const { experience, skills, targetRole } = req.body;
      
      if (!openai) {
        return res.json({ 
          summary: `Experienced professional with expertise in ${skills?.slice(0, 3).join(', ') || 'various technologies'}. Passionate about ${targetRole || 'technology'} and delivering high-quality results.`
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
            content: `Write a professional resume summary (3-4 sentences) for someone targeting a ${targetRole || 'professional'} role with these details:

Experience: ${JSON.stringify(experience?.slice(0, 2) || [])}
Skills: ${skills?.join(', ') || 'Various skills'}

Make it achievement-focused and compelling.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const summary = completion.choices[0]?.message?.content || "";
      res.json({ summary });
    } catch (error: any) {
      res.status(500).json({ 
        summary: `Experienced professional with expertise in ${req.body.skills?.slice(0, 3).join(', ') || 'various technologies'}.`
      });
    }
  });

  // AI Career Coach Chat
  app.post("/api/ai-coach/chat", async (req: Request, res: Response) => {
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
        ...(conversationHistory || []),
        {
          role: "user",
          content: message
        }
      ];
      
      const completion = await openai.chat.completions.create({
        model: "provider-1/deepseek-v3.1-terminus",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ 
        response: "I'm experiencing some technical difficulties. Please try again in a moment."
      });
    }
  });

  // Career Roadmap Routes
  app.get("/api/roadmaps", async (req: Request, res: Response) => {
    try {
      const roadmaps = await storage.getRoadmaps();
      res.json(roadmaps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roadmaps" });
    }
  });

  app.get("/api/roadmaps/:id", async (req: Request, res: Response) => {
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

  app.get("/api/roadmaps/:roadmapId/progress/:userId", async (req: Request, res: Response) => {
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

  app.post("/api/roadmaps/:roadmapId/start", async (req: Request, res: Response) => {
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
        startedAt: new Date().toISOString(),
        completedMilestones: [],
        currentMilestone: roadmap.milestones[0]?.id,
        overallProgress: 0,
      });
      
      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to start roadmap" });
    }
  });

  app.post("/api/roadmaps/:roadmapId/milestone/:milestoneId/complete", async (req: Request, res: Response) => {
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
      
      const completedMilestonesSet = new Set([...progress.completedMilestones, milestoneId]);
      const completedMilestones = Array.from(completedMilestonesSet);
      const currentMilestoneIndex = roadmap.milestones.findIndex(m => m.id === milestoneId);
      const nextMilestone = roadmap.milestones[currentMilestoneIndex + 1];
      
      const updatedProgress = await storage.updateUserRoadmapProgress(progress.id, {
        completedMilestones,
        currentMilestone: nextMilestone?.id,
        overallProgress: (completedMilestones.length / roadmap.milestones.length) * 100,
      });
      
      res.json(updatedProgress);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to complete milestone" });
    }
  });

  // LeetCode Proxy Routes
  app.get("/api/leetcode/problems", async (req: Request, res: Response) => {
    try {
      const { difficulty, tags, limit = '20', skip = '0' } = req.query;
      
      const params = new URLSearchParams();
      if (difficulty) params.append('difficulty', difficulty as string);
      if (tags) params.append('tags', tags as string);
      if (limit) params.append('limit', limit as string);
      if (skip) params.append('skip', skip as string);
      
      const url = `https://alfa-leetcode-api.onrender.com/problems?${params.toString()}`;
      console.log('Proxying LeetCode request:', url);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Career-Guidance-Platform/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching LeetCode problems:', error);
      res.status(500).json({ 
        message: error.message || "Failed to fetch problems",
        problemsetQuestionList: []
      });
    }
  });

  app.get("/api/leetcode/solution", async (req: Request, res: Response) => {
    try {
      const { titleSlug } = req.query;
      
      if (!titleSlug) {
        return res.status(400).json({ message: "titleSlug is required" });
      }
      
      const url = `https://alfa-leetcode-api.onrender.com/officialSolution?titleSlug=${titleSlug}`;
      console.log('Proxying LeetCode solution request:', url);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Career-Guidance-Platform/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching LeetCode solution:', error);
      res.status(500).json({ 
        message: error.message || "Failed to fetch solution",
        content: null
      });
    }
  });

  // Career News Routes
  app.get("/api/news", async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.NEWSDATA_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ 
          message: "News API key not configured",
          articles: []
        });
      }

      // Build NewsData.io API URL with parameters
      const params = new URLSearchParams({
        apikey: apiKey,
        country: 'in', // India
        category: 'business,technology',
        language: 'en',
        q: 'career OR jobs OR hiring OR employment OR "tech industry" OR startup'
      });

      const response = await fetch(`https://newsdata.io/api/1/news?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`NewsData API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform NewsData.io format to our NewsArticle format
      const articles = (data.results || []).map((article: any, index: number) => ({
        id: article.article_id || `news-${index}`,
        title: article.title || 'Untitled',
        summary: article.description || article.content?.substring(0, 200) || 'No description available',
        content: article.content || article.description || '',
        author: article.creator?.[0] || article.source_name || 'Unknown',
        source: article.source_name || article.source_id || 'Unknown Source',
        category: article.category || ['Technology'],
        thumbnail: article.image_url,
        publishedAt: article.pubDate || new Date().toISOString(),
        readTime: Math.ceil((article.content?.length || 500) / 200), // Estimate based on word count
        tags: article.keywords || [],
        url: article.link,
        isBookmarked: false,
        views: Math.floor(Math.random() * 1000) + 100 // Mock view count
      }));

      res.json({ 
        articles,
        totalResults: data.totalResults || articles.length,
        nextPage: data.nextPage || null
      });
    } catch (error: any) {
      console.error('Error fetching news:', error);
      res.status(500).json({ 
        message: error.message || "Failed to fetch news",
        articles: []
      });
    }
  });

  // Books API Routes - Free Programming Books
  app.get("/api/books/search", async (req: Request, res: Response) => {
    try {
      const { q = "programming", subject, limit = "20", page = "1" } = req.query;
      
      // Build Open Library search query
      let query = q as string;
      if (subject) {
        query += ` subject:${subject}`;
      }
      
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      // Fetch from Open Library API
      const params = new URLSearchParams({
        q: query,
        limit: limit as string,
        offset: offset.toString(),
        fields: "key,title,author_name,first_publish_year,subject,cover_i,edition_count,language,number_of_pages_median",
      });

      const response = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Open Library API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform to our Book interface
      const books = (data.docs || []).map((doc: any) => ({
        id: doc.key || `book-${Math.random()}`,
        title: doc.title || 'Untitled',
        author: doc.author_name || ['Unknown'],
        description: '', // Open Library search doesn't include descriptions
        subjects: (doc.subject || []).slice(0, 10),
        coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : undefined,
        publishYear: doc.first_publish_year,
        language: doc.language?.[0] || 'eng',
        pageCount: doc.number_of_pages_median,
        readUrl: `https://openlibrary.org${doc.key}`,
        format: ['HTML'], // Open Library provides web reader
        isBookmarked: false
      }));

      res.json({ 
        books,
        total: data.numFound || 0,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });
    } catch (error: any) {
      console.error('Error fetching books:', error);
      res.status(500).json({ 
        message: error.message || "Failed to fetch books",
        books: []
      });
    }
  });

  app.get("/api/books/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Fetch book details from Open Library
      const response = await fetch(`https://openlibrary.org${id}.json`);
      
      if (!response.ok) {
        throw new Error(`Open Library API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Get authors
      const authors = await Promise.all(
        (data.authors || []).map(async (author: any) => {
          try {
            const authorRes = await fetch(`https://openlibrary.org${author.author.key}.json`);
            const authorData = await authorRes.json();
            return authorData.name || 'Unknown';
          } catch {
            return 'Unknown';
          }
        })
      );

      const book = {
        id: data.key,
        title: data.title || 'Untitled',
        author: authors.length > 0 ? authors : ['Unknown'],
        description: typeof data.description === 'string' ? data.description : data.description?.value || '',
        subjects: data.subjects || [],
        coverUrl: data.covers?.[0] ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : undefined,
        publishYear: data.first_publish_date ? parseInt(data.first_publish_date) : undefined,
        language: 'eng',
        pageCount: data.number_of_pages,
        readUrl: `https://openlibrary.org${data.key}`,
        format: ['HTML'],
        isBookmarked: false
      };

      res.json(book);
    } catch (error: any) {
      console.error('Error fetching book details:', error);
      res.status(500).json({ 
        message: error.message || "Failed to fetch book details"
      });
    }
  });

  // Book Bookmarks Routes
  app.get("/api/bookmarks", async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id || "demo-user";
      const bookmarks = await storage.getBookBookmarks(userId);
      res.json({ bookmarks });
    } catch (error: any) {
      console.error('Error fetching bookmarks:', error);
      res.status(500).json({ 
        message: error.message || "Failed to fetch bookmarks"
      });
    }
  });

  app.post("/api/bookmarks", async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id || "demo-user";
      const { bookData } = req.body;
      
      if (!bookData || !bookData.id) {
        return res.status(400).json({ message: "Valid book data with id is required" });
      }

      // Check if already bookmarked
      const existingBookmarks = await storage.getBookBookmarks(userId);
      const alreadyBookmarked = existingBookmarks.some(b => b.bookId === bookData.id);
      
      if (alreadyBookmarked) {
        return res.status(400).json({ message: "Book already bookmarked" });
      }

      const bookmark = await storage.createBookBookmark({
        userId,
        bookId: bookData.id,
        bookData,
        bookmarkedAt: new Date().toISOString()
      });

      res.json({ bookmark });
    } catch (error: any) {
      console.error('Error creating bookmark:', error);
      res.status(500).json({ 
        message: error.message || "Failed to create bookmark"
      });
    }
  });

  app.delete("/api/bookmarks/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBookBookmark(id);
      
      if (!success) {
        return res.status(404).json({ message: "Bookmark not found" });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting bookmark:', error);
      res.status(500).json({ 
        message: error.message || "Failed to delete bookmark"
      });
    }
  });

  // JSearch API - Fetch internship opportunities from India
  app.get("/api/internships", async (req: Request, res: Response) => {
    try {
      const { query, location, employment_type, date_posted, remote_jobs_only } = req.query;
      
      const apiKey = process.env.RAPIDAPI_KEY;
      
      if (!apiKey) {
        // Return mock internship data for demo
        const mockInternships = [
          {
            job_id: "mock-1",
            job_title: "Software Engineering Intern",
            company_name: "Flipkart",
            job_location: "Bangalore, India",
            job_employment_type: "INTERN",
            job_posted_at_datetime_utc: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
            job_posted_at_datetime_utc: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            job_description: "Analyze payment data, build ML models, and generate insights for business decisions. Work with Python, SQL, and data visualization tools.",
            job_apply_link: "https://razorpay.com/jobs",
            job_is_remote: true,
            job_required_skills: ["Python", "SQL", "Machine Learning", "Data Analysis"],
            job_min_salary: 40000,
            job_max_salary: 50000,
            job_salary_currency: "INR",
            job_salary_period: "MONTH"
          },
          {
            job_id: "mock-3",
            job_title: "Frontend Developer Intern",
            company_name: "Swiggy",
            job_location: "Bangalore, India",
            job_employment_type: "INTERN",
            job_posted_at_datetime_utc: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            job_description: "Build delightful user experiences for millions of food lovers. Work with React, TypeScript, and modern frontend technologies.",
            job_apply_link: "https://www.swiggy.com/careers",
            job_is_remote: false,
            job_required_skills: ["React", "TypeScript", "JavaScript", "CSS"],
            job_min_salary: 35000,
            job_max_salary: 45000,
            job_salary_currency: "INR",
            job_salary_period: "MONTH"
          }
        ];
        
        return res.json({ data: mockInternships, demo: true });
      }
      
      // Build search query - default to "intern" for India
      const searchQuery = (query as string) || "intern";
      const searchLocation = (location as string) || "India";
      
      const apiUrl = "https://jsearch.p.rapidapi.com/search";
      const params = new URLSearchParams({
        query: `${searchQuery} in ${searchLocation}`,
        page: "1",
        num_pages: "1",
        date_posted: (date_posted as string) || "all"
      });
      
      if (employment_type) {
        params.append("employment_types", employment_type as string);
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
    } catch (error: any) {
      console.error("Error fetching internships:", error);
      
      // Return mock data as fallback
      const mockInternships = [
        {
          job_id: "fallback-1",
          job_title: "Software Engineering Intern",
          company_name: "Tech Company India",
          job_location: "Mumbai, India",
          job_employment_type: "INTERN",
          job_posted_at_datetime_utc: new Date().toISOString(),
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

  // Eventbrite Events API - Fetch networking events with caching
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const { search, location, category, online } = req.query;
      
      // Check if we have cached events and if they're still fresh (30 minutes)
      const cached = await storage.getCachedEvents();
      const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
      
      if (cached) {
        const cacheAge = Date.now() - new Date(cached.cachedAt).getTime();
        if (cacheAge < CACHE_DURATION) {
          // Cache is fresh, return cached events with filters applied
          let filteredEvents = cached.events;
          
          // Apply client-side filters
          if (search) {
            const searchLower = (search as string).toLowerCase();
            filteredEvents = filteredEvents.filter(event => 
              event.name.toLowerCase().includes(searchLower) ||
              event.description.toLowerCase().includes(searchLower)
            );
          }
          
          if (online === 'true') {
            filteredEvents = filteredEvents.filter(event => event.isOnline);
          } else if (online === 'false') {
            filteredEvents = filteredEvents.filter(event => !event.isOnline);
          }
          
          if (category) {
            filteredEvents = filteredEvents.filter(event => 
              event.category?.toLowerCase() === (category as string).toLowerCase()
            );
          }
          
          return res.json({ events: filteredEvents, cached: true });
        }
      }
      
      // Cache is stale or doesn't exist, fetch from Eventbrite API
      const apiKey = process.env.EVENTBRITE_API_KEY;
      
      if (!apiKey) {
        // If no API key, return mock data for demo
        const mockEvents = [
          {
            id: "mock-1",
            name: "Tech Career Networking Mixer - Virtual",
            description: "Join us for an evening of networking with tech professionals from various industries. Perfect for career changers and job seekers looking to expand their network.",
            url: "https://eventbrite.com",
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
            created: new Date().toISOString(),
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
            start: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
            created: new Date().toISOString(),
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
            start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
            created: new Date().toISOString(),
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
        
        // Cache mock events
        await storage.setCachedEvents(mockEvents);
        
        return res.json({ events: mockEvents, cached: false, demo: true });
      }
      
      // Try to fetch from Eventbrite API, fall back to mock data if it fails
      try {
        const searchQuery = (search as string) || "networking career tech";
        const apiUrl = `https://www.eventbriteapi.com/v3/events/search/?q=${encodeURIComponent(searchQuery)}&expand=venue,organizer,category&sort_by=date`;
        
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });
        
        if (!response.ok) {
          console.warn(`Eventbrite API error: ${response.status}, falling back to mock data`);
          throw new Error('API failed, using mock data');
        }
        
        const data = await response.json();
        
        // Transform Eventbrite data to our schema
        const events = data.events?.map((event: any) => ({
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
          } : undefined,
          logoUrl: event.logo?.url,
          organizerName: event.organizer?.name,
          category: event.category?.name
        })) || [];
        
        // Cache the events
        await storage.setCachedEvents(events);
        
        return res.json({ events, cached: false });
      } catch (apiError) {
        // Fall back to mock data if Eventbrite API fails
        console.warn('Using mock events due to API failure:', apiError);
        const mockEvents = [
          {
            id: "mock-1",
            name: "Tech Career Networking Mixer - Virtual",
            description: "Join us for an evening of networking with tech professionals from various industries. Perfect for career changers and job seekers looking to expand their network.",
            url: "https://eventbrite.com",
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
            created: new Date().toISOString(),
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
            start: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
            created: new Date().toISOString(),
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
            start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
            created: new Date().toISOString(),
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
        
        // Cache mock events
        await storage.setCachedEvents(mockEvents);
        
        return res.json({ events: mockEvents, cached: false, demo: true });
      }
    } catch (error: any) {
      console.error('Error fetching events:', error);
      res.status(500).json({ 
        message: error.message || "Failed to fetch events"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
