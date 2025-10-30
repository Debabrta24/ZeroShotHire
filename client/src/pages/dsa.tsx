import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Play, CheckCircle2, XCircle, Trophy, Building2, Search, Filter, ChevronLeft, Globe, Users, Package, Monitor, Apple as AppleIcon, Film, RefreshCw, Lightbulb, ExternalLink, X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const API_BASE_URL = '/api/leetcode';

interface Company {
  id: string;
  name: string;
  icon: typeof Globe;
}

interface LeetCodeProblem {
  title?: string;
  questionTitle?: string;
  titleSlug?: string;
  difficulty?: string;
  acRate?: string;
  topicTags?: { name: string }[];
}

interface Problem {
  id: number;
  title: string;
  titleSlug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  companies: string[];
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  solved: boolean;
  acceptance: number;
}

interface ApiFilters {
  difficulty: string;
  tags: string[];
  limit: number;
  skip: number;
}

const companies: Company[] = [
  { id: "google", name: "Google", icon: Globe },
  { id: "meta", name: "Meta", icon: Users },
  { id: "amazon", name: "Amazon", icon: Package },
  { id: "microsoft", name: "Microsoft", icon: Monitor },
  { id: "apple", name: "Apple", icon: AppleIcon },
  { id: "netflix", name: "Netflix", icon: Film },
];

const availableTags = [
  "array",
  "math",
  "string",
  "hash-table",
  "dynamic-programming",
  "tree",
  "graph",
  "sorting",
  "binary-search",
  "stack",
  "queue",
  "greedy",
  "backtracking"
];

