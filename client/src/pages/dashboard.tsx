import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { ProgressRing } from "@/components/progress-ring";
import { SkillBadge } from "@/components/skill-badge";
import {
  BookOpen,
  TrendingUp,
  Award,
  Flame,
  ArrowRight,
  Target,
  Sparkles,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: analysisData } = useQuery({
    queryKey: ['/api/career-analysis', 'demo-user'],
    queryFn: async () => {
      const response = await fetch('/api/career-analysis/demo-user');
      if (!response.ok) {
        return null;
      }
      return response.json();
    },
  });

  const topCareer = analysisData?.recommendations?.[0];
  const hasAnalysis = !!analysisData;

  const careerFitData = [
    { skill: "Technical", current: 85, fullMark: 100 },
    { skill: "Leadership", current: 65, fullMark: 100 },
    { skill: "Communication", current: 78, fullMark: 100 },
    { skill: "Problem Solving", current: 90, fullMark: 100 },
    { skill: "Creativity", current: 70, fullMark: 100 },
    { skill: "Teamwork", current: 82, fullMark: 100 },
  ];

  const skillGapData = [
    { skill: "Python", current: 70, required: 90, gap: 20 },
    { skill: "Machine Learning", current: 50, required: 85, gap: 35 },
    { skill: "Data Analysis", current: 75, required: 90, gap: 15 },
    { skill: "Cloud Computing", current: 40, required: 75, gap: 35 },
    { skill: "SQL", current: 80, required: 90, gap: 10 },
  ];

  const topSkills = [
    "JavaScript",
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "Git",
  ];

  const recentActivity = [
    {
      title: "Completed Course",
      description: "Advanced React Patterns",
      time: "2 hours ago",
    },
    {
      title: "Achievement Unlocked",
      description: "7-day Learning Streak",
      time: "1 day ago",
    },
    {
      title: "New Recommendation",
      description: "Full Stack Developer path updated",
      time: "2 days ago",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-heading font-bold">Welcome back! 👋</h1>
        <p className="text-lg text-muted-foreground">
          Here's your career progress overview
        </p>
      </motion.div>

      {/* AI Career Recommendation Banner */}
      {hasAnalysis && topCareer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-purple/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-heading font-semibold">
                    Your AI-Recommended Career Path
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    {topCareer.title}
                  </p>
                  <p className="text-muted-foreground">
                    {topCareer.description}
                  </p>
                  {(topCareer as any).whyThisCareer && (
                    <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-4 mt-2">
                      {(topCareer as any).whyThisCareer}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button 
                      onClick={() => setLocation("/recommendations")}
                      data-testid="button-view-all-recommendations"
                    >
                      View All Recommendations
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setLocation("/learning")}
                      data-testid="button-start-learning"
                    >
                      Start Learning Path
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!hasAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-warning/50 bg-gradient-to-br from-warning/5 to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Target className="h-6 w-6 text-warning" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-heading font-semibold">
                    Get Personalized Career Recommendations
                  </h3>
                  <p className="text-muted-foreground">
                    Take our AI-powered career analysis to discover the perfect career paths tailored to your skills, interests, and goals.
                  </p>
                  <Button 
                    onClick={() => setLocation("/analysis")}
                    data-testid="button-take-analysis"
                    className="mt-2"
                  >
                    Take Career Analysis
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Courses Completed"
          value={12}
          icon={BookOpen}
          trend={{ value: 15, isPositive: true }}
          iconColor="text-primary"
          index={0}
        />
        <StatCard
          title="Learning Streak"
          value={7}
          icon={Flame}
          suffix=" days"
          iconColor="text-warning"
          index={1}
        />
        <StatCard
          title="Skills Mastered"
          value={8}
          icon={Award}
          trend={{ value: 12, isPositive: true }}
          iconColor="text-success"
          index={2}
        />
        <StatCard
          title="Career Match"
          value={87}
          icon={Target}
          suffix="%"
          iconColor="text-accent"
          index={3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Career Fit Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
              <CardTitle>Career Fit Analysis</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={() => setLocation("/recommendations")}
                data-testid="button-view-recommendations"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={careerFitData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Your Skills"
                    dataKey="current"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <ProgressRing progress={72} size={160} strokeWidth={12} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-semibold">18 of 25 courses</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time Invested</span>
                  <span className="font-semibold">156 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Completion</span>
                  <span className="font-semibold">2 months</span>
                </div>
              </div>
              <Button
                className="w-full gap-2"
                onClick={() => setLocation("/learning")}
                data-testid="button-continue-learning"
              >
                Continue Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
              <CardTitle>Skill Gap Analysis</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={() => setLocation("/learning")}
                data-testid="button-view-learning-path"
              >
                View Learning Path
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={skillGapData}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis
                    dataKey="skill"
                    type="category"
                    width={120}
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar
                    dataKey="current"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="required"
                    fill="hsl(var(--muted))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-muted-foreground">Current Level</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-muted" />
                  <span className="text-muted-foreground">Required Level</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Skills & Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Top Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {topSkills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                  >
                    <SkillBadge skill={skill} isUserSkill variant="default" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex gap-3 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-purple/10 border-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-heading font-bold">
                  Ready to level up?
                </h3>
                <p className="text-muted-foreground">
                  Take a new career analysis to get updated recommendations
                </p>
              </div>
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setLocation("/analysis")}
                data-testid="button-retake-analysis"
              >
                <TrendingUp className="h-5 w-5" />
                Retake Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
