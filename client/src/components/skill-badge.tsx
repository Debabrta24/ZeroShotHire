import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface SkillBadgeProps {
  skill: string;
  variant?: "default" | "secondary" | "outline" | "success";
  isUserSkill?: boolean;
  className?: string;
}

export function SkillBadge({
  skill,
  variant = "secondary",
  isUserSkill = false,
  className = "",
}: SkillBadgeProps) {
  return (
    <Badge
      variant={isUserSkill ? "default" : variant}
      className={`gap-1 ${
        isUserSkill ? "bg-success hover:bg-success text-white" : ""
      } ${className}`}
      data-testid={`badge-skill-${skill.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {isUserSkill && <CheckCircle2 className="h-3 w-3" />}
      {skill}
    </Badge>
  );
}
