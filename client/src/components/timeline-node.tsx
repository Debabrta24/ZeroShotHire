import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";

interface TimelineNodeProps {
  isCompleted: boolean;
  isCurrent: boolean;
  title: string;
  description?: string;
  index: number;
  isLast?: boolean;
}

export function TimelineNode({
  isCompleted,
  isCurrent,
  title,
  description,
  index,
  isLast = false,
}: TimelineNodeProps) {
  return (
    <div className="relative flex gap-4" data-testid={`timeline-node-${index}`}>
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-4 top-8 w-0.5 h-full bg-border">
          {isCompleted && (
            <motion.div
              className="w-full bg-primary"
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            />
          )}
        </div>
      )}

      {/* Node Circle */}
      <div className="relative z-10 flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring" }}
          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            isCompleted
              ? "bg-primary border-primary text-primary-foreground"
              : isCurrent
              ? "bg-background border-primary"
              : "bg-background border-border"
          }`}
        >
          {isCompleted ? (
            <Check className="h-4 w-4" />
          ) : (
            <Circle
              className={`h-3 w-3 ${
                isCurrent ? "fill-primary text-primary" : "text-muted-foreground"
              }`}
            />
          )}
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 + 0.2 }}
        className="flex-1 pb-8"
      >
        <h3
          className={`font-semibold ${
            isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </motion.div>
    </div>
  );
}
