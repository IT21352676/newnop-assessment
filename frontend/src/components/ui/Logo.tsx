import { motion, AnimatePresence } from "motion/react";
import type { Transition } from "motion/react";
import { Bug, BugPlay, BugOff } from "lucide-react";
import { useState, useEffect } from "react";
import { IconCircleDashedCheck, IconSearch } from "@tabler/icons-react";

const icons: {
  Icon: React.ElementType;
  color: string;
  animate: Record<string, number[]>;
  transition: Transition;
}[] = [
  {
    Icon: IconSearch,
    color: "text-blue-500",
    animate: { scale: [1, 1.15, 1] },
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
  },
  {
    Icon: Bug,
    color: "text-red-500",
    animate: { x: [0, -3, 3, -2, 2, 0], rotate: [0, -5, 5, -3, 3, 0] },
    transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
  },
  {
    Icon: BugPlay,
    color: "text-amber-500",
    animate: { y: [0, -6, -2, 0] },
    transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
  },
  {
    Icon: BugOff,
    color: "text-indigo-500",
    animate: { scale: [1, 1.1, 0.6, 1], opacity: [1, 1, 0.2, 1] },
    transition: { duration: 1.0, repeat: Infinity, ease: "easeInOut" },
  },
  {
    Icon: IconCircleDashedCheck,
    color: "text-emerald-500",
    animate: { scale: [1, 1.35, 0.9, 1.2, 1] },
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatDelay: 1.2,
      ease: "easeOut",
    },
  },
];

const Logo = ({
  className = "w-5 h-5",
  isColors = true,
  isAnimated = true,
}: {
  className?: string;
  isColors?: boolean;
  isAnimated?: boolean;
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const { Icon, color, animate, transition } = icons[index];

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
          <motion.div
            animate={isAnimated && animate}
            transition={isAnimated && transition}
          >
            <Icon className={`${className} ${isColors && color}`} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Logo;
