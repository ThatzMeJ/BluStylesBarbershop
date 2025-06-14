'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { bookingTypes } from '../../../../constant/bookingTypes'
import { useBookingStore } from '@/store/bookingStore';


interface BookingTypeSelectorProps {
  onBookingSelect: () => void;
}



const BookingTypeSelector = ({ onBookingSelect, }: BookingTypeSelectorProps) => {
  const setUserData = useBookingStore(state => state.setUserData);
  return (
    <div className="w-full">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8">
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Choose Booking
        </span>
      </h1>

      <div className='flex flex-col gap-4 sm:gap-6 md:gap-10'>
        {bookingTypes.map((type) => (
          <motion.div
            key={type.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setUserData({ bookingType: type.bookingType })
              onBookingSelect()
            }}
            className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-800 shadow-lg hover:cursor-pointer"
          >
            <div className="flex flex-col gap-1 p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-bold text-white">{type.name}</h3>
              <p className="text-sm sm:text-base text-gray-400">{type.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default BookingTypeSelector 