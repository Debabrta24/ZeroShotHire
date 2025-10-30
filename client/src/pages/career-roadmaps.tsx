import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Map,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle2,
  Circle,
  PlayCircle,
  BookOpen,
  Target,
  Lightbulb,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CareerRoadmap, RoadmapMilestone, UserRoadmapProgress } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CareerRoadmaps() {
  const { toast } = useToast();
  const [selectedRoadmap, setSelectedRoadmap] = useState<CareerRoadmap | null>(null);
  const [userProgress, setUserProgress] = useState<UserRoadmapProgress | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: roadmaps, isLoading } = useQuery<CareerRoadmap[]>({
    queryKey: ["/api/roadmaps"],
  });

  const filteredRoadmaps = useMemo(() => {
    if (!roadmaps) return [];
    if (!searchQuery.trim()) return roadmaps;

    const query = searchQuery.toLowerCase();
    return roadmaps.filter((roadmap) => {
      return (
        roadmap.title.toLowerCase().includes(query) ||
        roadmap.description.toLowerCase().includes(query) ||
        roadmap.requiredSkills.some((skill) => skill.toLowerCase().includes(query)) ||
        roadmap.difficulty.toLowerCase().includes(query)
      );
    });
  }, [roadmaps, searchQuery]);

  const startRoadmapMutation = useMutation({
    mutationFn: async (roadmapId: string) => {
      const response = await apiRequest(
        "POST",
        `/api/roadmaps/${roadmapId}/start`,
        { userId: "demo-user" }
      );
      return await response.json() as UserRoadmapProgress;
    },
    onSuccess: (data) => {
      setUserProgress(data);
      toast({
        title: "Roadmap Started!",
        description: "Your learning journey has begun.",
      });
    },
  });

  const completeMilestoneMutation = useMutation({
    mutationFn: async ({
      roadmapId,
      milestoneId,
    }: {
      roadmapId: string;
      milestoneId: string;
    }) => {
      const response = await apiRequest(
        "POST",
        `/api/roadmaps/${roadmapId}/milestone/${milestoneId}/complete`,
        { userId: "demo-user" }
      );
      return await response.json() as UserRoadmapProgress;
    },
    onSuccess: (data) => {
      setUserProgress(data);
      toast({
        title: "Milestone Completed!",
        description: "Great progress on your learning journey!",
      });
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success text-white";
      case "Intermediate":
        return "bg-warning text-white";
      case "Advanced":
        return "bg-destructive text-white";
      default:
        return "bg-secondary";
    }
  };

  const handleStartRoadmap = (roadmap: CareerRoadmap) => {
    startRoadmapMutation.mutate(roadmap.id);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Map className="h-10 w-10 text-primary" />
          <div className="flex-1">
            <h1 className="text-4xl font-heading font-bold">Career Roadmaps</h1>
            <p className="text-lg text-muted-foreground">
              Choose your path and follow a structured learning journey
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search roadmaps by title, skills, or difficulty..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-roadmaps"
          />
        </div>

        {filteredRoadmaps.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-roadmaps-found">
              No roadmaps found matching "{searchQuery}"
            </p>
          </div>
        )}
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoadmaps?.map((roadmap, index) => (
          <motion.div
            key={roadmap.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col hover-elevate cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-2xl">{roadmap.title}</CardTitle>
                  <Badge className={getDifficultyColor(roadmap.difficulty)}>
                    {roadmap.difficulty}
                  </Badge>
                </div>
                <CardDescription>{roadmap.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {roadmap.estimatedDuration} {roadmap.durationUnit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{roadmap.milestones.length} milestones</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>
                        ${roadmap.salaryRange.min}k-${roadmap.salaryRange.max}k
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>{roadmap.jobDemand}% demand</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {roadmap.requiredSkills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {roadmap.requiredSkills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{roadmap.requiredSkills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 gap-2"
                  onClick={() => setSelectedRoadmap(roadmap)}
                  data-testid={`button-view-roadmap-${roadmap.id}`}
                >
                  <Lightbulb className="h-4 w-4" />
                  View Roadmap
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedRoadmap} onOpenChange={() => setSelectedRoadmap(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRoadmap && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-3xl mb-2">
                      {selectedRoadmap.title}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedRoadmap.description}
                    </DialogDescription>
                  </div>
                  <Badge className={getDifficultyColor(selectedRoadmap.difficulty)}>
                    {selectedRoadmap.difficulty}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {userProgress && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Overall Completion</span>
                          <span className="font-bold">
                            {Math.round(userProgress.overallProgress)}%
                          </span>
                        </div>
                        <Progress value={userProgress.overallProgress} />
                        <p className="text-xs text-muted-foreground">
                          {userProgress.completedMilestones.length} of{" "}
                          {selectedRoadmap.milestones.length} milestones completed
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <h3 className="text-xl font-heading font-bold mb-4">
                    Learning Milestones
                  </h3>
                  <div className="space-y-4">
                    {selectedRoadmap.milestones.map((milestone, index) => {
                      const isCompleted = userProgress?.completedMilestones.includes(
                        milestone.id
                      );
                      const isCurrent = userProgress?.currentMilestone === milestone.id;

                      return (
                        <motion.div
                          key={milestone.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card
                            className={
                              isCurrent ? "ring-2 ring-primary" : isCompleted ? "opacity-75" : ""
                            }
                          >
                            <CardHeader>
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-8 w-8 text-success" />
                                  ) : isCurrent ? (
                                    <PlayCircle className="h-8 w-8 text-primary" />
                                  ) : (
                                    <Circle className="h-8 w-8 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-4 mb-2">
                                    <div>
                                      <CardTitle className="text-lg">
                                        {milestone.order}. {milestone.title}
                                      </CardTitle>
                                      <CardDescription>{milestone.description}</CardDescription>
                                    </div>
                                    <Badge variant="outline">
                                      {milestone.duration} {milestone.durationUnit}
                                    </Badge>
                                  </div>

                                  <div className="space-y-3 mt-4">
                                    <div>
                                      <p className="text-sm font-medium mb-2">Skills to Learn:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {milestone.skills.map((skill) => (
                                          <Badge key={skill} variant="secondary" className="text-xs">
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium mb-2">Tasks:</p>
                                      <ul className="space-y-1">
                                        {milestone.tasks.map((task, taskIndex) => (
                                          <li
                                            key={taskIndex}
                                            className="flex items-start gap-2 text-sm text-muted-foreground"
                                          >
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                            <span>{task}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium mb-2">Resources:</p>
                                      <div className="space-y-2">
                                        {milestone.resources.map((resource) => (
                                          <div
                                            key={resource.id}
                                            className="flex items-center gap-3 p-2 bg-muted rounded-md"
                                          >
                                            <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium truncate">
                                                {resource.title}
                                              </p>
                                              <p className="text-xs text-muted-foreground">
                                                {resource.provider} •{" "}
                                                {resource.isFree ? "Free" : "Paid"}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {isCurrent && !isCompleted && (
                                      <Button
                                        className="w-full mt-2 gap-2"
                                        onClick={() =>
                                          completeMilestoneMutation.mutate({
                                            roadmapId: selectedRoadmap.id,
                                            milestoneId: milestone.id,
                                          })
                                        }
                                        disabled={completeMilestoneMutation.isPending}
                                        data-testid={`button-complete-milestone-${milestone.id}`}
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Mark as Complete
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {!userProgress && (
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={() => handleStartRoadmap(selectedRoadmap)}
                    disabled={startRoadmapMutation.isPending}
                    data-testid="button-start-roadmap"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Start This Roadmap
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
