'use client'
import { useBookingStore } from '@/store/bookingStore'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import Service from '../../../../constant/ServiceType'
import { User, UserCircle } from 'lucide-react'
import Image from 'next/image'
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  useDisclosure,
  Accordion,
  AccordionItem
} from "@heroui/react";
import { FetchedBarberData } from '../../../../constant/barberOptions';
import { BookingGuest, BookingPerson } from '../../../../constant/bookingTypes';

// Helper type guard functions
// If currentUser object has the key 'type' than its the main user else a guest
function isBookingPerson(user: BookingPerson | BookingGuest | null): user is BookingPerson {
  return user !== null && 'type' in user;
}

function isBookingGuest(user: BookingPerson | BookingGuest | null): user is BookingGuest {
  return user !== null && 'id' in user;
}

interface ModelOptionsProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isMobile: boolean;
  currentUser: BookingPerson | BookingGuest | null
}

interface PerServiceBarberSelectionProps {
  isMobile: boolean;
  fetchedBarbers: FetchedBarberData[];
}

const PerServiceBarberSelection = ({ isMobile, fetchedBarbers }: PerServiceBarberSelectionProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const mainUserServices = useBookingStore((state) => state.mainUserServices)
  const [currentUser, setCurrentUser] = useState<BookingPerson | BookingGuest | null>(null)
  const selectedBarber = useBookingStore((state) => state.selectedBarber)
  const setSelectedBarber = useBookingStore((state) => state.setSelectedBarber)
  const userData = useBookingStore((state) => state.userData)


  // Find the selected barber details
  const selectedBarberDetails = fetchedBarbers.find(barber => barber.barber_id === selectedBarber);
  console.log("PerServiceBarberSelection / selectedBarberDetails", selectedBarberDetails)
  console.log("PerServiceBarberSelection / userData", userData)


  return (
    <>
      <div className="w-full flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8">
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Select Professional
          </span>
        </h1>

        {/* Professionals Grid - Improved responsiveness */}
        <div className="flex flex-col gap-4 w-full max-w-xl mx-auto">

          <div className='flex flex-col gap-4'>

            <h2 className='text-xl font-bold'>
              {userData.first_name ? userData.first_name : 'Me'}
            </h2>

            {/* Main user */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-800 py-4 px-2 flex flex-col gap-2 shadow-md items-start justify-start">
              {mainUserServices.length > 1 ? (
                <Accordion
                  isCompact
                  className="p-2 flex flex-col gap-1 w-full"
                >
                  <AccordionItem
                    key={mainUserServices[0]?.service_id} aria-label="Accordion 1"
                    title={mainUserServices[0]?.name}
                    subtitle="Press to see more"
                  >
                    <div className="max-h-[50px] overflow-y-auto">
                      {mainUserServices.map((service: Service, idx) => {
                        if (idx === 0) {
                          return null; // Skip the first service since it's already in the title
                        } else {
                          return (
                            <div key={service.service_id}>
                              {service.name}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </AccordionItem>
                </Accordion>
              ) : (
                mainUserServices.length === 1 && (
                  <div key={mainUserServices[0].service_id} className="w-full">
                    <h2 className="text-lg font-medium text-white">{mainUserServices[0].name}</h2>
                  </div>
                )
              )}
              <div className="flex items-center text-gray-400 text-base -mt-1 mb-1">
                <span>{mainUserServices.reduce((acc, cur) => acc + cur.price, 0)} mins</span>
              </div>
              <motion.button
                onClick={() => {
                  onOpen()
                  setCurrentUser(userData)
                }}
                className="flex items-center gap-2 px-4 py-1 rounded-full border bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out shadow-sm max-w-44 min-w-fit"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2, ease: "easeInOut" }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Circle icon background */}
                <span className="flex items-center justify-center w-6 h-6 rounded-full text-white">
                  {!selectedBarberDetails || typeof selectedBarberDetails.profile_pic !== "string" ? (
                    <UserCircle size={24} />
                  ) : (
                    <Image
                      src={selectedBarberDetails.profile_pic}
                      className='w-full h-full rounded-full object-cover'
                      width={48}
                      height={48}
                      quality={100}
                      priority
                      alt="Barber profile"
                    />
                  )}
                </span>
                <span className="flex-1 text-white font-medium text-sm text-left">
                  {selectedBarberDetails?.first_name || "Any professional"}
                </span>
                {/* Dropdown arrow */}
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

            </div>

            {/* Guests */}
            {userData.bookingGuest && userData.bookingGuest.map((guest, idx) => (
              <div key={guest.id || idx} className='flex flex-col gap-4'>
                <h2 className='text-xl font-bold'>{`Guest ${idx + 1}`}</h2>
                <div className="bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-800 py-4 px-2 flex flex-col gap-2 shadow-md items-start justify-start">
                  {guest.services.length > 1 ? (
                    <Accordion
                      isCompact
                      className="p-2 flex flex-col gap-1 w-full"
                    >
                      <AccordionItem
                        key={guest.services[0]?.service_id}
                        aria-label="Accordion 1"
                        title={guest.services[0]?.name}
                        subtitle="Press to see more"
                      >
                        <div className="max-h-[50px] overflow-y-auto">
                          {guest.services.map((service: Service, idx) => {
                            if (idx === 0) {
                              return null; // Skip the first service since it's already in the title
                            } else {
                              return (
                                <div key={service.service_id}>
                                  {service.name}
                                </div>
                              );
                            }
                          })}
                        </div>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    guest.services.length === 1 && (
                      <div key={guest.services[0].service_id} className="w-full">
                        <h2 className="text-lg font-medium text-white">{guest.services[0].name}</h2>
                      </div>
                    )
                  )}

                  <div className="flex items-center text-gray-400 text-base -mt-1 mb-1">
                    <span>{guest.services ? guest.services.reduce((acc, cur) => acc + (cur.service_duration || 0), 0) : 0} mins</span>
                  </div>

                  <motion.button
                    onClick={() => {
                      onOpen()
                      setCurrentUser(guest)
                    }}
                    className="flex items-center gap-2 px-4 py-1 rounded-full border bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out shadow-sm max-w-44 min-w-fit"
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2, ease: "easeInOut" }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Circle icon background */}
                    <span className="flex items-center justify-center w-6 h-6 rounded-full text-white">
                      {(() => {
                        // Only show profile picture if guest has selected a specific barber
                        if (!guest.barber_id || guest.barber_id === 0) {
                          return <UserCircle size={24} />;
                        }

                        // Find selected barber
                        const selectedGuestBarber = fetchedBarbers.find(b => b.barber_id === guest.barber_id);

                        // Check if barber exists and has a string profile pic
                        if (selectedGuestBarber && typeof selectedGuestBarber.profile_pic === 'string') {
                          return (
                            <Image
                              src={selectedGuestBarber.profile_pic as string}
                              className='w-full h-full rounded-full object-cover'
                              width={48}
                              height={48}
                              quality={100}
                              priority
                              alt="Barber profile"
                            />
                          );
                        }

                        // Default fallback
                        return <UserCircle size={24} />;
                      })()}
                    </span>
                    <span className="flex-1 text-white font-medium text-sm text-left">
                      {(() => {
                        // Find the selected barber for this guest
                        if (!guest.barber_id || guest.barber_id === 0 || guest.barber_id === -1) {
                          // Default option - Any professional
                          return fetchedBarbers[0].name;
                        }

                        // Find the specific barber
                        const guestBarber = fetchedBarbers.find(b => b.barber_id === guest.barber_id);
                        return guestBarber ? (guestBarber.first_name || guestBarber.name) : "Any professional";
                      })()}
                    </span>
                    {/* Dropdown arrow */}
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div >
      <ModelOptions
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isMobile={isMobile}
        currentUser={currentUser}
        fetchedBarbers={fetchedBarbers}
        selectedBarber={selectedBarber}
        setSelectedBarber={setSelectedBarber}
      />

      {/* Booking Summary Modal */}
      {/* <BookingSummaryModal /> */}
    </>
  )
}


function ModelOptions({ isOpen, onOpenChange, isMobile, currentUser, fetchedBarbers, selectedBarber, setSelectedBarber }: ModelOptionsProps & { fetchedBarbers: FetchedBarberData[], selectedBarber: number | undefined, setSelectedBarber: (barberId: number) => void }) {
  const updateGuestBarber = useBookingStore((state) => state.updateGuestBarber);

  // Determine which barber is currently selected based on who we're viewing
  const getCurrentSelectedBarber = () => {
    if (isBookingPerson(currentUser)) {
      // For main user, use the global selectedBarber state
      return selectedBarber;
    } else if (isBookingGuest(currentUser)) {
      // For guests, use their own barber_id
      return currentUser.barber_id || 0;
    }
    return 0; // Default
  };

  const currentSelectedBarber = getCurrentSelectedBarber();

  return (
    isMobile ? (
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size='5xl' placement='bottom' className='bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white [&_.heroui-drawer-content]:bg-gradient-to-br [&_.heroui-drawer-content]:from-gray-900 [&_.heroui-drawer-content]:via-black [&_.heroui-drawer-content]:to-gray-900 [&_.heroui-drawer-header]:bg-transparent [&_.heroui-drawer-body]:bg-transparent'>
        <DrawerContent className="bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 bg-transparent text-white">
                {isBookingPerson(currentUser)
                  ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'Me'
                  : isBookingGuest(currentUser)
                    ? `${currentUser.name}`
                    : 'Select Professional'
                }
              </DrawerHeader>

              <DrawerBody className='grid grid-cols-2 gap-4 bg-transparent'>
                {fetchedBarbers && fetchedBarbers.map((barber) => {
                  // Skip the "Select professional per service" option
                  if (barber.barber_id === -1) return null;

                  return (
                    <motion.div
                      key={barber.barber_id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        scale: currentSelectedBarber === barber.barber_id ? 1.05 : 1,
                        borderColor: currentSelectedBarber === barber.barber_id ? 'rgb(59, 130, 246)' : 'rgb(31, 41, 55)'
                      }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => {
                        if (isBookingPerson(currentUser)) {
                          // Set barber for main user
                          setSelectedBarber(barber.barber_id);
                        } else if (isBookingGuest(currentUser)) {
                          // Update the guest's barber_id in the userData store
                          updateGuestBarber(currentUser.id, barber.barber_id);
                        }
                        onClose();
                      }}
                      className={`bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border-2 ${currentSelectedBarber === barber.barber_id
                        ? 'border-blue-500 ring-4 ring-blue-500/30 shadow-lg shadow-blue-500/20'
                        : 'border-gray-800 hover:border-gray-700'
                        } cursor-pointer h-full`}
                    >
                      <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 h-full relative">
                        {currentSelectedBarber === barber.barber_id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          </motion.div>
                        )}
                        <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 mb-2 ${currentSelectedBarber === barber.barber_id ? 'ring-2 ring-blue-500' : ''
                          }`}>
                          {typeof barber.profile_pic !== "string" || barber.profile_pic === null ? (
                            barber.profile_pic ? (
                              barber.profile_pic // Render the SVG or ReactNode directly
                            ) : (
                              <User className="w-6 h-6 text-gray-400" />
                            )
                          ) : (
                            <Image
                              src={barber.profile_pic as string}
                              className='w-full h-full rounded-full object-cover'
                              width={48}
                              height={48}
                              quality={100}
                              priority
                              alt="Barber profile"
                            />
                          )}
                        </div>
                        <h3 className="mt-2 text-xs sm:text-sm md:text-base font-bold text-white text-center">{barber.first_name ?? barber.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-400 text-center mt-1 line-clamp-2 min-h-[20px]">{barber.description ? barber.description : barber.barber_id !== -1 ? 'barber' : '\u00A0'}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    ) : (
      <div className="relative">
        {isOpen && (
          <>
            <div>Place holder for barber selection</div>
          </>
        )}
      </div>
    )
  );
}

export default PerServiceBarberSelection
