import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-2 mb-4">
      {/* Bot Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-secondary to-green-400 flex items-center justify-center shadow-md">
        <span className="text-white text-xs font-bold">AI</span>
      </div>

      {/* Typing Bubble */}
      <div className="bg-secondary/10 dark:bg-secondary/20 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-secondary rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;