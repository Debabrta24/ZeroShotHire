import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { TimelineNode } from "@/components/timeline-node";
import {
  BookOpen,
  Clock,
  Award,
  Star,
  Play,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { Course, LearningPhase } from "@shared/schema";

export default function LearningPath() {
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(
    new Set(["c1", "c2", "c5"])
  );

  const toggleCourseCompletion = (courseId: string) => {
    const newCompleted = new Set(completedCourses);
    if (newCompleted.has(courseId)) {
      newCompleted.delete(courseId);
    } else {
      newCompleted.add(courseId);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    setCompletedCourses(newCompleted);
  };

  const phases: LearningPhase[] = [
    {
      id: "1",
      title: "Foundation",
      description: "Build your fundamental skills",
      order: 1,
      estimatedDuration: 3,
      isCompleted: true,
      isCurrent: false,
      courses: [
        {
          id: "c1",
          title: "JavaScript Fundamentals",
          description: "Master the core concepts of JavaScript programming",
          thumbnail: "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=400&h=225&fit=crop",
          difficulty: "Beginner",
          duration: 40,
          durationUnit: "hours",
          provider: "Codecademy",
          rating: 4.8,
          skillsTaught: ["JavaScript", "ES6", "DOM Manipulation"],
          progress: 100,
          isCompleted: true,
          isEnrolled: true,
        },
        {
          id: "c2",
          title: "HTML & CSS Mastery",
          description: "Build beautiful and responsive web layouts",
          thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=225&fit=crop",
          difficulty: "Beginner",
          duration: 30,
          durationUnit: "hours",
          provider: "freeCodeCamp",
          rating: 4.7,
          skillsTaught: ["HTML5", "CSS3", "Flexbox", "Grid"],
          progress: 100,
          isCompleted: true,
          isEnrolled: true,
        },
      ],
    },
    {
      id: "2",
      title: "Core Skills",
      description: "Develop essential development capabilities",
      order: 2,
      estimatedDuration: 4,
      isCompleted: false,
      isCurrent: true,
      courses: [
        {
          id: "c3",
          title: "React Complete Guide",
          description: "Build modern web applications with React",
          thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
          difficulty: "Intermediate",
          duration: 60,
          durationUnit: "hours",
          provider: "Udemy",
          rating: 4.9,
          skillsTaught: ["React", "Hooks", "Context API", "React Router"],
          progress: 65,
          isCompleted: false,
          isEnrolled: true,
        },
        {
          id: "c4",
          title: "TypeScript for Developers",
          description: "Add type safety to your JavaScript projects",
          thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop",
          difficulty: "Intermediate",
          duration: 25,
          durationUnit: "hours",
          provider: "Pluralsight",
          rating: 4.6,
          skillsTaught: ["TypeScript", "Type Systems", "Generics"],
          progress: 0,
          isCompleted: false,
          isEnrolled: false,
        },
        {
          id: "c5",
          title: "Git & GitHub Essentials",
          description: "Master version control and collaboration",
          thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=225&fit=crop",
          difficulty: "Beginner",
          duration: 15,
          durationUnit: "hours",
          provider: "GitHub Learning Lab",
          rating: 4.8,
          skillsTaught: ["Git", "GitHub", "Version Control"],
          progress: 100,
          isCompleted: true,
          isEnrolled: true,
        },
      ],
    },
    {
      id: "3",
      title: "Advanced Topics",
      description: "Master advanced concepts and patterns",
      order: 3,
      estimatedDuration: 5,
      isCompleted: false,
      isCurrent: false,
      courses: [
        {
          id: "c6",
          title: "Node.js & Express",
          description: "Build scalable backend applications",
          thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=225&fit=crop",
          difficulty: "Intermediate",
          duration: 50,
          durationUnit: "hours",
          provider: "Udemy",
          rating: 4.7,
          skillsTaught: ["Node.js", "Express", "REST APIs", "Authentication"],
          progress: 0,
          isCompleted: false,
          isEnrolled: false,
        },
        {
          id: "c7",
          title: "Database Design & SQL",
          description: "Design efficient databases and write complex queries",
          thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop",
          difficulty: "Intermediate",
          duration: 35,
          durationUnit: "hours",
          provider: "DataCamp",
          rating: 4.5,
          skillsTaught: ["SQL", "Database Design", "PostgreSQL", "Optimization"],
          progress: 0,
          isCompleted: false,
          isEnrolled: false,
        },
      ],
    },
    {
      id: "4",
      title: "Specialization",
      description: "Focus on your chosen specialty",
      order: 4,
      estimatedDuration: 6,
      isCompleted: false,
      isCurrent: false,
      courses: [
        {
          id: "c8",
          title: "System Design & Architecture",
          description: "Design scalable and robust systems",
          thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop",
          difficulty: "Advanced",
          duration: 40,
          durationUnit: "hours",
          provider: "Educative",
          rating: 4.9,
          skillsTaught: ["System Design", "Microservices", "Load Balancing"],
          progress: 0,
          isCompleted: false,
          isEnrolled: false,
        },
      ],
    },
  ];

  const allCourses = phases.flatMap((phase) => phase.courses);
  const totalCourses = allCourses.length;
  const completedCount = allCourses.filter((c) => completedCourses.has(c.id)).length;
  const overallProgress = (completedCount / totalCourses) * 100;

  const difficultyColors = {
    Beginner: "bg-success text-white",
    Intermediate: "bg-warning text-white",
    Advanced: "bg-destructive text-white",
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-heading font-bold">Your Learning Path</h1>
        <p className="text-lg text-muted-foreground">
          Full Stack Developer Roadmap
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-purple/10 border-primary/20">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-bold">
                  Overall Progress
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {completedCount} of {totalCourses} courses completed
                    </span>
                    <span className="font-mono font-semibold">
                      {Math.round(overallProgress)}%
                    </span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div>
                    <div className="text-2xl font-bold font-mono">
                      {completedCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono">
                      {totalCourses - completedCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Remaining
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono">12</div>
                    <div className="text-sm text-muted-foreground">Months</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="hsl(var(--muted))"
                      strokeWidth="16"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="hsl(var(--primary))"
                      strokeWidth="16"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 88}
                      initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 88 * (1 - overallProgress / 100),
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold font-mono">
                      {Math.round(overallProgress)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Learning Phases Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Learning Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-0">
              {phases.map((phase, index) => (
                <TimelineNode
                  key={phase.id}
                  isCompleted={phase.isCompleted}
                  isCurrent={phase.isCurrent}
                  title={phase.title}
                  description={`${phase.description} • ${phase.estimatedDuration} months • ${phase.courses.length} courses`}
                  index={index}
                  isLast={index === phases.length - 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Course Modules */}
      <div className="space-y-8">
        {phases.map((phase, phaseIndex) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + phaseIndex * 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading font-bold">
                {phase.title}
              </h2>
              {phase.isCompleted && (
                <Badge className="bg-success text-white">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
              {phase.isCurrent && (
                <Badge variant="default">In Progress</Badge>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phase.courses.map((course, courseIndex) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + courseIndex * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full hover-elevate overflow-visible">
                    <div className="relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <Badge
                        className={`absolute top-2 right-2 ${
                          difficultyColors[course.difficulty]
                        }`}
                      >
                        {course.difficulty}
                      </Badge>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-heading font-semibold text-lg line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {course.duration} {course.durationUnit}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-mono font-semibold">
                            {course.progress}%
                          </span>
                        </div>
                        <Progress value={course.progress} />
                      </div>

                      <div className="flex items-center gap-3">
                        {completedCourses.has(course.id) ? (
                          <Button
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={() => toggleCourseCompletion(course.id)}
                            data-testid={`button-unmark-${course.id}`}
                          >
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            Completed
                          </Button>
                        ) : course.progress > 0 ? (
                          <>
                            <Button
                              className="flex-1 gap-2"
                              data-testid={`button-continue-${course.id}`}
                            >
                              <Play className="h-4 w-4" />
                              Continue
                            </Button>
                            <Checkbox
                              checked={false}
                              onCheckedChange={() =>
                                toggleCourseCompletion(course.id)
                              }
                              data-testid={`checkbox-complete-${course.id}`}
                            />
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            className="flex-1 gap-2"
                            data-testid={`button-start-${course.id}`}
                          >
                            <BookOpen className="h-4 w-4" />
                            Start Course
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
