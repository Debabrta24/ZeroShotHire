// ==================== SKILL ASSESSMENTS PAGE ====================
// This page provides interactive quizzes to test and evaluate user skills
// Users can take quizzes in different categories and track their scores

// Import React hooks for component logic
import { useState } from "react";
// Import framer-motion for smooth animations
import { motion } from "framer-motion";
// Import UI components from shadcn
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
// Import icons
import {
  GraduationCap,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  ArrowRight,
  RotateCcw,
  Code2,
  Database,
  Brain,
  Briefcase,
} from "lucide-react";
// Import technology logos
import { SiJavascript, SiPython, SiReact } from "react-icons/si";
// Import type definitions
import type { QuizQuestion, QuizAttempt } from "@shared/schema";

// Available quiz categories with icons
const QUIZ_CATEGORIES = [
  { 
    id: "javascript", 
    name: "JavaScript", 
    description: "Test your JavaScript knowledge", 
    color: "bg-yellow-500",
    icon: SiJavascript
  },
  { 
    id: "python", 
    name: "Python", 
    description: "Evaluate your Python skills", 
    color: "bg-blue-500",
    icon: SiPython
  },
  { 
    id: "react", 
    name: "React", 
    description: "Assess your React expertise", 
    color: "bg-cyan-500",
    icon: SiReact
  },
  { 
    id: "data-structures", 
    name: "Data Structures", 
    description: "Test algorithmic thinking", 
    color: "bg-green-500",
    icon: Brain
  },
  { 
    id: "databases", 
    name: "Databases", 
    description: "Test SQL and database knowledge", 
    color: "bg-purple-500",
    icon: Database
  },
  { 
    id: "career-skills", 
    name: "Career Skills", 
    description: "Soft skills assessment", 
    color: "bg-orange-500",
    icon: Briefcase
  },
];

