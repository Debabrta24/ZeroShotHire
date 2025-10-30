import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-white via-green-50 to-green-100 dark:from-[#0a1f0a] dark:via-[#0d1a0d] dark:to-[#000000]">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary dark:text-white" />
            <span className="text-xl font-heading font-bold text-foreground dark:text-white">ZeroShotHire</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-sign-in"
              className="text-foreground dark:text-white hover:text-foreground/80 dark:hover:text-white/80"
            >
              Sign In
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-white/10 backdrop-blur-sm border border-primary/30 dark:border-white/20"
            >
              <Sparkles className="h-4 w-4 text-primary dark:text-white" />
              <span className="text-sm font-medium text-foreground dark:text-white">Powered by Advanced AI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight text-foreground dark:text-white"
            >
              Find Your Perfect Career with AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground dark:text-white/80 max-w-2xl mx-auto px-4"
            >
              Personalized guidance powered by intelligent analysis. Discover your ideal
              career path, bridge skill gaps, and achieve your professional dreams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 gap-2 bg-primary hover:bg-primary/90 text-white min-w-[200px]"
                onClick={() => setLocation("/auth")}
                data-testid="button-start-analysis"
              >
                Start Career Analysis
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-8 bg-primary/5 dark:bg-white/10 backdrop-blur-sm border-primary dark:border-white/30 min-w-[200px]"
                onClick={() => setLocation("/dashboard")}
                data-testid="button-view-demo"
              >
                View Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 pt-12"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold font-mono text-primary dark:text-white">10,000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground dark:text-white/70 mt-1">Students Guided</div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-border dark:bg-white/20" />
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold font-mono text-primary dark:text-white">95%</div>
                <div className="text-xs sm:text-sm text-muted-foreground dark:text-white/70 mt-1">Success Rate</div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-border dark:bg-white/20" />
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold font-mono text-primary dark:text-white">500+</div>
                <div className="text-xs sm:text-sm text-muted-foreground dark:text-white/70 mt-1">Career Paths</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
