// ==================== SALARY CALCULATOR PAGE ====================
// This page provides advanced salary comparison across roles, locations, and experience
// Users can compare multiple positions and get personalized salary insights

// Import React hooks
import { useState } from "react";
// Import animations
import { motion } from "framer-motion";
// Import UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CareerSelect, CAREER_OPTIONS } from "@/components/career-select";
// Import charts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
// Import icons
import { DollarSign, TrendingUp, MapPin, Briefcase, Building2, Plus, X } from "lucide-react";
// Import types
import type { SalaryData } from "@shared/schema";

// Sample salary data for different roles
const SAMPLE_SALARY_DATA: SalaryData[] = [
  {
    id: "1",
    role: "Software Engineer",
    level: "Mid",
    location: "San Francisco, CA",
    industry: "Technology",
    companySize: "500-1000",
    baseSalary: 145000,
    bonus: 15000,
    equity: 40000,
    totalComp: 200000,
    benefits: ["Health Insurance", "401k Match", "Stock Options", "Remote Work"],
    currency: "USD",
    yearsExperience: 3,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    role: "Software Engineer",
    level: "Senior",
    location: "San Francisco, CA",
    industry: "Technology",
    companySize: "500-1000",
    baseSalary: 180000,
    bonus: 25000,
    equity: 80000,
    totalComp: 285000,
    benefits: ["Health Insurance", "401k Match", "Stock Options", "Remote Work"],
    currency: "USD",
    yearsExperience: 5,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    role: "Data Scientist",
    level: "Mid",
    location: "New York, NY",
    industry: "Finance",
    companySize: "1000+",
    baseSalary: 130000,
    bonus: 20000,
    equity: 0,
    totalComp: 150000,
    benefits: ["Health Insurance", "401k Match", "Bonus"],
    currency: "USD",
    yearsExperience: 4,
    updatedAt: new Date().toISOString(),
  },
];

