'use client'
import { motion } from 'framer-motion'
import React from 'react'
import Image from 'next/image'
import heroImage from "../../../../public/img/blustyles_cut_01.jpg"

const Hero = () => {
  return (
    <section className='w-full min-h-[350px] md:min-h-[600px] relative flex-col justify-center items-center'>
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 -top-32">
        <Image
          src={heroImage}
          alt="Hero background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        {/* Optional Overlay */}
        <div className="hero-image-overlay" /> {/* Adjust opacity as needed */}
      </div>

      <div className='container mx-auto mt-12'>
        <div className="flex flex-col justify-center items-center gap-2 text-center">
          <h1 className="text-5xl  sm:text-8xl md:text-[96px] font-normal text-[var(--accent)] font-[Splash] w-64 sm:w-96">BluStyles Barbershop</h1>
          <p className="text-md  sm:text-lg md:text-xl text-gray-300 mt-2 font-[Aboreto] font-medium  w-52 md:w-[247.15px]">
            &ldquo;We want you to leave better than you came!&rdquo;
          </p>
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
          >
            <span className="text-[var(--accent)] tracking-wide font-light h-full w-full block relative linear-mask text-2xl">
              Book Now
            </span>
            <span className="block absolute inset-0 rounded-md p-px linear-overlay opacity-50" />
          </motion.button>

          {/* <motion.button
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
            className="relative px-4 py-5 rounded-md backdrop-blur-[0.775rem] 
                       bg-[var(--primary-transparent)] border border-[var(--accent)] w-[210px] mt-7
                        text-2xl leading-6 tracking-normal 
                       transition-all duration-300 hover:border-[var(--accent)]
                       hover:bg-[--background-color--background-secondary]"
          >
            <span className="text-[var(--accent)] tracking-normal w-full block relative linear-mask">
              Browse Our Services
            </span>
            <span className="block absolute inset-0 rounded-md p-px linear-overlay opacity-50" />
          </motion.button> */}
        </div>
      </div>
    </section >
  )
}

export default Hero
