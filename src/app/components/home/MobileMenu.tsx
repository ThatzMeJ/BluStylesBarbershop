'use client'

import React, { Dispatch, SetStateAction, useState } from 'react'
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from './Link';
import Hamburger from 'hamburger-react'
import Curve from '../Curve';

const menuSlide = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { x: "calc(100% + 100px)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
};


const navItems = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'Services',
    href: '/services'
  },
  {
    title: 'Book Now',
    href: '/book'
  },
  {
    title: 'About Us',
    href: '/about'
  },
  {
    title: 'Contact Us',
    href: '/contact'
  },
]

interface Prop {
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  isOpen: boolean
}

export default function MobileMenu({
  setIsOpen,
  isOpen
}: Prop) {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  console.log(selectedIndicator)
  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="h-screen w-screen bg-[var(--primary)] fixed right-0 top-0 text-white"
    >
      <div className="relative box-border h-full w-full p-[100px] flex flex-col justify-between gap-2">
        <div className='absolute top-6 right-10'>
          <Hamburger toggle={() => setIsOpen(prev => !prev)} toggled={isOpen} color='white' size={30} />
        </div>
        <div
          onMouseLeave={() => { setSelectedIndicator(pathname) }}
          className="flex flex-col sm:text-[56px] text-[45px]  gap-3 "
        >
          <div className="text-[#999999] border-b border-[#999999] uppercase font-bold text-[16px] ">
            <p>Navigation</p>
          </div>
          {navItems.map((data, index) => {
            return (
              <Link
                key={index}
                data={{ ...data, index }}
                isActive={selectedIndicator == data.href}
                setSelectedIndicator={setSelectedIndicator}
                setIsOpen={setIsOpen}
              />
            )
          })}
        </div>
        <div className="flex w-full justify-between text-sm gap-10 ">
          <a href="#" className="font-light hover:text-gray-300 transition-colors">Awwwards</a>
          <a href="#" className="font-light hover:text-gray-300 transition-colors">Instagram</a>
          <a href="#" className="font-light hover:text-gray-300 transition-colors">Dribble</a>
          <a href="#" className="font-light hover:text-gray-300 transition-colors">LinkedIn</a>
        </div>
      </div>
      <Curve />
    </motion.div>
  )
}