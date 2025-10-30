// ==================== CAREER COMPARISON PAGE ====================
// Side-by-side comparison of multiple career paths
// Helps users make informed decisions about career transitions

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Plus, X, TrendingUp, TrendingDown, Minus, Check } from "lucide-react";
import type { CareerPath } from "@shared/schema";
import { CareerSelect, CAREER_OPTIONS } from "@/components/career-select";

// Generate career paths from CAREER_OPTIONS
const generateCareerPath = (career: typeof CAREER_OPTIONS[0], index: number): CareerPath => {
  const categories = ["Technology", "Design", "Business", "Healthcare", "Education", "Engineering", "Finance", "Marketing"];
  const category = categories[index % categories.length];
  
  return {
    id: career.value,
    title: career.label,
    category,
    avgSalary: 60000 + Math.floor(Math.random() * 100000),
    salaryGrowth: 3 + Math.random() * 7,
    jobOpenings: 5000 + Math.floor(Math.random() * 80000),
    workLifeBalance: 5 + Math.floor(Math.random() * 5),
    stressLevel: 3 + Math.floor(Math.random() * 7),
    jobSatisfaction: 5 + Math.floor(Math.random() * 5),
    requiredEducation: ["High School", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "PhD"][Math.floor(Math.random() * 5)],
    topSkills: ["Communication", "Leadership", "Problem Solving", "Technical Skills"].slice(0, 3 + Math.floor(Math.random() * 2)),
    careerGrowth: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
    remoteFriendly: Math.random() > 0.5,
    pros: ["Competitive salary", "Growth opportunities", "Good benefits", "Flexible schedule"].slice(0, 3 + Math.floor(Math.random() * 2)),
    cons: ["High pressure", "Long hours", "Competitive field"].slice(0, 2 + Math.floor(Math.random() * 2)),
  };
};

const CAREER_PATHS: CareerPath[] = CAREER_OPTIONS.map((career, index) => generateCareerPath(career, index));

