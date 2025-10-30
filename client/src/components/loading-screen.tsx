import { motion } from "framer-motion";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-green-50 to-green-100 dark:from-[#0a1f0a] dark:via-[#0d1a0d] dark:to-[#000000] flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-8"
      >
        {/* Main Logo with Glow Effect */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex items-center gap-3 relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <Lightbulb className="h-14 w-14 text-primary dark:text-white relative z-10" />
          <h1 className="text-5xl font-heading font-bold text-foreground dark:text-white relative z-10">ZeroShotHire</h1>
        </motion.div>

        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-white/10 backdrop-blur-sm border border-primary/30 dark:border-white/20"
        >
          <Sparkles className="h-4 w-4 text-primary dark:text-primary" />
          <span className="text-sm font-medium text-foreground dark:text-white">Powered by AI</span>
        </motion.div>

        {/* Loading Text with Spinner */}
        <div className="flex items-center gap-3 text-muted-foreground dark:text-white/80">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-base">Loading your career journey...</p>
        </div>

        {/* Animated Dots */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
