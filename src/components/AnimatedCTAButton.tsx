'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface AnimatedCTAButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export default function AnimatedCTAButton({ text, onClick, className = "", disabled = false }: AnimatedCTAButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`
        relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 
        text-white font-bold text-lg rounded-lg shadow-lg 
        transform transition-all duration-300 overflow-hidden
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:scale-105'}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: [0, -10, 0],
        x: [0, 5, -5, 0],
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        },
        x: {
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0"
        animate={{
          opacity: isHovered ? 0.3 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Pulsing ring effect */}
      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-white"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Button text */}
      <motion.span
        className="relative z-10 flex items-center justify-center"
        animate={{
          textShadow: isHovered 
            ? "0 0 20px rgba(255,255,255,0.8)" 
            : "0 0 0px rgba(255,255,255,0)"
        }}
        transition={{ duration: 0.3 }}
      >
        {text}
        <motion.span
          className="ml-2 inline-block"
          animate={{
            x: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          →
        </motion.span>
      </motion.span>
      
      {/* Hover shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{
          x: isHovered ? "100%" : "-100%",
          opacity: isHovered ? 0.3 : 0,
        }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}