// Main Assessments component
export default function Assessments() {
  // ===== STATE MANAGEMENT =====
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Currently selected quiz category
  const [quizStarted, setQuizStarted] = useState(false);                        // Whether quiz is in progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);          // Index of current question
  const [userAnswers, setUserAnswers] = useState<number[]>([]);                 // User's selected answers
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);    // Currently selected option
  const [showResults, setShowResults] = useState(false);                        // Whether to show final results
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);               // Array of quiz questions
  const [startTime, setStartTime] = useState<number>(0);                        // Quiz start timestamp

  // ===== HANDLERS =====
  // Start a quiz for the selected category
  const handleStartQuiz = (categoryId: string) => {
    setSelectedCategory(categoryId);                     // Set the category
    const quizQuestions = generateQuestions(categoryId); // Generate questions for this category
    setQuestions(quizQuestions);                         // Store questions
    setQuizStarted(true);                                // Mark quiz as started
    setCurrentQuestionIndex(0);                          // Start at first question
    setUserAnswers([]);                                  // Reset answers
    setSelectedAnswer(null);                             // Reset selection
    setShowResults(false);                               // Hide results
    setStartTime(Date.now());                            // Record start time
  };

  // Submit answer and move to next question
  const handleNextQuestion = () => {
    if (selectedAnswer === null) return; // Don't proceed if no answer selected

    // Store the user's answer
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    // Check if this was the last question
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null); // Reset selection for next question
    } else {
      // Quiz completed - show results
      setShowResults(true);
    }
  };

  // Reset quiz to take it again
  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);    // Reset to first question
    setUserAnswers([]);            // Clear all answers
    setSelectedAnswer(null);       // Clear selection
    setShowResults(false);         // Hide results
    setStartTime(Date.now());      // Reset timer
  };

  // Go back to category selection
  const handleBackToCategories = () => {
    setQuizStarted(false);         // Exit quiz mode
    setSelectedCategory(null);     // Deselect category
    setCurrentQuestionIndex(0);    // Reset question index
    setUserAnswers([]);            // Clear answers
    setSelectedAnswer(null);       // Clear selection
    setShowResults(false);         // Hide results
  };

  // ===== COMPUTED VALUES =====
  // Calculate quiz results
  const calculateResults = () => {
    let correctCount = 0;                                        // Count of correct answers
    let totalPoints = 0;                                         // Total possible points
    let earnedPoints = 0;                                        // Points earned

    questions.forEach((question, index) => {
      totalPoints += question.points;                            // Add to total points
      if (userAnswers[index] === question.correctAnswer) {       // Check if answer is correct
        correctCount++;                                          // Increment correct count
        earnedPoints += question.points;                         // Add points earned
      }
    });

    const percentage = (correctCount / questions.length) * 100;  // Calculate percentage
    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // Time in seconds

    return { correctCount, totalPoints, earnedPoints, percentage, timeTaken };
  };

  const currentQuestion = questions[currentQuestionIndex];       // Get current question object
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100; // Progress percentage

  // ===== RENDER =====
  // Show quiz interface if quiz started
  if (quizStarted && !showResults) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Quiz header with progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold">
                {QUIZ_CATEGORIES.find((c) => c.id === selectedCategory)?.name} Assessment
              </h1>
              <p className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            
            {/* Exit button */}
            <Button variant="outline" onClick={handleBackToCategories} data-testid="button-exit-quiz">
              Exit Quiz
            </Button>
          </div>
          
          {/* Progress bar */}
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Question card */}
        {currentQuestion && (
          <motion.div
            key={currentQuestionIndex}                            // Re-animate on question change
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {currentQuestion.question}                // Question text
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      {/* Difficulty badge */}
                      <Badge variant={
                        currentQuestion.difficulty === 'Easy' ? 'default' :
                        currentQuestion.difficulty === 'Medium' ? 'secondary' : 'destructive'
                      }>
                        {currentQuestion.difficulty}
                      </Badge>
                      {/* Points badge */}
                      <Badge variant="outline">
                        {currentQuestion.points} points
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Answer options */}
                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 border rounded-lg p-4 hover-elevate cursor-pointer"
                        onClick={() => setSelectedAnswer(index)}
                        data-testid={`option-${index}`}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {/* Next button */}
                <Button
                  className="w-full mt-6 gap-2"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}              // Disable if no answer selected
                  data-testid="button-next-question"
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>Next Question <ArrowRight className="h-4 w-4" /></>
                  ) : (
                    <>Submit Quiz <CheckCircle2 className="h-4 w-4" /></>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    );
  }

  // Show results screen if quiz completed
  if (showResults) {
    const results = calculateResults();                           // Calculate final results

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Results header */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`p-6 rounded-full ${
                  results.percentage >= 80 ? 'bg-green-500/20' :
                  results.percentage >= 60 ? 'bg-yellow-500/20' : 'bg-red-500/20'
                }`}>
                  <Trophy className={`h-16 w-16 ${
                    results.percentage >= 80 ? 'text-green-500' :
                    results.percentage >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }`} />
                </div>
              </div>
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
              <CardDescription className="text-lg">
                Here are your results for the {QUIZ_CATEGORIES.find((c) => c.id === selectedCategory)?.name} assessment
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Score display */}
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">
                  {Math.round(results.percentage)}%
                </div>
                <p className="text-muted-foreground">
                  {results.correctCount} out of {questions.length} correct
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{results.earnedPoints}</div>
                  <div className="text-sm text-muted-foreground">Points Earned</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{Math.floor(results.timeTaken / 60)}:{(results.timeTaken % 60).toString().padStart(2, '0')}</div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">
                    {results.percentage >= 80 ? 'Excellent' :
                     results.percentage >= 60 ? 'Good' : 'Keep Practicing'}
                  </div>
                  <div className="text-sm text-muted-foreground">Performance</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={handleRetakeQuiz} className="gap-2" data-testid="button-retake">
                  <RotateCcw className="h-4 w-4" />
                  Retake Quiz
                </Button>
                <Button variant="outline" onClick={handleBackToCategories} data-testid="button-back">
                  Back to Categories
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed results */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-lg border ${
                        isCorrect ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">{question.question}</p>
                          <p className="text-sm text-muted-foreground mb-1">
                            Your answer: {question.options[userAnswer]}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                              Correct answer: {question.options[question.correctAnswer]}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground italic">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Default view: Show category selection
  return (
    <div className="p-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-heading font-bold flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          Skill Assessments
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Test your knowledge and track your progress across different skills
        </p>
      </motion.div>

      {/* Category grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUIZ_CATEGORIES.map((category, index) => {
          const IconComponent = category.icon;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}                // Stagger animation
            >
              <Card className="hover-elevate h-full" data-testid={`category-card-${category.id}`}>
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => handleStartQuiz(category.id)}
                    data-testid={`button-start-${category.id}`}
                  >
                    Start Assessment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====
// Generate quiz questions for a given category
function generateQuestions(category: string): QuizQuestion[] {
  // Sample questions for JavaScript category
  if (category === "javascript") {
    return [
      {
        id: "js-1",
        category: "JavaScript",
        difficulty: "Easy",
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["variable x = 5;", "let x = 5;", "dim x = 5;", "int x = 5;"],
        correctAnswer: 1,
        explanation: "'let' is the modern way to declare a variable in JavaScript. 'var' also works but 'let' has block scope.",
        points: 10,
      },
      {
        id: "js-2",
        category: "JavaScript",
        difficulty: "Medium",
        question: "What does the '===' operator do in JavaScript?",
        options: [
          "Assigns a value",
          "Compares values only",
          "Compares values and types",
          "Checks if values are similar"
        ],
        correctAnswer: 2,
        explanation: "The '===' operator checks both value AND type equality, while '==' only checks value.",
        points: 15,
      },
      {
        id: "js-3",
        category: "JavaScript",
        difficulty: "Hard",
        question: "What is a closure in JavaScript?",
        options: [
          "A way to close the browser",
          "A function that has access to variables in its outer scope",
          "A way to end a program",
          "A loop structure"
        ],
        correctAnswer: 1,
        explanation: "A closure is a function that retains access to its outer scope even after the outer function has returned.",
        points: 20,
      },
    ];
  }

  // Default questions for other categories
  return [
    {
      id: `${category}-1`,
      category: category,
      difficulty: "Easy",
      question: `Which of the following is a core concept in ${category}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "This is the correct answer for this sample question.",
      points: 10,
    },
    {
      id: `${category}-2`,
      category: category,
      difficulty: "Medium",
      question: `What is the best practice when working with ${category}?`,
      options: ["Practice A", "Practice B", "Practice C", "Practice D"],
      correctAnswer: 1,
      explanation: "Practice B is considered the industry standard.",
      points: 15,
    },
    {
      id: `${category}-3`,
      category: category,
      difficulty: "Hard",
      question: `Which advanced technique is used in ${category}?`,
      options: ["Technique A", "Technique B", "Technique C", "Technique D"],
      correctAnswer: 2,
      explanation: "Technique C is the most advanced and efficient approach.",
      points: 20,
    },
  ];
}
