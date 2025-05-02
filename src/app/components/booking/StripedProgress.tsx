import React from 'react';
import { motion } from 'framer-motion';

interface StripedProgressProps {
  progress: number; // 0-100
}

const StripedProgress: React.FC<StripedProgressProps> = ({ progress }) => {
  return (
    <div className="h-4 w-full rounded-full overflow-hidden bg-gray-900 relative">
      {/* Background container with darker shade */}
      <div className="absolute inset-0 bg-gray-800 rounded-full"></div>

      {/* Animated striped progress bar */}
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
        className="h-full rounded-full relative overflow-hidden"
        style={{
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3) inset',
        }}
      >
        {/* Barber pole stripes */}
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(45deg, #e63946, #e63946 10px, #ffffff 10px, #ffffff 20px, #0a66c2 20px, #0a66c2 30px)',
            backgroundSize: '42.43px 42.43px', // 30px * sqrt(2) to make diagonal stripes the right width
            animation: 'barberpole 1s linear infinite',
          }}
        />

        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
      </motion.div>

      <style jsx global>{`
        @keyframes barberpole {
          from { background-position: 0 0; }
          to { background-position: 42.43px 0; }
        }
      `}</style>
    </div>
  );
};

export default StripedProgress; 