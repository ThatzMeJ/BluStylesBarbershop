import React from 'react'
import { useBookingStore } from '@/store/bookingStore'
import Service from '../../../../constant/ServiceType';
import { BookingGuest } from '../../../../constant/bookingTypes';


interface CurrentGuest {
  id: number;
  name: string;
  services: Service[];
}

interface ConfirmationModalProps {
  isGuest: boolean,
  currentGuestServices: Array<BookingGuest>,
  currentGuestId?: CurrentGuest | null,
  selectedProfessional: number | undefined,
}

const ConfirmationModal = ({ isGuest, currentGuestServices, currentGuestId, selectedProfessional }: ConfirmationModalProps) => {
  const userData = useBookingStore(state => state.userData);
  const setUserData = useBookingStore(state => state.setUserData);
  const step = useBookingStore(state => state.step);
  const setStep = useBookingStore(state => state.setStep);
  const mainUserServices = useBookingStore(state => state.mainUserServices);
  console.log("currentGuestServices", currentGuestServices)
  // Update the total calculations
  const calculateTotals = () => {
    let services: Service[] = [];
    if (step === 2.5 || step === 3 && userData.bookingType === 'group') {
      // If group booking, add all services from guests and selected services
      services = userData.bookingGuest?.flatMap(guest => guest.services).concat(mainUserServices) || []
    } else {
      // If single booking, add services from guest or selected services
      services = isGuest && currentGuestId
        ? currentGuestId.services
        : mainUserServices;
    }

    const totalMinutes = services.reduce((sum, service) => sum + service.service_duration, 0);
    const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
    return { totalMinutes, totalPrice };
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
      {(isGuest ? currentGuestServices : mainUserServices).length > 0 && (
        <div
          className='fixed bottom-0 right-0 w-screen bg-gradient-to-br from-gray-800 via-black to-gray-800 border-t border-gray-700 min-h-[6.5rem] z-50 px-4 py-4 flex justify-between items-center shadow-lg'
        >
          {(() => {
            const { totalMinutes, totalPrice } = calculateTotals();
            const formattedTime = formatDuration(totalMinutes);
            let serviceCount
            if (step === 2.5 && userData.bookingType === 'group') {
              serviceCount = userData.bookingGuest?.flatMap(guest => guest.services).concat(mainUserServices).length || 0;
            } else {
              serviceCount = isGuest ? (currentGuestServices[0]?.services.length || 0) : mainUserServices.length;
            }

            return (
              <div className='flex flex-col gap-1 text-sm flex-grow'>
                <div className='font-semibold text-white text-lg'>
                  ${totalPrice.toFixed(2)}
                </div>
                <div className='flex flex-row items-center gap-1.5 text-gray-400'>
                  <span>
                    {serviceCount} service{serviceCount !== 1 ? 's' : ''}
                  </span>
                  {formattedTime && <span className='text-gray-600'>·</span>}
                  {formattedTime && <span>{formattedTime}</span>}
                </div>
              </div>
            );
          })()}

          <button
            onClick={() => {
              const step = useBookingStore.getState().step;
              if (isGuest && currentGuestId && userData.bookingGuest && step === 2) {
                // Check if the guest already exists
                const existingGuestIndex = userData.bookingGuest.findIndex(g => g.id === currentGuestId.id);

                if (existingGuestIndex === -1) {
                  // Guest doesn't exist, add new guest
                  userData.bookingGuest.push({
                    id: currentGuestId.id,
                    name: currentGuestId.name,
                    barber_id: null,
                    services: currentGuestId.services
                  });
                } else {
                  // Guest exists, update their services
                  userData.bookingGuest[existingGuestIndex] = {
                    id: currentGuestId.id,
                    name: currentGuestId.name,
                    barber_id: null,
                    services: currentGuestId.services
                  };
                }
              }

              if (userData.bookingGuest && userData.bookingGuest.length > 0 && step === 3) {
                // Create a new array with updated guests
                const updatedGuests = userData.bookingGuest.map(guest => ({
                  ...guest,
                  barber_id: selectedProfessional
                }));

                // Update the state using setUserData
                setUserData({
                  ...userData,
                  bookingGuest: updatedGuests as BookingGuest[]
                });;
              }

              // Handle step navigation
              if (userData.bookingType === 'group') {
                if (step === 2) {
                  // After service selection in group booking, go to guest and services
                  setStep(2.5);
                } else if (step === 2.5) {
                  // After guest and services, go to professional selection
                  setStep(3);
                } else if (step === 3 && selectedProfessional === -1) {
                  setStep(3.5);
                } else if (step === 3) {
                  // After professional selection, go to date and time
                  setStep(4);
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
  )
}

export default ConfirmationModal
