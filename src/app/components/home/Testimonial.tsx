'use client'

import React from 'react';
import ReviewCard from './ReviewCard';
import useWindowDimensions from '../../hooks/WindowDimensions';

const Testimonial = () => {
  const { width } = useWindowDimensions();

  const getNumberOfCards = () => {
    if (width < 768) { // Mobile
      return 1;
    } else if (width < 1024) { // Tablet
      return 2;
    } else if (width < 1280) { // Desktop
      return 3;
    } else {
      return 4;
    }
  };

  const renderReviewCards = () => {
    const cards = [];
    const numberOfCards = getNumberOfCards();

    for (let i = 0; i < numberOfCards; i++) {
      cards.push(<ReviewCard key={i} />);
    }

    return cards;
  };

  return (
    <section className='bg-[var(--primary)] min-h-[40rem] relative py-10'>
      <div className='absolute inset-0 hero-image-overlay z-20' />

      <div className='flex flex-col items-center justify-center w-full h-full z-30 relative text-[var(--primary-light)] text-center mb-10 gap-y-4'>
        <p className='uppercase text-white text-md font-medium'>
          Testimonial
        </p>
        <h2 className='text-5xl font-extrabold text-white'>People Say<br />
          About Our Barber</h2>
      </div>

      <div className='flex flex-row items-center justify-center w-full h-[550px] rounded-lg mx-auto overflow-hidden relative p-10 gap-x-10 '>
        {renderReviewCards()}
      </div>
    </section>
  );
};

export default Testimonial;
