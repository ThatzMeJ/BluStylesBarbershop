'use client'

import React from 'react'
import { motion } from 'framer-motion';

export default function Curve() {
  // Make sure we're on the client side before accessing window
  const initialPath = typeof window !== 'undefined'
    ? `M100 0 L100 ${window.innerHeight} Q-100 ${window.innerHeight / 2} 100 0`
    : '';
  const targetPath = typeof window !== 'undefined'
    ? `M100 0 L100 ${window.innerHeight} Q100 ${window.innerHeight / 2} 100 0`
    : '';

  const curve = {
    initial: {
      d: initialPath
    },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  }

  return (
    <svg className="absolute top-0 -left-[99px] w-[100px] h-full fill-[var(--primary)] stroke-none">
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  )
}