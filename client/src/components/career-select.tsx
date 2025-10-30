import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const CAREER_OPTIONS = [
  { value: "software-engineer", label: "Software Engineer" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "product-manager", label: "Product Manager" },
  { value: "ux-designer", label: "UX Designer" },
  { value: "ui-designer", label: "UI Designer" },
  { value: "devops-engineer", label: "DevOps Engineer" },
  { value: "frontend-developer", label: "Frontend Developer" },
  { value: "backend-developer", label: "Backend Developer" },
  { value: "full-stack-developer", label: "Full Stack Developer" },
  { value: "mobile-developer", label: "Mobile Developer" },
  { value: "ios-developer", label: "iOS Developer" },
  { value: "android-developer", label: "Android Developer" },
  { value: "machine-learning-engineer", label: "Machine Learning Engineer" },
  { value: "ai-engineer", label: "AI Engineer" },
  { value: "data-engineer", label: "Data Engineer" },
  { value: "data-analyst", label: "Data Analyst" },
  { value: "business-analyst", label: "Business Analyst" },
  { value: "qa-engineer", label: "QA Engineer" },
  { value: "security-engineer", label: "Security Engineer" },
  { value: "cloud-architect", label: "Cloud Architect" },
  { value: "solutions-architect", label: "Solutions Architect" },
  { value: "system-administrator", label: "System Administrator" },
  { value: "network-engineer", label: "Network Engineer" },
  { value: "database-administrator", label: "Database Administrator" },
  { value: "technical-writer", label: "Technical Writer" },
  { value: "scrum-master", label: "Scrum Master" },
  { value: "project-manager", label: "Project Manager" },
  { value: "engineering-manager", label: "Engineering Manager" },
  { value: "technical-lead", label: "Technical Lead" },
  { value: "cto", label: "Chief Technology Officer" },
  { value: "marketing-manager", label: "Marketing Manager" },
  { value: "digital-marketing-specialist", label: "Digital Marketing Specialist" },
  { value: "content-strategist", label: "Content Strategist" },
  { value: "seo-specialist", label: "SEO Specialist" },
  { value: "social-media-manager", label: "Social Media Manager" },
  { value: "graphic-designer", label: "Graphic Designer" },
  { value: "motion-designer", label: "Motion Designer" },
  { value: "3d-artist", label: "3D Artist" },
  { value: "game-developer", label: "Game Developer" },
  { value: "game-designer", label: "Game Designer" },
  { value: "financial-analyst", label: "Financial Analyst" },
  { value: "accountant", label: "Accountant" },
  { value: "investment-banker", label: "Investment Banker" },
  { value: "consultant", label: "Consultant" },
  { value: "hr-manager", label: "HR Manager" },
  { value: "recruiter", label: "Recruiter" },
  { value: "sales-manager", label: "Sales Manager" },
  { value: "account-executive", label: "Account Executive" },
  { value: "customer-success-manager", label: "Customer Success Manager" },
  { value: "support-engineer", label: "Support Engineer" },
  { value: "legal-counsel", label: "Legal Counsel" },
  { value: "operations-manager", label: "Operations Manager" },
  { value: "supply-chain-manager", label: "Supply Chain Manager" },
  { value: "logistics-coordinator", label: "Logistics Coordinator" },
  { value: "healthcare-administrator", label: "Healthcare Administrator" },
  { value: "nurse", label: "Nurse" },
  { value: "physician", label: "Physician" },
  { value: "pharmacist", label: "Pharmacist" },
  { value: "physical-therapist", label: "Physical Therapist" },
  { value: "teacher", label: "Teacher" },
  { value: "professor", label: "Professor" },
  { value: "instructional-designer", label: "Instructional Designer" },
  { value: "architect", label: "Architect" },
  { value: "civil-engineer", label: "Civil Engineer" },
  { value: "mechanical-engineer", label: "Mechanical Engineer" },
  { value: "electrical-engineer", label: "Electrical Engineer" },
  { value: "chemical-engineer", label: "Chemical Engineer" },
  { value: "biomedical-engineer", label: "Biomedical Engineer" },
  { value: "research-scientist", label: "Research Scientist" },
  { value: "lab-technician", label: "Lab Technician" },
  { value: "statistician", label: "Statistician" },
  { value: "actuary", label: "Actuary" },
  { value: "economist", label: "Economist" },
  { value: "urban-planner", label: "Urban Planner" },
  { value: "environmental-scientist", label: "Environmental Scientist" },
  { value: "geologist", label: "Geologist" },
  { value: "meteorologist", label: "Meteorologist" },
  { value: "astronomer", label: "Astronomer" },
  { value: "physicist", label: "Physicist" },
  { value: "chemist", label: "Chemist" },
  { value: "biologist", label: "Biologist" },
  { value: "psychologist", label: "Psychologist" },
  { value: "social-worker", label: "Social Worker" },
  { value: "counselor", label: "Counselor" },
  { value: "therapist", label: "Therapist" },
  { value: "journalist", label: "Journalist" },
  { value: "editor", label: "Editor" },
  { value: "photographer", label: "Photographer" },
  { value: "videographer", label: "Videographer" },
  { value: "video-editor", label: "Video Editor" },
  { value: "sound-engineer", label: "Sound Engineer" },
  { value: "music-producer", label: "Music Producer" },
  { value: "musician", label: "Musician" },
  { value: "artist", label: "Artist" },
  { value: "interior-designer", label: "Interior Designer" },
  { value: "fashion-designer", label: "Fashion Designer" },
  { value: "industrial-designer", label: "Industrial Designer" },
  { value: "chef", label: "Chef" },
  { value: "restaurant-manager", label: "Restaurant Manager" },
  { value: "hotel-manager", label: "Hotel Manager" },
  { value: "event-planner", label: "Event Planner" },
  { value: "real-estate-agent", label: "Real Estate Agent" },
  { value: "property-manager", label: "Property Manager" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "startup-founder", label: "Startup Founder" },
  { value: "business-development-manager", label: "Business Development Manager" },
  { value: "customer-service-representative", label: "Customer Service Representative" },
  { value: "administrative-assistant", label: "Administrative Assistant" },
  { value: "executive-assistant", label: "Executive Assistant" },
  { value: "paralegal", label: "Paralegal" },
  { value: "librarian", label: "Librarian" },
  { value: "pilot", label: "Pilot" },
  { value: "air-traffic-controller", label: "Air Traffic Controller" },
  { value: "flight-attendant", label: "Flight Attendant" },
  { value: "truck-driver", label: "Truck Driver" },
  { value: "mechanic", label: "Mechanic" },
  { value: "electrician", label: "Electrician" },
  { value: "plumber", label: "Plumber" },
  { value: "carpenter", label: "Carpenter" },
  { value: "welder", label: "Welder" },
  { value: "construction-manager", label: "Construction Manager" },
];

interface CareerSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  testId?: string;
}

export function CareerSelect({
  value,
  onValueChange,
  placeholder = "Select a career...",
  testId = "select-career",
}: CareerSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedCareer = CAREER_OPTIONS.find((career) => career.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          data-testid={testId}
        >
          {selectedCareer ? selectedCareer.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search careers..." data-testid={`${testId}-search`} />
          <CommandList>
            <CommandEmpty>No career found.</CommandEmpty>
            <CommandGroup>
              {CAREER_OPTIONS.map((career) => (
                <CommandItem
                  key={career.value}
                  value={career.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  data-testid={`${testId}-option-${career.value}`}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === career.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {career.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
