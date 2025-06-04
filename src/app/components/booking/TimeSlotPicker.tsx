'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  onTimeSelect: (timeSlot: TimeSlot) => void;
  selectedTimeId?: string | null;
}

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  onTimeSelect,
  selectedTimeId
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(selectedTimeId || null);
  // Create a ref object to store section-specific refs
  const sectionRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});

  // Group time slots into morning and afternoon sections
  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    // Check if time is AM or PM
    const isPM = slot.time.includes('PM');

    // For 9-5 shop hours, divide into just morning and afternoon
    let section = 'morning'; // 9:00 AM - 11:59 AM
    if (isPM) {
      section = 'afternoon'; // 12:00 PM - 5:00 PM
    }

    if (!acc[section]) {
      acc[section] = [];
      // Initialize a ref for this section if it doesn't exist
      if (!sectionRefs.current[section]) {
        sectionRefs.current[section] = React.createRef<HTMLDivElement>();
      }
    }
    acc[section].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  // Scroll to selected time slot when it changes
  useEffect(() => {
    if (selectedSlot) {
      // Find which section contains the selected slot
      for (const [section, slots] of Object.entries(groupedTimeSlots)) {
        const foundSlot = slots.find(slot => slot.id === selectedSlot);
        if (foundSlot && sectionRefs.current[section]?.current) {
          const scrollContainer = sectionRefs.current[section].current;
          const selectedElement = document.getElementById(`time-${selectedSlot}`);

          if (scrollContainer && selectedElement) {
            const scrollLeft = selectedElement.offsetLeft - scrollContainer.offsetWidth / 2 + selectedElement.offsetWidth / 2;
            scrollContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            break; // Exit loop once we've found and scrolled to the slot
          }
        }
      }
    }
  }, [selectedSlot, groupedTimeSlots]);

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    if (!timeSlot.available) return;

    setSelectedSlot(timeSlot.id);
    onTimeSelect(timeSlot);
  };

  const scrollLeft = (section: string) => {
    const ref = sectionRefs.current[section];
    if (ref?.current) {
      ref.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = (section: string) => {
    const ref = sectionRefs.current[section];
    if (ref?.current) {
      ref.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-6">
      {Object.entries(groupedTimeSlots).map(([section, slots]) => (
        slots.length > 0 && (
          <div key={section} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400 capitalize">
                {section} ({slots.length} slots)
              </h3>

              <div className="flex items-center">
                {/* Navigation buttons */}

                <button
                  onClick={() => scrollLeft(section)}
                  className="flex items-center justify-center p-2 text-white hover:text-blue-400 transition-colors rounded-md hover:bg-gray-800"
                  aria-label={`Scroll ${section} left`}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={() => scrollRight(section)}
                  className="flex items-center justify-center p-2 text-white hover:text-blue-400 transition-colors rounded-md hover:bg-gray-800"
                  aria-label={`Scroll ${section} right`}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative w-full">
              {/* Time slots container */}
              <div
                ref={sectionRefs.current[section]}
                className="flex overflow-x-auto scrollbar-hide py-2 px-6 scroll-smooth snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    id={`time-${slot.id}`}
                    className="flex-shrink-0 snap-center px-1"
                  >
                    <button
                      type="button"
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect(slot)}
                      className={classNames(
                        'flex items-center justify-center min-w-[90px] h-12 rounded-lg transition-all px-4',
                        selectedSlot === slot.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
                        !slot.available && 'opacity-40 cursor-not-allowed bg-gray-700 text-gray-500'
                      )}
                    >
                      <span className="text-sm font-medium">{slot.time}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default TimeSlotPicker; 