'use client'
import React, { useState, useEffect } from 'react';
import HorizontalDatePicker from './HorizontalDatePicker';
import TimeSlotPicker from './TimeSlotPicker';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, User, UserCircle } from 'lucide-react';
import { Accordion, AccordionItem, useDisclosure, AvatarGroup, Avatar } from '@heroui/react';
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react';
import { useBookingStore } from '@/store/bookingStore';
import { FetchedBarberData } from '../../../../constant/barberOptions';
import { BookingGuest } from '../../../../constant/bookingTypes';
import { BookingPerson } from '../../../../constant/bookingTypes';
import Service from '../../../../constant/ServiceType';
import Image from 'next/image';
import {
  addDays
} from 'date-fns';


interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}


// Stage 1: Fetch available dates for the date picker
const fetchAvailableDates = async (barberIds: FetchedBarberData[], numberOfDays: number, from: Date) => {
  const { userData, mainUserServices } = useBookingStore.getState()
  let totalServiceTime = 0
  if (userData.bookingGuest !== undefined && userData.bookingGuest.length > 0) {
    totalServiceTime = userData.bookingGuest.reduce((acc, guest) => {
      const guestServices: Service[] = guest.services
      const guestServiceTime = guestServices.reduce((acc, service) => {
        return acc + service.service_duration
      }, 0)
      return acc + guestServiceTime
    }, 0)
  }

  totalServiceTime += mainUserServices.reduce((acc, service) => {
    return acc + service.service_duration
  }, 0)

  console.log("totalServiceTime", totalServiceTime)
  console.log("from", from)
  const requestBody = {
    date: {
      from: from,
      to: addDays(from, numberOfDays)
    },
    barbers: barberIds.map((barber) => ({
      barber_id: barber.barber_id
    })),
    totalServiceDuration: totalServiceTime,
    // totalParticipants: (userData.bookingGuest?.length ?? 0) + 1
  }

  const response = await fetch(`/api/barbers/availability/dates?amountOfDays=${numberOfDays}&totalServiceDuration=${totalServiceTime}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch availability: ${response.status}`);
  }
  const data = await response.json()
  return data
}

