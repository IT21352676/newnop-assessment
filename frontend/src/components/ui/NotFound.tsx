import { ArrowUp, BugOff } from "lucide-react";
import { motion } from "motion/react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
          <BugOff className="text-red-500 w-12 h-12" />
        </div>
        <h1 className="text-6xl font-black text-ink-primary tracking-tighter mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-ink-primary mb-4 tracking-tight">
          Signal Interrupted
        </h2>
        <p className="text-ink-secondary mb-8 leading-relaxed">
          The requested terminal coordinate does not exist in the current system
          mapping. Telemetry indicates a dead end.
        </p>
        <button
          onClick={() => (window.location.hash = "")}
          className="btn-primary px-8 py-3 text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2"
        >
          <ArrowUp className="w-4 h-4" /> Re-initialize
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
