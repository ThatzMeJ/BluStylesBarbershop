'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import Image from 'next/image';
import FaQuoteLeft from '../../../../public/img/63515e0705695e64229e5eb7_quotes-fill.svg';
import useMeasure from 'react-use-measure';
import { userReviews1 } from '../../../../constant/userReviews';
import { Rating } from '@smastrom/react-rating'


const ReviewCard = () => {
  // This ref will now measure the entire list
  const [listRef] = useMeasure();

  // Ref for the duplicated list to calculate total height
  const [duplicateListRef, duplicateListBounds] = useMeasure();

  const yTranslation = useMotionValue(0);
  const allItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!duplicateListBounds.height) return;

    const totalHeight = -duplicateListBounds.height / 2; // Only scroll through one set

    const controls = animate(yTranslation, [0, totalHeight], {
      ease: 'linear',
      duration: 60, // Adjusted for smoother scrolling
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
    });

    return controls.stop;
  }, [yTranslation, duplicateListBounds.height]);

  return (
    <div className="overflow-hidden h-full">
      <motion.div
        className="flex flex-col items-center w-fit"
        ref={listRef}
        style={{
          y: yTranslation,
        }}
      >
        <div ref={duplicateListRef}>
          {[...userReviews1, ...userReviews1].map((item, index) => (
            <div
              ref={(el) => { allItemsRef.current[index] = el  }}
              key={`${item.name}-${index}`}
              className="bg-white flex-1 max-w-64 rounded-lg flex flex-col items-start justify-start my-2 text-black p-5 gap-4"
            >
              <Image src={FaQuoteLeft} alt="testimonial" width={25} height={25} />

              <p>{item.review}</p>

              <div className="flex items-center gap-2 w-full mt-auto">
                <Image
                  src={item.image}
                  alt="testimonial"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <Rating style={{ maxWidth: 80 }} value={5} readOnly />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewCard;