'use client'

import React from 'react'
import useDimensions from 'react-cool-dimensions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPhoneVolume, faClock } from '@fortawesome/free-solid-svg-icons'

const HeroContent = () => {
  const { observe, width } = useDimensions();

  // Calculate positioning class based on screen width
  const getPositionClass = () => {
    if (width < 768) { // mobile and small tablets
      return 'relative py-6';
    }
    // For screens >= 768px (md breakpoint)
    return 'absolute left-1/2 -translate-x-1/2 -top-20 py-8';
  };

  return (
    <div ref={observe} className='container md:px-10 max-w-[75rem] '>
      <div className={`${getPositionClass()} z-30 px-6 py-8 lg:py-16 bg-white rounded-[1.875rem] shadow-[0_4px_1.875rem_#0000000d] w-full max-w-7xl`}>
        {/* Horizontal layout for desktop */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full items-center justify-items-center'>

          {/* Address Section */}
          <div className='flex items-start  gap-4 max-w-[350px] w-full'>
            <div className='flex items-center gap-4 w-full'>
              <div className='flex-shrink-0 w-16 h-16 border border-[var(--border-light)] rounded-lg flex justify-center items-center bg-[var(--bg-light)]'>
                <FontAwesomeIcon icon={faLocationDot} className='text-[var(--icon-color)] text-2xl' />
              </div>
              <div className='flex flex-col gap-1 flex-1'>
                <h4 className='text-[var(--primary)] font-semibold text-2xl md:text-3xl uppercase'>ADDRESS</h4>
                <p className='text-[var(--text-body)] text-base md:text-xl max-w-56'>223 E COMMERCIAL ST, SPRINGFIELD, MO, MISSOURI</p>
              </div>
            </div>
          </div>

          {/* Phone Section */}
          <div className='flex items-start gap-4 max-w-[350px] w-full'>
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

          {/* Hours Section */}
          <div className='flex items-start gap-4 max-w-[350px] w-full'>
            <div className='flex items-center gap-4 w-full'>
              <div className='flex-shrink-0 w-16 h-16 border border-[var(--border-light)] rounded-lg flex justify-center items-center bg-[var(--bg-light)]'>
                <FontAwesomeIcon icon={faClock} className='text-[var(--icon-color)] text-2xl' />
              </div>
              <div className='flex flex-col gap-1 flex-1'>
                <h4 className='text-[var(--primary)] font-semibold text-2xl md:text-3xl  uppercase'>HOURS</h4>
                <p className='text-[var(--text-body)] text-base md:text-xl'>Mon-Fri: 9AM-5PM<br />Sat: 10AM-2PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;