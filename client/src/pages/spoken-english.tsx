import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Languages, 
  Clock, 
  Users, 
  Award, 
  Play, 
  CheckCircle2, 
  Mic,
  Square,
  RotateCcw,
  Volume2,
  BookOpen,
  Dumbbell,
  Trophy,
  Target,
  Headphones,
  Star,
  Brain,
  Eye,
  EyeOff,
  Timer,
  Zap,
  MessageSquare,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ===== TYPES =====
interface Course {
  id: number;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  topics: string[];
  lessons: number;
  progress: number;
  enrolled: boolean;
}

interface Exercise {
  id: number;
  title: string;
  type: "pronunciation" | "conversation" | "vocabulary" | "listening" | "memory" | "reading" | "shadowing" | "storytelling" | "fluency";
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  fullText?: string;
  sampleAnswer?: string;
  completed: boolean;
  score?: number;
  memoryTime?: number;
}

// ===== MOCK DATA =====
const courses: Course[] = [
  {
    id: 1,
    title: "Business Communication",
    description: "Master professional English for workplace success",
    level: "Intermediate",
    duration: "6 weeks",
    topics: ["Presentations", "Meetings", "Emails", "Negotiations"],
    lessons: 24,
    progress: 0,
    enrolled: false,
  },
  {
    id: 2,
    title: "Everyday Conversations",
    description: "Build confidence in daily English conversations",
    level: "Beginner",
    duration: "4 weeks",
    topics: ["Greetings", "Shopping", "Dining", "Small Talk"],
    lessons: 18,
    progress: 0,
    enrolled: false,
  },
  {
    id: 3,
    title: "Job Interview Mastery",
    description: "Ace interviews with perfect English responses",
    level: "Intermediate",
    duration: "3 weeks",
    topics: ["Self Intro", "Behavioral", "Technical", "Questions"],
    lessons: 20,
    progress: 0,
    enrolled: false,
  },
  {
    id: 4,
    title: "Pronunciation & Accent",
    description: "Improve clarity and reduce accent naturally",
    level: "Advanced",
    duration: "10 weeks",
    topics: ["Vowels", "Consonants", "Stress", "Intonation"],
    lessons: 35,
    progress: 0,
    enrolled: false,
  },
];

