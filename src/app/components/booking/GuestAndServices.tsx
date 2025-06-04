import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { BookingGuest } from '../../../../constant/bookingTypes'
import { Plus, UserCircle, EllipsisVertical, ChevronDown } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@heroui/react";
import Image from 'next/image';
import Service from '../../../../constant/ServiceType';
import { useBookingStore } from '@/store/bookingStore'
import ConfirmationModal from './ConfirmationModal';



interface GuestAndServicesProps {
  mainUserServices: Array<Service>,
  isMobile: boolean,
  onAddGuest: () => void,
  setCurrentGuestId: (id: number | undefined) => void
}

type ModalType = 'user' | 'guest';

interface ModelOptionsProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  modalType: ModalType;
  isMobile: boolean;
  handleEditServices: (type: ModalType) => void,
  handleRemoveGuest: (guestData: BookingGuest) => void
  guestData: BookingGuest | null
}

const GuestAndServices = ({ mainUserServices, isMobile, onAddGuest, setCurrentGuestId }: GuestAndServicesProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const userData = useBookingStore((state) => state.userData)
  const setIsSelectingForGuest = useBookingStore(state => state.setIsSelectingForGuest);
  const setStep = useBookingStore(state => state.setStep);
  const setUserData = useBookingStore((state) => state.setUserData)
  const [modalType, setModalType] = useState<ModalType>('user');
  const [guestData, setGuestData] = useState<BookingGuest | null>(null);
  console.log("userData", userData)

  const handleAddGuest = () => {
    const nextGuestId = (userData.bookingGuest?.length ?? 0) + 1;
    setCurrentGuestId(nextGuestId);
    onAddGuest();
  };

  const handleEditServices = (type: ModalType) => {
    const step = useBookingStore.getState().step;
    if (type === 'user') {
      setCurrentGuestId(undefined)
      setIsSelectingForGuest(false)
      setStep(step - 0.5)
    } else {
      setCurrentGuestId(guestData?.id)
      setIsSelectingForGuest(true)
      setStep(step - 0.5)
    }
  }

  const handleRemoveGuest = (guestData: BookingGuest) => {
    if (!guestData) return;
    console.log("Remove Guest", guestData)
    const deleteBookingGuest = userData.bookingGuest?.filter(guest => guest.id !== guestData.id)
    setUserData({
      ...userData,
      bookingGuest: deleteBookingGuest
    })
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-start mb-6 sm:mb-8">
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
                width={48}
                height={48}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
              />
            ) : (
              <UserCircle size={48} className="text-gray-400 w-10 h-10 sm:w-12 sm:h-12" />
            )}

            <div className='flex flex-col justify-start items-start gap-1'>
              <h6 className='font-bold'>
                {userData.first_name ? userData.first_name : 'Me'}
              </h6>
              <div>
                {mainUserServices && mainUserServices.length === 1 ? (
                  mainUserServices[0].name
                ) : (
                  `${mainUserServices.length} Services`
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setModalType('user')
                onOpen()
              }}
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
          </div>
        </motion.div>

        {userData.bookingGuest && userData.bookingGuest.length > 0 && (
          userData.bookingGuest.map((guest: BookingGuest, index: number) => {
            console.log(`Guest ${index + 1}:`, guest);
            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-800 shadow-lg hover:cursor-pointer p-2"
              >
                <div className="flex justify-start items-center gap-4">
                  <UserCircle size={48} className="text-gray-400 w-10 h-10 sm:w-12 sm:h-12" />

                  <div className='flex flex-col justify-start items-start gap-1'>
                    <h6 className='font-bold'>{guest.name}</h6>
                    <div>
                      {guest.services && guest.services.length === 1 ? (
                        guest.services[0].name
                      ) : (
                        `${guest.services.length} Services`
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setModalType('guest')
                      setGuestData(guest)
                      onOpen()
                    }}
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
                </div>
              </motion.div>
            );
          })
        )}

        <motion.button
          onClick={handleAddGuest}
          className=" max-w-36 px-4 py-2 rounded-3xl font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out flex items-center gap-2 justify-center mt-10"
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


{/* 
        <ConfirmationModal isGuest={false} currentGuestServices={[]} currentGuestId={null} selectedProfessional={undefined} /> */}
 
      <ModelOptions isOpen={isOpen} onOpenChange={onOpenChange} modalType={modalType} isMobile={isMobile} handleRemoveGuest={handleRemoveGuest} handleEditServices={handleEditServices} guestData={guestData} />
    </div>
  );
};



function ModelOptions({ isOpen, onOpenChange, modalType, isMobile, handleEditServices, handleRemoveGuest, guestData }: ModelOptionsProps) {
  return (
    isMobile ? (
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size='xs' placement='bottom' className='text-black'>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerBody className='flex flex-col gap-4 '>

              </DrawerBody>
              <DrawerFooter className='flex flex-col justify-start items-start gap-4 mt-10'>
                <div
                  className='cursor-pointer'
                  onClick={() => handleEditServices(modalType)}
                >
                  Edit Services
                </div>
                {modalType === "guest" && guestData &&
                  <div
                    className='cursor-pointer text-red-500 '
                    onClick={() => {
                      handleRemoveGuest(guestData)
                      onClose()
                    }}
                  >
                    Remove Guest
                  </div>
                }
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    ) : (
      <div className="relative">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => onOpenChange(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    handleEditServices(modalType);
                    onOpenChange(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-blue-600 transition-colors duration-150"
                >
                  Edit Services
                </button>
                {modalType === "guest" && guestData && (
                  <button
                    onClick={() => {
                      handleRemoveGuest(guestData);
                      onOpenChange(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors duration-150"
                  >
                    Remove Guest
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    )
  );
}

export default GuestAndServices;
