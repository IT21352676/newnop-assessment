import { Bot } from "lucide-react";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="sm:max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-4xl font-bold text-primary mb-6">
          Welcome back
        </h2>
        <span className="flex items-center gap-2 justify-center">
          <p className="text-secondary text-sm sm:text-lg leading-relaxed">
            You are now in the debug environment. Start monitoring issues, get
            AI{" "}
          </p>
          <Bot className="w-6 h-6 text-accent/80 animate-bounce" />
        </span>
        <p className="text-secondary text-sm sm:text-lg leading-relaxed">
          suggestions, manage deployments and so much more.
        </p>
      </div>
    </motion.div>
  );
};

export default Hero;
