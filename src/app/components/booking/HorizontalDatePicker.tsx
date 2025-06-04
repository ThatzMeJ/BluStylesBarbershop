'use client'
import React, { useState, useRef, useEffect } from 'react';
import {
  format,
  addDays,
  startOfToday,
  isToday,
  isEqual,
  isSameDay
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

interface HorizontalDatePickerProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date | null;
  daysToShow?: number;
  disabledDates?: Date[];
}

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}



const HorizontalDatePicker: React.FC<HorizontalDatePickerProps> = ({
  onDateSelect,
  selectedDate: propSelectedDate,
  daysToShow = 14,
  disabledDates = []
}) => {
  const today = startOfToday();
  const [offSet, setOffSet] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(propSelectedDate || today);
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState<Date>(propSelectedDate || today);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);


  const loadMoreDates = () => {
    const newDates: Date[] = []
    if (offSet) {
      for (let i = 0; i < daysToShow; i++) {
        newDates.push(addDays(offSet, i));
      }

      setVisibleDates(prev => [...prev, ...newDates]);
      // Update offset to the day after the last new date
      setOffSet(addDays(newDates[newDates.length - 1], 1));
    }
  }
  // Generate dates to display
  useEffect(() => {
    const dates: Date[] = [];
    for (let i = 0; i < daysToShow; i++) {
      dates.push(addDays(today, i));
    }
    setVisibleDates(dates);

    // Set offset to the last date in the new dates array
    if (dates.length > 0) {
      setOffSet(addDays(dates[dates.length - 1], 1)); // Next day after last visible date
    }
  }, [daysToShow]); // ✅ Added dependency array

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleDates.length > 0) {
          loadMoreDates();
        }
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [offSet, visibleDates.length]); // Added dependencies

  // Update the displayed month/year based on the center-most visible date
  const updateDisplayMonth = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    // Find the date element closest to the center
    let closestDate: Date | null = null;
    let closestDistance = Infinity;

    visibleDates.forEach(date => {
      const element = document.getElementById(`date-${format(date, 'yyyy-MM-dd')}`);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const elementCenter = elementRect.left + elementRect.width / 2;
        const distance = Math.abs(elementCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestDate = date;
        }
      }
    });

    if (closestDate && !isEqual(closestDate, currentDisplayMonth)) {
      setCurrentDisplayMonth(closestDate);
    }
  };

  // Add scroll event listener for month/year updates
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Throttle scroll events for performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateDisplayMonth();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => container.removeEventListener('scroll', throttledHandleScroll);
  }, [visibleDates, currentDisplayMonth]);

  // Scroll to selected date
  useEffect(() => {
    if (selectedDate && scrollRef.current) {
      const selectedDateElement = document.getElementById(`date-${format(selectedDate, 'yyyy-MM-dd')}`);
      if (selectedDateElement) {
        const scrollContainer = scrollRef.current;
        const scrollLeft = selectedDateElement.offsetLeft - scrollContainer.offsetWidth / 2 + selectedDateElement.offsetWidth / 2;
        scrollContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    console.log("date", date)
    setSelectedDate(date);
    onDateSelect(date);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const isDateDisabled = (date: Date) => {
    return disabledDates.some(disabledDate => isSameDay(disabledDate, date));
  };

  return (
    <div className="relative w-full">
      {/* Header with month/year and navigation */}
      <div className="flex items-center justify-between mb-3">
        <div className="relative overflow-hidden min-w-[120px] flex items-center gap-2">
          {/* Animated Month */}
          <AnimatePresence mode="wait">
            <motion.span
              key={format(currentDisplayMonth, 'MMMM')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className='text-sm font-bold text-gray-400 capitalize'
            >
              {format(currentDisplayMonth, 'MMMM')}
            </motion.span>
          </AnimatePresence>

          {/* Animated Year */}
          <AnimatePresence mode="wait">
            <motion.span
              key={format(currentDisplayMonth, 'yyyy')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className='text-sm font-bold text-gray-400'
            >
              {format(currentDisplayMonth, 'yyyy')}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1">
          {/* Navigation buttons */}
          <button
            onClick={scrollLeft}
            className="flex items-center justify-center p-2 text-white hover:text-blue-400 transition-colors rounded-md hover:bg-gray-800"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <button
            onClick={scrollRight}
            className="flex items-center justify-center p-2 text-white hover:text-blue-400 transition-colors rounded-md hover:bg-gray-800"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Date strip container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-3 px-2 scroll-smooth snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {visibleDates.map((date) => {
          const isDisabled = isDateDisabled(date);
          return (
            <div
              key={format(date, 'yyyy-MM-dd')}
              id={`date-${format(date, 'yyyy-MM-dd')}`}
              className="flex-shrink-0 snap-center px-1"
            >
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && handleDateSelect(date)}
                className={classNames(
                  'flex flex-col items-center justify-center transition-all',
                  isDisabled && 'opacity-40 cursor-not-allowed'
                )}
              >
                {/* Circular date number */}
                <div className={classNames(
                  'w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-all',
                  isEqual(date, selectedDate)
                    ? 'bg-blue-600 text-white'
                    : isToday(date)
                      ? 'border-2 border-blue-400 text-white bg-gray-800'
                      : 'border-2 border-gray-600 text-gray-300 hover:border-gray-500'
                )}>
                  <span className="text-lg font-bold">
                    {format(date, 'd')}
                  </span>
                </div>

                {/* Day name below */}
                <span className="text-xs font-medium text-gray-400">
                  {format(date, 'EEE')}
                </span>
              </button>
            </div>
          );
        })}

        {/* Sentinel element for infinite scrolling - placed after all dates */}
        <div
          key={`sentinel-${visibleDates.length}`}
          ref={sentinelRef}
          className="flex-shrink-0 w-1 h-1"
        />
      </div>
    </div>
  );
};

export default HorizontalDatePicker; 