const exercises: Exercise[] = [
  {
    id: 1,
    title: "Introduce Yourself Professionally",
    type: "conversation",
    difficulty: "Easy",
    prompt: "Introduce yourself in a job interview. Include your name, background, and why you're interested in the position.",
    sampleAnswer: "Hello, my name is John. I have 5 years of experience in software development and I'm passionate about creating user-friendly applications.",
    completed: false,
  },
  {
    id: 2,
    title: "Practice 'TH' Sound",
    type: "pronunciation",
    difficulty: "Medium",
    prompt: "Read this sentence clearly: 'The thoughtful author gathered thirty-three things together.'",
    sampleAnswer: "The thoughtful author gathered thirty-three things together.",
    completed: false,
  },
  {
    id: 3,
    title: "Long Text Reading: Climate Change",
    type: "reading",
    difficulty: "Medium",
    prompt: "Read this passage clearly with proper intonation and pacing.",
    fullText: "Climate change represents one of the most pressing challenges of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become increasingly unpredictable. Scientists worldwide agree that human activities, particularly the burning of fossil fuels, are the primary drivers of this phenomenon. The consequences extend far beyond environmental concerns, affecting food security, water resources, and human health. However, there is still hope. By transitioning to renewable energy sources, implementing sustainable practices, and fostering international cooperation, we can mitigate the worst effects of climate change and create a more sustainable future for generations to come.",
    completed: false,
  },
  {
    id: 4,
    title: "Memory Challenge: Famous Quote",
    type: "memory",
    difficulty: "Medium",
    prompt: "Read this quote, memorize it, then recite it from memory after 30 seconds.",
    fullText: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
    memoryTime: 30,
    completed: false,
  },
  {
    id: 5,
    title: "Ordering at a Restaurant",
    type: "conversation",
    difficulty: "Easy",
    prompt: "You're at a restaurant. Order a meal, ask about ingredients, and request the check.",
    sampleAnswer: "I'd like to order the grilled salmon, please. Does it contain any dairy? And could I have the check when you get a chance?",
    completed: false,
  },
  {
    id: 6,
    title: "Word Stress Practice",
    type: "pronunciation",
    difficulty: "Hard",
    prompt: "Practice these words with correct stress: PHOtograph, phoTOgraphy, photoGRAphic",
    sampleAnswer: "PHOtograph, phoTOgraphy, photoGRAphic",
    completed: false,
  },
  {
    id: 7,
    title: "Handling Customer Complaints",
    type: "conversation",
    difficulty: "Medium",
    prompt: "A customer is upset about a delayed shipment. Address their concerns professionally and offer a solution.",
    sampleAnswer: "I sincerely apologize for the delay. I understand your frustration. Let me check the status and see how we can resolve this quickly.",
    completed: false,
  },
  {
    id: 8,
    title: "Long Passage: Technology Impact",
    type: "reading",
    difficulty: "Hard",
    prompt: "Read this technology article with clarity and expression.",
    fullText: "Artificial intelligence is transforming every aspect of modern life. From healthcare diagnostics to autonomous vehicles, AI systems are becoming increasingly sophisticated and integrated into our daily routines. Machine learning algorithms can now analyze vast amounts of data, identify patterns, and make predictions with remarkable accuracy. In healthcare, AI assists doctors in diagnosing diseases, analyzing medical images, and developing personalized treatment plans. In transportation, self-driving cars promise to reduce accidents and improve traffic flow. However, these advancements also raise important ethical questions about privacy, job displacement, and the role of human judgment in critical decisions. As we continue to develop and deploy AI systems, it's crucial that we establish robust ethical frameworks and regulatory guidelines to ensure these technologies benefit humanity as a whole.",
    completed: false,
  },
  {
    id: 9,
    title: "Memory Recall: Story",
    type: "memory",
    difficulty: "Hard",
    prompt: "Read this short story, then retell it in your own words after the text disappears.",
    fullText: "Sarah had always dreamed of opening her own bakery. After years of working in corporate finance, she finally saved enough money to pursue her passion. She found a small shop in the neighborhood where she grew up and spent months renovating it. On opening day, her childhood friends and family filled the bakery. The smell of fresh bread and pastries attracted curious neighbors. Within weeks, her croissants became legendary in the community.",
    memoryTime: 45,
    completed: false,
  },
  {
    id: 10,
    title: "Fluency Challenge: Your Dream Job",
    type: "fluency",
    difficulty: "Medium",
    prompt: "Speak continuously for 60 seconds about your dream job without stopping. Don't worry about perfection, focus on maintaining flow.",
    sampleAnswer: "My dream job would be working as a product designer at a tech company where I can create innovative solutions that help people...",
    completed: false,
  },
  {
    id: 11,
    title: "Tongue Twister Challenge",
    type: "pronunciation",
    difficulty: "Hard",
    prompt: "Say this tongue twister 3 times quickly: 'She sells seashells by the seashore. The shells she sells are seashells, I'm sure.'",
    sampleAnswer: "She sells seashells by the seashore. The shells she sells are seashells, I'm sure.",
    completed: false,
  },
  {
    id: 12,
    title: "Vowel Sounds: Long vs Short",
    type: "pronunciation",
    difficulty: "Medium",
    prompt: "Practice these pairs: ship/sheep, fit/feet, live/leave, full/fool",
    sampleAnswer: "ship, sheep, fit, feet, live, leave, full, fool",
    completed: false,
  },
  {
    id: 13,
    title: "Storytelling: A Memorable Experience",
    type: "storytelling",
    difficulty: "Medium",
    prompt: "Tell a story about a memorable experience from your life. Include details about what happened, how you felt, and what you learned.",
    sampleAnswer: "I remember the day I gave my first presentation at work. I was incredibly nervous, but as I started speaking, I gained confidence...",
    completed: false,
  },
  {
    id: 14,
    title: "Long Article: Space Exploration",
    type: "reading",
    difficulty: "Hard",
    prompt: "Read this comprehensive article about space exploration.",
    fullText: "Humanity's quest to explore space has led to some of the most remarkable achievements in history. From the first satellite launch in 1957 to landing humans on the Moon in 1969, each milestone has expanded our understanding of the universe. Today, space agencies around the world are collaborating on ambitious projects. The International Space Station serves as a laboratory for scientific research in microgravity. Private companies are developing reusable rockets to reduce the cost of space travel. Plans for establishing permanent bases on the Moon and sending humans to Mars are no longer science fiction but genuine engineering challenges being actively addressed. Telescope missions like the James Webb Space Telescope are revealing distant galaxies and exoplanets, some of which might harbor life. As we look to the future, space exploration promises not only scientific discoveries but also technological innovations that benefit life on Earth. From satellite communications to GPS navigation, space technology has become integral to modern civilization.",
    completed: false,
  },
  {
    id: 15,
    title: "Memory Test: Important Numbers",
    type: "memory",
    difficulty: "Easy",
    prompt: "Memorize this phone number and address, then recite them.",
    fullText: "Phone: (555) 123-4567\nAddress: 742 Evergreen Terrace, Springfield, 12345",
    memoryTime: 20,
    completed: false,
  },
  {
    id: 16,
    title: "Debate: Work From Home",
    type: "conversation",
    difficulty: "Hard",
    prompt: "Present arguments for or against remote work. Support your position with clear reasoning and examples.",
    sampleAnswer: "Remote work offers numerous benefits including flexibility, reduced commute time, and improved work-life balance. However, it can also lead to isolation and communication challenges...",
    completed: false,
  },
  {
    id: 17,
    title: "Shadowing Exercise: TED Talk Style",
    type: "shadowing",
    difficulty: "Hard",
    prompt: "Listen to and repeat this inspirational message with the same energy and intonation.",
    fullText: "The future belongs to those who believe in the beauty of their dreams. Success is not final, failure is not fatal. It is the courage to continue that counts. Every expert was once a beginner. Every master started as a disaster. The only impossible journey is the one you never begin.",
    completed: false,
  },
  {
    id: 18,
    title: "Fluency: Describe Your City",
    type: "fluency",
    difficulty: "Easy",
    prompt: "Describe your city or hometown for 45 seconds. Talk about its culture, landmarks, food, and what makes it special.",
    completed: false,
  },
];

