'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceSelection from '../components/booking/ServiceSelection';
import BookingTypeSelector from '../components/booking/BookingTypeSelector ';
import { ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation'
import ProfessionalSelection from '../components/booking/ProfessionalSelection ';
import { format } from 'date-fns';
import Calendar from '../components/booking/Calendar';
import { Alert, useDisclosure, addToast, ToastProvider } from '@heroui/react';
import UserModal from '../components/booking/UserModal';
import Button from '../components/booking/Button';
import { useAuth } from '../context/AuthContext';
import UserProfileMenu from '../components/booking/UserProfileMenu';
import Breadcrum from '../components/booking/Breadcrum'
import PercentageChip from '../components/booking/PercentageChip'
import StripedProgress from '@/app/components/booking/StripedProgress'
import Head from 'next/head';
import GuestAndServices from '../components/booking/GuestAndServices'
// Import the moved types
import {
  BookingPerson,
  BookingGuest
} from '../../../constant/bookingTypes';
import Service from '../../../constant/ServiceType';

const Page = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [userData, setUserData] = useState<BookingPerson>({
    type: 'guest',
    firstName: user?.first_name,
    lastName: user?.last_name,
    email: user?.email,
    phoneNumber: user?.phone_number,
    profile_pic: user?.profile_pic,
    no_shows: user?.no_shows,
    bookingType: null,
    bookingGuest: Array<BookingGuest>()
  });
  const [selectedService, setSelectedService] = useState<Array<Service>>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalTitle, setModalTitle] = useState<'Login' | 'Sign Up'>('Login');
  const [noShowsAlert, setNoShowsAlert] = useState(true);
  const [step, setStep] = useState<number>(1);
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [bookingDetails, setBookingDetails] = useState<{
    date: Date | null;
    time: string | null;
  }>({
    date: null,
    time: null,
  });
  const [isSelectingForGuest, setIsSelectingForGuest] = useState(false);

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
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: user.phone_number,
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
      setUserData({
        type: 'guest',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        bookingType: null,
        bookingGuest: []
      });
    }

    // Check localStorage for noShowsAlert visibility
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('noShowsAlertVisible');
      if (stored === 'false') {
        setNoShowsAlert(false);
      }
    }

    // Clear any previous errors when component mounts or when auth state changes
    if (error) setError('');

  }, [user, isAuthenticated, error, setError]);

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

  //Passed to ServiceSelction Component
  const handleServiceSelect = (service: Service) => {
    if (isSelectingForGuest) {
      // If selecting for a guest, add the service to the guest's services
      const newGuest: BookingGuest = {
        name: `Guest ${userData.bookingGuest?.length ?? 0 + 1}`,
        services: [service]
      };
      setUserData(prev => ({
        ...prev,
        bookingGuest: [...(prev.bookingGuest ?? []), newGuest]
      }));
      // After selecting services for guest, go back to guest management
      setStep(2.5);
      setIsSelectingForGuest(false);
    } else {
      // Normal service selection for main user
      const isAlreadySelected = selectedService.some(s => s.id === service.id);
      if (isAlreadySelected) {
        setSelectedService(prev => prev.filter(s => s.id !== service.id));
      } else {
        setSelectedService(prev => [...prev, service]);
      }
    }
  };

  //Passed to ProfessionalSelection Component
  const handleProfessionalSelect = (id: number) => {
    setSelectedProfessional(id);
    setStep(4);
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
          service: selectedService,
          professional: selectedProfessional,
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
        'availabilityStarts': new Date().toISOString(),
        'availabilityEnds': new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
        'priceCurrency': 'USD'
      }
    };
    return JSON.stringify(structuredData);
  };

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
        dangerouslySetInnerHTML={{ __html: generateStructuredData() }}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
        <header className='flex justify-between items-center w-full px-4 sm:px-6 md:px-8 py-4 md:py-6 max-w-7xl mx-auto mb-6'>
          <div className='w-12 sm:w-16'>
            {step > 1 ? (
              <button
                onClick={() => {
                  // If the user is on the service selection step and the booking type is group, clear the booking guest array
                  if (step === 2 && userData.bookingType === 'group') {
                    userData.bookingGuest?.splice(0, userData.bookingGuest.length)
                  }

                  if (step === 2.5 && userData.bookingType === 'group') {
                    setStep(step => step - 0.5);
                  } else {
                    setStep(step => step - 1);
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
                first_name: userData.firstName || '',
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
                          <BookingTypeSelector onBookingSelect={handleBookingSelect} setUserData={setUserData} />
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
                          <ServiceSelection
                            setSelectedService={handleServiceSelect}
                            setStep={setStep}
                            isMobile={isMobile}
                            selectedService={selectedService}
                            userData={userData}
                            isGuest={isSelectingForGuest}
                            setIsSelectingForGuest={setIsSelectingForGuest}
                          />
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
                              userData={userData}
                              selectedService={selectedService}
                              isMobile={isMobile}
                              onAddGuest={() => {
                                setIsSelectingForGuest(true);
                                setStep(2); // Go back to service selection
                              }}
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
                          <ProfessionalSelection
                            onProfessionalSelect={handleProfessionalSelect}
                            selectedProfessional={selectedProfessional}
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
                          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
                            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                              Select Date & Time
                            </span>
                          </h1>
                          <Calendar
                            onDateTimeSelect={handleDateTimeSelect}
                            selectedDate={bookingDetails.date}
                            selectedTime={bookingDetails.time}
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
    </>
  );
};

export default Page; 