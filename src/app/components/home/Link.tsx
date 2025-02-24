'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';

// Animation variants
const slide = {
  initial: {
    x: -20,
    opacity: 0
  },
  enter: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.1 * i
    }
  }),
  exit: {
    x: -20,
    opacity: 0
  }
};

const scale = {
  open: {
    scale: 1,
    transition: {
      duration: 0.3
    }
  },
  closed: {
    scale: 0,
    transition: {
      duration: 0.3
    }
  }
};

interface LinkProps {
  data: {
    title: string;
    href: string;
    index: number;
  };
  isActive: boolean;
  setSelectedIndicator: (href: string) => void,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
}

export default function CustomLink({ data, isActive, setSelectedIndicator, setIsOpen }: LinkProps) {
  const { title, href, index } = data;

  return (
    <motion.div 
      className="relative flex items-center"
      onMouseEnter={() => {setSelectedIndicator(href)}} 
      custom={index} 
      variants={slide} 
      initial="initial" 
      animate="enter" 
      exit="exit"
    >
      <motion.div 
        variants={scale} 
        animate={isActive ? "open" : "closed"} 
        className="w-[10px] h-[10px] bg-white rounded-full absolute -left-[30px]"
      >
      </motion.div>
      <Link href={href} className="text-white hover:text-gray-300 transition-colors" onClick={() => setIsOpen((prev: boolean) => !prev)}>
        {title}
      </Link>
    </motion.div>
  )
}