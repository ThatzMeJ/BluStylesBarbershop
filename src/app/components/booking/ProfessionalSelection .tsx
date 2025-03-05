import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Users } from 'lucide-react';
import useWindowDimensions from '@/app/hooks/WindowDimensions';

const professionals = [
  {
    id: 1,
    name: 'Any professional',
    image: <Users />,
    description: 'for maximum availability',
  },
  {
    id: 2,
    name: 'Any professional',
    image: <Users />,
    description: 'for maximum availability',
  },
  {
    id: 3,
    name: 'Any professional',
    image: <Users />,
    description: 'for maximum availability',
  },
  {
    id: 4,
    name: 'Any professional',
    image: <Users />,
    description: 'for maximum availability',
  }
]

interface ProfessionalSelectionProps {
  selectedProfessional: number | null;
  onProfessionalSelect: (id: number) => void;
}
const ProfessionalSelection = ({ onProfessionalSelect, selectedProfessional }: ProfessionalSelectionProps) => {
  const { width } = useWindowDimensions();

  return (
    <div className="max-w-6xl flex flex-col items-center justify-center mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Select Professional
        </span>
      </h1>

      {/* Services Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 justify-center max-w-2xl ">
        {professionals.map((service: any) => (
          <motion.div
            key={service.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={() => onProfessionalSelect(service.id)}
            className={`bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-800 cursor-pointer w-full max-w-56 h-full min-h-44 ${selectedProfessional === service.id ? 'border-blue-500' : ''}`}
          >
            <div className="flex flex-col items-center justify-center p-4 mt-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 mb-2">
                {service.image}
              </div>
              <h3 className="mt-3 text-sm text-center font-bold text-white">{service.name}</h3>
              <p className="text-sm text-gray-400 text-center truncate" style={{ maxWidth: width > 516 ? '200px' : '150px' }}>{service.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ProfessionalSelection 