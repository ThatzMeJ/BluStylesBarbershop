'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import React from 'react'

const HeroButton = () => {  
  const router = useRouter()

  return (
    <motion.button
            initial={{ "--x": "100%", scale: 1 }}
            animate={{ "--x": "-100%" }}
            whileTap={{ scale: 0.97 }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 1,
              type: "spring",
              stiffness: 20,
              damping: 15,
              mass: 2,
              scale: {
                type: "spring",
                stiffness: 10,
                damping: 5,
                mass: 0.1,
              },
            }}
            className="px-6 py-4 rounded-md relative bg-[var(--primary)] hover:bg-[var(--primary-light)] border-[var(--accent)] border w-[210px] mt-7 transition-colors duration-300"
            onClick={() => router.push('/booking')}
          >
            <span className="text-[var(--accent)] tracking-wide font-light h-full w-full block relative linear-mask text-2xl">
              Book Now
            </span>
            <span className="block absolute inset-0 rounded-md p-px linear-overlay opacity-50" />
          </motion.button>
  )
}

export default HeroButton