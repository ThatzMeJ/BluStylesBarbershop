import { motion } from 'framer-motion'
import React from 'react'
import { BookingPerson } from '../../../../constant/bookingTypes'
import { Plus, UserCircle, EllipsisVertical, ChevronDown } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import Image from 'next/image';
import Service from '../../../../constant/ServiceType';
interface GuestAndServicesProps {
  userData: BookingPerson,
  selectedService: Array<Service>,
  isMobile: boolean,
  onAddGuest: () => void
}


const GuestAndServices = ({ userData, selectedService, isMobile, onAddGuest }: GuestAndServicesProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8">
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Add Guest and Services
        </span>
      </h1>

      <div className='flex flex-col gap-4 sm:gap-6 md:gap-10'>
        <motion.div
          key={1}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-800 shadow-lg hover:cursor-pointer p-2"
        >
          <div className="flex justify-start items-center gap-4">
            {userData.profile_pic ? (
              <Image
                src={userData.profile_pic}
                alt="User profile picture"
                width={48} // Adjust size as needed
                height={48}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
              />
            ) : (
              <UserCircle size={48} className="text-gray-400 w-10 h-10 sm:w-12 sm:h-12" />
            )}

            <div className='flex flex-col justify-start items-start gap-1'>
              <h6 className='font-bold'>{userData.firstName}</h6>
              <div>
                {selectedService && selectedService.length === 1 ? (
                  selectedService[0].name
                ) : (
                  `${selectedService.length} Services`
                )}
              </div>

            </div>

            <button
              onClick={onOpen}
              className='bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-lg p-2 w-fit focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors duration-150 ml-auto'
              aria-label="Open options menu"
            >
              {isMobile === true ? (
                <EllipsisVertical size={20} />
              ) : (
                <div className='flex items-center gap-2'>
                  Options <ChevronDown size={16} />
                </div>
              )}
            </button>

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size='xs' placement='bottom' className='text-black'>
              <DrawerContent>
                {(onClose) => (
                  <>
                    <DrawerHeader className="flex flex-col gap-1">Drawer Title</DrawerHeader>
                    <DrawerBody>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                        risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                        quam.
                      </p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                        risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                        quam.
                      </p>
                      <p>
                        Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor
                        adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                        officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                        nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                        deserunt nostrud ad veniam.
                      </p>
                    </DrawerBody>
                    <DrawerFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={onClose}>
                        Action
                      </Button>
                    </DrawerFooter>
                  </>
                )}
              </DrawerContent>
            </Drawer>
          </div>
        </motion.div>

      </div>

      <motion.button
        onClick={onAddGuest}
        className="px-4 py-2 rounded-3xl font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out flex items-center gap-2 justify-center"
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2, ease: "easeInOut" }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus />
        Add guest
      </motion.button>
    </div>
  )
}

export default GuestAndServices
