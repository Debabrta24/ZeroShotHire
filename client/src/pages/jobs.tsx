import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  ExternalLink,
  Search,
  Filter,
  X,
} from "lucide-react";

export default function Jobs() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRemote, setSelectedRemote] = useState("all");

  const allJobs = [
    {
      id: "1",
      title: "Senior Full Stack Developer",
      company: "TechCorp",
      location: "Remote",
      salary: "$120k - $160k",
      type: "Full-time",
      posted: "2 days ago",
      match: 95,
      description:
        "Join our team to build next-generation web applications using React, Node.js, and TypeScript.",
      tags: ["React", "Node.js", "TypeScript", "AWS"],
    },
    {
      id: "2",
      title: "Data Scientist",
      company: "DataFlow Inc",
      location: "San Francisco, CA",
      salary: "$140k - $180k",
      type: "Full-time",
      posted: "1 week ago",
      match: 88,
      description:
        "Analyze complex datasets and build machine learning models to drive business insights.",
      tags: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    },
    {
      id: "3",
      title: "Product Manager",
      company: "InnovateLabs",
      location: "Remote",
      salary: "$130k - $170k",
      type: "Full-time",
      posted: "3 days ago",
      match: 76,
      description:
        "Lead product strategy and work with cross-functional teams to deliver innovative solutions.",
      tags: ["Product Strategy", "Agile", "Leadership"],
    },
    {
      id: "4",
      title: "Frontend Developer",
      company: "DesignHub",
      location: "New York, NY",
      salary: "$100k - $140k",
      type: "Full-time",
      posted: "5 days ago",
      match: 92,
      description:
        "Create beautiful, responsive user interfaces using modern frameworks and tools.",
      tags: ["React", "TypeScript", "CSS", "Figma"],
    },
    {
      id: "5",
      title: "Backend Engineer",
      company: "Tech Solutions India",
      location: "Bangalore, India",
      salary: "₹25L - ₹35L",
      type: "Full-time",
      posted: "1 day ago",
      match: 89,
      description:
        "Build scalable backend systems for millions of users across India and Southeast Asia.",
      tags: ["Java", "Spring Boot", "Microservices", "AWS"],
    },
    {
      id: "6",
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Hyderabad, India",
      salary: "₹20L - ₹30L",
      type: "Full-time",
      posted: "4 days ago",
      match: 85,
      description:
        "Manage cloud infrastructure and automate deployment pipelines for enterprise applications.",
      tags: ["Kubernetes", "Docker", "CI/CD", "Azure"],
    },
    {
      id: "7",
      title: "UI/UX Designer",
      company: "DesignCraft",
      location: "Mumbai, India",
      salary: "₹15L - ₹25L",
      type: "Contract",
      posted: "2 days ago",
      match: 78,
      description:
        "Design intuitive user experiences for mobile and web applications.",
      tags: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    },
    {
      id: "8",
      title: "Machine Learning Engineer",
      company: "AI Innovations",
      location: "Pune, India",
      salary: "₹30L - ₹45L",
      type: "Full-time",
      posted: "6 days ago",
      match: 91,
      description:
        "Develop and deploy ML models for computer vision and NLP applications.",
      tags: ["Python", "TensorFlow", "PyTorch", "Deep Learning"],
    },
    {
      id: "9",
      title: "Mobile Developer",
      company: "AppCraft",
      location: "Remote",
      salary: "$90k - $130k",
      type: "Part-time",
      posted: "3 days ago",
      match: 82,
      description:
        "Build cross-platform mobile applications using React Native.",
      tags: ["React Native", "JavaScript", "iOS", "Android"],
    },
  ];

  // Filter jobs based on selected criteria
  const filteredJobs = allJobs.filter((job) => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Location filter
    const matchesLocation = selectedLocation === "all" || job.location === selectedLocation;

    // Job type filter
    const matchesType = selectedType === "all" || job.type === selectedType;

    // Remote filter
    const matchesRemote = 
      selectedRemote === "all" ||
      (selectedRemote === "remote" && job.location === "Remote") ||
      (selectedRemote === "on-site" && job.location !== "Remote");

    return matchesSearch && matchesLocation && matchesType && matchesRemote;
  });

  // Clear all filters
  const clearFilters = () => {
    setSelectedLocation("all");
    setSelectedType("all");
    setSelectedRemote("all");
    setSearchQuery("");
  };

  // Check if any filters are active
  const hasActiveFilters = selectedLocation !== "all" || selectedType !== "all" || selectedRemote !== "all" || searchQuery !== "";

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-heading font-bold">Job Matches</h1>
        <p className="text-lg text-muted-foreground">
          Positions tailored to your career profile
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, company, or skill..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-jobs"
                />
              </div>
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-filters"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1">
                    Active
                  </Badge>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filter Jobs</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFilters(false)}
                      data-testid="button-close-filters"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Location Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="filter-location">Location</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger id="filter-location" data-testid="select-filter-location">
                          <SelectValue placeholder="All locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
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
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Job Type Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="filter-type">Job Type</Label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger id="filter-type" data-testid="select-filter-type">
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Remote Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="filter-remote">Work Location</Label>
                      <Select value={selectedRemote} onValueChange={setSelectedRemote}>
                        <SelectTrigger id="filter-remote" data-testid="select-filter-remote">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="remote">Remote Only</SelectItem>
                          <SelectItem value="on-site">On-site Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="gap-2"
                        data-testid="button-clear-filters"
                      >
                        <X className="h-4 w-4" />
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Matches", value: filteredJobs.length.toString(), color: "text-primary" },
          { label: "Applied", value: "8", color: "text-success" },
          { label: "Saved", value: "12", color: "text-warning" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold font-mono ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Job Listings */}
      <div className="grid gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="hover-elevate overflow-visible">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-2xl">{job.title}</CardTitle>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary font-mono"
                        >
                          {job.match}% Match
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      className="flex-1 gap-2"
                      data-testid={`button-apply-${job.id}`}
                    >
                      Apply Now
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      data-testid={`button-save-${job.id}`}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No jobs found matching your criteria
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
                data-testid="button-clear-filters-empty"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