export default function CareerComparison() {
  // ===== STATE =====
  const [selectedCareers, setSelectedCareers] = useState<CareerPath[]>([]);  // Careers being compared
  const [availableCareers] = useState<CareerPath[]>(CAREER_PATHS);           // All available careers

  // ===== HANDLERS =====
  // Add a career to comparison
  const handleAddCareer = (careerId: string) => {
    const career = availableCareers.find(c => c.id === careerId);
    if (career && !selectedCareers.find(c => c.id === careerId)) {
      setSelectedCareers([...selectedCareers, career]);  // Add if not already selected
    }
  };

  // Remove a career from comparison
  const handleRemoveCareer = (careerId: string) => {
    setSelectedCareers(selectedCareers.filter(c => c.id !== careerId));  // Filter out removed career
  };

  // ===== HELPER FUNCTIONS =====
  // Get color for rating (1-10 scale)
  const getRatingColor = (value: number, inverse = false) => {
    if (inverse) value = 11 - value;  // Invert for stress (lower is better)
    if (value >= 8) return "text-green-500";
    if (value >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  // Render rating bars
  const renderRatingBar = (value: number, max: number = 10, inverse = false) => {
    const percentage = (value / max) * 100;
    const colorClass = getRatingColor(value, inverse);
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-secondary rounded-full h-2">
          <div
            className={`h-full rounded-full ${
              inverse
                ? value >= 7 ? 'bg-red-500' : value >= 4 ? 'bg-yellow-500' : 'bg-green-500'
                : value >= 8 ? 'bg-green-500' : value >= 6 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-sm font-medium w-8 ${colorClass}`}>{value}</span>
      </div>
    );
  };

  // ===== RENDER =====
  return (
    <div className="p-6">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-heading font-bold flex items-center gap-3">
          <GitCompare className="h-8 w-8 text-primary" />
          Career Comparison
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Compare multiple career paths side by side to make informed decisions
        </p>
      </motion.div>

      {/* Career selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Careers to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap items-end">
              <div className="flex-1 min-w-[200px]">
                <CareerSelect
                  onValueChange={handleAddCareer}
                  placeholder="Search and select a career..."
                  testId="select-career"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedCareers.length} / 4 careers selected
              </div>
            </div>

            {/* Selected careers chips */}
            {selectedCareers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCareers.map(career => (
                  <Badge key={career.id} variant="secondary" className="gap-2 py-2 px-3" data-testid={`badge-career-${career.id}`}>
                    {career.title}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemoveCareer(career.id)}
                      data-testid={`button-remove-career-${career.id}`}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparison table */}
      {selectedCareers.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr)` }}>
                {/* Header row */}
                <div className="sticky left-0 bg-background z-10"></div>
                {selectedCareers.map((career, index) => (
                  <motion.div
                    key={career.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{career.title}</CardTitle>
                        <Badge variant="outline">{career.category}</Badge>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}

                {/* Salary */}
                <div className="flex items-center font-medium sticky left-0 bg-background z-10 p-4">
                  Average Salary
                </div>
                {selectedCareers.map(career => (
                  <Card key={career.id}>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary">
                        ${career.avgSalary.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        +{career.salaryGrowth}% yearly
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Job Openings */}
                <div className="flex items-center font-medium sticky left-0 bg-background z-10 p-4">
                  Job Openings
                </div>
                {selectedCareers.map(career => (
                  <Card key={career.id}>
                    <CardContent className="p-4">
                      <div className="text-xl font-semibold">
                        {career.jobOpenings.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">positions</div>
                    </CardContent>
                  </Card>
                ))}

                {/* Work-Life Balance */}
                <div className="flex items-center font-medium sticky left-0 bg-background z-10 p-4">
                  Work-Life Balance
                </div>
                {selectedCareers.map(career => (
                  <Card key={career.id}>
                    <CardContent className="p-4">
                      {renderRatingBar(career.workLifeBalance)}
                    </CardContent>
                  </Card>
                ))}

                {/* Stress Level */}
                <div className="flex items-center font-medium sticky left-0 bg-background z-10 p-4">
                  Stress Level
                </div>
                {selectedCareers.map(career => (
                  <Card key={career.id}>
                    <CardContent className="p-4">
                      {renderRatingBar(career.stressLevel, 10, true)}
                    </CardContent>
                  </Card>
                ))}

                {/* Job Satisfaction */}
                <div className="flex items-center font-medium sticky left-0 bg-background z-10 p-4">
                  Job Satisfaction
                </div>
                {selectedCareers.map(career => (
                  <Card key={career.id}>
                    <CardContent className="p-4">
                      {renderRatingBar(career.jobSatisfaction)}
                    </CardContent>
                  </Card>
                ))}

                {/* Education Required */}
                <div className="flex items-center font-medium sticky left-0 bg-background z-10 p-4">
                  Education Required
                </div>
                {selectedCareers.map(career => (
                  <Card key={career.id}>
                    <CardContent className="p-4">
                      <Badge variant="secondary">{career.requiredEducation}</Badge>
                    </CardContent>
                  </Card>
                ))}

                {/* Career Growth */}
                <div className="flex items-center font-medium sticky left-0 bg-background z-10 p-4">
                  Career Growth
                </div>
                {selectedCareers.map(career => (
                  <Card key={career.id}>
                    <CardContent className="p-4">
                      <Badge variant={
                        career.careerGrowth === 'High' ? 'default' :
                        career.careerGrowth === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {career.careerGrowth}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}

                {/* Remote Friendly */}
                <div className="flex items-center font-medium sticky left-0 bg-background z-10 p-4">
                  Remote Work
                </div>
                {selectedCareers.map(career => (
                  <Card key={career.id}>
                    <CardContent className="p-4">
                      {career.remoteFriendly ? (
                        <Check className="h-6 w-6 text-green-500" />
                      ) : (
                        <X className="h-6 w-6 text-red-500" />
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Top Skills */}
                <div className="flex items-center font-medium sticky left-0 bg-background z-10 p-4">
                  Top Skills
                </div>
                {selectedCareers.map(career => (
                  <Card key={career.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {career.topSkills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Pros */}
                <div className="flex items-center font-medium sticky left-0 bg-background z-10 p-4">
                  Pros
                </div>
                {selectedCareers.map(career => (
                  <Card key={career.id}>
                    <CardContent className="p-4">
                      <ul className="space-y-1">
                        {career.pros.map((pro, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}

                {/* Cons */}
                <div className="flex items-center font-medium sticky left-0 bg-background z-10 p-4">
                  Cons
                </div>
                {selectedCareers.map(career => (
                  <Card key={career.id}>
                    <CardContent className="p-4">
                      <ul className="space-y-1">
                        {career.cons.map((con, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <Minus className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        // Empty state
        <Card className="p-12">
          <div className="text-center">
            <GitCompare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Careers Selected</h3>
            <p className="text-muted-foreground">
              Select career paths above to start comparing
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
