import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const ScrollIndicator = ({
  direction,
  visible,
}: {
  direction: "left" | "right";
  visible: boolean;
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: direction === "left" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === "left" ? -20 : 20 }}
          className={`absolute ${direction === "left" ? "left-0" : "right-0"} top-0 bottom-0 w-24 z-20 pointer-events-none flex items-center ${direction === "left" ? "justify-start pl-4" : "justify-end pr-4"} bg-gradient-to-${direction === "left" ? "r" : "l"} from-bg-deep via-bg-deep/40 to-transparent`}
        >
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
            {direction === "left" ? (
              <ChevronLeft className="w-6 h-6 text-accent animate-[pulse_2s_infinite]" />
            ) : (
              <ChevronRight className="w-6 h-6 text-accent animate-[pulse_2s_infinite]" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollIndicator;
