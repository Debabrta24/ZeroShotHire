import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  suffix?: string;
  prefix?: string;
  iconColor?: string;
  index?: number;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  suffix = "",
  prefix = "",
  iconColor = "text-primary",
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Card className="hover-elevate overflow-visible">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </p>
              <div className="text-3xl font-bold font-mono">
                <AnimatedCounter
                  value={value}
                  prefix={prefix}
                  suffix={suffix}
                />
              </div>
              {trend && (
                <p
                  className={`text-sm mt-2 ${
                    trend.isPositive ? "text-success" : "text-destructive"
                  }`}
                >
                  {trend.isPositive ? "+" : "-"}
                  {Math.abs(trend.value)}% from last week
                </p>
              )}
            </div>
            <div
              className={`p-3 rounded-lg bg-muted ${iconColor}`}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