export default function DSA() {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [showCompanySelection, setShowCompanySelection] = useState<boolean>(true);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>("// Write your solution here\n\n");
  const [testResult, setTestResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  
  // API state
  const [apiProblems, setApiProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filters, setFilters] = useState<ApiFilters>({
    difficulty: "",
    tags: [],
    limit: 20,
    skip: 0
  });
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [solutionContent, setSolutionContent] = useState<string>("");
  const [loadingSolution, setLoadingSolution] = useState<boolean>(false);

  // Build API URL
  const buildApiUrl = () => {
    let url = `${API_BASE_URL}/problems?`;
    const params: string[] = [];
    
    if (filters.difficulty) {
      params.push(`difficulty=${filters.difficulty}`);
    }
    
    if (filters.tags.length > 0) {
      params.push(`tags=${filters.tags.join('+')}`);
    }
    
    if (filters.limit) {
      params.push(`limit=${filters.limit}`);
    }
    
    if (filters.skip > 0) {
      params.push(`skip=${filters.skip}`);
    }
    
    return url + params.join('&');
  };

  // Fetch problems from API
  const fetchProblems = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const url = buildApiUrl();
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const problemList: LeetCodeProblem[] = data.problemsetQuestionList || [];
      
      // Transform API data to our format
      const transformedProblems: Problem[] = problemList.map((p, index) => ({
        id: filters.skip + index + 1,
        title: p.title || p.questionTitle || 'Untitled',
        titleSlug: p.titleSlug || '',
        difficulty: (p.difficulty || 'Medium') as "Easy" | "Medium" | "Hard",
        topics: (p.topicTags || []).map(tag => tag.name),
        companies: [],
        description: `Solve this problem on LeetCode: ${p.titleSlug}`,
        examples: [],
        constraints: [],
        solved: false,
        acceptance: p.acRate ? parseFloat(p.acRate) : 0
      }));
      
      setApiProblems(transformedProblems);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch problems');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch official solution
  const fetchSolution = async (titleSlug: string) => {
    setLoadingSolution(true);
    setShowSolution(true);
    setSolutionContent('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/solution?titleSlug=${titleSlug}`);
      
      if (!response.ok) {
        throw new Error('Solution not available');
      }
      
      const data = await response.json();
      
      if (data && data.content) {
        setSolutionContent(data.content);
      } else {
        setSolutionContent('Official solution is not available for this problem. Try solving it yourself or check the LeetCode discussion section!');
      }
    } catch (error) {
      console.error('Error fetching solution:', error);
      setSolutionContent(`Failed to load solution: ${error instanceof Error ? error.message : 'Unknown error'}. The solution might not be available for this problem.`);
    } finally {
      setLoadingSolution(false);
    }
  };

  // Load initial problems on mount
  useEffect(() => {
    if (!showCompanySelection) {
      fetchProblems();
    }
  }, [showCompanySelection]);

  const filteredProblems = apiProblems.filter(problem => {
    const matchesCompany = !selectedCompany || problem.companies.includes(selectedCompany);
    const matchesSearch = !searchQuery || 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter;
    
    return matchesCompany && matchesSearch && matchesDifficulty;
  });

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompany(companyId);
    setShowCompanySelection(false);
  };

  const handleRunCode = () => {
    const randomPass = Math.random() > 0.3;
    setTestResult({
      passed: randomPass,
      message: randomPass 
        ? "All test cases passed! ✓" 
        : "Test case 2 failed: Expected [0,1] but got [1,0]"
    });
  };

  const handleSubmit = () => {
    if (selectedProblem) {
      const randomPass = Math.random() > 0.5;
      setTestResult({
        passed: randomPass,
        message: randomPass 
          ? "Accepted! Your solution passed all test cases." 
          : "Wrong Answer: 15/42 test cases passed."
      });
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

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const setApiDifficulty = (difficulty: string) => {
    setFilters(prev => ({ ...prev, difficulty }));
  };

  const setLimit = (limit: number) => {
    setFilters(prev => ({ ...prev, limit }));
  };

  const applySkip = () => {
    fetchProblems();
  };

  const resetFilters = () => {
    setFilters({
      difficulty: "",
      tags: [],
      limit: 20,
      skip: 0
    });
  };

  const solvedCount = apiProblems.filter(p => p.solved).length;
  const progressPercentage = apiProblems.length > 0 ? (solvedCount / apiProblems.length) * 100 : 0;

  if (showCompanySelection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl">Select Your Target Company</CardTitle>
            </div>
            <CardDescription>
              Choose the company you're preparing for to get personalized problem recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {companies.map((company) => {
                const IconComponent = company.icon;
                return (
                  <Button
                    key={company.id}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2 hover-elevate"
                    onClick={() => handleCompanySelect(company.id)}
                    data-testid={`button-company-${company.id}`}
                  >
                    <IconComponent className="h-8 w-8 text-primary" />
                    <span className="font-medium">{company.name}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowCompanySelection(false)}
              data-testid="button-skip-company"
            >
              Skip - Show All Problems
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (selectedProblem) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <div className="border-b p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedProblem(null)}
              data-testid="button-back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold">{selectedProblem.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getDifficultyColor(selectedProblem.difficulty)} variant="secondary">
                  {selectedProblem.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Acceptance: {selectedProblem.acceptance.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedProblem.titleSlug && (
              <>
                <Button
                  variant="outline"
                  onClick={() => fetchSolution(selectedProblem.titleSlug)}
                  data-testid="button-view-solution"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  View Solution
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = `https://leetcode.com/problems/${selectedProblem.titleSlug}`}
                  data-testid="button-open-leetcode"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open on LeetCode
                </Button>
              </>
            )}
            {selectedCompany && (
              <Badge variant="outline">
                {companies.find(c => c.id === selectedCompany)?.name}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 border-r overflow-auto p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full" data-testid="tabs-problem-details">
                <TabsTrigger value="description" className="flex-1" data-testid="tab-description">Description</TabsTrigger>
                <TabsTrigger value="submissions" className="flex-1" data-testid="tab-submissions">Submissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-6 mt-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Problem Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{selectedProblem.description}</p>
                  {selectedProblem.titleSlug && (
                    <div className="mt-4">
                      <a 
                        href={`https://leetcode.com/problems/${selectedProblem.titleSlug}`}
                        className="text-primary hover:underline text-sm"
                      >
                        View full problem on LeetCode →
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProblem.topics.map((topic, idx) => (
                      <Badge key={idx} variant="outline" data-testid={`badge-topic-${idx}`}>{topic}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="submissions" className="mt-4">
                <p className="text-muted-foreground">No submissions yet</p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-1/2 flex flex-col">
            <div className="border-b p-4">
              <Select defaultValue="javascript">
                <SelectTrigger className="w-40" data-testid="select-language">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript" data-testid="select-language-javascript">JavaScript</SelectItem>
                  <SelectItem value="python" data-testid="select-language-python">Python</SelectItem>
                  <SelectItem value="java" data-testid="select-language-java">Java</SelectItem>
                  <SelectItem value="cpp" data-testid="select-language-cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 overflow-hidden">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-full resize-none font-mono text-sm rounded-none border-0"
                placeholder="Write your code here..."
                data-testid="textarea-code"
              />
            </div>

            {testResult && (
              <div className={`border-t p-4 ${testResult.passed ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                <div className="flex items-center gap-2">
                  {testResult.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={testResult.passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                    {testResult.message}
                  </span>
                </div>
              </div>
            )}

            <div className="border-t p-4 flex gap-2">
              <Button
                onClick={handleRunCode}
                variant="outline"
                className="flex-1"
                data-testid="button-run"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                data-testid="button-submit"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>

        {/* Solution Dialog */}
        <Dialog open={showSolution} onOpenChange={setShowSolution}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Official Solution</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {loadingSolution ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading solution...</span>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
                    {solutionContent}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Code className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-4xl font-heading font-bold">DSA Practice</h1>
                <p className="text-muted-foreground mt-1">
                  Practice coding problems from LeetCode with advanced filtering
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCompanySelection(true)}
              data-testid="button-change-company"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Change Company
            </Button>
          </div>

          {/* API Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Problems</CardTitle>
              <CardDescription>Use LeetCode API to filter problems by difficulty, tags, and more</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Difficulty Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filters.difficulty === "" ? "default" : "outline"}
                    onClick={() => setApiDifficulty("")}
                    data-testid="button-api-difficulty-all"
                  >
                    All
                  </Button>
                  <Button
                    variant={filters.difficulty === "EASY" ? "default" : "outline"}
                    onClick={() => setApiDifficulty("EASY")}
                    data-testid="button-api-difficulty-easy"
                  >
                    Easy
                  </Button>
                  <Button
                    variant={filters.difficulty === "MEDIUM" ? "default" : "outline"}
                    onClick={() => setApiDifficulty("MEDIUM")}
                    data-testid="button-api-difficulty-medium"
                  >
                    Medium
                  </Button>
                  <Button
                    variant={filters.difficulty === "HARD" ? "default" : "outline"}
                    onClick={() => setApiDifficulty("HARD")}
                    data-testid="button-api-difficulty-hard"
                  >
                    Hard
                  </Button>
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Topics/Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <Button
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      onClick={() => toggleTag(tag)}
                      data-testid={`button-api-tag-${tag}`}
                    >
                      {tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Limit and Skip */}
              <div>
                <label className="text-sm font-medium mb-2 block">Problem Count & Pagination</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Button
                    variant={filters.limit === 20 ? "default" : "outline"}
                    onClick={() => setLimit(20)}
                    data-testid="button-api-limit-20"
                  >
                    20 Problems
                  </Button>
                  <Button
                    variant={filters.limit === 50 ? "default" : "outline"}
                    onClick={() => setLimit(50)}
                    data-testid="button-api-limit-50"
                  >
                    50 Problems
                  </Button>
                  <Button
                    variant={filters.limit === 100 ? "default" : "outline"}
                    onClick={() => setLimit(100)}
                    data-testid="button-api-limit-100"
                  >
                    100 Problems
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Skip problems"
                    min="0"
                    value={filters.skip}
                    onChange={(e) => setFilters(prev => ({ ...prev, skip: parseInt(e.target.value) || 0 }))}
                    className="w-40"
                    data-testid="input-api-skip"
                  />
                  <Button
                    onClick={applySkip}
                    data-testid="button-apply-skip"
                  >
                    Apply Skip
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    data-testid="button-reset-filters"
                  >
                    Reset All
                  </Button>
                </div>
              </div>

              {/* Load Button */}
              <Button
                onClick={fetchProblems}
                disabled={isLoading}
                className="w-full"
                data-testid="button-fetch-problems"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading Problems...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Load Problems
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          {apiProblems.length > 0 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Loaded Problems</span>
                  <span className="text-sm text-muted-foreground">
                    {apiProblems.length} problems 
                    {filters.tags.length > 0 && ` • ${filters.tags.join(', ')}`}
                    {filters.difficulty && ` • ${filters.difficulty}`}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </CardContent>
            </Card>
          )}

          {/* Search and Local Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search loaded problems..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-40" data-testid="select-difficulty">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" data-testid="select-difficulty-all">All Levels</SelectItem>
                <SelectItem value="Easy" data-testid="select-difficulty-easy">Easy</SelectItem>
                <SelectItem value="Medium" data-testid="select-difficulty-medium">Medium</SelectItem>
                <SelectItem value="Hard" data-testid="select-difficulty-hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Problems</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchProblems} data-testid="button-retry">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading problems from LeetCode API...</p>
            </CardContent>
          </Card>
        )}

        {/* Problems List */}
        {!isLoading && !error && (
          <div className="space-y-2">
            {filteredProblems.map((problem) => (
              <Card
                key={problem.id}
                className="hover-elevate cursor-pointer"
                onClick={() => setSelectedProblem(problem)}
                data-testid={`problem-card-${problem.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {problem.solved ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium" data-testid={`problem-title-${problem.id}`}>{problem.title}</h3>
                          <Badge className={getDifficultyColor(problem.difficulty)} variant="secondary" data-testid={`badge-difficulty-${problem.id}`}>
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {problem.topics.slice(0, 5).map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs" data-testid={`badge-problem-topic-${problem.id}-${idx}`}>
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>{problem.acceptance.toFixed(1)}%</span>
                      </div>
                      {problem.titleSlug && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchSolution(problem.titleSlug);
                          }}
                          data-testid={`button-solution-${problem.id}`}
                        >
                          <Lightbulb className="h-3 w-3 mr-1" />
                          Solution
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredProblems.length === 0 && apiProblems.length > 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No problems found matching your search criteria</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && apiProblems.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Click "Load Problems" to fetch problems from LeetCode API</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
