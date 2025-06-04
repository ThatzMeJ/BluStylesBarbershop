import React from 'react'
import {
  Modal,
  ModalContent,
} from "@heroui/react";
import Service from '../../../../constant/ServiceType';
import { useBookingStore } from '@/store/bookingStore';
import { BookingGuest } from '../../../../constant/bookingTypes';


interface CurrentGuest {
  id: number;
  name: string;
  services: Service[];
}

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  service: Service;
  isGuest: boolean;
  currentGuestInfo: CurrentGuest | null;
  setCurrentGuestInfo: React.Dispatch<React.SetStateAction<CurrentGuest | null>>;
  setCurrentGuestServices: React.Dispatch<React.SetStateAction<BookingGuest[]>>;

}

const ServiceDetailsModal = ({ isOpen, onOpenChange, service, isGuest, currentGuestInfo, setCurrentGuestInfo, setCurrentGuestServices }: ServiceDetailsModalProps) => {
  console.log("currentGuestInfo", currentGuestInfo)
  console.log("isGuest", isGuest)
  const userData = useBookingStore(state => state.userData);
  const mainUserServices = useBookingStore(state => state.mainUserServices);
  const setMainUserServices = useBookingStore(state => state.setMainUserServices);

  const buttonText = isGuest
    ? currentGuestInfo?.services.some(s => s.service_id === service.service_id)
      ? "Remove from guest's services"
      : "Add to guest's services"
    : mainUserServices.some(s => s.service_id === service.service_id)
      ? "Remove from my services"
      : "Add to my services";


  const handleServiceSelection = () => {
    if (isGuest && currentGuestInfo && userData.bookingGuest) {
      const isServiceAlreadySelected = currentGuestInfo.services.some(s => s.service_id === service.service_id)

      if (isServiceAlreadySelected) {
        const removeSelectedService = currentGuestInfo.services.filter(s => s.service_id !== service.service_id);
        setCurrentGuestInfo(prev => prev ? {
          ...prev,
          services: removeSelectedService
        } : null);

        // Update guestServices array, ensuring it's properly filtered when no services remain
        setCurrentGuestServices(prev => {
          const updatedGuests = prev.map(g =>
            g.id === currentGuestInfo.id
              ? { ...g, services: removeSelectedService }
              : g
          );
          // Filter out guests with no services
          return updatedGuests.filter(g => g.services.length > 0);
        });

        // Close modal immediately
        onOpenChange(false);
      } else {
        // Add service to current guest
        const updatedServices = [...currentGuestInfo.services, service];
        setCurrentGuestInfo(prev => prev ? {
          ...prev,
          services: updatedServices
        } : null);

        // Update guestServices array
        setCurrentGuestServices((prev) => {
          const existingGuestIndex = prev.findIndex(g => g.id === currentGuestInfo.id);
          if (existingGuestIndex >= 0) {
            return prev.map((g, index) =>
              index === existingGuestIndex
                ? {
                  ...g,
                  services: updatedServices,
                  barber_id: null
                }
                : g
            );
          } else {
            return [...prev, {
              id: currentGuestInfo.id,
              name: currentGuestInfo.name,
              barber_id: null,
              services: updatedServices
            }];
          }
        });

        // Close modal immediately
        onOpenChange(false);
      }
      console.log("isServiceAlreadySelected", isServiceAlreadySelected);
    } else {
      // Main user logic remains the same
      const isServiceSelected = mainUserServices.find(s => s.service_id === service.service_id);
      if (isServiceSelected) {
        setMainUserServices(mainUserServices.filter(s => s.service_id !== service.service_id));
      } else {
        setMainUserServices([...mainUserServices, service]);
      }
      // Close modal after action
      onOpenChange(false);
    }

    console.log(userData);
  }

  const isServiceSelected = isGuest
    ? currentGuestInfo?.services.some(s => s.service_id === service.service_id)
    : mainUserServices.some(s => s.service_id === service.service_id);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        placement="center"
        className="bg-gray-900"
      >
        <ModalContent>
          {() => (
            <>
              <div className="p-6 bg-gray-900">
                {/* Service Content */}
                <div className="flex flex-col gap-2">
                  {/* Title */}
                  <h1 className="text-2xl font-bold text-white">
                    {service.name}
                  </h1>

                  {/* Time and Price */}
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>{service.service_duration} min</span>
                  </div>

                  <p className="text-gray-400">
                    ${service.price}
                  </p>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Dynamic Add/Remove Button */}
                  <button
                    className={`w-full mt-4 py-3 px-4 transition-colors text-white font-medium rounded-xl ${isServiceSelected
                      ? 'bg-red-600 hover:bg-red-700 border border-red-500'
                      : 'bg-blue-600 hover:bg-blue-700 border border-blue-500'
                      }`}
                    onClick={handleServiceSelection}
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ServiceDetailsModal
