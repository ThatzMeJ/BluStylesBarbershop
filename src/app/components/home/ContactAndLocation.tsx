import React from 'react'
import backgroundImg from '../../../../public/img/blustyles_cuttype_02.jpg'
import Image from 'next/image'
import { faPhoneVolume } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const BackgroundImage: React.FC = () => (
  <>
    <Image
      src={backgroundImg}
      alt='Background Image'
      width={1920}
      height={1080}
      className='absolute top-0 left-0 w-full h-full object-cover -z-50'
    />
    <div className='absolute service-overlay ' />
  </>
)


const ContactAndLocation = () => {
  return (
    <section className='w-full min-h-[40rem] flex flex-col items-start justify-start relative px-5 py-10'>
      <BackgroundImage />

      <div className='w-full h-full flex flex-col items-center justify-center z-50'>
        <div className='w-full h-1/2 flex flex-col items-start justify-center gap-4'>
          <h1 className='text-2xl font-bold uppercase'>Why We Stand Out</h1>
          <p className='text-base text-white '>Discover why BluStyles stands out. We provide personalized, luxury grooming with expert barbers, premium products, and unmatched convenience from the comfort of your home.</p>
        </div>

        <div className='flex items-center gap-4 w-full'>
              <div className='flex-shrink-0 w-16 h-16 border border-[var(--border-light)] rounded-lg flex justify-center items-center bg-[var(--bg-light)]'>
                <FontAwesomeIcon icon={faPhoneVolume} className='text-[var(--icon-color)] text-2xl' />
              </div>
              <div className='flex flex-col items-start gap-1 flex-1 '>
                <h4 className='text-[var(--primary)] font-semibold  text-2xl md:text-3xl uppercase'>PHONE</h4>
                <p className='text-[var(--text-body)] text-base md:text-xl'>(417) 555-1234 <br />&nbsp;</p>
              </div>
            </div>
      </div>


    </section>
  )
}

export default ContactAndLocation
