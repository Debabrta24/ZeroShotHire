import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, ChevronRight } from "lucide-react";
import { ProgressRing } from "./progress-ring";
import type { CareerRecommendation } from "@shared/schema";

interface CareerCardProps {
  career: CareerRecommendation;
  onViewDetails?: () => void;
  index?: number;
}

export function CareerCard({ career, onViewDetails, index = 0 }: CareerCardProps) {
  const growthColors = {
    High: "bg-success text-white",
    Medium: "bg-warning text-white",
    Low: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      data-testid={`card-career-${career.id}`}
    >
      <Card className="h-full hover-elevate border-card-border overflow-visible">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-heading mb-2">
                {career.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {career.description}
              </p>
            </div>
            <ProgressRing
              progress={career.matchPercentage}
              size={80}
              strokeWidth={6}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={growthColors[career.growthPotential]}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {career.growthPotential} Growth
            </Badge>
            <Badge variant="outline" className="gap-1">
              <DollarSign className="h-3 w-3" />
              ${career.salaryRange.min}k - ${career.salaryRange.max}k
            </Badge>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-2">Key Metrics</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-md bg-muted">
                <div className="text-lg font-bold font-mono">{career.industryDemand}%</div>
                <div className="text-xs text-muted-foreground">Demand</div>
              </div>
              <div className="p-2 rounded-md bg-muted">
                <div className="text-lg font-bold font-mono">{career.workLifeBalance}%</div>
                <div className="text-xs text-muted-foreground">Balance</div>
              </div>
              <div className="p-2 rounded-md bg-muted">
                <div className="text-lg font-bold font-mono">{career.remoteOpportunities}%</div>
                <div className="text-xs text-muted-foreground">Remote</div>
              </div>
            </div>
          </div>

          <Button
            className="w-full gap-2"
            onClick={onViewDetails}
            data-testid={`button-view-career-${career.id}`}
          >
            View Full Career Path
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
