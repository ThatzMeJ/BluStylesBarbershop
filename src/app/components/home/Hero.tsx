'use client'
import React from 'react'
import Image from 'next/image'
import heroImage from "../../../../public/img/blustyles_cut_01.jpg"
import HeroButton from './HeroButton'

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
          <HeroButton />
        </div>
      </div>
    </section >
  )
}

export default Hero
