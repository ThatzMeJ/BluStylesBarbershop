'use client'

import React, { forwardRef } from 'react'
import Image from 'next/image'
import useDimensions from 'react-cool-dimensions';

interface ServiceCardProps {
  imageUrl: string
  title: string
  description: string,
  className?: string
}

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ imageUrl, title, description, className = '' }, ref) => (
    <div className={`flex flex-col items-center justify-center w-full sm:max-w-md ${className}`} ref={ref}>
      <Image
        src={imageUrl}
        alt={title}
        width={64}
        height={64}
        className='mb-4 '
      />
      <h3 className='text-2xl xl:text-3xl  font-bold text-white mb-3'>
        {title}
      </h3>
      <p className='text-white text-base sm:text-lg lg:text-xl xl:text-2xl xl:text-left text-center'>
        {description}
      </p>

      <button className='bg-[#BAD1FF] text-black rounded-lg mt-4 text-sm uppercase py-5 px-10 tracking-tighter font-semibold loading-[1em]'>
        View Pricing
      </button>
    </div>
  )
)

ServiceCard.displayName = 'ServiceCard'

const BackgroundVideo: React.FC = () => (
  <>
    <video
      src='/video/ServiceVideo.mp4'
      autoPlay
      muted
      loop
      className='absolute top-0 left-0 w-full h-full object-cover z-1'
    />
    <div className='absolute hero-image-overlay' />
  </>
)

const ServiceSection: React.FC = () => {
  const { observe } = useDimensions();

  return (
    <section className='w-full min-h-[40rem] relative '>
      <BackgroundVideo />

      <div className='w-full py-28 px-5 relative z-10 '>
        <h1 className='text-7xl font-bold text-white mb-10'>
          Services.
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 place-items-center '>
          <ServiceCard
            imageUrl="https://cdn.prod.website-files.com/677c2320fa064fa6827d5fec/677e956f03bbb028e9d12a90_Layer_1.svg"
            title="Precision Haircuts"
            description="Discover your signature look with our expert-crafted haircut styles, tailored to match your personality and preferences"
          />

          <ServiceCard
            imageUrl="https://cdn.prod.website-files.com/677c2320fa064fa6827d5fec/677e95a9643d77c651bbdcee_Frame.svg"
            title="Expert Shaves"
            description="Discover your signature look with our expert-crafted haircut styles, tailored to match your personality and preferences"
          />

          <ServiceCard
            ref={observe}
            imageUrl="https://cdn.prod.website-files.com/677c2320fa064fa6827d5fec/677e95c99a3af1b5e26d6c99_Layer_1v.svg"
            title="Beard Grooming"
            description="Sculpt and maintain your beard with expert trimming, shaping, and grooming to complement your style."
            className="md:col-span-2 xl:col-span-1"
          />
        </div>
      </div>
    </section>
  )
}

export default ServiceSection