// ===== MAIN COMPONENT =====
export default function SpokenEnglish() {
  const [coursesData, setCoursesData] = useState<Course[]>(courses);
  const [exercisesData, setExercisesData] = useState<Exercise[]>(exercises);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSample, setShowSample] = useState(false);
  const [showText, setShowText] = useState(true);
  const [memoryCountdown, setMemoryCountdown] = useState<number | null>(null);
  const [memoryPhase, setMemoryPhase] = useState<'reading' | 'memorizing' | 'reciting'>('reading');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const memoryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const practiceAreaRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // ===== HANDLERS =====
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "Advanced":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "Hard":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pronunciation":
        return <Volume2 className="h-4 w-4" />;
      case "conversation":
        return <Users className="h-4 w-4" />;
      case "vocabulary":
        return <BookOpen className="h-4 w-4" />;
      case "listening":
        return <Headphones className="h-4 w-4" />;
      case "memory":
        return <Brain className="h-4 w-4" />;
      case "reading":
        return <FileText className="h-4 w-4" />;
      case "shadowing":
        return <MessageSquare className="h-4 w-4" />;
      case "storytelling":
        return <Star className="h-4 w-4" />;
      case "fluency":
        return <Zap className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const handleEnroll = (courseId: number) => {
    setCoursesData(coursesData.map(course => 
      course.id === courseId ? { ...course, enrolled: true } : course
    ));
    toast({
      title: "Enrolled Successfully!",
      description: "You've been enrolled in the course. Start learning now!",
    });
  };

  const handleStartPractice = (courseId: number) => {
    const course = coursesData.find(c => c.id === courseId);
    toast({
      title: "Starting Practice",
      description: `Opening ${course?.title} practice session...`,
    });
  };

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setRecordedAudio(null);
    setShowSample(false);
    setRecordingTime(0);
    setShowText(true);
    setMemoryCountdown(null);
    setMemoryPhase('reading');
    if (memoryTimerRef.current) {
      clearInterval(memoryTimerRef.current);
      memoryTimerRef.current = null;
    }
    
    // Scroll to practice area on mobile/tablet
    setTimeout(() => {
      if (practiceAreaRef.current) {
        practiceAreaRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const startMemoryChallenge = () => {
    if (!selectedExercise || selectedExercise.type !== 'memory' || !selectedExercise.memoryTime) return;
    
    setMemoryPhase('memorizing');
    setMemoryCountdown(selectedExercise.memoryTime);
    
    memoryTimerRef.current = setInterval(() => {
      setMemoryCountdown(prev => {
        if (prev === null || prev <= 1) {
          if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
          setShowText(false);
          setMemoryPhase('reciting');
          toast({
            title: "Time's Up!",
            description: "Now try to recite what you remember",
          });
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        stream.getTracks().forEach(track => track.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record your voice",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    setRecordingTime(0);
    setShowSample(false);
  };

  const markAsCompleted = () => {
    if (selectedExercise) {
      setExercisesData(exercisesData.map(ex =>
        ex.id === selectedExercise.id ? { ...ex, completed: true, score: 85 } : ex
      ));
      toast({
        title: "Exercise Completed!",
        description: "Great job! Keep practicing to improve further.",
      });
      setSelectedExercise(null);
      setRecordedAudio(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Languages className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-heading font-bold">Spoken English Practice</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Master English communication with interactive courses, exercises, and voice recording
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2" data-testid="tabs-list">
            <TabsTrigger value="courses" data-testid="tab-courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="exercises" data-testid="tab-exercises">
              <Dumbbell className="h-4 w-4 mr-2" />
              Exercises
            </TabsTrigger>
          </TabsList>

          {/* COURSES TAB */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesData.map((course) => (
                <Card key={course.id} className="flex flex-col hover-elevate" data-testid={`course-card-${course.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl" data-testid={`course-title-${course.id}`}>{course.title}</CardTitle>
                      <Badge className={getLevelColor(course.level)} variant="secondary" data-testid={`badge-level-${course.id}`}>
                        {course.level}
                      </Badge>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span data-testid={`course-duration-${course.id}`}>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span data-testid={`course-lessons-${course.id}`}>{course.lessons} lessons</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {course.topics.map((topic, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs"
                            data-testid={`badge-topic-${course.id}-${idx}`}
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {course.enrolled && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium" data-testid={`course-progress-${course.id}`}>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" data-testid={`progress-bar-${course.id}`} />
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    {!course.enrolled ? (
                      <Button
                        onClick={() => handleEnroll(course.id)}
                        className="w-full gap-2"
                        data-testid={`button-enroll-${course.id}`}
                      >
                        <Award className="h-4 w-4" />
                        Enroll Now
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStartPractice(course.id)}
                        className="w-full gap-2"
                        data-testid={`button-practice-${course.id}`}
                      >
                        <Play className="h-4 w-4" />
                        Continue Learning
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* EXERCISES TAB */}
          <TabsContent value="exercises" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Exercise List */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Daily Exercises
                </h2>
                <div className="space-y-3">
                  {exercisesData.map((exercise) => (
                    <Card
                      key={exercise.id}
                      className={`cursor-pointer hover-elevate ${selectedExercise?.id === exercise.id ? 'border-primary' : ''}`}
                      onClick={() => handleSelectExercise(exercise)}
                      data-testid={`exercise-card-${exercise.id}`}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-base mb-1 flex items-center gap-2">
                              {getTypeIcon(exercise.type)}
                              {exercise.title}
                            </CardTitle>
                            <div className="flex gap-2 flex-wrap">
                              <Badge 
                                variant="outline" 
                                className={getDifficultyColor(exercise.difficulty) + " text-xs"}
                                data-testid={`badge-difficulty-${exercise.id}`}
                              >
                                {exercise.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {exercise.type}
                              </Badge>
                            </div>
                          </div>
                          {exercise.completed && (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" data-testid={`icon-completed-${exercise.id}`} />
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Exercise Practice Area */}
              <div className="lg:col-span-2" ref={practiceAreaRef}>
                {selectedExercise ? (
                  <Card className="h-full" data-testid="exercise-practice-area">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                            {getTypeIcon(selectedExercise.type)}
                            {selectedExercise.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {selectedExercise.prompt}
                          </CardDescription>
                        </div>
                        <Badge className={getDifficultyColor(selectedExercise.difficulty)} variant="secondary">
                          {selectedExercise.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Full Text Display for Reading/Memory/Shadowing Exercises */}
                      {selectedExercise.fullText && (selectedExercise.type === 'reading' || selectedExercise.type === 'shadowing' || (selectedExercise.type === 'memory' && showText)) && (
                        <Alert className="bg-primary/5 border-primary/20" data-testid="alert-full-text">
                          <FileText className="h-4 w-4" />
                          <AlertDescription>
                            <p className="font-medium mb-2">
                              {selectedExercise.type === 'reading' && 'Read this passage:'}
                              {selectedExercise.type === 'memory' && 'Memorize this text:'}
                              {selectedExercise.type === 'shadowing' && 'Read and repeat:'}
                            </p>
                            <p className="text-base leading-relaxed whitespace-pre-wrap">{selectedExercise.fullText}</p>
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Memory Exercise Controls */}
                      {selectedExercise.type === 'memory' && (
                        <div className="space-y-4">
                          {memoryPhase === 'reading' && (
                            <Button
                              onClick={startMemoryChallenge}
                              className="w-full gap-2"
                              size="lg"
                              data-testid="button-start-memory"
                            >
                              <Brain className="h-5 w-5" />
                              Start Memory Challenge
                            </Button>
                          )}

                          {memoryPhase === 'memorizing' && memoryCountdown !== null && (
                            <Alert className="bg-yellow-500/10 border-yellow-500/50" data-testid="alert-memorizing">
                              <Timer className="h-4 w-4 text-yellow-500" />
                              <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                                <div className="flex items-center justify-between">
                                  <span>Memorizing... Text will disappear in:</span>
                                  <span className="text-2xl font-bold">{memoryCountdown}s</span>
                                </div>
                              </AlertDescription>
                            </Alert>
                          )}

                          {memoryPhase === 'reciting' && !showText && (
                            <Alert className="bg-blue-500/10 border-blue-500/50" data-testid="alert-reciting">
                              <EyeOff className="h-4 w-4 text-blue-500" />
                              <AlertDescription className="text-blue-700 dark:text-blue-400">
                                Text is now hidden. Try to recite what you remember by recording yourself!
                              </AlertDescription>
                            </Alert>
                          )}

                          {memoryPhase === 'reciting' && (
                            <Button
                              variant="outline"
                              onClick={() => setShowText(true)}
                              className="w-full gap-2"
                              data-testid="button-show-text"
                            >
                              <Eye className="h-4 w-4" />
                              Show Text Again
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Recording Controls */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-4">
                          {!isRecording && !recordedAudio && (
                            <Button
                              size="lg"
                              onClick={startRecording}
                              className="gap-2"
                              data-testid="button-start-recording"
                            >
                              <Mic className="h-5 w-5" />
                              Start Recording
                            </Button>
                          )}
                          
                          {isRecording && (
                            <Button
                              size="lg"
                              variant="destructive"
                              onClick={stopRecording}
                              className="gap-2 animate-pulse"
                              data-testid="button-stop-recording"
                            >
                              <Square className="h-5 w-5" />
                              Stop Recording ({formatTime(recordingTime)})
                            </Button>
                          )}

                          {recordedAudio && (
                            <div className="flex gap-2 flex-wrap justify-center">
                              <Button
                                variant="outline"
                                onClick={resetRecording}
                                className="gap-2"
                                data-testid="button-reset-recording"
                              >
                                <RotateCcw className="h-4 w-4" />
                                Re-record
                              </Button>
                              <Button
                                onClick={markAsCompleted}
                                className="gap-2"
                                data-testid="button-complete-exercise"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Mark Complete
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Recording Time Display */}
                        {isRecording && (
                          <Alert className="bg-red-500/10 border-red-500/50" data-testid="alert-recording">
                            <Mic className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-700 dark:text-red-400">
                              Recording in progress... Speak clearly into your microphone
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Audio Playback */}
                        {recordedAudio && (
                          <div className="space-y-4">
                            <Alert className="bg-green-500/10 border-green-500/50" data-testid="alert-recorded">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <AlertDescription className="text-green-700 dark:text-green-400">
                                Recording saved! Listen to your recording below
                              </AlertDescription>
                            </Alert>
                            <audio 
                              controls 
                              src={recordedAudio} 
                              className="w-full"
                              data-testid="audio-playback"
                            />
                          </div>
                        )}
                      </div>

                      {/* Sample Answer */}
                      {selectedExercise.sampleAnswer && (
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowSample(!showSample)}
                            className="w-full gap-2"
                            data-testid="button-show-sample"
                          >
                            <Star className="h-4 w-4" />
                            {showSample ? 'Hide' : 'Show'} Sample Answer
                          </Button>
                          {showSample && (
                            <Alert data-testid="alert-sample">
                              <Volume2 className="h-4 w-4" />
                              <AlertDescription>
                                <p className="font-medium mb-1">Sample Answer:</p>
                                <p className="italic">{selectedExercise.sampleAnswer}</p>
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}

                      {/* Completion Badge */}
                      {selectedExercise.completed && (
                        <Alert className="bg-primary/10 border-primary/50" data-testid="alert-completed">
                          <Trophy className="h-4 w-4 text-primary" />
                          <AlertDescription className="text-primary">
                            Exercise completed! Score: {selectedExercise.score}/100
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center min-h-[400px]">
                    <CardContent className="text-center">
                      <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-heading font-semibold mb-2">Select an Exercise</h3>
                      <p className="text-muted-foreground">
                        Choose an exercise from the list to start practicing
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
