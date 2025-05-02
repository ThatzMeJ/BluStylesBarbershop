import React from 'react'
import {
  Modal,
  ModalContent,
} from "@heroui/react";
import Service from '../../../../constant/ServiceType';

interface ServiceDetailsModalProps {
  isOpen: boolean;
  selectedService: Array<Service>;
  setSelectedService: (services: Service) => void;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  onAddGuestService: () => void;
  service: Service;
  isGuest: boolean;
}

const ServiceDetailsModal = ({ isOpen, onOpenChange, service, selectedService, setSelectedService, isGuest, onAddGuestService }: ServiceDetailsModalProps) => {
  const buttonText = isGuest
    ? selectedService.find(s => s.id === service.id)
      ? "Remove from guest's services"
      : "Add to guest's services"
    : selectedService.find(s => s.id === service.id)
      ? "Remove from my services"
      : "Add to my services";

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
                    <span>{service.time} min</span>
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
                    className={`w-full mt-4 py-3 px-4 transition-colors text-white font-medium rounded-xl ${selectedService.find(s => s.id === service.id)
                      ? 'bg-red-600 hover:bg-red-700 border border-red-500'
                      : 'bg-blue-600 hover:bg-blue-700 border border-blue-500'
                      }`}
                    onClick={() => {
                      if (isGuest) {
                        onAddGuestService();
                      } else {
                        setSelectedService(service);
                      }
                      onOpenChange(false);
                    }}
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
