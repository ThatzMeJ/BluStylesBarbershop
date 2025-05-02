import React from 'react'
import { motion } from 'framer-motion'
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

interface Professional {
  id: number;
  name: string;
  image: React.ReactNode;
  description: string;
}

interface ProfessionalSelectionProps {
  selectedProfessional: number | null;
  onProfessionalSelect: (id: number) => void;
}
const ProfessionalSelection = ({ onProfessionalSelect, selectedProfessional }: ProfessionalSelectionProps) => {
  const { width } = useWindowDimensions();

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8">
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Select Professional
        </span>
      </h1>

      {/* Professionals Grid - Improved responsiveness */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-4xl mx-auto">
        {professionals.map((professional: Professional) => (
          <motion.div
            key={professional.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={() => onProfessionalSelect(professional.id)}
            className={`bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border ${selectedProfessional === professional.id ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-800'} cursor-pointer h-full shadow-lg`}
          >
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 h-full">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 mb-2">
                {professional.image}
              </div>
              <h3 className="mt-2 text-xs sm:text-sm md:text-base font-bold text-white text-center">{professional.name}</h3>
              <p className="text-xs sm:text-sm text-gray-400 text-center mt-1 line-clamp-2">{professional.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ProfessionalSelection 