'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceSelection from '../components/booking/ServiceSelection';
import BookingTypeSelector from '../components/booking/BookingTypeSelector ';
import { ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation'
import ProfessionalSelection from '../components/booking/ProfessionalSelection ';

const Page = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<object | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
  const [service, setService] = useState<object>({
    bookingType: null,
    service: null,
  });

  console.log(service);


  //Passed to BookingTypeSelector Component
  const handleBookingSelect = (bookingType: string) => {
    setService(prev => ({
      ...prev,
      bookingType: bookingType,
    }));
    setStep(2);
  };

  //Passed to ServiceSelction Component
  const handleServiceSelect = (service: object) => {
    setSelectedService(service);
    setStep(3);
  };
  
  //Passed to ProfessionalSelection Component
  const handleProfessionalSelect = (id: number) => {
    setSelectedProfessional(id);
  }



  const handleBookingSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          service: selectedService,
        }),
      });

      if (response.ok) {
        console.log('Booking successful');
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      // Handle error state
    }
  };

  return (
    <div className="min-h-[760px] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col ">

      <div className='flex justify-center items-center mx-auto w-full max-w-5xl p-4 mb-5'>
        <div className='flex-grow' >
          {step > 1 &&
            <button
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft color='white' size={40} />
            </button>
          }
        </div>
        {step <= 1 &&
          <button onClick={() => router.back()}>
            <X color='white' size={40} />
          </button>
        }
      </div>

      <div className="container mx-auto px-4">

        {/* Progress Bar Container */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-white">
                Step {step} of 4: {step === 1 ? 'Choose Booking' : 'Book Appointment'}
              </div>
              {/* Percentage Details */}
              <div className="text-white">
                {Math.round((step / 4) * 100)}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode='wait'>
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <BookingTypeSelector onBookingSelect={handleBookingSelect} />
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ServiceSelection onServiceSelect={handleServiceSelect} />
            </motion.div>
          ) : step === 3 ? (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ProfessionalSelection onProfessionalSelect={handleProfessionalSelect}
                selectedProfessional={selectedProfessional}
              />
            </motion.div>
          ) : step === 4 ? (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-800 p-8 rounded-lg text-white">
                <h2 className="text-2xl font-bold mb-4">Step 4: Confirmation</h2>
                <p className="mb-4">This is a placeholder for step 4 content.</p>
                <button
                  onClick={() => console.log("Booking completed!")}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
                >
                  Complete Booking
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page; 