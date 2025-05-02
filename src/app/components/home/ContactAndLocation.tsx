import React from 'react'
import backgroundImg from '../../../../public/img/blustyles_cuttype_02.jpg'
import Image from 'next/image'
import { faEnvelope, faPhoneVolume } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const BackgroundImage: React.FC = () => (
  <>
    <Image
      src={backgroundImg}
      alt='Background Image'
      width={1920}
      height={1080}
      className='absolute top-0 left-0 w-full h-full object-cover z-1'
    />
    <div className='absolute service-overlay ' />
  </>
)


const ContactAndLocation = () => {
  return (
    <section className='w-full min-h-[40rem] flex flex-col items-start justify-start relative px-5 py-10'>
      <BackgroundImage />

      <div className='w-full h-full flex flex-col items-center justify-center z-20 gap-10'>
        <div className='w-full h-1/2 flex flex-col items-start justify-center gap-4'>
          <h1 className='text-2xl font-bold uppercase'>Why We Stand Out</h1>
          <p className='text-base text-white '>Discover why BluStyles stands out. We provide personalized, luxury grooming with expert barbers, premium products, and unmatched convenience from the comfort of your home.</p>
        </div>
        {/* phone */}
        <div className='flex flex-row items-center gap-10 w-full text-white'>
          <div className='flex-shrink-0 w-16 h-16 border border-[var(--border-light)] rounded-lg flex justify-center items-center bg-[var(--bg-light)]'>
            <FontAwesomeIcon icon={faPhoneVolume} className='text-[var(--icon-color)] text-2xl' />
          </div>
          <div className='flex flex-col items-start justify-center gap-1 flex-1 '>
            <h4 className='text-sm md:text-3xl uppercase'>Give us a Call</h4>
            <p className=' text-lg font-semibold  md:text-xl'>(417) 555-1234</p>
          </div>
        </div>

        {/* email */}
        <div className='flex flex-row items-center gap-10 w-full text-white'>
          <div className='flex-shrink-0 w-16 h-16 border border-[var(--border-light)] rounded-lg flex justify-center items-center bg-[var(--bg-light)]'>
            <FontAwesomeIcon icon={faEnvelope} className='text-[var(--icon-color)] text-2xl' />
          </div>
          <div className='flex flex-col items-start justify-center gap-1 flex-1 '>
            <h4 className='  text-sm md:text-3xl uppercase'>Send us an email</h4>
            <p className=' text-lg font-semibold md:text-xl'>blustyles@gmail.com</p>
          </div>
        </div>


        <div className='w-full max-w-[642px] bg-white rounded-lg '>

        </div>
      </div>


    </section>
  )
}

export default ContactAndLocation
