'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FetchedBarberData } from '../../../../constant/barberOptions'
import { User } from 'lucide-react'
import { useBookingStore } from '@/store/bookingStore'
import { Spinner } from "@heroui/react";
import BookingSummaryModal from './BookingSummaryModal'


interface ProfessionalSelectionProps {
  selectedBarber: number;
  onProfessionalSelect: (id: number) => void;
  currentBarbers: FetchedBarberData[]
}

const BarberSelection = ({
  onProfessionalSelect,
  selectedBarber,
  currentBarbers
}: ProfessionalSelectionProps) => {
  const userData = useBookingStore((state) => state.userData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionBarber, setSessionBarber] = useState<number>(selectedBarber)
  const updateGuestBarber = useBookingStore(state => state.updateGuestBarber);
  const step = useBookingStore(state => state.step);


  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('http://localhost:3005/barbers/all')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch barbers')
      } finally {
        setIsLoading(false)
      }
    }

    if (!currentBarbers) {
      fetchBarbers()
    } else {
      setIsLoading(false)
    }

  }, [])

  // If the user selected a barber in single mode and then switched to group mode, set the selected barber to 0
  useEffect(() => {

    // If user switches from single to group mode and has a specific barber selected (> 0), 
    // reset to "Any professional" (0) since group mode works differently
    if (selectedBarber > 0 && userData.bookingType === 'group' && userData.bookingGuest && userData.bookingGuest.length > 0) {
      setSessionBarber(0);
    } else if (selectedBarber > 0 && userData.bookingType === 'group' && userData.bookingGuest && userData.bookingGuest.length === 0) {
      //If user switched from single to group mode but still has no guest added use the same selectedBarber
      setSessionBarber(selectedBarber)
    }

  }, [userData.bookingType, userData.bookingGuest?.length]); // Depend on mode changes, not selectedBarber


  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[200px]">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8">
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Select Professional
        </span>
      </h1>

      {/* Professionals Grid - Improved responsiveness */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-4xl mx-auto">
        {currentBarbers.map((barber) => {
          // For group bookings with no guests, hide the per-service selection option
          if (barber.barber_id === -1 && userData.bookingType === 'group' && (!userData.bookingGuest || userData.bookingGuest.length === 0)) {
            return null;
          }

          // For single bookings, hide the per-service selection option
          if (barber.barber_id === -1 && userData.bookingType === 'single') {
            return null;
          }

          // For group bookings with guests, only show barber_id 0 and -1
          if (userData.bookingType === 'group' && userData.bookingGuest && userData.bookingGuest.length > 0) {
            if (barber.barber_id !== 0 && barber.barber_id !== -1) {
              return null;
            }
          }

          return (
            <motion.div
              key={barber.barber_id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: sessionBarber === barber.barber_id ? 1.05 : 1,
                borderColor: sessionBarber === barber.barber_id ? 'rgb(59, 130, 246)' : 'rgb(31, 41, 55)'
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                if (userData.bookingType === 'group' && barber.barber_id === -1) {
                  // Just set UI state, don't update global selectedBarber
                  setSessionBarber(barber.barber_id);
                  onProfessionalSelect(barber.barber_id); // Trigger navigation to PerServiceBarberSelection
                } else if (userData.bookingType === 'group' && barber.barber_id === 0) {
                  // "Any professional" for group - update all guests and global state
                  userData.bookingGuest?.map((guest) => {
                    updateGuestBarber(guest.id, 0)
                  })
                  setSessionBarber(barber.barber_id);
                  onProfessionalSelect(barber.barber_id);
                } else if (userData.bookingType === 'single') {
                  // Single booking - update global selectedBarber for all barbers (including 0)
                  setSessionBarber(barber.barber_id);
                  onProfessionalSelect(barber.barber_id);
                } else {
                  // Fallback - just update UI state
                  setSessionBarber(barber.barber_id);
                }
              }}
              onFocus={() => {
                console.log('focus')
              }}
              className={`bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border-2 ${sessionBarber === barber.barber_id
                ? 'border-blue-500 ring-4 ring-blue-500/30 shadow-lg shadow-blue-500/20'
                : 'border-gray-800 hover:border-gray-700'
                } cursor-pointer h-full`}
            >
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 h-full relative">
                {sessionBarber === barber.barber_id && (
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
                <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 mb-2 ${sessionBarber === barber.barber_id ? 'ring-2 ring-blue-500' : ''
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
                      alt="Picture of the author"
                    />
                  )}
                </div>
                <h3 className="mt-2 text-xs sm:text-sm md:text-base font-bold text-white text-center">{barber.barber_id === -1 || barber.barber_id === 0 ? barber.name : barber.first_name}</h3>
                <p className="text-xs sm:text-sm text-gray-400 text-center mt-1 line-clamp-2 min-h-[20px]">{barber.description ? barber.description : barber.barber_id !== -1 ? 'barber' : '\u00A0'}</p>
              </div>
            </motion.div>
          );
        })}
      </div>



      {/* <BookingSummaryModal /> */}


    </div>
  )
}

export default BarberSelection 