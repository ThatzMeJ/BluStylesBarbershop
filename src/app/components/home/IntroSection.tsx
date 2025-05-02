'use client'

import React from 'react'
import useDimensions from 'react-cool-dimensions';
import Image from 'next/image';
import introImage from '../../../../public/img/blustyles_cut_02.jpg'
import introImage2 from '../../../../public/img/blustyles_cuttype_01.jpg'



const IntroSection = () => {
  const { width, observe } = useDimensions();

  const getContainerClass = () => {
    if (width < 768) { // mobile
      return 'mt-20';
    } else if (width < 1020 && width >= 768) { // tablet
      return 'mt-32';
    } else {
      return 'mt-40';
    }
  };

  const getMarginLeft = () => {
    if (width > 1024) { // tablet
      return 'ml-[35rem]';
    }
  };

  return (
    <section ref={observe} className={`container min-h-[45rem] bg-[#051926] ${getContainerClass()}`}>
      <div className='flex flex-col h-[600px] md:grid md:grid-cols-2 xl:flex items-center justify-center gap-6 lg:relative'>
        <div
          className={`min-h-[350px] sm:max-h-[600px] h-full w-full sm:max-w-[700px] md:col-start-2 md:row-start-1 ${getMarginLeft()} ${width < 1258 ? 'zoom-wrapper' : ''}`}

        >
          <Image
            src={introImage}
            alt='intro image'
            className='object-cover rounded-lg w-full h-full'
          />
        </div>

        <div className="xl:bg-[#1A2937]/75 lg:pt-6 md:col-start-1 self-start max-w-[550px] w-full lg:pr-2 xl:absolute xl:top-32 xl:left-72">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase leading-none tracking-tight">
            A SMOOTH BARBER EXPERIENCE IN YOUR TOWN
          </h1>
          <p className="text-gray-400 mt-2 text-lg md:text-2xl leading-relaxed max-w-xl w-full">
            At BluStyles, we&apos;re more than just haircuts – we&apos;re about connection, conversation, and confidence. Located in the heart of Springfield, our mission is to provide a relaxed space where you can unwind, chat, and walk out looking your absolute best.
          </p>

          <div className="flex gap-4 sm:gap-8 w-full max-w-2xl mt-5">
            {/* Stats Card 1 */}
            <div className='flex flex-col gap-1 bg-[#BAD1FF] text-black p-4 rounded-lg'>
              <p className='text-2xl md:text-3xl font-bold'>98%</p>
              <p className='text-base sm:text-lg uppercase leading-tight max-w-36 w-full'>
                Client Satisfaction
              </p>
            </div>

            {/* Stats Card 2 */}
            <div className='flex flex-col gap-1 bg-[#BAD1FF] text-black p-4 rounded-lg'>
              <p className='text-2xl md:text-3xl font-bold'>12+</p>
              <p className='text-base sm:text-lg uppercase leading-tight'>
                Years of Expertise
              </p>
            </div>
          </div>
        </div>

        <div className={`absolute top-[22rem] right-24 w-64 h-80 border-dashed border-2 border-[#5EB1FA] p-2 ${width < 1400 ? 'hidden' : 'block'}`}>
          <Image
            src={introImage2}
            alt='intro image'
            className='object-cover rounded-lg w-full h-full'
          />
        </div>
      </div>
    </section>
  )
}

export default IntroSection
