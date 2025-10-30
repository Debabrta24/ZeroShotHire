import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, MapPin, Clock, DollarSign, Building2, Briefcase, Search, Filter, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JSearchJob {
  job_id: string;
  job_title: string;
  company_name: string;
  job_location: string;
  job_employment_type: string;
  job_posted_at_datetime_utc: string;
  job_description: string;
  job_apply_link: string;
  job_is_remote: boolean;
  job_required_skills: string[] | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_salary_period: string | null;
}

interface InternshipsResponse {
  data: JSearchJob[];
  demo?: boolean;
  error?: string;
  fallback?: boolean;
}

export default function Internship() {
  const [searchQuery, setSearchQuery] = useState<string>("software engineering intern");
  const [locationFilter, setLocationFilter] = useState<string>("India");
  const [remoteFilter, setRemoteFilter] = useState<string>("all");
  const [datePostedFilter, setDatePostedFilter] = useState<string>("all");

  const buildQueryKey = () => {
    const params = new URLSearchParams({
      query: searchQuery,
      location: locationFilter,
      date_posted: datePostedFilter
    });
    
    if (remoteFilter === "remote") {
      params.append("remote_jobs_only", "true");
    }
    
    return `/api/internships?${params.toString()}`;
  };

  const { data, isLoading, error } = useQuery<InternshipsResponse>({
    queryKey: ["/api/internships", searchQuery, locationFilter, remoteFilter, datePostedFilter],
    queryFn: async () => {
      const response = await fetch(buildQueryKey());
      if (!response.ok) {
        throw new Error("Failed to fetch internships");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const internships = data?.data || [];
  const isDemoMode = data?.demo || data?.fallback;

  const handleSearch = () => {
    // Trigger refetch by updating state
  };

  const formatSalary = (job: JSearchJob) => {
    if (job.job_min_salary && job.job_max_salary) {
      const currency = job.job_salary_currency === "INR" ? "₹" : "$";
      const period = job.job_salary_period === "MONTH" ? "/month" : "/year";
      return `${currency}${job.job_min_salary.toLocaleString()} - ${currency}${job.job_max_salary.toLocaleString()}${period}`;
    }
    return "Not specified";
  };

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getTypeColor = (isRemote: boolean) => {
    return isRemote 
      ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      : "bg-green-500/10 text-green-700 dark:text-green-400";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-heading font-bold">Internship Opportunities</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Discover internship programs from leading companies across India
          </p>
        </div>

        {isDemoMode && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {data?.demo 
                ? "Showing demo data. Add your RapidAPI key to fetch real internship listings."
                : "Unable to fetch live data. Showing fallback results."}
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for internships..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    data-testid="input-search"
                  />
                </div>
                <Button onClick={handleSearch} data-testid="button-search">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full md:w-56" data-testid="select-location">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">All India</SelectItem>
                    <SelectItem value="Bangalore, India">Bangalore</SelectItem>
                    <SelectItem value="Mumbai, India">Mumbai</SelectItem>
                    <SelectItem value="Delhi, India">Delhi</SelectItem>
                    <SelectItem value="Hyderabad, India">Hyderabad</SelectItem>
                    <SelectItem value="Pune, India">Pune</SelectItem>
                    <SelectItem value="Chennai, India">Chennai</SelectItem>
                    <SelectItem value="Kolkata, India">Kolkata</SelectItem>
                    <SelectItem value="Gurgaon, India">Gurgaon</SelectItem>
                    <SelectItem value="Noida, India">Noida</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={remoteFilter} onValueChange={setRemoteFilter}>
                  <SelectTrigger className="w-full md:w-48" data-testid="select-remote">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="remote">Remote Only</SelectItem>
                    <SelectItem value="onsite">On-site Only</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={datePostedFilter} onValueChange={setDatePostedFilter}>
                  <SelectTrigger className="w-full md:w-48" data-testid="select-date">
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="3days">Last 3 Days</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Failed to load internships</p>
              <p className="text-muted-foreground">Please try again later</p>
            </CardContent>
          </Card>
        ) : internships.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No internships found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {internships.map((job) => (
              <Card key={job.job_id} className="flex flex-col" data-testid={`internship-card-${job.job_id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1" data-testid={`internship-title-${job.job_id}`}>
                        {job.job_title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium" data-testid={`internship-company-${job.job_id}`}>
                          {job.company_name}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      className={getTypeColor(job.job_is_remote)} 
                      variant="secondary"
                      data-testid={`badge-type-${job.job_id}`}
                    >
                      {job.job_is_remote ? "Remote" : "On-site"}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {job.job_description.substring(0, 200)}...
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate" data-testid={`internship-location-${job.job_id}`}>
                        {job.job_location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span data-testid={`internship-posted-${job.job_id}`}>
                        {formatPostedDate(job.job_posted_at_datetime_utc)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                      <DollarSign className="h-4 w-4 flex-shrink-0" />
                      <span data-testid={`internship-salary-${job.job_id}`}>
                        {formatSalary(job)}
                      </span>
                    </div>
                  </div>

                  {job.job_required_skills && job.job_required_skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.job_required_skills.slice(0, 5).map((skill, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs"
                            data-testid={`badge-skill-${job.job_id}-${idx}`}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    asChild
                    className="flex-1"
                    data-testid={`button-apply-${job.job_id}`}
                  >
                    <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && internships.length > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Showing {internships.length} internship{internships.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