// Main Salary Calculator component
export default function SalaryCalculator() {
  // ===== STATE MANAGEMENT =====
  const [selectedRole, setSelectedRole] = useState("");         // Job role being searched
  const [selectedLocation, setSelectedLocation] = useState(""); // Location being searched
  const [selectedLevel, setSelectedLevel] = useState("");       // Experience level
  const [yearsExp, setYearsExp] = useState("");                 // Years of experience
  const [comparisons, setComparisons] = useState<SalaryData[]>([]); // Roles to compare
  const [showResults, setShowResults] = useState(false);        // Whether to show comparison

  // ===== HANDLERS =====
  // Add current search to comparison list
  const handleAddToComparison = () => {
    // Validation: ensure all fields are filled
    if (!selectedRole || !selectedLocation || !selectedLevel) {
      return;
    }

    // Find matching salary data (in production, would fetch from API)
    const matchingData = SAMPLE_SALARY_DATA.find(
      (data) =>
        data.role === selectedRole &&
        data.location === selectedLocation &&
        data.level === selectedLevel
    );

    // Use matching data or create placeholder
    const salaryData: SalaryData = matchingData || {
      id: Date.now().toString(),
      role: selectedRole,
      level: selectedLevel as any,
      location: selectedLocation,
      industry: "Technology",
      companySize: "500-1000",
      baseSalary: 100000,
      bonus: 10000,
      equity: 20000,
      totalComp: 130000,
      benefits: ["Health Insurance", "401k Match"],
      currency: "USD",
      yearsExperience: parseInt(yearsExp) || 3,
      updatedAt: new Date().toISOString(),
    };

    // Add to comparison list
    setComparisons([...comparisons, salaryData]);
    setShowResults(true); // Show results panel
  };

  // Remove a role from comparison
  const handleRemoveFromComparison = (index: number) => {
    const newComparisons = comparisons.filter((_, i) => i !== index);
    setComparisons(newComparisons);
    if (newComparisons.length === 0) {
      setShowResults(false); // Hide results if no comparisons
    }
  };

  // Reset all comparisons
  const handleReset = () => {
    setComparisons([]);      // Clear comparison list
    setShowResults(false);   // Hide results
  };

  // ===== COMPUTED VALUES =====
  // Format chart data for visualization
  const chartData = comparisons.map((data) => ({
    name: `${data.role}\n${data.level}`,              // Role and level
    "Base Salary": data.baseSalary,                    // Base salary amount
    "Bonus": data.bonus,                               // Bonus amount
    "Equity": data.equity,                             // Equity value
    "Total Comp": data.totalComp,                      // Total compensation
  }));

  // ===== RENDER =====
  return (
    <div className="p-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-heading font-bold flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-primary" />
          Salary Calculator
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Compare salaries across different roles, locations, and experience levels
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left panel: Search form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle>Search Salary Data</CardTitle>
              <CardDescription>
                Enter job details to find salary information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Job role input */}
                <div className="space-y-2">
                  <Label htmlFor="role">Job Role</Label>
                  <CareerSelect
                    value={selectedRole}
                    onValueChange={(value) => {
                      const career = CAREER_OPTIONS.find(c => c.value === value);
                      setSelectedRole(career?.label || value);
                    }}
                    placeholder="Search and select role..."
                    testId="select-role"
                  />
                </div>

                {/* Location input */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger data-testid="select-location-trigger">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                      <SelectItem value="New York, NY">New York, NY</SelectItem>
                      <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                      <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                      <SelectItem value="Bangalore, India">Bangalore, India</SelectItem>
                      <SelectItem value="Mumbai, India">Mumbai, India</SelectItem>
                      <SelectItem value="Hyderabad, India">Hyderabad, India</SelectItem>
                      <SelectItem value="Pune, India">Pune, India</SelectItem>
                      <SelectItem value="Delhi, India">Delhi, India</SelectItem>
                      <SelectItem value="Chennai, India">Chennai, India</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience level input */}
                <div className="space-y-2">
                  <Label htmlFor="level">Experience Level</Label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger data-testid="select-level-trigger">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry">Entry Level</SelectItem>
                      <SelectItem value="Mid">Mid Level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Principal">Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Years of experience input */}
                <div className="space-y-2">
                  <Label htmlFor="years">Years of Experience</Label>
                  <Input
                    id="years"
                    type="number"
                    placeholder="e.g., 5"
                    value={yearsExp}
                    onChange={(e) => setYearsExp(e.target.value)}
                    data-testid="input-years"
                  />
                </div>

                {/* Add to comparison button */}
                <Button
                  className="w-full gap-2"
                  onClick={handleAddToComparison}
                  disabled={!selectedRole || !selectedLocation || !selectedLevel}
                  data-testid="button-add-comparison"
                >
                  <Plus className="h-4 w-4" />
                  Add to Comparison
                </Button>

                {/* Reset button */}
                {comparisons.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleReset}
                    data-testid="button-reset"
                  >
                    Reset All
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current comparisons list */}
          {comparisons.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  Comparing ({comparisons.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {comparisons.map((data, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                      data-testid={`comparison-item-${index}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{data.role}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.level} • {data.location}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFromComparison(index)}
                        data-testid={`button-remove-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Right panel: Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {showResults && comparisons.length > 0 ? (
            <div className="space-y-6">
              {/* Salary comparison chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Total Compensation Breakdown</CardTitle>
                  <CardDescription>
                    Compare base salary, bonus, and equity across roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Bar dataKey="Base Salary" fill="hsl(var(--primary))" />
                      <Bar dataKey="Bonus" fill="hsl(var(--secondary))" />
                      <Bar dataKey="Equity" fill="hsl(var(--accent))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Detailed comparison cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {comparisons.map((data, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{data.role}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{data.level}</Badge>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {data.location}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Total compensation - highlighted */}
                        <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">
                            Total Compensation
                          </div>
                          <div className="text-3xl font-bold text-primary">
                            ${data.totalComp.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per year
                          </div>
                        </div>

                        {/* Compensation breakdown */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Base Salary
                            </span>
                            <span className="font-medium">
                              ${data.baseSalary.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Annual Bonus
                            </span>
                            <span className="font-medium">
                              ${data.bonus.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Equity/Year
                            </span>
                            <span className="font-medium">
                              ${data.equity.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Additional details */}
                        <div className="mt-4 pt-4 border-t space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{data.companySize} employees</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span>{data.industry}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span>{data.yearsExperience} years experience</span>
                          </div>
                        </div>

                        {/* Benefits */}
                        <div className="mt-4">
                          <div className="text-sm font-medium mb-2">Benefits</div>
                          <div className="flex flex-wrap gap-2">
                            {data.benefits.map((benefit, i) => (
                              <Badge key={i} variant="outline">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Salary Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Market Trend</p>
                        <p className="text-sm text-muted-foreground">
                          Salaries for {comparisons[0]?.role} roles have increased by 8% in the past year
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Negotiation Tip</p>
                        <p className="text-sm text-muted-foreground">
                          Consider total compensation, not just base salary. Equity and bonuses can add 20-40% to your package
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-500/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Location Impact</p>
                        <p className="text-sm text-muted-foreground">
                          San Francisco and New York typically offer 20-30% higher salaries but have higher cost of living
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Empty state
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <DollarSign className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Comparisons Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Add job roles to compare salary information
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
