'use client';

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import FaQuoteLeft from '../../../../public/img/63515e0705695e64229e5eb7_quotes-fill.svg'
import userImage from '../../../../public/img/63515e0705695ee4bb9e5ec5_Screenshot_9.jpg'
import useMeasure from 'react-use-measure'
import { useMotionValue, animate } from 'framer-motion'
import { useEffect } from 'react'

const items = [
  1, 2, 3, 4, 5, 6, 7, 8
]

const ReviewCard = () => {

  // This ref will now measure one item's full height including margins
  const [itemRef, itemBounds] = useMeasure();
  // This ref measures the entire list
  const [listRef, listBounds] = useMeasure();

  const yTranslation = useMotionValue(0);

  useEffect(() => {
    if (!itemBounds.height || !listBounds.height) return;

    // Calculate the height of one complete set of items
    // const finalPos = -(items.length * itemBounds.height);
    const finalPos = -765;
    console.log('Single item height:', itemBounds.height);
    console.log('Total scroll distance:', finalPos);

    const controls = animate(yTranslation, [0, finalPos], {
      ease: 'linear',
      duration: 15,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
    })

    return controls.stop;
  }, [yTranslation, itemBounds.height, listBounds.height]);

  return (
    <motion.div
    className='flex flex-col items-center h-full w-fit '
    ref={listRef}
    style={{
      y: yTranslation,
    }}
  >
    {[...items, ...items].map((item, index) => (

      <div
        // Only measure the first item
        ref={index === 0 ? itemRef : undefined}
        key={`${item}-${index}`}
        className="bg-white flex-1 max-w-64 min-h-64 rounded-lg flex flex-col items-start justify-start my-2 overflow-hidden text-black p-5 gap-4"
      >
        <Image src={FaQuoteLeft} alt='testimonial' width={25} height={25} />

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>

        <div className='flex items-center gap-2  w-full mt-auto'>
          <Image src={userImage} alt='testimonial'  className='rounded-full object-cover max-w-[60px] max-h-[60px]' />
          <div>
            <h4 className='font-semibold'>John Doe</h4>
            <p className='text-[var(--text-muted)] text-sm'>CEO at Company</p>
          </div>
        </div>
      </div>

    ))}
  </motion.div>
  )
}

export default ReviewCard
