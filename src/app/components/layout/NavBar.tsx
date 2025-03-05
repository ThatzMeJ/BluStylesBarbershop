'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../../../../public/img/blustyles_logo_transparent.png'
import Hamburger from 'hamburger-react'
import useWindowDimensions from '../../hooks/WindowDimensions'
import { AnimatePresence, motion } from 'framer-motion'
import MobileMenu from '../home/MobileMenu'
import { usePathname } from 'next/navigation';

const navItems = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'Services',
    href: '/'
  },
  {
    name: 'Team',
    href: '/'
  },
  {
    name: 'About Us',
    href: '/'
  },
  {
    name: 'Contact Us',
    href: '/'
  },
]

const NavBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { width } = useWindowDimensions()
  const belowMd: boolean = width < 768
  const pathname = usePathname();

 // Define routes where you want to show the navbar
 const showNavbarRoutes = ['/', '/services'];
 const shouldShowNavbar = showNavbarRoutes.includes(pathname);
  

  return (
    <>
      {shouldShowNavbar && (
        <header className='sticky top-0 z-50'>
        <div className='p-5 md:px-10 '>
          <div className='container mx-auto fixed top-0 left-0 right-0  bg-blur'>
            <div className='flex justify-between items-center '>
              <Link href={'/'}>
                <Image
                  alt='Blu Styles Logo'
                  src={Logo}
                  width={belowMd ? 45 : 80}
                  height={belowMd ? 45 : 80}
                  priority
                />
              </Link>

              {belowMd ? (
                // Mobile Navbar
                <Hamburger toggle={() => setIsOpen(prev => !prev)} toggled={isOpen} color='white' size={30} />
              ) : (
                // Desktop Navbar
                <motion.nav
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', duration: 5 }}
                  className='flex flex-row gap-10 min-w-60 justify-between items-center text-xl uppercase tracking-wide'
                >
                  {navItems.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1, y: -3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative px-3 py-2"
                    >
                      <Link href={item.href} className="relative text-[var(--accent)]">
                        {item.name}
                      </Link>
                      <motion.span
                        className="absolute left-0 bottom-0 w-full h-0.5 bg-white origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  ))}
                </motion.nav>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence mode='wait'>
          {isOpen && <MobileMenu setIsOpen={setIsOpen} isOpen={isOpen} />}
        </AnimatePresence>
        </header>
      )}
    </>
  )
}

export default NavBar
