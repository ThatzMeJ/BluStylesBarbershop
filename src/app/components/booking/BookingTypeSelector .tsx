'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { bookingTypes } from '../../../../constant/bookingTypes'

interface BookingTypeSelectorProps {
  onBookingSelect: (bookingType: string) => void;
}

const BookingTypeSelector = ({ onBookingSelect }: BookingTypeSelectorProps) => {

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Choose Booking
        </span>
      </h1>

      <div className='flex flex-col gap-10'>
        {bookingTypes.map((type) => (
          <motion.div
            key={type.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={() => onBookingSelect(type.name)}
            className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-800"
          >
            <div className="flex flex-col gap-1 p-3">
              <h3 className="text-xl font-bold text-white">{type.name}</h3>
              <p className="text-gray-400">{type.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default BookingTypeSelector 