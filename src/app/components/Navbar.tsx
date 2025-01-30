"use client"

import React from 'react'
import { useState, useRef } from 'react'
import Image from 'next/image'
import Logo from '../../../public/img/blustyles_logo_transparent.png'
import { Twirl as Hamburger } from 'hamburger-react'
import Drawer from '@mui/material/Drawer';
import DrawerList from './DrawerList'
import { SlideProps } from '@mui/material'


const slideProps = {
  easing: {
    enter: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth default MUI transition
    exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  timeout: {
    enter: 500, // Increase duration for smoother transition
    exit: 400,
  },
};


const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
      <header className='flex justify-between items-center max-w-7xl px-3 h-16'>
        <Image
          alt='Blu Styles Logo'
          src={Logo}
          className='w-16 h-16'
        />

        <Hamburger toggle={setIsOpen} toggled={isOpen} />
      </header>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        SlideProps={slideProps} // Pass smooth transition props
      >
        <DrawerList toggleIsOpen={setIsOpen} />
      </Drawer>


    </>
  )
}

export default Navbar
