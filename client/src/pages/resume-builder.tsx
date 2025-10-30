import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Sparkles,
  Loader2,
  Briefcase,
  GraduationCap,
  Award,
  Folder,
  Upload,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  resumePersonalInfoSchema,
  type Resume,
  type ResumeExperience,
  type ResumeEducation,
  type ResumeSkill,
} from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ResumeBuilder() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [experiences, setExperiences] = useState<ResumeExperience[]>([]);
  const [educations, setEducations] = useState<ResumeEducation[]>([]);
  const [skills, setSkills] = useState<ResumeSkill[]>([]);
  const [summary, setSummary] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(resumePersonalInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      photo: "",
    },
  });

  const templates = [
    { id: "modern", name: "Modern", description: "Clean and contemporary design" },
    { id: "professional", name: "Professional", description: "Classic business style" },
    { id: "creative", name: "Creative", description: "Stand out with unique layout" },
  ];

  const generateSummaryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "POST",
        "/api/resume/generate-summary",
        {
          experience: experiences,
          skills: skills.map((s) => s.name),
          targetRole: form.getValues("fullName"),
        }
      );
      return await response.json() as { summary: string };
    },
    onSuccess: (data) => {
      setSummary(data.summary);
      toast({
        title: "Summary Generated!",
        description: "AI-generated professional summary is ready.",
      });
    },
  });

  const saveResumeMutation = useMutation({
    mutationFn: async () => {
      const personalInfo = form.getValues();
      const response = await apiRequest(
        "POST",
        "/api/resume",
        {
          userId: "demo-user",
          templateId: selectedTemplate,
          personalInfo,
          summary,
          experience: experiences,
          education: educations,
          skills,
        }
      );
      return await response.json() as Resume;
    },
    onSuccess: () => {
      toast({
        title: "Resume Saved!",
        description: "Your resume has been saved successfully.",
      });
    },
  });

  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const personalInfo = form.getValues();

    let yPosition = 20;
    const leftMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add photo if available
    if (photoPreview) {
      try {
        doc.addImage(photoPreview, "JPEG", pageWidth - 50, 15, 30, 30);
      } catch (error) {
        console.error("Error adding photo:", error);
      }
    }

    // Personal Information
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(personalInfo.fullName || "Your Name", leftMargin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
      personalInfo.github,
      personalInfo.website,
    ].filter(Boolean).join(" | ");
    
    doc.text(contactInfo, leftMargin, yPosition);
    yPosition += 15;

    // Professional Summary
    if (summary) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Professional Summary", leftMargin, yPosition);
      yPosition += 7;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const summaryLines = doc.splitTextToSize(summary, pageWidth - 40);
      doc.text(summaryLines, leftMargin, yPosition);
      yPosition += summaryLines.length * 5 + 10;
    }

    // Work Experience
    if (experiences.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Work Experience", leftMargin, yPosition);
      yPosition += 7;

      experiences.forEach((exp) => {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(exp.title, leftMargin, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(`${exp.company} | ${exp.location}`, leftMargin, yPosition);
        yPosition += 5;

        doc.setFont("helvetica", "normal");
        doc.text(`${exp.startDate} - ${exp.current ? "Present" : exp.endDate || ""}`, leftMargin, yPosition);
        yPosition += 6;

        if (exp.description) {
          const descLines = doc.splitTextToSize(exp.description, pageWidth - 40);
          doc.text(descLines, leftMargin, yPosition);
          yPosition += descLines.length * 5 + 8;
        }
      });
    }

    // Education
    if (educations.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Education", leftMargin, yPosition);
      yPosition += 7;

      educations.forEach((edu) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(edu.degree, leftMargin, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(`${edu.institution} | ${edu.location}`, leftMargin, yPosition);
        yPosition += 5;

        doc.setFont("helvetica", "normal");
        doc.text(`Graduated: ${edu.graduationDate}`, leftMargin, yPosition);
        if (edu.gpa) {
          doc.text(`GPA: ${edu.gpa}`, leftMargin + 60, yPosition);
        }
        yPosition += 10;
      });
    }

    // Skills
    if (skills.length > 0) {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Skills", leftMargin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const skillsText = skills.map(s => s.name).join(", ");
      const skillsLines = doc.splitTextToSize(skillsText, pageWidth - 40);
      doc.text(skillsLines, leftMargin, yPosition);
    }

    // Save the PDF
    doc.save(`${personalInfo.fullName || "resume"}_resume.pdf`);
    
    toast({
      title: "PDF Downloaded!",
      description: "Your resume has been downloaded as a PDF.",
    });
  };

  const addExperience = () => {
    const newExp: ResumeExperience = {
      id: `exp-${Date.now()}`,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
    };
    setExperiences([...experiences, newExp]);
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const addEducation = () => {
    const newEdu: ResumeEducation = {
      id: `edu-${Date.now()}`,
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
      honors: "",
    };
    setEducations([...educations, newEdu]);
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setEducations(
      educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const removeEducation = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const addSkill = () => {
    const skillName = prompt("Enter skill name:");
    if (!skillName) return;
    
    const newSkill: ResumeSkill = {
      id: `skill-${Date.now()}`,
      name: skillName,
      category: "Technical",
      level: "Intermediate",
    };
    setSkills([...skills, newSkill]);
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        form.setValue("photo", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview("");
    form.setValue("photo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold">Resume Builder</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Create a professional resume in minutes
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Choose Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer hover-elevate ${
                        selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                      data-testid={`card-template-${template.id}`}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-heading font-bold mb-1">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="personal" data-testid="tab-personal" className="text-xs sm:text-sm">
                Personal
              </TabsTrigger>
              <TabsTrigger value="experience" data-testid="tab-experience" className="text-xs sm:text-sm">
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" data-testid="tab-education" className="text-xs sm:text-sm">
                Education
              </TabsTrigger>
              <TabsTrigger value="skills" data-testid="tab-skills" className="text-xs sm:text-sm">
                Skills
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <div className="space-y-6">
                      {/* Photo Upload Section */}
                      <div className="flex flex-col items-center gap-4 p-4 border rounded-md bg-muted/30">
                        <div className="relative">
                          {photoPreview ? (
                            <div className="relative">
                              <img
                                src={photoPreview}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                                onClick={removePhoto}
                                data-testid="button-remove-photo"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20">
                              <User className="h-16 w-16 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            data-testid="input-photo-file"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            data-testid="button-upload-photo"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {photoPreview ? "Change Photo" : "Upload Photo"}
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            Max file size: 5MB (JPG, PNG, GIF)
                          </p>
                        </div>
                      </div>

                      <Separator />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-full-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-phone" />
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
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-location" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn (optional)</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-linkedin" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="github"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GitHub (optional)</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-github" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Separator className="my-6" />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Professional Summary</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateSummaryMutation.mutate()}
                          disabled={generateSummaryMutation.isPending}
                          data-testid="button-generate-summary"
                        >
                          {generateSummaryMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate with AI
                            </>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="A brief professional summary highlighting your key strengths..."
                        className="min-h-[100px]"
                        data-testid="textarea-summary"
                      />
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <CardTitle>Work Experience</CardTitle>
                  <Button
                    onClick={addExperience}
                    size="sm"
                    data-testid="button-add-experience"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {experiences.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No experience added yet</p>
                    </div>
                  ) : (
                    experiences.map((exp, index) => (
                      <div key={exp.id} className="p-4 border rounded-md space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading font-bold">
                            Experience {index + 1}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                            data-testid={`button-remove-experience-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Job Title</Label>
                            <Input
                              value={exp.title}
                              onChange={(e) =>
                                updateExperience(exp.id, "title", e.target.value)
                              }
                              data-testid={`input-exp-title-${index}`}
                            />
                          </div>
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) =>
                                updateExperience(exp.id, "company", e.target.value)
                              }
                              data-testid={`input-exp-company-${index}`}
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={exp.location}
                              onChange={(e) =>
                                updateExperience(exp.id, "location", e.target.value)
                              }
                              data-testid={`input-exp-location-${index}`}
                            />
                          </div>
                          <div>
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) =>
                                updateExperience(exp.id, "startDate", e.target.value)
                              }
                              data-testid={`input-exp-start-${index}`}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) =>
                              updateExperience(exp.id, "description", e.target.value)
                            }
                            placeholder="Describe your responsibilities and achievements..."
                            data-testid={`textarea-exp-description-${index}`}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <CardTitle>Education</CardTitle>
                  <Button
                    onClick={addEducation}
                    size="sm"
                    data-testid="button-add-education"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {educations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No education added yet</p>
                    </div>
                  ) : (
                    educations.map((edu, index) => (
                      <div key={edu.id} className="p-4 border rounded-md space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading font-bold">
                            Education {index + 1}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                            data-testid={`button-remove-education-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducation(edu.id, "degree", e.target.value)
                              }
                              data-testid={`input-edu-degree-${index}`}
                            />
                          </div>
                          <div>
                            <Label>Institution</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) =>
                                updateEducation(edu.id, "institution", e.target.value)
                              }
                              data-testid={`input-edu-institution-${index}`}
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={edu.location}
                              onChange={(e) =>
                                updateEducation(edu.id, "location", e.target.value)
                              }
                              data-testid={`input-edu-location-${index}`}
                            />
                          </div>
                          <div>
                            <Label>Graduation Date</Label>
                            <Input
                              type="month"
                              value={edu.graduationDate}
                              onChange={(e) =>
                                updateEducation(edu.id, "graduationDate", e.target.value)
                              }
                              data-testid={`input-edu-grad-${index}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <CardTitle>Skills</CardTitle>
                  <Button onClick={addSkill} size="sm" data-testid="button-add-skill">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </CardHeader>
                <CardContent>
                  {skills.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No skills added yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className="gap-2 px-3 py-1"
                          data-testid={`badge-skill-${skill.id}`}
                        >
                          {skill.name}
                          <button
                            onClick={() => removeSkill(skill.id)}
                            className="hover:text-destructive"
                            data-testid={`button-remove-skill-${skill.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 md:space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Resume Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-[8.5/11] w-full bg-muted rounded-md flex items-center justify-center">
                <div className="text-center text-muted-foreground px-4">
                  <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm sm:text-base">Preview will appear here</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full gap-2"
                  onClick={downloadPDF}
                  data-testid="button-download-pdf"
                >
                  <Download className="h-4 w-4" />
                  Download as PDF
                </Button>
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={() => saveResumeMutation.mutate()}
                  disabled={saveResumeMutation.isPending}
                  data-testid="button-save-resume"
                >
                  {saveResumeMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Folder className="h-4 w-4" />
                      Save Resume
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
