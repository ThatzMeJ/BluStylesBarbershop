import React from 'react'
import HeroContent from './HeroContent'
import IntroSection from './IntroSection'
const Introduction = () => {
  return (
    <section className='w-full min-h-[650px] relative flex flex-col justify-between items-center bg-[#051926] pt-10 px-6 ' >
      <HeroContent />
      <IntroSection />
    </section>
  )
}

export default Introduction
