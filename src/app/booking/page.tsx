'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingTypeSelector from '../components/booking/BookingTypeSelector';
import { ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { format } from 'date-fns';
import { Alert, useDisclosure, addToast, ToastProvider, Spinner } from '@heroui/react';
import UserModal from '../components/booking/UserModal';
import Button from '../components/booking/Button';
import { useAuth } from '../context/AuthContext';
import UserProfileMenu from '../components/booking/UserProfileMenu';
import Breadcrum from '../components/booking/Breadcrum'
import PercentageChip from '../components/booking/PercentageChip'
import StripedProgress from '@/app/components/booking/StripedProgress'
import Head from 'next/head';
import { useBookingStore } from '@/store/bookingStore';
import { FetchedBarberData, STATIC_BARBER_OPTIONS } from '../../../constant/barberOptions';
import dynamic from 'next/dynamic';
import ServiceSelection from '../components/booking/ServiceSelection';
import {
  startOfToday,
} from 'date-fns';
import ConfirmationModal from '../components/booking/ConfirmationModal';
import BookingSummaryModal from '../components/booking/BookingSummaryModal';

const GuestAndServices = dynamic(() => import('../components/booking/GuestAndServices'),
  {
    ssr: false,
    loading: () =>
      <div className="w-full flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
  });


const BarberSelection = dynamic(() => import('../components/booking/BarberSelection'),
  {
    ssr: false,
    loading: () =>
      <div className="w-full flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
  });

const PerServiceBarberSelection = dynamic(() => import('../components/booking/PerServiceBarberSelection'),
  {
    ssr: false,
    loading: () =>
      <div className="w-full flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
  });

const DateTimePicker = dynamic(() => import('../components/booking/DateTimePicker'),
  {
    ssr: false,
    loading: () =>
      <div className="w-full flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
  });


const Page = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  // Static options for barbers are added to the top of the list
  const [barbers, setBarbers] = useState<FetchedBarberData[]>([...STATIC_BARBER_OPTIONS]);
  const { user, isAuthenticated, logout } = useAuth();
  const userData = useBookingStore(state => state.userData);
  const setUserData = useBookingStore(state => state.setUserData);
  const resetBooking = useBookingStore(state => state.resetBooking);
  const mainUserServices = useBookingStore(state => state.mainUserServices);
  const isSelectingForGuest = useBookingStore(state => state.isSelectingForGuest);
  const setIsSelectingForGuest = useBookingStore(state => state.setIsSelectingForGuest);
  const step = useBookingStore(state => state.step);
  const setStep = useBookingStore(state => state.setStep);
  const [categories, setCategories] = useState()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalTitle, setModalTitle] = useState<'Login' | 'Sign Up'>('Login');
  const [noShowsAlert, setNoShowsAlert] = useState(true);
  const selectedBarber = useBookingStore(state => state.selectedBarber);
  const setSelectedBarber = useBookingStore(state => state.setSelectedBarber);
  const [error, setError] = useState<string>('');
  const [bookingDetails, setBookingDetails] = useState<{
    date: Date | null;
    time: string | null;
  }>({
    date: startOfToday(),
    time: null,
  });
  const [currentGuestId, setCurrentGuestId] = useState<number | undefined>(undefined);
  console.log("bookingDetails", bookingDetails)


  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Example breakpoint for mobile
    };

    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize); // Cleanup listener
  }, [])

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (user && isAuthenticated) {
      setUserData({
        type: 'registered',
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        profile_pic: user.profile_pic,
        no_shows: user.no_shows,
        bookingType: null,
        bookingGuest: []
      });

      // Check if the welcome toast has been shown
      const hasSeenToast = localStorage.getItem('hasSeenNoShowWelcomeToast');
      if (!hasSeenToast) {
        addToast({
          title: "Welcome to BluStyles!",
          description: "Please be mindful of our no-show policy. Repeated no-shows may require card validation for future bookings.",
          classNames: {
            base: "bg-gray-800 border border-gray-700 text-white rounded-lg shadow-lg",
          }
        });
        localStorage.setItem('hasSeenNoShowWelcomeToast', 'true');
      }
    } else {
      resetBooking();
    }

    // Check localStorage for noShowsAlert visibility
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('noShowsAlertVisible');
      if (stored === 'false') {
        setNoShowsAlert(false);
      }
    }
    console.log("userData / Page.booking.tsx", userData)
    // Clear any previous errors when component mounts or when auth state changes
    if (error) setError('');

  }, [user, isAuthenticated, error, setError]);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await fetch('http://localhost:3005/barbers/all?has_availability=true')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        setBarbers((prev) => [...prev, ...data.data])
        return data

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch barbers')
      }
    }

    const fetchCutsAndCategories = async () => {
      try {
        const response = await fetch('http://localhost:3005/services/services-with-categories', {
          method: 'GET'
        })
        if (!response.ok) {
          throw new Error('Unable to fetch services and categories.')
        }
        const data = await response.json()
        setCategories(data.data)
      } catch (error) {
        console.error('Unable to get cuts.', error)
        throw error;
      }
    }

    Promise.all([fetchBarbers(), fetchCutsAndCategories()])
      .catch((error) => {
        console.error('Unable to fetch data.', error)
        throw error;
      })
  }, [])

  console.log("categories", categories)

  useEffect(() => {
    // Reset isSelectingForGuest when moving away from service selection steps
    if (step !== 2 && step !== 2.5) {
      setIsSelectingForGuest(false);
    }
  }, [step]);

  //Passed to BookingTypeSelector Component
  const handleBookingSelect = () => {
    setStep(2);
  };


  //Passed to ProfessionalSelection Component
  const handleProfessionalSelect = (id: number) => {
    setSelectedBarber(id);
  }

  const handleDateTimeSelect = (date: Date, time: string) => {
    setBookingDetails({
      date,
      time,
    });

    // Automatically submit the booking after selecting date and time
    handleBookingSubmit({
      date: format(date, 'yyyy-MM-dd'),
      time: time,
    });
  };

  // Define a proper type for the form data
  interface BookingFormData {
    date?: string;
    time?: string;
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    [key: string]: string | undefined; // Fixed any type to be more specific
  }



  const handleBookingSubmit = async (formData: BookingFormData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          service: mainUserServices,
          professional: selectedBarber,
          bookingDetails: {
            date: bookingDetails.date ? format(bookingDetails.date, 'yyyy-MM-dd') : null,
            time: bookingDetails.time
          }
        }),
      });

      if (response.ok) {
        // Navigate to a success page or show a success message
        router.push('/booking/success');
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) { // Use underscore to avoid linter error for unused variable
      // Handle error state
      console.error(error)
      setError('Booking submission failed. Please try again.');
    }
  };

  // Generate structured data for the booking page
  const generateStructuredData = () => {
    // Use a fixed date rather than new Date() to prevent hydration mismatch
    const currentDate = new Date(Date.now());
    // Format dates as strings to make them consistent between server/client
    const availabilityStart = currentDate.toISOString().split('T')[0];

    // Calculate date 3 months from now but in a predictable way
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + 3);
    const availabilityEnd = endDate.toISOString().split('T')[0];

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Hair Salon Booking',
      'provider': {
        '@type': 'LocalBusiness',
        'name': 'BluStyles Salon',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '123 Main Street', // Replace with actual address
          'addressLocality': 'New York', // Replace with actual city
          'addressRegion': 'NY', // Replace with actual state
          'postalCode': '10001', // Replace with actual zip
          'addressCountry': 'US'
        },
        'telephone': '+1-212-555-0000', // Replace with actual phone
        'url': 'https://blustyles.com'
      },
      'offers': {
        '@type': 'Offer',
        'availability': 'https://schema.org/InStock',
        'availabilityStarts': availabilityStart,
        'availabilityEnds': availabilityEnd,
        'priceCurrency': 'USD'
      }
    };
    return JSON.stringify(structuredData);
  };

  // Memoize the structured data to ensure consistency
  const structuredDataJSON = React.useMemo(() => generateStructuredData(), []);

  // Set page title based on the current step
  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Choose Booking Type | BluStyles Booking';
      case 2: return 'Select Service | BluStyles Booking';
      case 3: return 'Choose Professional | BluStyles Booking';
      case 4: return 'Select Date & Time | BluStyles Booking';
      default: return 'Book an Appointment | BluStyles Hair Salon';
    }
  };

  return (
    <>
      <Head>
        <title>{getStepTitle()}</title>
        <meta name="description" content="Schedule your hair appointment at BluStyles. Choose your preferred service, stylist, date and time." />
      </Head>

      {/* Add ToastProvider here */}
      <ToastProvider placement="bottom-right" toastOffset={60} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredDataJSON }}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
        <header className='flex justify-between items-center w-full px-4 sm:px-6 md:px-8 py-4 md:py-6 max-w-7xl mx-auto mb-6'>
          <div className='w-12 sm:w-16'>
            {step > 1 ? (
              <button
                onClick={() => {
                  // If the user is on the service selection step and the booking type is group, clear the booking guest array
                  const step = useBookingStore.getState().step;
                  if (step === 2 && userData.bookingType === 'group') {
                    userData.bookingGuest?.splice(0, userData.bookingGuest.length)
                  }

                  if (step === 2.5 && userData.bookingType === 'group') {
                    setStep(step - 0.5);
                  } else if (step === 3 && userData.bookingType === 'group') {
                    setStep(2.5);
                  } else if (step === 3.5 && userData.bookingType === 'group') {
                    setStep(3);
                  } else {
                    setStep(step - 1);
                  }

                }}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Go back to previous step"
              >
                <ArrowLeft color='white' size={24} className="sm:w-8 sm:h-8" />
              </button>
            ) : (
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Return to homepage"
              >
                <X color='white' size={24} className="sm:w-8 sm:h-8" />
              </button>
            )}
          </div>
          {user && isAuthenticated && userData ? (
            <UserProfileMenu
              userData={{
                first_name: userData.first_name || '',
                no_shows: userData.no_shows || 0,
                profile_pic: userData?.profile_pic || '',
                type: userData.type
              }}
              logout={logout}
            />
          ) : (
            <div className='flex gap-4'>
              <Button onOpen={onOpen} setModalTitle={setModalTitle} title={'Sign Up'} />
              <Button onOpen={onOpen} setModalTitle={setModalTitle} title={'Login'} />
            </div>
          )}
        </header>

        {noShowsAlert && (
          <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-12'>
            <AnimatePresence>
              {noShowsAlert && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Alert
                    color="primary"
                    description={"Verified users with clean records can book instantly. Others will need to secure bookings with a card (processed via Stripe)."}
                    isVisible={noShowsAlert}
                    title={"Booking Security"}
                    variant="solid"
                    className='w-full bg-blue-500/10 border border-blue-500/20 [&_svg]:text-[#60A5FA] text-[#60A5FA]'
                    onClose={() => {
                      setNoShowsAlert((prev) => !prev)
                      localStorage.setItem('noShowsAlertVisible', 'false');
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-12 flex-grow">

          {/* Progress Bar Container */}
          {hasMounted && !isMobile && (
            <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <Breadcrum currentStep={step} />
                  <PercentageChip percentage={Number(Math.round((step / 4) * 100))} />
                </div>

                {/* Progress Bar */}
                <div className="overflow-hidden mb-4 mt-2 text-xs flex rounded" aria-label={`Booking progress: ${Math.round((step / 4) * 100)}% complete`}>
                  <StripedProgress progress={(step / 4) * 100} />
                </div>
              </div>
            </div>
          )}


          {/* Content Container */}
          <div className="w-full flex justify-center">
            <AnimatePresence mode='wait'>
              {(() => {
                const getStepComponent = () => {
                  switch (step) {
                    case 1:
                      return (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="w-full max-w-xl"
                        >
                          <BookingTypeSelector onBookingSelect={handleBookingSelect} />
                        </motion.div>
                      );
                    case 2:
                      return (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="w-full max-w-6xl"
                        >
                          {categories && (
                            <ServiceSelection
                              isMobile={isMobile}
                              isGuest={isSelectingForGuest}
                              guestId={currentGuestId}
                              categories={categories}
                            />
                          )}
                        </motion.div>
                      );
                    case 2.5:
                      if (userData.bookingType === 'group') {
                        return (
                          <motion.div
                            key="step2.5"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-6xl"
                          >
                            <GuestAndServices
                              mainUserServices={mainUserServices}
                              isMobile={isMobile}
                              // Callback function if user clicks on add guest
                              onAddGuest={() => {
                                setIsSelectingForGuest(true);
                                setStep(2); // Go back to service selection
                              }}
                              setCurrentGuestId={setCurrentGuestId}
                            />
                          </motion.div>
                        );
                      }
                      return null;
                    case 3:
                      return (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="w-full max-w-6xl"
                        >
                          <BarberSelection
                            onProfessionalSelect={handleProfessionalSelect}
                            selectedBarber={selectedBarber}
                            currentBarbers={barbers}
                          />
                        </motion.div>
                      );
                    case 3.5:
                      return (
                        <motion.div
                          key="step3.5"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="w-full max-w-6xl"
                        >
                          <PerServiceBarberSelection
                            isMobile={isMobile}
                            fetchedBarbers={barbers}
                          />
                        </motion.div>
                      );
                    case 4:
                      return (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="w-full max-w-6xl"
                        >
                          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2">
                            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                              Select Date & Time
                            </span>
                          </h1>
                          <DateTimePicker
                            onDateTimeSelect={(date, timeSlot) => handleDateTimeSelect(date, timeSlot.time)}
                            initialDate={bookingDetails.date || undefined}
                            initialTimeId={bookingDetails.time ? `${format(bookingDetails.date || new Date(), 'yyyy-MM-dd')}-${bookingDetails.time}` : undefined}
                            fetchedBarbers={barbers}
                            isMobile={isMobile}
                          />
                        </motion.div>
                      );
                    default:
                      return null;
                  }
                };

                return getStepComponent();
              })()}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* User Sign-in/Login Modal */}
      <UserModal isOpen={isOpen} onOpenChange={onOpenChange} title={modalTitle} setError={setError} />

      {/* Centralized Modal Manager - Renders appropriate modal based on step */}
      {(() => {
        // Helper function to determine which modal to show and with what props
        const getModalConfig = () => {
          switch (step) {
            case 2:
              // Service Selection Step - only for main user, not guests
              if (!isSelectingForGuest) {
                return {
                  type: 'confirmation' as const,
                  props: {
                    isGuest: false, // Always false since this is main user
                    currentGuestServices: [], // Not needed for main user
                    currentGuestId: null, // Not needed for main user  
                    selectedProfessional: selectedBarber
                  }
                };
              }
              // If selecting for guest, let ServiceSelection handle its own modal
              return null;

            case 2.5:
              // Guest and Services Step (Group booking)
              if (userData.bookingType === 'group') {
                return {
                  type: 'confirmation' as const,
                  props: {
                    isGuest: false,
                    currentGuestServices: userData.bookingGuest || [],
                    currentGuestId: null,
                    selectedProfessional: selectedBarber
                  }
                };
              }
              return null;

            case 3:
              // Professional Selection Step
              return {
                type: 'summary' as const
              };

            case 3.5:
              // Per-Service Professional Selection Step
              return {
                type: 'summary' as const
              };

            default:
              return null;
          }
        };

        const modalConfig = getModalConfig();

        if (!modalConfig) return null;

        if (modalConfig.type === 'confirmation') {
          return (
            <ConfirmationModal
              isGuest={modalConfig.props.isGuest}
              currentGuestServices={modalConfig.props.currentGuestServices}
              currentGuestId={modalConfig.props.currentGuestId}
              selectedProfessional={modalConfig.props.selectedProfessional}
            />
          );
        }

        if (modalConfig.type === 'summary') {
          return <BookingSummaryModal />;
        }

        return null;
      })()}
    </>
  );
};

export default Page; 