// Stage 2: Fetch detailed time slots for a specific date
const fetchTimeSlots = async (barberIds: FetchedBarberData[], selectedDate: Date) => {
  const requestBody = {
    date: selectedDate.toISOString(),
    barbers: barberIds.map((barber) => ({
      barber_id: barber.barber_id,
      name: barber.first_name || barber.name
    })),
    booking_type: barberIds.length > 1 ? 'group' : 'single'
  };

  const response = await fetch('/api/barbers/time-slots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch time slots: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

// Define time slot hours statically (no randomness during rendering)
const timeSlotHours = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
];

// This function only creates slots with all available=true initially
// Randomization will happen in an effect
const createInitialTimeSlots = (date: Date): TimeSlot[] => {
  return timeSlotHours.map(time => ({
    id: `${format(date, 'yyyy-MM-dd')}-${time}`,
    time,
    available: true // All slots start as available
  }));
};

// Function to apply randomness to availability (used in useEffect)
const randomizeAvailability = (slots: TimeSlot[], date: Date): TimeSlot[] => {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  return slots.map((slot, index) => {
    const isMorning = index < 6; // Before noon

    let available = true;

    // Simulate some basic business rules with deterministic patterns
    // instead of pure randomness
    if (isWeekend && isMorning && (index % 3 === 0)) {
      available = false; // Some weekend mornings unavailable
    } else if (!isWeekend && !isMorning && (index % 2 === 1)) {
      available = false; // Some weekday afternoons unavailable
    } else if ((index + dayOfWeek) % 4 === 0) {
      available = false; // Some general unavailability
    }

    return { ...slot, available };
  });
};

interface DateTimePickerProps {
  onDateTimeSelect: (date: Date, timeSlot: TimeSlot) => void;
  initialDate?: Date;
  initialTimeId?: string;
  fetchedBarbers: FetchedBarberData[];
  isMobile: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  onDateTimeSelect,
  initialDate,
  initialTimeId,
  fetchedBarbers,
  isMobile
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const selectedBarber = useBookingStore((state) => state.selectedBarber)
  const NUMBER_OF_DAYS = 14
  const userData = useBookingStore((state) => state.userData)
  console.log("DateTimePicker / userData", userData)
  console.log("DateTimePicker / selectedBarber", selectedBarber)
  // Update available time slots when selected date changes
  useEffect(() => {
    // First create slots with all available
    const initialSlots = createInitialTimeSlots(selectedDate);
    // Then apply randomized availability in this client-side effect
    const randomizedSlots = randomizeAvailability(initialSlots, selectedDate);
    setAvailableTimeSlots(randomizedSlots);
  }, [selectedDate]);

  // ✅ Fixed: Now it's properly typed as an array
  const [currentSelectedBarber, setCurrentSelectedBarber] = useState<FetchedBarberData[]>([]);

  useEffect(() => {
    // Reset barbers array at the start of each effect run
    setCurrentSelectedBarber([]);

    const barbers: FetchedBarberData[] = [];

    // Add main user barber if present
    const mainUserBarber = fetchedBarbers.find(barber => barber.barber_id === selectedBarber);
    if (mainUserBarber) {
      barbers.push(mainUserBarber);
    }

    // Add guest barbers if present
    if (userData.bookingGuest && userData.bookingGuest.length > 0) {
      const guestBarbers = userData.bookingGuest
        .map(guest => fetchedBarbers.find(barber => barber.barber_id === guest.barber_id))
        .filter((barber): barber is FetchedBarberData => barber !== undefined);

      // Add only unique barbers (avoid duplicates)
      guestBarbers.forEach(guestBarber => {
        if (!barbers.some(b => b.barber_id === guestBarber.barber_id)) {
          barbers.push(guestBarber);
        }
      });
    }

    setCurrentSelectedBarber(barbers);

    fetchAvailableDates(barbers, NUMBER_OF_DAYS)
  }, []);


  console.log("currentSelectedBarber", currentSelectedBarber)

  // Update selected time slot if initialTimeId is provided
  useEffect(() => {
    if (initialTimeId && availableTimeSlots.length > 0) {
      const initialSlot = availableTimeSlots.find(slot => slot.id === initialTimeId);
      if (initialSlot) {
        setSelectedTimeSlot(initialSlot);
      }
    }
  }, [initialTimeId, availableTimeSlots]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time selection when date changes
  };

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    onDateTimeSelect(selectedDate, timeSlot);
  };

  const getDisabledDates = (date: Date) => {
    const disabledDates = [];
    const currentDate = new Date();


  }


  return (
    <div className="rounded-lg shadow-lg p-4 max-w-3xl mx-auto">
      <div className='flex justify-between items-center mb-4'>
        <motion.button
          onClick={() => {
            onOpen()
          }}
          className="flex items-center gap-2 px-4 py-1 rounded-full border bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out shadow-sm max-w-44 min-w-fit"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2, ease: "easeInOut" }
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Render based on number of unique barbers */}
          {currentSelectedBarber.length === 0 || currentSelectedBarber.every(barber => barber.barber_id === 0) ? (
            // No barbers selected or all are "Any professional"
            <>
              <span>
                <User className="w-5 h-5 text-white" />
              </span>
              <span className="flex-1 text-white font-medium text-sm text-left">
                Any professional
              </span>
            </>
          ) : currentSelectedBarber.length === 1 ? (
            // Single barber selected
            <>
              <span>
                {typeof currentSelectedBarber[0].profile_pic === "string" ? (
                  <Image
                    src={currentSelectedBarber[0].profile_pic}
                    className='w-5 h-5 rounded-full object-cover'
                    width={20}
                    height={20}
                    quality={100}
                    priority
                    alt="Barber profile"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </span>
              <span className="flex-1 text-white font-medium text-sm text-left">
                {currentSelectedBarber[0].name ?? currentSelectedBarber[0].first_name}
              </span>
            </>
          ) : (
            // Multiple different barbers selected - show avatar group
            <>
              <AvatarGroup
                max={3}
                size="sm"
                className="flex-shrink-0"
              >
                {currentSelectedBarber.map((barber, index) => (
                  <Avatar
                    key={`${barber.barber_id}-${index}`}
                    src={typeof barber.profile_pic === "string" ? barber.profile_pic : undefined}
                    name={barber.first_name ?? barber.name}
                    className="w-5 h-5"
                    fallback={<User className="w-5 h-5 text-gray-400" />}
                  />
                ))}
              </AvatarGroup>
              <span className="flex-1 text-white font-medium text-sm text-left">
                {currentSelectedBarber.length} professionals
              </span>
            </>
          )}

          {/* Dropdown arrow */}
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>

        <button
          className="flex items-center gap-2 px-4 py-1 rounded-full border bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out shadow-sm max-w-44 min-w-fit"
          onClick={() => {
            console.log("Hello there")
          }}
        >
          <Calendar size={20} />
        </button>
      </div>
      <div className="mb-6">
        <HorizontalDatePicker
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          daysToShow={NUMBER_OF_DAYS}
        />
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-4">
          Available time slots for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </p>

        <TimeSlotPicker
          timeSlots={availableTimeSlots}
          onTimeSelect={handleTimeSelect}
          selectedTimeId={selectedTimeSlot?.id}
        />
      </div>

      <ModelOptions
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isMobile={isMobile}
        fetchedBarbers={fetchedBarbers}
        setCurrentSelectedBarber={setCurrentSelectedBarber}
      />
    </div>
  );
};


