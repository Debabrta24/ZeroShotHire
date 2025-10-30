import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { AnimatedCounter } from "@/components/animated-counter";
import {
  BookOpen,
  Award,
  Flame,
  Target,
  TrendingUp,
  Lock,
  Sparkles,
  Gem,
  Library,
  Clock,
  Dumbbell,
} from "lucide-react";
import type { Achievement } from "@shared/schema";

export default function Progress() {
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first course",
      icon: "target",
      category: "Learning",
      isUnlocked: true,
      unlockedAt: "2025-01-15",
      progress: 1,
      requirement: 1,
    },
    {
      id: "2",
      title: "Week Warrior",
      description: "Maintain a 7-day learning streak",
      icon: "flame",
      category: "Streak",
      isUnlocked: true,
      unlockedAt: "2025-01-20",
      progress: 7,
      requirement: 7,
    },
    {
      id: "3",
      title: "Skill Collector",
      description: "Master 5 different skills",
      icon: "gem",
      category: "Skill",
      isUnlocked: true,
      unlockedAt: "2025-01-25",
      progress: 5,
      requirement: 5,
    },
    {
      id: "4",
      title: "Course Crusher",
      description: "Complete 10 courses",
      icon: "library",
      category: "Learning",
      isUnlocked: true,
      unlockedAt: "2025-02-10",
      progress: 10,
      requirement: 10,
    },
    {
      id: "5",
      title: "On Fire",
      description: "Achieve a 30-day learning streak",
      icon: "sparkles",
      category: "Streak",
      isUnlocked: false,
      progress: 7,
      requirement: 30,
    },
    {
      id: "6",
      title: "Expert Level",
      description: "Master 15 different skills",
      icon: "award",
      category: "Skill",
      isUnlocked: false,
      progress: 5,
      requirement: 15,
    },
    {
      id: "7",
      title: "Century Club",
      description: "Study for 100 total hours",
      icon: "clock",
      category: "Milestone",
      isUnlocked: false,
      progress: 72,
      requirement: 100,
    },
    {
      id: "8",
      title: "Dedication",
      description: "Complete 25 courses",
      icon: "dumbbell",
      category: "Learning",
      isUnlocked: false,
      progress: 12,
      requirement: 25,
    },
  ];

  const getAchievementIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = `h-12 w-12 ${isUnlocked ? "" : "opacity-50"}`;
    const iconMap: Record<string, JSX.Element> = {
      target: <Target className={iconClass} />,
      flame: <Flame className={iconClass} />,
      gem: <Gem className={iconClass} />,
      library: <Library className={iconClass} />,
      sparkles: <Sparkles className={iconClass} />,
      award: <Award className={iconClass} />,
      clock: <Clock className={iconClass} />,
      dumbbell: <Dumbbell className={iconClass} />,
    };
    return iconMap[iconName] || <Award className={iconClass} />;
  };

  const weeklyActivity = [
    { date: "Mon", hours: 2 },
    { date: "Tue", hours: 3 },
    { date: "Wed", hours: 1 },
    { date: "Thu", hours: 4 },
    { date: "Fri", hours: 2 },
    { date: "Sat", hours: 5 },
    { date: "Sun", hours: 3 },
  ];

  const monthlyHeatmap = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    hours: Math.floor(Math.random() * 5),
  }));

  const getHeatmapColor = (hours: number) => {
    if (hours === 0) return "bg-muted";
    if (hours === 1) return "bg-success/30";
    if (hours === 2) return "bg-success/50";
    if (hours === 3) return "bg-success/70";
    return "bg-success";
  };

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const lockedAchievements = achievements.filter((a) => !a.isUnlocked);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-heading font-bold">Your Progress</h1>
        <p className="text-lg text-muted-foreground">
          Track your achievements and learning milestones
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hours"
          value={156}
          icon={BookOpen}
          trend={{ value: 12, isPositive: true }}
          iconColor="text-primary"
          index={0}
        />
        <StatCard
          title="Current Streak"
          value={7}
          icon={Flame}
          suffix=" days"
          iconColor="text-warning"
          index={1}
        />
        <StatCard
          title="Achievements"
          value={unlockedAchievements.length}
          icon={Award}
          suffix={` / ${achievements.length}`}
          iconColor="text-success"
          index={2}
        />
        <StatCard
          title="Skills Mastered"
          value={8}
          icon={Target}
          trend={{ value: 20, isPositive: true }}
          iconColor="text-accent"
          index={3}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>This Week's Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {weeklyActivity.map((day, index) => (
                  <div key={day.date} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{day.date}</span>
                      <span className="font-mono text-muted-foreground">
                        {day.hours}h
                      </span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.hours / 5) * 100}%` }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                        className="absolute inset-y-0 left-0 bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total this week</span>
                    <span className="text-2xl font-bold font-mono">
                      <AnimatedCounter
                        value={weeklyActivity.reduce((sum, day) => sum + day.hours, 0)}
                        suffix="h"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Learning Streak</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-warning to-destructive"
                >
                  <Flame className="h-16 w-16 text-white" />
                </motion.div>
                <div>
                  <div className="text-5xl font-bold font-mono mb-2">7</div>
                  <div className="text-muted-foreground">Day Streak</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Longest Streak
                    </span>
                    <span className="font-semibold">14 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-semibold">18 days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Learning Activity Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-2">
              {monthlyHeatmap.map((day) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + day.day * 0.01 }}
                  className={`aspect-square rounded ${getHeatmapColor(
                    day.hours
                  )} hover-elevate cursor-pointer relative group`}
                  title={`${day.hours} hours`}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs font-medium">
                    {day.hours}h
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="w-3 h-3 rounded bg-muted" />
              <div className="w-3 h-3 rounded bg-success/30" />
              <div className="w-3 h-3 rounded bg-success/50" />
              <div className="w-3 h-3 rounded bg-success/70" />
              <div className="w-3 h-3 rounded bg-success" />
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-heading font-bold mb-4">
            Unlocked Achievements ({unlockedAchievements.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {unlockedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.6 + index * 0.05,
                  type: "spring",
                  bounce: 0.4,
                }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <Card className="hover-elevate text-center overflow-visible">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex justify-center text-primary">
                      {getAchievementIcon(achievement.icon, achievement.isUnlocked)}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {new Date(achievement.unlockedAt!).toLocaleDateString()}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-heading font-bold mb-4">
            Locked Achievements ({lockedAchievements.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lockedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
              >
                <Card className="opacity-60 text-center">
                  <CardContent className="p-6 space-y-3">
                    <div className="relative flex justify-center text-muted-foreground">
                      <div className="opacity-30">
                        {getAchievementIcon(achievement.icon, achievement.isUnlocked)}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>
                          {achievement.progress} / {achievement.requirement}
                        </span>
                        <span>
                          {Math.round(
                            (achievement.progress / achievement.requirement) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (achievement.progress / achievement.requirement) * 100
                            }%`,
                          }}
                          transition={{ delay: 0.9 + index * 0.05, duration: 0.5 }}
                          className="h-full bg-muted-foreground rounded-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
