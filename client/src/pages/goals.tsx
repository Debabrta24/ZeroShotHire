// ==================== GOAL TRACKER PAGE ====================
// Visual goal tracking system with milestones and progress monitoring
// Users can set career goals, break them into milestones, and track completion

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Plus, Check, Calendar, TrendingUp, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CareerGoal, GoalMilestone } from "@shared/schema";

export default function GoalTracker() {
  // ===== STATE =====
  const [goals, setGoals] = useState<CareerGoal[]>([]);

  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    targetDate: "",
  });

  const { toast } = useToast();

  // ===== HANDLERS =====
  // Create new goal
  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const goal: CareerGoal = {
      id: Date.now().toString(),
      userId: "demo-user",
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category || "Career Advancement",
      targetDate: newGoal.targetDate,
      priority: newGoal.priority,
      status: "Not Started",
      progress: 0,
      milestones: [],
      createdAt: new Date().toISOString(),
    };

    setGoals([...goals, goal]);
    setIsCreatingGoal(false);
    setNewGoal({ title: "", description: "", category: "", priority: "Medium", targetDate: "" });
    
    toast({
      title: "Goal Created!",
      description: "Start adding milestones to track your progress",
    });
  };

  // Toggle milestone completion
  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m => {
          if (m.id === milestoneId) {
            return {
              ...m,
              completed: !m.completed,
              completedAt: !m.completed ? new Date().toISOString() : undefined,
            };
          }
          return m;
        });

        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const newProgress = updatedMilestones.length > 0
          ? (completedCount / updatedMilestones.length) * 100
          : 0;

        return {
          ...goal,
          milestones: updatedMilestones,
          progress: Math.round(newProgress),
          status: newProgress === 100 ? "Completed" : newProgress > 0 ? "In Progress" : "Not Started",
        };
      }
      return goal;
    }));
  };

  // Delete a goal
  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
    toast({
      title: "Goal Deleted",
      description: "The goal has been removed from your tracker",
    });
  };

  // ===== RENDER =====
  return (
    <div className="p-6">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-heading font-bold flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              Goal Tracker
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Set career goals, track milestones, and achieve your dreams
            </p>
          </div>

          {/* Create goal button */}
          <Dialog open={isCreatingGoal} onOpenChange={setIsCreatingGoal}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-create-goal">
                <Plus className="h-4 w-4" />
                Create Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Goal Title *</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g., Become Senior Engineer"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    data-testid="input-goal-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-description">Description</Label>
                  <Textarea
                    id="goal-description"
                    placeholder="Describe your goal..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    data-testid="textarea-goal-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-category">Category</Label>
                  <Input
                    id="goal-category"
                    placeholder="e.g., Career Advancement"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    data-testid="input-goal-category"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-priority">Priority</Label>
                  <Select value={newGoal.priority} onValueChange={(v: any) => setNewGoal({ ...newGoal, priority: v })}>
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-date">Target Date *</Label>
                  <Input
                    id="goal-date"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    data-testid="input-goal-date"
                  />
                </div>

                <Button onClick={handleCreateGoal} className="w-full" data-testid="button-create-goal-submit">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Goals list */}
      {goals.length > 0 ? (
        <div className="space-y-6">
          {goals.map((goal, index) => {
            const daysRemaining = Math.ceil(
              (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            const completedMilestones = goal.milestones.filter(m => m.completed).length;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant={
                            goal.priority === 'High' ? 'destructive' :
                            goal.priority === 'Medium' ? 'default' : 'secondary'
                          }>
                            {goal.priority} Priority
                          </Badge>
                          <Badge variant="outline">{goal.category}</Badge>
                          <Badge variant={
                            goal.status === 'Completed' ? 'default' :
                            goal.status === 'In Progress' ? 'secondary' : 'outline'
                          }>
                            {goal.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl mb-2">{goal.title}</CardTitle>
                        <CardDescription className="text-base">{goal.description}</CardDescription>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" data-testid={`button-delete-${goal.id}`}>
                          <Trash2 className="h-4 w-4" onClick={() => handleDeleteGoal(goal.id)} />
                        </Button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-2xl font-bold text-primary">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-3" />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{completedMilestones} / {goal.milestones.length} milestones</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{daysRemaining} days remaining</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Milestones */}
                  {goal.milestones.length > 0 && (
                    <CardContent>
                      <h3 className="font-semibold mb-4">Milestones</h3>
                      <div className="space-y-3">
                        {goal.milestones.map((milestone) => {
                          const milestoneDate = new Date(milestone.dueDate);
                          const isPast = milestoneDate < new Date();

                          return (
                            <div
                              key={milestone.id}
                              className={`p-4 border rounded-lg ${
                                milestone.completed ? 'bg-green-500/5 border-green-500/20' : 'bg-card'
                              }`}
                              data-testid={`milestone-${milestone.id}`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                                    milestone.completed
                                      ? 'bg-green-500 border-green-500'
                                      : 'border-muted-foreground hover:border-primary'
                                  }`}
                                  onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                                  data-testid={`milestone-toggle-${milestone.id}`}
                                >
                                  {milestone.completed && <Check className="h-3 w-3 text-white" />}
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                      <p className={`font-medium ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                                        {milestone.title}
                                      </p>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {milestone.description}
                                      </p>
                                    </div>
                                    <div className="text-sm text-right">
                                      <div className={`${isPast && !milestone.completed ? 'text-red-500' : 'text-muted-foreground'}`}>
                                        Due: {milestoneDate.toLocaleDateString()}
                                      </div>
                                      {milestone.completed && milestone.completedAt && (
                                        <div className="text-green-500 text-xs">
                                          Completed {new Date(milestone.completedAt).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your career goals and milestones
            </p>
            <Button onClick={() => setIsCreatingGoal(true)} className="gap-2" data-testid="button-create-first-goal">
              <Plus className="h-4 w-4" />
              Create Your First Goal
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
