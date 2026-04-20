import { motion } from "motion/react";

const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-primary mb-6">Welcome back</h2>
        <p className="text-secondary text-lg leading-relaxed mb-8">
          You are now in the debug environment. Start monitoring issues and
          manage deployments.
        </p>
      </div>
    </motion.div>
  );
};

export default Hero;
