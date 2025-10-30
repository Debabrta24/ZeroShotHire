import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CareerCard } from "@/components/career-card";
import { SkillBadge } from "@/components/skill-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  GraduationCap,
  Clock,
  TrendingUp,
  Users,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { CareerRecommendation } from "@shared/schema";

export default function Recommendations() {
  const [, setLocation] = useLocation();
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);

  const { data: analysisData, isLoading, error } = useQuery({
    queryKey: ['/api/career-analysis', 'demo-user'],
    queryFn: async () => {
      const response = await fetch('/api/career-analysis/demo-user');
      if (!response.ok) {
        throw new Error('Failed to fetch career analysis');
      }
      return response.json();
    },
  });

  const recommendations: CareerRecommendation[] = analysisData?.recommendations || [];
  const userSkills = analysisData?.skills || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" data-testid="loader-recommendations" />
          <p className="text-lg text-muted-foreground">Loading your personalized career recommendations...</p>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-6 w-6" />
              <h2 className="text-xl font-semibold">No Analysis Found</h2>
            </div>
            <p className="text-muted-foreground">
              Complete the career analysis first to get personalized recommendations.
            </p>
            <Button onClick={() => setLocation("/analysis")} className="w-full" data-testid="button-start-analysis">
              Start Career Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold">
          Your AI-Powered Career Recommendations
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Based on your unique profile, here are your top {recommendations.length} personalized career paths
        </p>
      </motion.div>

      {userSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill: string) => (
                  <SkillBadge key={skill} skill={skill} isUserSkill />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {recommendations.map((career, index) => (
          <CareerCard
            key={career.id || index}
            career={career}
            index={index}
            onViewDetails={() => setSelectedCareer(career)}
          />
        ))}
      </div>

      <Dialog
        open={!!selectedCareer}
        onOpenChange={(open) => !open && setSelectedCareer(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCareer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-heading">
                  {selectedCareer.title}
                </DialogTitle>
                <p className="text-muted-foreground text-lg mt-2">
                  {selectedCareer.description}
                </p>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                  <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
                  <TabsTrigger value="insights" data-testid="tab-insights">Insights</TabsTrigger>
                  <TabsTrigger value="companies" data-testid="tab-companies">Companies</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Salary Range
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold font-mono">
                          ${selectedCareer.salaryRange.min}k - ${selectedCareer.salaryRange.max}k
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedCareer.salaryRange.currency} per year
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          Time to Master
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold font-mono">
                          {selectedCareer.averageYearsToMaster} years
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Average learning timeline
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          Education Required
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-medium">
                          {selectedCareer.educationRequired}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Growth Potential
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-medium">
                          {selectedCareer.growthPotential}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {(selectedCareer as any).whyThisCareer && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Why This Career Matches You</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {(selectedCareer as any).whyThisCareer}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="skills" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Required Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.requiredSkills.map((skill) => (
                          <SkillBadge key={skill} skill={skill} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Related Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedCareer.relatedRoles.map((role) => (
                          <div key={role} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>{role}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="insights" className="space-y-6 mt-6">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Market Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Industry Demand</span>
                            <span className="text-sm font-mono">{selectedCareer.industryDemand}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${selectedCareer.industryDemand}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Work-Life Balance</span>
                            <span className="text-sm font-mono">{selectedCareer.workLifeBalance}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent"
                              style={{ width: `${selectedCareer.workLifeBalance}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Remote Opportunities</span>
                            <span className="text-sm font-mono">{selectedCareer.remoteOpportunities}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-success"
                              style={{ width: `${selectedCareer.remoteOpportunities}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="companies" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Top Companies Hiring
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {selectedCareer.topCompanies.map((company) => (
                          <div
                            key={company}
                            className="flex items-center gap-3 p-3 rounded-lg border hover-elevate"
                          >
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{company}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 mt-6">
                <Button
                  className="flex-1"
                  onClick={() => setLocation("/learning")}
                  data-testid="button-view-learning-path"
                >
                  View Learning Path
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation("/roadmaps")}
                  data-testid="button-explore-roadmaps"
                >
                  Explore Roadmaps
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
