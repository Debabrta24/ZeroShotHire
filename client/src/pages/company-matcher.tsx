// ==================== COMPANY MATCHER PAGE ====================
// Match users with companies based on values, culture, and preferences
// Helps find companies that align with personal and professional goals

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, Heart, TrendingUp, Users, MapPin, Sparkles } from "lucide-react";
import type { Company } from "@shared/schema";

// Sample companies data
const SAMPLE_COMPANIES: Company[] = [
  {
    id: "1",
    name: "TechVision Inc",
    industry: "Technology",
    size: "500-1000 employees",
    description: "Leading AI and machine learning company building the future of intelligent systems",
    values: ["Innovation", "Diversity", "Work-Life Balance", "Continuous Learning"],
    benefits: ["Remote Work", "Stock Options", "Learning Budget", "Flexible Hours"],
    workCulture: "Fast-paced, collaborative environment with emphasis on innovation and personal growth",
    techStack: ["Python", "React", "TensorFlow", "AWS"],
    careerGrowth: 9,
    workLifeBalance: 8,
    compensation: 9,
    diversityScore: 8,
    remotePolicy: "Fully Remote",
    location: ["San Francisco", "Remote"],
    openPositions: 12,
  },
  {
    id: "2",
    name: "GreenTech Solutions",
    industry: "Clean Energy",
    size: "200-500 employees",
    description: "Sustainable technology company focused on renewable energy solutions",
    values: ["Sustainability", "Social Impact", "Transparency", "Collaboration"],
    benefits: ["Health Insurance", "401k Match", "Unlimited PTO", "Gym Membership"],
    workCulture: "Mission-driven team passionate about making a positive environmental impact",
    careerGrowth: 7,
    workLifeBalance: 9,
    compensation: 7,
    diversityScore: 9,
    remotePolicy: "Hybrid",
    location: ["Austin", "Boston", "Remote"],
    openPositions: 8,
  },
  {
    id: "3",
    name: "FinanceCore",
    industry: "Financial Services",
    size: "1000+ employees",
    description: "Innovative fintech platform revolutionizing digital banking and payments",
    values: ["Security", "Innovation", "Customer First", "Excellence"],
    benefits: ["Competitive Salary", "Bonus Structure", "Stock Options", "Premium Healthcare"],
    workCulture: "Professional environment with focus on security and reliability",
    techStack: ["Java", "Kubernetes", "PostgreSQL", "React"],
    careerGrowth: 8,
    workLifeBalance: 7,
    compensation: 10,
    diversityScore: 7,
    remotePolicy: "Hybrid",
    location: ["New York", "London", "Singapore"],
    openPositions: 25,
  },
];

export default function CompanyMatcher() {
  // ===== STATE =====
  const [companies] = useState<Company[]>(SAMPLE_COMPANIES);  // Available companies
  const [savedCompanies, setSavedCompanies] = useState<string[]>([]);  // Saved company IDs

  // ===== HANDLERS =====
  // Toggle company in saved list
  const toggleSaveCompany = (companyId: string) => {
    if (savedCompanies.includes(companyId)) {
      setSavedCompanies(savedCompanies.filter(id => id !== companyId));
    } else {
      setSavedCompanies([...savedCompanies, companyId]);
    }
  };

  // ===== HELPER FUNCTIONS =====
  // Calculate match score (simplified - would use user preferences in production)
  const calculateMatchScore = (company: Company): number => {
    const scores = [
      company.careerGrowth,
      company.workLifeBalance,
      company.compensation / 10 * 10,
      company.diversityScore,
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10);
  };

  // Get rating color
  const getRatingColor = (value: number) => {
    if (value >= 8) return "text-green-500";
    if (value >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  // ===== RENDER =====
  return (
    <div className="p-6">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-heading font-bold flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          Company Matcher
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Find companies that match your values, culture preferences, and career goals
        </p>
      </motion.div>

      {/* Companies grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {companies.map((company, index) => {
          const matchScore = calculateMatchScore(company);
          const isSaved = savedCompanies.includes(company.id);

          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  {/* Company header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{company.name}</CardTitle>
                          <CardDescription>{company.industry}</CardDescription>
                        </div>
                      </div>
                    </div>

                    {/* Save button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaveCompany(company.id)}
                      data-testid={`button-toggle-save-${company.id}`}
                    >
                      <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>

                  {/* Match score */}
                  <div className="bg-primary/10 rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Match Score</span>
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{matchScore}%</div>
                    <Progress value={matchScore} className="h-2" />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground">{company.description}</p>

                    {/* Key stats */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-y">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{company.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{company.location[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{company.remotePolicy}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{company.openPositions} openings</Badge>
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Career Growth</span>
                          <span className={`text-sm font-medium ${getRatingColor(company.careerGrowth)}`}>
                            {company.careerGrowth}/10
                          </span>
                        </div>
                        <Progress value={company.careerGrowth * 10} className="h-1" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Work-Life Balance</span>
                          <span className={`text-sm font-medium ${getRatingColor(company.workLifeBalance)}`}>
                            {company.workLifeBalance}/10
                          </span>
                        </div>
                        <Progress value={company.workLifeBalance * 10} className="h-1" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Compensation</span>
                          <span className={`text-sm font-medium ${getRatingColor(company.compensation)}`}>
                            {company.compensation}/10
                          </span>
                        </div>
                        <Progress value={company.compensation * 10} className="h-1" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Diversity & Inclusion</span>
                          <span className={`text-sm font-medium ${getRatingColor(company.diversityScore)}`}>
                            {company.diversityScore}/10
                          </span>
                        </div>
                        <Progress value={company.diversityScore * 10} className="h-1" />
                      </div>
                    </div>

                    {/* Values */}
                    <div>
                      <p className="text-sm font-medium mb-2">Core Values</p>
                      <div className="flex flex-wrap gap-2">
                        {company.values.map((value) => (
                          <Badge key={value} variant="secondary">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <p className="text-sm font-medium mb-2">Benefits</p>
                      <div className="flex flex-wrap gap-2">
                        {company.benefits.map((benefit) => (
                          <Badge key={benefit} variant="outline">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Tech stack (if available) */}
                    {company.techStack && (
                      <div>
                        <p className="text-sm font-medium mb-2">Tech Stack</p>
                        <div className="flex flex-wrap gap-2">
                          {company.techStack.map((tech) => (
                            <Badge key={tech} variant="outline" className="bg-primary/5">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Work culture */}
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Work Culture</p>
                      <p className="text-sm text-muted-foreground">{company.workCulture}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" data-testid={`button-view-openings-${company.id}`}>
                        View Openings
                      </Button>
                      <Button variant="outline" className="flex-1" data-testid={`button-learn-more-${company.id}`}>
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Saved companies section */}
      {savedCompanies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                Saved Companies ({savedCompanies.length})
              </CardTitle>
              <CardDescription>
                Companies you're interested in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {savedCompanies.map((companyId) => {
                  const company = companies.find(c => c.id === companyId);
                  if (!company) return null;

                  return (
                    <div
                      key={companyId}
                      className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2"
                    >
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{company.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleSaveCompany(companyId)}
                        data-testid={`button-unsave-${companyId}`}
                      >
                        <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
