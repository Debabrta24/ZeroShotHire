// ==================== INTERVIEW SIMULATOR PAGE ====================
// Practice technical and behavioral interviews with AI feedback
// Users can simulate real interview scenarios and get instant feedback

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Video,
  Play,
  SkipForward,
  CheckCircle,
  Trophy,
  Clock,
  MessageSquare,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { MockInterview, InterviewSimQuestion } from "@shared/schema";

// Interview type options
const INTERVIEW_TYPES = [
  {
    type: "Technical" as const,
    description: "Coding and technical problem-solving questions",
    color: "bg-blue-500",
  },
  {
    type: "Behavioral" as const,
    description: "Assess soft skills and past experiences",
    color: "bg-green-500",
  },
  {
    type: "Case Study" as const,
    description: "Business case analysis and strategy",
    color: "bg-purple-500",
  },
  {
    type: "System Design" as const,
    description: "Design scalable systems and architecture",
    color: "bg-orange-500",
  },
];

// Difficulty levels
const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"] as const;

export default function InterviewSimulator() {
  // ===== STATE =====
  const [selectedType, setSelectedType] = useState<string | null>(null);     // Interview type selected
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");  // Difficulty level
  const [interviewStarted, setInterviewStarted] = useState(false);           // Whether interview is active
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);       // Current question number
  const [userAnswer, setUserAnswer] = useState("");                          // User's current answer
  const [questions, setQuestions] = useState<InterviewSimQuestion[]>([]);    // All interview questions
  const [showResults, setShowResults] = useState(false);                     // Show final results
  const [startTime, setStartTime] = useState(0);                             // Interview start time
  const { toast } = useToast();

  // ===== HANDLERS =====
  // Start interview with selected parameters
  const handleStartInterview = () => {
    if (!selectedType || !selectedDifficulty) {
      toast({
        title: "Selection Required",
        description: "Please select interview type and difficulty",
        variant: "destructive",
      });
      return;
    }

    const interviewQuestions = generateInterviewQuestions(
      selectedType,
      selectedDifficulty as any
    );
    setQuestions(interviewQuestions);   // Set generated questions
    setInterviewStarted(true);          // Start the interview
    setCurrentQuestionIndex(0);         // Start at first question
    setUserAnswer("");                  // Clear answer field
    setShowResults(false);              // Hide results
    setStartTime(Date.now());           // Record start time
  };

  // Submit current answer and move to next question
  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please provide an answer before continuing",
        variant: "destructive",
      });
      return;
    }

    // Update the question with user's answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      userAnswer: userAnswer.trim(),
    };
    setQuestions(updatedQuestions);

    // Check if this was the last question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);  // Move to next question
      setUserAnswer("");                                  // Clear answer field
    } else {
      setShowResults(true);  // Show results if completed
    }
  };

  // Skip current question without answering
  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
    } else {
      setShowResults(true);
    }
  };

  // Restart the interview
  const handleRetry = () => {
    handleStartInterview();  // Restart with same settings
  };

  // Go back to selection screen
  const handleBackToSelection = () => {
    setInterviewStarted(false);
    setSelectedType(null);
    setSelectedDifficulty("");
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setShowResults(false);
  };

  // ===== COMPUTED VALUES =====
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Calculate interview results
  const calculateResults = () => {
    const answeredQuestions = questions.filter((q) => q.userAnswer);
    const avgScore = answeredQuestions.length > 0
      ? answeredQuestions.reduce((sum, q) => sum + q.score, 0) / answeredQuestions.length
      : 0;
    const duration = Math.floor((Date.now() - startTime) / 1000);

    return {
      answeredCount: answeredQuestions.length,
      totalCount: questions.length,
      avgScore: Math.round(avgScore),
      duration,
    };
  };

  // ===== RENDER =====
  // Show results screen
  if (showResults) {
    const results = calculateResults();

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`p-6 rounded-full ${
                  results.avgScore >= 80 ? 'bg-green-500/20' :
                  results.avgScore >= 60 ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                }`}>
                  <Trophy className={`h-16 w-16 ${
                    results.avgScore >= 80 ? 'text-green-500' :
                    results.avgScore >= 60 ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                </div>
              </div>
              <CardTitle className="text-3xl">Interview Complete!</CardTitle>
              <CardDescription className="text-lg">
                You answered {results.answeredCount} of {results.totalCount} questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center p-6 border rounded-lg">
                  <Trophy className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <div className="text-4xl font-bold mb-1">{results.avgScore}%</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <Clock className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <div className="text-4xl font-bold mb-1">
                    {Math.floor(results.duration / 60)}:{(results.duration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={handleRetry} className="gap-2" data-testid="button-retry">
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleBackToSelection}>
                  Back to Selection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed feedback for each question */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-6 pr-4">
                  {questions.map((q, index) => (
                    <div key={q.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-2">Question {index + 1}</Badge>
                          <p className="font-medium">{q.question}</p>
                        </div>
                        <Badge variant={q.userAnswer ? "default" : "secondary"}>
                          {q.userAnswer ? "Answered" : "Skipped"}
                        </Badge>
                      </div>

                      {q.userAnswer && (
                        <>
                          <div className="bg-muted p-3 rounded-lg mb-3">
                            <p className="text-sm font-medium mb-1">Your Answer:</p>
                            <p className="text-sm">{q.userAnswer}</p>
                          </div>

                          <div className="bg-primary/10 p-3 rounded-lg mb-3">
                            <p className="text-sm font-medium mb-1">Model Answer:</p>
                            <p className="text-sm">{q.expectedAnswer}</p>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">Score:</span>
                            <Badge>{q.score}%</Badge>
                          </div>

                          <div className="bg-blue-500/10 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Feedback:
                            </p>
                            <p className="text-sm">{q.feedback}</p>
                          </div>
                        </>
                      )}

                      {!q.userAnswer && (
                        <div className="bg-secondary/50 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">This question was skipped</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show interview in progress
  if (interviewStarted) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header with progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold">
                {selectedType} Interview
              </h1>
              <p className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length} • {selectedDifficulty}
              </p>
            </div>
            <Button variant="outline" onClick={handleBackToSelection}>
              Exit Interview
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Current question */}
        {currentQuestion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">{currentQuestion.category}</Badge>
                  <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Answer</label>
                      <Textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer here... Be detailed and specific."
                        className="min-h-[200px]"
                        data-testid="textarea-answer"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Tip: Use the STAR method (Situation, Task, Action, Result) for behavioral questions
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1 gap-2"
                        onClick={handleSubmitAnswer}
                        data-testid="button-submit-answer"
                      >
                        {currentQuestionIndex < questions.length - 1 ? (
                          <>Submit & Next <ArrowRight className="h-4 w-4" /></>
                        ) : (
                          <>Submit & Finish <CheckCircle className="h-4 w-4" /></>
                        )}
                      </Button>
                      <Button variant="outline" onClick={handleSkipQuestion} data-testid="button-skip">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }

  // Show selection screen
  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-heading font-bold flex items-center gap-3">
          <Video className="h-8 w-8 text-primary" />
          Interview Simulator
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Practice interviews and get AI-powered feedback to improve your skills
        </p>
      </motion.div>

      <div className="max-w-4xl">
        {/* Interview type selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Interview Type</CardTitle>
            <CardDescription>Choose the type of interview you want to practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {INTERVIEW_TYPES.map((type) => (
                <div
                  key={type.type}
                  onClick={() => setSelectedType(type.type)}
                  className={`p-4 border-2 rounded-lg cursor-pointer hover-elevate ${
                    selectedType === type.type ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  data-testid={`type-${type.type.toLowerCase()}`}
                >
                  <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center mb-3`}>
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{type.type}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Difficulty selection */}
        {selectedType && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Difficulty</CardTitle>
                <CardDescription>Choose your experience level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <Button
                      key={level}
                      variant={selectedDifficulty === level ? "default" : "outline"}
                      onClick={() => setSelectedDifficulty(level)}
                      className="h-auto py-4"
                      data-testid={`difficulty-${level.toLowerCase()}`}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleStartInterview}
              disabled={!selectedDifficulty}
              data-testid="button-start-interview"
            >
              <Play className="h-5 w-5" />
              Start Interview
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====
// Generate interview questions based on type and difficulty
function generateInterviewQuestions(
  type: string,
  difficulty: "Easy" | "Medium" | "Hard"
): InterviewSimQuestion[] {
  const baseQuestions: Record<string, InterviewSimQuestion[]> = {
    Technical: [
      {
        id: "tech-1",
        category: "Algorithms",
        question: "Explain how you would implement a function to reverse a linked list",
        expectedAnswer: "To reverse a linked list, iterate through the list and change the next pointer of each node to point to its previous node. Keep track of the previous node, current node, and next node during iteration.",
        userAnswer: "",
        score: 0,
        feedback: "",
      },
      {
        id: "tech-2",
        category: "System Design",
        question: "How would you design a URL shortening service like bit.ly?",
        expectedAnswer: "Use a hash function to generate short codes, store mappings in a distributed database with replication, implement caching for popular URLs, use load balancing for scalability, and consider analytics tracking.",
        userAnswer: "",
        score: 0,
        feedback: "",
      },
    ],
    Behavioral: [
      {
        id: "beh-1",
        category: "Teamwork",
        question: "Tell me about a time when you had to work with a difficult team member",
        expectedAnswer: "Use STAR method: Describe the situation, the specific task/challenge, actions you took to improve communication and collaboration, and the positive result achieved.",
        userAnswer: "",
        score: 0,
        feedback: "",
      },
      {
        id: "beh-2",
        category: "Leadership",
        question: "Describe a situation where you had to lead a project under tight deadlines",
        expectedAnswer: "Explain how you prioritized tasks, delegated responsibilities, maintained team morale, communicated with stakeholders, and successfully delivered the project on time.",
        userAnswer: "",
        score: 0,
        feedback: "",
      },
    ],
  };

  const questions = baseQuestions[type] || baseQuestions.Technical;
  
  // Simulate scoring and feedback (would be AI-generated in production)
  return questions.map(q => ({
    ...q,
    score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
    feedback: "Good answer! Consider adding more specific examples and quantifiable results.",
  }));
}
