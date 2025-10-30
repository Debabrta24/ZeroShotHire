import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "@/components/tag-input";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  interestCategories,
  educationLevels,
  careerGoalOptions,
  workStyleOptions,
  locationOptions,
  salaryRanges,
  careerAnalysisSchema,
  type CareerAnalysisFormData,
} from "@shared/schema";

export default function CareerAnalysis() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<CareerAnalysisFormData>({
    resolver: zodResolver(careerAnalysisSchema),
    defaultValues: {
      skills: [],
      interests: [],
      education: "",
      careerGoals: [],
      workStyle: "",
      location: "",
      salaryExpectation: "",
    },
  });

  const skillSuggestions = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "TypeScript",
    "SQL",
    "Git",
    "Docker",
    "AWS",
    "Machine Learning",
    "Data Analysis",
    "UI/UX Design",
    "Project Management",
    "Communication",
    "Leadership",
  ];

  const steps = [
    { title: "Skills", description: "What are your current skills?" },
    { title: "Interests", description: "What areas interest you?" },
    { title: "Education", description: "What's your education level?" },
    { title: "Goals", description: "What are your career goals?" },
    { title: "Preferences", description: "Your work preferences" },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const isStepValid = () => {
    const values = form.getValues();
    switch (currentStep) {
      case 0:
        return values.skills && values.skills.length > 0;
      case 1:
        return values.interests && values.interests.length > 0;
      case 2:
        return !!values.education;
      case 3:
        return values.careerGoals && values.careerGoals.length > 0;
      case 4:
        return (
          !!values.workStyle &&
          !!values.location &&
          !!values.salaryExpectation
        );
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const isValid = await form.trigger();
      if (isValid) {
        handleSubmit(form.getValues());
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: CareerAnalysisFormData) => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/career-analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user',
          ...data
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze career profile');
      }

      const result = await response.json();
      console.log('AI Analysis Result:', result);
      
      localStorage.setItem('careerAnalysisCompleted', 'true');
      window.dispatchEvent(new Event('careerAnalysisComplete'));
      
      setTimeout(() => {
        setLocation("/recommendations");
      }, 1500);
    } catch (error) {
      console.error('Error analyzing career:', error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
              Career Analysis
            </h1>
          </div>
          <p className="text-base md:text-lg text-muted-foreground">
            Answer a few questions to get personalized career recommendations
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-analysis" />
          <div className="flex justify-between text-sm font-medium">
            {steps.map((step, index) => (
              <span
                key={step.title}
                className={
                  index <= currentStep ? "text-primary" : "text-muted-foreground"
                }
                data-testid={`step-label-${step.title.toLowerCase()}`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Form Card */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Card className="overflow-visible">
              <CardHeader>
                <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                <p className="text-muted-foreground">
                  {steps[currentStep].description}
                </p>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px]"
                  >
                    {/* Step 0: Skills */}
                    {currentStep === 0 && (
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Add your skills (type and press Enter or select from suggestions)
                            </FormLabel>
                            <FormControl>
                              <TagInput
                                tags={field.value || []}
                                onTagsChange={field.onChange}
                                placeholder="e.g., JavaScript, Python, Project Management"
                                suggestions={skillSuggestions}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Step 1: Interests */}
                    {currentStep === 1 && (
                      <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select areas that interest you</FormLabel>
                            <div className="grid md:grid-cols-2 gap-3">
                              {Array.from(interestCategories).map((interest) => (
                                <motion.div
                                  key={interest}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <label
                                    className={`flex items-center gap-3 p-4 rounded-md border-2 cursor-pointer hover-elevate ${
                                      field.value?.includes(interest)
                                        ? "border-primary bg-primary/5"
                                        : "border-border"
                                    }`}
                                    data-testid={`checkbox-interest-${interest.toLowerCase().replace(/\s+/g, "-")}`}
                                  >
                                    <Checkbox
                                      checked={field.value?.includes(interest)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, interest]);
                                        } else {
                                          field.onChange(current.filter((i) => i !== interest));
                                        }
                                      }}
                                    />
                                    <span className="font-medium">{interest}</span>
                                  </label>
                                </motion.div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Step 2: Education */}
                    {currentStep === 2 && (
                      <FormField
                        control={form.control}
                        name="education"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select your highest education level</FormLabel>
                            <FormControl>
                              <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <div className="grid gap-3">
                                  {Array.from(educationLevels).map((level) => (
                                    <motion.div
                                      key={level}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <label
                                        className={`flex items-center gap-3 p-4 rounded-md border-2 cursor-pointer hover-elevate ${
                                          field.value === level
                                            ? "border-primary bg-primary/5"
                                            : "border-border"
                                        }`}
                                        data-testid={`radio-education-${level.toLowerCase().replace(/\s+/g, "-")}`}
                                      >
                                        <RadioGroupItem value={level} />
                                        <span className="font-medium">{level}</span>
                                      </label>
                                    </motion.div>
                                  ))}
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Step 3: Career Goals */}
                    {currentStep === 3 && (
                      <FormField
                        control={form.control}
                        name="careerGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What matters most to you in your career?</FormLabel>
                            <div className="grid md:grid-cols-2 gap-3">
                              {Array.from(careerGoalOptions).map((goal) => (
                                <motion.div
                                  key={goal}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <label
                                    className={`flex items-center gap-3 p-4 rounded-md border-2 cursor-pointer hover-elevate ${
                                      field.value?.includes(goal)
                                        ? "border-primary bg-primary/5"
                                        : "border-border"
                                    }`}
                                    data-testid={`checkbox-goal-${goal.toLowerCase().replace(/\s+/g, "-")}`}
                                  >
                                    <Checkbox
                                      checked={field.value?.includes(goal)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, goal]);
                                        } else {
                                          field.onChange(current.filter((g) => g !== goal));
                                        }
                                      }}
                                    />
                                    <span className="font-medium">{goal}</span>
                                  </label>
                                </motion.div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Step 4: Work Preferences */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="workStyle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred work style</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <div className="grid md:grid-cols-2 gap-3">
                                    {Array.from(workStyleOptions).map((style) => (
                                      <label
                                        key={style}
                                        className={`flex items-center gap-3 p-4 rounded-md border-2 cursor-pointer hover-elevate ${
                                          field.value === style
                                            ? "border-primary bg-primary/5"
                                            : "border-border"
                                        }`}
                                        data-testid={`radio-workstyle-${style.toLowerCase().replace(/\s+/g, "-")}`}
                                      >
                                        <RadioGroupItem value={style} />
                                        <span className="font-medium">{style}</span>
                                      </label>
                                    ))}
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location preference</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <div className="grid md:grid-cols-2 gap-3">
                                    {Array.from(locationOptions).map((location) => (
                                      <label
                                        key={location}
                                        className={`flex items-center gap-3 p-4 rounded-md border-2 cursor-pointer hover-elevate ${
                                          field.value === location
                                            ? "border-primary bg-primary/5"
                                            : "border-border"
                                        }`}
                                        data-testid={`radio-location-${location.toLowerCase().replace(/\s+/g, "-")}`}
                                      >
                                        <RadioGroupItem value={location} />
                                        <span className="font-medium">{location}</span>
                                      </label>
                                    ))}
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="salaryExpectation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salary expectation</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <div className="grid gap-3">
                                    {Array.from(salaryRanges).map((range) => (
                                      <label
                                        key={range}
                                        className={`flex items-center gap-3 p-4 rounded-md border-2 cursor-pointer hover-elevate ${
                                          field.value === range
                                            ? "border-primary bg-primary/5"
                                            : "border-border"
                                        }`}
                                        data-testid={`radio-salary-${range.toLowerCase().replace(/[()$,\s+]+/g, "-")}`}
                                      >
                                        <RadioGroupItem value={range} />
                                        <span className="font-medium">{range}</span>
                                      </label>
                                    ))}
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0 || isAnalyzing}
                    data-testid="button-back"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid() || isAnalyzing}
                    data-testid="button-next"
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : currentStep === steps.length - 1 ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Get Recommendations
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
