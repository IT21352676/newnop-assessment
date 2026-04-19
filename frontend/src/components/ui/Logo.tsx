import { motion, AnimatePresence } from "motion/react";
import { Bug, BugPlay, BugOff } from "lucide-react";
import { useState, useEffect } from "react";

const Logo = ({ className = "w-5 h-5" }: { className?: string }) => {
  const icons = [Bug, BugPlay, BugOff];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = icons[index];

  return (
    <div className="relative overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="flex items-center justify-center"
        >
          <ActiveIcon className={`${className} text-white`} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Logo;
