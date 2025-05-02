import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, Star, Scissors, Search, ArrowLeft, Plus, Check, UserCircle } from 'lucide-react';
import Service from '../../../../constant/ServiceType'
import {
    BookingPerson,
    BookingGuest
} from '../../../../constant/bookingTypes';
import { useDisclosure } from '@heroui/react';
import ServiceDetailsModal from './ServiceDetailsModal';

interface ServiceSelectionProps {
    setSelectedService: (service: Service) => void,
    selectedService: Array<Service>,
    isMobile: boolean,
    setStep: React.Dispatch<React.SetStateAction<number>>;
    userData: BookingPerson
    isGuest: boolean
    setIsSelectingForGuest:  React.Dispatch<React.SetStateAction<boolean>>
}

const ServiceSelection = ({ setSelectedService, selectedService, isMobile, setStep, userData, isGuest, setIsSelectingForGuest }: ServiceSelectionProps) => {
    console.log("userData", userData)
    const [services, setServices] = useState<Service[]>([]);
    const [guestServices, setGuestServices] = useState<Array<BookingGuest>>([]);
    const [activeFilter, setActiveFilter] = useState(1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [serviceModal, setServiceModal] = useState<Service | null>(null)

    // Create refs for each filter section
    const filterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const observerRef = useRef<IntersectionObserver | null>(null);
    console.log("services", filterRefs)
    console.log("activeFilter", observerRef)
    // Function to set refs
    const setFilterRef = (id: number) => (el: HTMLDivElement | null) => {
        console.log(`setFilterRef called for ${id} with element:`, el?.id);
        if (el) {
            filterRefs.current[id] = el;
            console.log(`Observing element with ID: ${el.id}`);
            // Observe the new element if observer exists
            if (observerRef.current) {
                observerRef.current.observe(el);
            }
        } else if (filterRefs.current[id] && observerRef.current) {
            console.log(`Unobserving element for ${id}`);
            // Unobserve removed elements
            observerRef.current.unobserve(filterRefs.current[id]!);
            filterRefs.current[id] = null;
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const filters = [
        { id: 1, name: 'Featured', icon: Scissors },
        { id: 2, name: 'Hair', icon: TrendingUp },
        { id: 3, name: 'Packages & Deals', icon: Clock },
        { id: 4, name: 'Razor & Facial Services', icon: Star },
    ];

    // Function to handle filter click and smooth scroll
    const handleFilterClick = (id: number) => {
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
                        const visibleHeight = Math.min(entry.intersectionRect.bottom, window.innerHeight) -
                            Math.max(entry.intersectionRect.top, 0);
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
    }, [filters]); // Add filters to dependencies since we're using it inside

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

    useEffect(() => {
        const storedCuts = localStorage.getItem('cuts');
        if (storedCuts) {
            // setServices(JSON.parse(storedCuts));
        }

        // Mock data with categorized services
        setServices(mockServices);
    }, []);

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

    // Update the service selection handler
    const handleServiceSelection = (service: Service) => {
        if (isGuest) {
            const isServiceSelected = guestServices.some(g => g.services.some(s => s.id === service.id));
            if (isServiceSelected) {
                setGuestServices(prev => prev.map(g => ({
                    ...g,
                    services: g.services.filter(s => s.id !== service.id)
                })).filter(g => g.services.length > 0));
            } else {
                const newGuestService: BookingGuest = {
                    name: '', // This will be filled in later
                    services: [service]
                };
                setGuestServices(prev => [...prev, newGuestService]);
            }
        } else {
            setSelectedService(service);
        }
    };

    // Update the service selection button
    const isServiceSelected = (service: Service) => {
        if (isGuest) {
            return guestServices.some(g => g.services.some(s => s.id === service.id));
        }
        return selectedService.some(s => s.id === service.id);
    };

    // Update the total calculations
    const calculateTotals = () => {
        const services = isGuest
            ? guestServices.flatMap(g => g.services)
            : selectedService;
        const totalMinutes = services.reduce((sum, service) => sum + service.time, 0);
        const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
        return { totalMinutes, totalPrice };
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
                                        onClick={() => setStep((step) => step - 1)}
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
                                            {filters.map(({ id, name, icon: Icon }) => (
                                                <button
                                                    key={id}
                                                    onClick={() => handleFilterClick(id)}
                                                    className={`flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 rounded-full transition-all duration-200 text-xs sm:text-sm ${activeFilter === id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                        }`}
                                                    role="tab"
                                                    aria-selected={activeFilter === id}
                                                    aria-controls={`${id}-services`}
                                                    id={`${id}-tab`}
                                                >
                                                    <Icon size={16} aria-hidden="true" />
                                                    <span>{name}</span>
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
                                {userData.profile_pic ? (
                                    <Image
                                        src={userData.profile_pic}
                                        alt="User profile picture"
                                        width={48} // Adjust size as needed
                                        height={48}
                                        className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
                                    />
                                ) : (
                                    <UserCircle size={48} className="text-gray-400 w-10 h-10 sm:w-12 sm:h-12" />
                                )}
                                <span className='text-xl md:text-3xl'>{isGuest ? `Guest ${userData.bookingGuest?.length + 1}` : 'Me'}</span>
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
                            {filters.map(({ id, name, icon: Icon }) => (
                                console.log(id, name, Icon),
                                <button
                                    key={id}
                                    onClick={() => handleFilterClick(id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 text-sm ${activeFilter === id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    role="tab"
                                    aria-selected={activeFilter === id}
                                    aria-controls={`${id}-services`}
                                    id={`${id}-tab`}
                                >
                                    <Icon size={16} aria-hidden="true" />
                                    <span>{name}</span>
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="relative mb-6 sm:mb-8">
                        <div className="overflow-x-auto scrollbar-hide pb-2 -mb-2">
                            <div className="flex space-x-2 sm:space-x-4 whitespace-nowrap px-4 sm:px-0" role="tablist" aria-label="Service filters">
                                {filters.map(({ id, name, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => handleFilterClick(id)}
                                        className={`flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 rounded-full transition-all duration-200 text-xs sm:text-sm ${activeFilter === id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            }`}
                                        role="tab"
                                        aria-selected={activeFilter === id}
                                        aria-controls={`${id}-services`}
                                        id={`${id}-tab`}
                                    >
                                        <Icon size={16} aria-hidden="true" />
                                        <span>{name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}



                {/* Filtered Services */}
                <div className="flex flex-col gap-4 sm:gap-6">
                    {filters.map(({ id, name }) => (
                        <div
                            key={id}
                            ref={setFilterRef(id)}
                            id={String(id)}
                            className='cursor-pointer'
                        >
                            <h1
                                className='font-bold text-xl'
                                role="tab"
                                aria-selected={activeFilter === id}
                                aria-controls={`${id}-services`}
                                id={`${id}-tab`}
                            >
                                {name}
                            </h1>
                            {services
                                .filter(service => service.category === id)
                                .map((service: Service) => {
                                    return (
                                        <motion.article
                                            key={service.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            onClick={() => {
                                                onOpen()
                                                setServiceModal(service)
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
                                                            <span className='text-base'>{service.time} mins</span>
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
                                    );
                                })}
                        </div>
                    ))}
                </div>

            </section >


            {/* Confirmation bottom modal to continue the booking flow */}
            <AnimatePresence>
                {(isGuest ? guestServices : selectedService).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className='fixed bottom-0 right-0 w-screen bg-gradient-to-br from-gray-800 via-black to-gray-800 border-t border-gray-700 min-h-[6.5rem] z-50 px-4 py-4 flex justify-between items-center shadow-lg'
                    >
                        {(() => {
                            const { totalMinutes, totalPrice } = calculateTotals();
                            const formattedTime = formatDuration(totalMinutes);
                            const serviceCount = isGuest ? guestServices.length : selectedService.length;

                            return (
                                <div className='flex flex-col gap-1 text-sm flex-grow'>
                                    <div className='font-semibold text-white text-lg'>
                                        ${totalPrice.toFixed(2)}
                                    </div>
                                    <div className='flex flex-row items-center gap-1.5 text-gray-400'>
                                        <span>
                                            {serviceCount} service{serviceCount !== 1 ? 's' : ''}
                                            {isGuest ? ' (Guest)' : ''}
                                        </span>
                                        {formattedTime && <span className='text-gray-600'>·</span>}
                                        {formattedTime && <span>{formattedTime}</span>}
                                    </div>
                                </div>
                            );
                        })()}
                        <button
                            onClick={() => {
                                if (isGuest) {
                                    userData.bookingGuest?.push({
                                        name: `Guest ${userData.bookingGuest?.length + 1}`,
                                        services: selectedService
                                    })
                                }

                                if (userData.bookingType === 'group') {
                                    setStep((step) => step + 0.5)
                                } else setStep((step) => step + 1)
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 whitespace-nowrap"
                        >
                            Continue
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {selectedService && serviceModal && (
                <ServiceDetailsModal onOpen={onOpen} isOpen={isOpen} onOpenChange={onOpenChange} service={serviceModal} selectedService={selectedService} setSelectedService={setSelectedService} isGuest={isGuest} onAddGuestService={() => setIsSelectingForGuest(prev => !prev)}/>
            )}
        </>
    );
};

export default ServiceSelection;



        // Mock data with categorized services
        const mockServices = [
            {
                id: "1",
                name: "Classic Bald Fade",
                description: "Clean and sharp skin fade that builds from bare to blend.",
                time: 30,
                price: 30,
                popular: true,
                category: 1
            },
            {
                id: "2",
                name: "Classic Temp/Taper",
                description: "Gradual contoured cut that shapes the hairline while maintaining a fuller profile.",
                time: 30,
                price: 30,
                popular: true,
                category: 1
            },
            {
                id: "3",
                name: "Elite Cut + Beard Trim",
                description: "Premium haircut service with precise beard trimming and styling.",
                time: 45,
                price: 45,
                popular: true,
                category: 2
            },
            {
                id: "4",
                name: "Kid's Special Cut",
                description: "Gentle and stylish haircut perfect for young customers.",
                time: 25,
                price: 25,
                popular: true,
                category: 2
            },
            {
                id: "5",
                name: "Quick Trim",
                description: "Fast and efficient trim to maintain your current style.",
                time: 20,
                price: 20,
                category: 3
            },
            {
                id: "6",
                name: "Express Fade",
                description: "Swift and precise fade service for those on the go.",
                time: 25,
                price: 25,
                category: 3
            },
            {
                id: "7",
                name: "Luxury Package",
                description: "Complete grooming experience including hot towel and facial massage.",
                time: 60,
                price: 75,
                specialty: true,
                category: 4
            },
            {
                id: "8",
                name: "VIP Treatment",
                description: "Premium service with custom styling and grooming consultation.",
                time: 45,
                price: 60,
                specialty: true,
                category: 4
            }
        ];