// Helper type guard functions
// If currentUser object has the key 'type' than its the main user else a guest
function isBookingPerson(user: BookingPerson | BookingGuest | null): user is BookingPerson {
  return user !== null && 'type' in user;
}

function isBookingGuest(user: BookingPerson | BookingGuest | null): user is BookingGuest {
  return user !== null && 'id' in user;
}

interface ModelOptionsProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isMobile: boolean;
  fetchedBarbers: FetchedBarberData[];
  setCurrentSelectedBarber: React.Dispatch<React.SetStateAction<FetchedBarberData[]>>;
}





function ModelOptions({ isOpen, onOpenChange, isMobile, fetchedBarbers, setCurrentSelectedBarber }: ModelOptionsProps) {
  const userData = useBookingStore((state) => state.userData)
  const mainUserServices = useBookingStore((state) => state.mainUserServices)
  const selectedBarber = useBookingStore((state) => state.selectedBarber)
  const setSelectedBarber = useBookingStore((state) => state.setSelectedBarber)

  // Check if it's a solo booking (no guests) or group booking
  const isSoloBooking = userData.bookingGuest?.length === 0;

  return (
    isMobile ? (
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size='5xl' placement='bottom' className='bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white [&_.heroui-drawer-content]:bg-gradient-to-br [&_.heroui-drawer-content]:from-gray-900 [&_.heroui-drawer-content]:via-black [&_.heroui-drawer-content]:to-gray-900 [&_.heroui-drawer-header]:bg-transparent [&_.heroui-drawer-body]:bg-transparent'>
        <DrawerContent className="bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 bg-transparent text-white">
                {isSoloBooking ? 'Select Professional' : 'Select Professional'}
              </DrawerHeader>

              {isSoloBooking ? (
                // Solo booking - Show barber selection grid (like PerServiceBarberSelection)
                <DrawerBody className='grid grid-cols-2 gap-4 bg-transparent'>
                  {fetchedBarbers && fetchedBarbers.map((barber) => {
                    // Skip the "Select professional per service" option
                    if (barber.barber_id === -1) return null;

                    return (
                      <motion.div
                        key={barber.barber_id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          scale: selectedBarber === barber.barber_id ? 1.05 : 1,
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => {
                          setSelectedBarber(barber.barber_id);
                          // Update the local currentSelectedBarber state for UI rendering
                          setCurrentSelectedBarber([barber]);
                          onClose();
                        }}
                        className={`bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border-2 ${selectedBarber === barber.barber_id
                          ? 'border-blue-500 ring-4 ring-blue-500/30 shadow-lg shadow-blue-500/20'
                          : 'border-gray-800 hover:border-gray-700'
                          } cursor-pointer h-full`}
                      >
                        <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 h-full relative">
                          {selectedBarber === barber.barber_id && (
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
                          <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 mb-2 ${selectedBarber === barber.barber_id ? 'ring-2 ring-blue-500' : ''
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
                                alt="Barber profile"
                              />
                            )}
                          </div>
                          <h3 className="mt-2 text-xs sm:text-sm md:text-base font-bold text-white text-center">{barber.first_name ?? barber.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-400 text-center mt-1 line-clamp-2 min-h-[20px]">{barber.description ? barber.description : barber.barber_id !== -1 ? 'barber' : '\u00A0'}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </DrawerBody>
              ) : (
                // Group booking - Show current user/guest management interface
                <DrawerBody className='flex flex-col gap-4 bg-transparent'>
                  <h2 className='text-xl font-bold'>
                    {userData.first_name ? userData.first_name : 'Me'}
                  </h2>
                  {/* Main user */}
                  <div className="bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-800 py-4 px-2 flex flex-col gap-2 shadow-md items-start justify-start">
                    {mainUserServices.length > 1 ? (
                      <Accordion
                        isCompact
                        className="p-2 flex flex-col gap-1 w-full"
                      >
                        <AccordionItem
                          key={mainUserServices[0]?.service_id} aria-label="Accordion 1"
                          title={mainUserServices[0]?.name}
                          subtitle="Press to see more"
                        >
                          <div className="max-h-[50px] overflow-y-auto">
                            {mainUserServices.map((service: Service, idx) => {
                              if (idx === 0) {
                                return null; // Skip the first service since it's already in the title
                              } else {
                                return (
                                  <div key={service.service_id}>
                                    {service.name}
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      mainUserServices.length === 1 && (
                        <div key={mainUserServices[0].service_id} className="w-full">
                          <h2 className="text-lg font-medium text-white">{mainUserServices[0].name}</h2>
                        </div>
                      )
                    )}
                    <div className="flex items-center text-gray-400 text-base -mt-1 mb-1">
                      <span>{mainUserServices.reduce((acc, cur) => acc + cur.price, 0)} mins</span>
                    </div>
                    <motion.button
                      onClick={() => {
                        // Handle individual barber selection for main user
                      }}
                      className="flex items-center gap-2 px-4 py-1 rounded-full border bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out shadow-sm max-w-44 min-w-fit"
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2, ease: "easeInOut" }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Circle icon background */}
                      <span className="flex items-center justify-center w-6 h-6 rounded-full text-white">
                        {typeof fetchedBarbers.find(barber => barber.barber_id === selectedBarber)?.profile_pic !== "string" ? (
                          <UserCircle size={24} />
                        ) : (
                          <Image
                            src={fetchedBarbers.find(barber => barber.barber_id === selectedBarber)?.profile_pic as string}
                            className='w-full h-full rounded-full object-cover'
                            width={48}
                            height={48}
                            quality={100}
                            priority
                            alt="Barber profile"
                          />
                        )}
                      </span>

                      <span className="flex-1 text-white font-medium text-sm text-left">
                        {fetchedBarbers.find(barber => barber.barber_id === selectedBarber)?.first_name ?? "Any professional"}
                      </span>
                      {/* Dropdown arrow */}
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.button>
                  </div>
                </DrawerBody>
              )}
            </>
          )}
        </DrawerContent>
      </Drawer>
    ) : (
      <div className="relative">
        {isOpen && (
          <>
            <div>Desktop version placeholder</div>
          </>
        )}
      </div>
    )
  );
}


interface BarberSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isMobile: boolean;
  currentUser: BookingPerson | BookingGuest | null
}


function BarberSelectionModal({ isOpen, onOpenChange, isMobile, currentUser, fetchedBarbers, selectedBarber, setSelectedBarber }: BarberSelectionModalProps & { fetchedBarbers: FetchedBarberData[], selectedBarber: number | undefined, setSelectedBarber: (barberId: number) => void }) {
  const updateGuestBarber = useBookingStore((state) => state.updateGuestBarber);

  // Determine which barber is currently selected based on who we're viewing
  const getCurrentSelectedBarber = () => {
    if (isBookingPerson(currentUser)) {
      // For main user, use the global selectedBarber state
      return selectedBarber;
    } else if (isBookingGuest(currentUser)) {
      // For guests, use their own barber_id
      return currentUser.barber_id || 0;
    }
    return 0; // Default
  };

  const currentSelectedBarber = getCurrentSelectedBarber();

  return (
    isMobile ? (
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size='5xl' placement='bottom' className='text-black'>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                {isBookingPerson(currentUser)
                  ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'Me'
                  : isBookingGuest(currentUser)
                    ? `Guest: ${currentUser.name}`
                    : 'Select Professional'
                }
              </DrawerHeader>

              <DrawerBody className='grid grid-cols-2 gap-4'>
                {fetchedBarbers && fetchedBarbers.map((barber) => {
                  // Skip the "Select professional per service" option
                  if (barber.barber_id === -1) return null;

                  return (
                    <motion.div
                      key={barber.barber_id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        scale: currentSelectedBarber === barber.barber_id ? 1.05 : 1,
                        borderColor: currentSelectedBarber === barber.barber_id ? 'rgb(59, 130, 246)' : 'rgb(31, 41, 55)'
                      }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => {
                        if (isBookingPerson(currentUser)) {
                          // Set barber for main user
                          setSelectedBarber(barber.barber_id);
                        } else if (isBookingGuest(currentUser)) {
                          // Update the guest's barber_id in the userData store
                          updateGuestBarber(currentUser.id, barber.barber_id);
                        }
                        onClose();
                      }}
                      className={`bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border-2 ${currentSelectedBarber === barber.barber_id
                        ? 'border-blue-500 ring-4 ring-blue-500/30 shadow-lg shadow-blue-500/20'
                        : 'border-gray-800 hover:border-gray-700'
                        } cursor-pointer h-full`}
                    >
                      <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 h-full relative">
                        {currentSelectedBarber === barber.barber_id && (
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
                        <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 mb-2 ${currentSelectedBarber === barber.barber_id ? 'ring-2 ring-blue-500' : ''
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
                              alt="Barber profile"
                            />
                          )}
                        </div>
                        <h3 className="mt-2 text-xs sm:text-sm md:text-base font-bold text-white text-center">{barber.first_name ?? barber.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-400 text-center mt-1 line-clamp-2 min-h-[20px]">{barber.description ? barber.description : barber.barber_id !== -1 ? 'barber' : '\u00A0'}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    ) : (
      <div className="relative">
        {isOpen && (
          <>
            <div>BBC</div>
          </>
        )}
      </div>
    )
  );
}

export default DateTimePicker; 