import React, { useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';

const BookingSummaryModal = () => {
  const userData = useBookingStore(state => state.userData);
  const step = useBookingStore(state => state.step);
  const setStep = useBookingStore(state => state.setStep);
  const mainUserServices = useBookingStore(state => state.mainUserServices);
  const selectedBarber = useBookingStore(state => state.selectedBarber);

  // Use useEffect to log data when component renders
  useEffect(() => {
    console.log('BookingSummaryModal - User Data:', userData);
    console.log('BookingSummaryModal - Main User Services:', mainUserServices);
    console.log('BookingSummaryModal - Step:', step);

    // Log guest services for debugging
    if (userData.bookingGuest && userData.bookingGuest.length > 0) {
      userData.bookingGuest.forEach((guest, index) => {
        console.log(`Guest ${index + 1} services:`, guest.services);
      });
    }
  }, [userData, mainUserServices, step]);

  // Calculate booking totals
  const calculateTotals = () => {
    // Main user services
    const mainServices = mainUserServices || [];

    // All guest services from the userData - ensure we safely handle null/undefined
    const guestServices = userData.bookingGuest
      ? userData.bookingGuest.flatMap(guest => guest.services || [])
      : [];

    // Log the calculated services for debugging
    console.log('Main services count:', mainServices.length);
    console.log('Guest services count:', guestServices.length);
    console.log('All guest services:', guestServices);

    // Combined services for totals
    const allServices = [...mainServices, ...guestServices];

    // Calculations
    const totalMinutes = allServices.reduce((sum, service) => sum + (service.service_duration || 0), 0);
    const totalPrice = allServices.reduce((sum, service) => sum + (service.price || 0), 0);

    return {
      totalMinutes,
      totalPrice,
      mainCount: mainServices.length,
      guestCount: guestServices.length,
      totalCount: allServices.length
    };
  };

  // Helper function to format duration
  const formatDuration = (totalMinutes: number): string => {
    if (totalMinutes <= 0) return '';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const parts: string[] = [];

    if (hours > 0) {
      parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
    }
    return parts.join(' ');
  };

  return (
    <div>
      {mainUserServices.length > 0 && (
        <div
          className='fixed bottom-0 left-0 w-full bg-gradient-to-br from-gray-800 via-black to-gray-800 border-t border-gray-700 min-h-[6.5rem] z-50 px-4 py-4 flex justify-between items-center shadow-lg'
        >
          {(() => {
            const { totalMinutes, totalPrice, totalCount } = calculateTotals();
            const formattedTime = formatDuration(totalMinutes);

            return (
              <div className='flex flex-col gap-1 text-sm flex-grow'>
                <div className='font-semibold text-white text-lg'>
                  ${totalPrice.toFixed(2)}
                </div>
                <div className='flex flex-row items-center gap-1.5 text-gray-400'>
                  <span>
                    {totalCount} service{totalCount !== 1 ? 's' : ''}
                  </span>
                  {formattedTime && <span className='text-gray-600'>·</span>}
                  {formattedTime && <span>{formattedTime}</span>}
                </div>
              </div>
            );
          })()}

          <button
            onClick={() => {
              // Handle step navigation
              if (userData.bookingType === 'group') {
                if (step === 3 && selectedBarber === -1) {
                  setStep(3.5);
                } else if (step === 3) {
                  // After professional selection, go to date and time
                  setStep(4);
                } else if (step === 3.5) {
                  setStep(4.0);
                } else {
                  setStep(step + 1);
                }
              } else {
                // For single bookings, just increment the step
                setStep(step + 1);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 whitespace-nowrap"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingSummaryModal; 