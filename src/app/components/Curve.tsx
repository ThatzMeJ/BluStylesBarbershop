'use client';

import React from 'react';
import { motion } from 'framer-motion';
import useWindowDimensions from '../hooks/WindowDimensions'

export default function Curve() {
  // Use the custom hook instead of directly accessing window
  const { height } = useWindowDimensions();

  const initialPath = `M100 0 L100 ${height} Q-100 ${height / 2} 100 0`;
  const targetPath = `M100 0 L100 ${height} Q100 ${height / 2} 100 0`;

  const curve = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  return (
    <svg className="absolute top-0 -left-[99px] w-[100px] h-full fill-[var(--primary)] stroke-none">
      <motion.path variants={curve} initial="initial" animate="enter" exit="exit" />
    </svg>
  );
}
