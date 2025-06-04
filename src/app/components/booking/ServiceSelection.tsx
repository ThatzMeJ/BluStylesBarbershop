'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, ArrowLeft, Plus, Check, UserCircle } from 'lucide-react';
import Service from '../../../../constant/ServiceType'
import {
    BookingGuest
} from '../../../../constant/bookingTypes';
import { useDisclosure } from '@heroui/react';
import ServiceDetailsModal from './ServiceDetailsModal';
import { useBookingStore } from '@/store/bookingStore';
import ConfirmationModal from './ConfirmationModal';

interface ServiceCategory {
    name: string;
    category_id: number
    services: Service[];
}

interface ServiceSelectionProps {
    isMobile: boolean,
    isGuest: boolean;
    guestId?: number;
    categories: ServiceCategory[];
}

interface CurrentGuest {
    id: number;
    name: string;
    services: Service[];
}

const ServiceSelection = ({ isMobile, isGuest, guestId, categories }: ServiceSelectionProps) => {

    // The guest currently being edited
    const [currentGuestInfo, setCurrentGuestInfo] = useState<CurrentGuest | null>(null);
    // To hold total services for all guests in the current booking session
    const [currentGuestServices, setCurrentGuestServices] = useState<Array<BookingGuest>>([]);
    console.log("currentGuestServices", currentGuestServices)
    // Initialize activeFilter with the ID of the first category (if categories exist)
    const [activeFilter, setActiveFilter] = useState(categories.length > 0 ? categories[0].category_id : 0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [currentSelectedService, setCurrentSelectedService] = useState<Service | null>(null)
    const userData = useBookingStore(state => state.userData);
    const mainUserServices = useBookingStore(state => state.mainUserServices);
    const setMainUserServices = useBookingStore(state => state.setMainUserServices);
    const setStep = useBookingStore(state => state.setStep);

    console.log("currentGuestId", currentGuestInfo)
    // Create refs for each filter section
    const filterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const observerRef = useRef<IntersectionObserver | null>(null);
    console.log("ObserverRef", observerRef)
    // Function to set refs
    const setFilterRef = (id: number) => (el: HTMLDivElement | null) => {
        // console.log(`setFilterRef called for ${id} with element:`, el?.id);
        if (el) {
            filterRefs.current[id] = el;
            console.log(`Observing element with ID: ${el.id}`);
            // Observe the new element if observer exists
            if (observerRef.current) {
                observerRef.current.observe(el);
            }
        } else if (filterRefs.current[id] && observerRef.current) {
            // console.log(`Unobserving element for ${id}`);
            // Unobserve removed elements
            observerRef.current.unobserve(filterRefs.current[id]!);
            filterRefs.current[id] = null;
        }
    };




    // Function to handle filter click and smooth scroll
    const handleFilterClick = (id: number) => {
        console.log("id", id)
        setActiveFilter(id);
        const element = filterRefs.current[id];
        if (element) {
            // Calculate scroll position to center the element
            const elementRect = element.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);

            window.scrollTo({
                top: middle,
                behavior: 'smooth'
            });
        }
    };

    // Use intersection observer to set active filter
    useEffect(() => {
        // Create an intersection observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                // Find the most visible section
                let maxVisibility = 0;
                let mostVisibleSection = null;

                entries.forEach((entry) => {
                    // Extract the numeric ID from the section ID (e.g., "4-services" -> 4)
                    const sectionId = parseInt(entry.target.id);
                    console.log('Processing section:', entry.target.id, 'parsed ID:', sectionId);

                    if (entry.isIntersecting) {
                        // Calculate how much of the section is visible
                        const visibleHeight = Math.min(entry.intersectionRect.bottom, window.innerHeight) - Math.max(entry.intersectionRect.top, 0);

                        const visibility = visibleHeight / window.innerHeight;

                        console.log('Section visibility:', {
                            id: sectionId,
                            visibility,
                            currentMax: maxVisibility
                        });

                        if (visibility > maxVisibility) {
                            maxVisibility = visibility;
                            mostVisibleSection = sectionId;
                        }
                    }
                });

                // Update active filter if we found a visible section
                if (mostVisibleSection !== null && maxVisibility > 0.3) { // Threshold of 30% visibility
                    console.log('Setting active filter to:', mostVisibleSection);
                    setActiveFilter(mostVisibleSection);
                }
            },
            {
                root: null,
                rootMargin: '-10% 0px -10% 0px', // Reduced margin to make it more sensitive
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] // Multiple thresholds for smoother detection
            }
        );

        // Cleanup
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [categories]); // Add filters to dependencies since we're using it inside


    // Get scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    // Get services from local storage and set current guest services
    useEffect(() => {
        const storedCuts = localStorage.getItem('cuts');
        if (storedCuts) {
            // setServices(JSON.parse(storedCuts));
        }

        if (guestId !== undefined) {
            // Check if this guest already exists in userData.bookingGuest
            const existingGuest: BookingGuest | undefined = userData.bookingGuest?.find(g => g.id === guestId);

            if (existingGuest) {
                // If guest exists, set their current services
                setCurrentGuestInfo({
                    id: existingGuest.id,
                    name: existingGuest.name,
                    services: existingGuest.services
                });
                setCurrentGuestServices([existingGuest]);
            } else {
                // If new guest, initialize with empty services
                setCurrentGuestInfo({
                    id: guestId,
                    name: `Guest ${guestId}`,
                    services: []
                });
            }
        }
    }, [guestId, userData.bookingGuest]);



    // Update the service selection handler
    const handleServiceSelection = (service: Service) => {
        console.log(service)
        if (isGuest && currentGuestInfo) {
            const isServiceSelected = currentGuestInfo.services.some(s => s.service_id === service.service_id);

            // If the service is already selected, remove it from the current guest
            if (isServiceSelected) {
                // Remove service from current guest
                const updatedServices = currentGuestInfo.services.filter(s => s.service_id !== service.service_id);
                setCurrentGuestInfo(prev => prev ? {
                    ...prev,
                    services: updatedServices
                } : null);

                // Update guestServices array
                setCurrentGuestServices(prev => prev.map(g =>
                    g.id === currentGuestInfo.id
                        ? { ...g, services: updatedServices }
                        : g
                ).filter(g => g.services.length > 0));
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
                            services: updatedServices,
                            barber_id: null
                        }];
                    }
                });
            }
        } else {
            // Handle main user service selection
            const isAlreadySelected = mainUserServices.some(s => s.service_id === service.service_id);
            if (isAlreadySelected) {
                setMainUserServices(mainUserServices.filter(s => s.service_id !== service.service_id));
            } else {
                setMainUserServices([...mainUserServices, service]);
            }
        }
    };

    // Update the service selection button based on guest or user
    const isServiceSelected = (service: Service) => {
        if (isGuest && currentGuestInfo) {
            return currentGuestInfo.services.some(s => s.service_id === service.service_id);
        }
        return mainUserServices.some(s => s.service_id === service.service_id);
    };



    return (
        <>
            <section className="w-full" aria-labelledby="service-selection-title">
                <AnimatePresence>
                    {scrollPosition > 250 && isMobile && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.1, ease: "easeOut" }}
                            className='fixed left-0 right-0 w-screen bg-gradient-to-br from-gray-800 via-black to-gray-800 border-t border-gray-700 min-h-[7.5rem] top-0 z-50 px-4 sm:px-6 md:px-8 pt-2'
                        >
                            <div className='flex flex-col gap-7'>
                                <div className='flex flex-row space-x-4 justify-start items-center'>
                                    <button
                                        onClick={() => {
                                            const step = useBookingStore.getState().step;
                                            setStep(step - 1);
                                        }}
                                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                                        aria-label="Go back to previous step"
                                    >
                                        <ArrowLeft color='white' size={24} className="sm:w-8 sm:h-8" />
                                    </button>
                                    <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent text-lg font-bold">
                                        Select services
                                    </span>
                                </div>

                                <div className="relative -mx-4">
                                    <div className="overflow-x-auto scrollbar-hide">
                                        <div className="flex space-x-2 sm:space-x-4 whitespace-nowrap px-4" role="tablist" aria-label="Service filters">
                                            {categories.map((category) => (
                                                <button
                                                    key={category.category_id}
                                                    onClick={() => handleFilterClick(category.category_id)}
                                                    className={`flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 rounded-full transition-all duration-200 text-xs sm:text-sm ${activeFilter === category.category_id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                        }`}
                                                    role="tab"
                                                    aria-selected={activeFilter === category.category_id}
                                                    aria-controls={`${category.category_id}-services`}
                                                    id={`${category.category_id}-tab`}
                                                >
                                                    <span>{category.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col items-start gap-4 text-3xl sm:text-4xl md:text-5xl font-bold text-start mb-6 sm:mb-8">
                    <h1 id="service-selection-title" className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        Select services
                    </h1>
                    {/* Conditionally render image/icon only if bookingType is 'group' */}
                    {userData && userData.bookingType === 'group' && userData.bookingGuest && (
                        <>
                            <div className='flex justify-start items-center gap-2'>
                                {userData.profile_pic && !isGuest ? (
                                    <Image
                                        src={userData.profile_pic}
                                        alt="User profile picture"
                                        width={48}
                                        height={48}
                                        className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
                                    />
                                ) : (
                                    <UserCircle size={48} className="text-gray-400 w-10 h-10 sm:w-12 sm:h-12" />
                                )}
                                <span className='text-xl md:text-3xl'>
                                    {isGuest ? `Guest ${guestId || (userData.bookingGuest?.length ?? 0) + 1}` : userData.first_name ? userData.first_name : 'Me'}
                                </span>
                            </div>
                        </>
                    )}
                </div>
                {/* Check if screen size is mobile */}
                {!isMobile ? (
                    <>
                        {/* Search Bar */}
                        <div className="relative max-w-md mx-auto mb-6 sm:mb-8">
                            <label htmlFor="service-search" className="sr-only">Search services</label>
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                id="service-search"
                                type="text"
                                placeholder="Search services..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white text-sm sm:text-base"

                                aria-label="Search for services"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap justify-center items-center gap-4 mb-6 sm:mb-8 w-full max-w-4xl mx-auto px-4" role="tablist" aria-label="Service filters">
                            {categories.map((category) => (
                                <button
                                    key={category.category_id}
                                    onClick={() => handleFilterClick(category.category_id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 text-sm ${activeFilter === category.category_id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    role="tab"
                                    aria-selected={activeFilter === category.category_id}
                                    aria-controls={`${category.category_id}-services`}
                                    id={`${category.category_id}-tab`}
                                >
                                    <span>{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="relative mb-6 sm:mb-8">
                        <div className="overflow-x-auto scrollbar-hide pb-2 -mb-2">
                            <div className="flex space-x-2 sm:space-x-4 whitespace-nowrap px-4 sm:px-0" role="tablist" aria-label="Service filters">
                                {categories.map((category) => (
                                    <button
                                        key={category.category_id}
                                        onClick={() => handleFilterClick(category.category_id)}
                                        className={`flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 rounded-full transition-all duration-200 text-xs sm:text-sm ${activeFilter === category.category_id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            }`}
                                        role="tab"
                                        aria-selected={activeFilter === category.category_id}
                                        aria-controls={`${category.category_id}-services`}
                                        id={`${category.category_id}-tab`}
                                    >
                                        <span>{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}



                {/* Filtered Services */}
                <div className="flex flex-col gap-4 sm:gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.category_id}
                            ref={setFilterRef(category.category_id)}
                            id={String(category.category_id)}
                            className='cursor-pointer'
                        >
                            <h1
                                className='font-bold text-xl mb-4'
                                role="tab"
                                aria-selected={activeFilter === category.category_id}
                                aria-controls={`${category.category_id}-services`}
                                id={`${category.category_id}-tab`}
                            >
                                {category.name}
                            </h1>
                            {category.services.map((service: Service) => (
                                <motion.article
                                    key={service.service_id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => {
                                        onOpen()
                                        setCurrentSelectedService(service)
                                    }}
                                    className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-800 shadow-lg mb-5 group hover:border-blue-500/50 hover:shadow-blue-500/10"
                                >
                                    <div className="p-4 flex flex-row ">
                                        <div className='flex flex-col flex-grow gap-2 pr-4'>
                                            <header className="flex justify-between items-start">
                                                <h3 className="text-lg sm:text-xl font-bold text-white">{service.name}</h3>
                                            </header>
                                            <div className="flex justify-between items-center text-gray-400 text-sm sm:text-base">
                                                <div className="flex items-center ">
                                                    <Clock className="w-4 h-4 mr-1" aria-hidden="true" />
                                                    <span className='text-base'>{service.service_duration} mins</span>
                                                </div>
                                            </div>
                                            <p className="text-sm sm:text-base text-gray-400 line-clamp-2">{service.description}</p>
                                            <span>${service.price}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleServiceSelection(service);
                                            }}
                                            className={`min-w-10 min-h-10 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base my-auto flex flex-grow-0 justify-center items-center ${isServiceSelected(service)
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                            aria-label={`${isServiceSelected(service) ? 'Deselect' : 'Select'} ${service.name} service`}
                                            aria-pressed={isServiceSelected(service)}
                                        >
                                            {isServiceSelected(service) ? <Check /> : <Plus />}
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    ))}
                </div>

            </section >


            {/* Confirmation bottom modal to continue the booking flow */}
            {isGuest && (
                <ConfirmationModal isGuest={isGuest} currentGuestServices={currentGuestServices} currentGuestId={currentGuestInfo} selectedProfessional={undefined} />
            )}


            {currentSelectedService && (
                <ServiceDetailsModal
                    onOpen={onOpen}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    service={currentSelectedService}
                    isGuest={isGuest}
                    currentGuestInfo={currentGuestInfo}
                    setCurrentGuestInfo={setCurrentGuestInfo}
                    setCurrentGuestServices={setCurrentGuestServices}
                />
            )}
        </>
    );
};

export default ServiceSelection;