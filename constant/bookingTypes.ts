import Service from './ServiceType'; // Adjusted path relative to the new file location

// Define types that match your database schema
export type BaseBookingPerson = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profile_pic?: string;
  no_shows?: number;
  
};

export interface BookingGuest {
  name: string;
  services: Array<Service>;
}

// Minimal interface for ID comparison
export interface Identifiable {
  id: number | string; // Allow string IDs as well, like from MongoDB (_id)
}

export type BookingMode = 'single' | 'group' | null;

export type RegisteredUser = BaseBookingPerson & {
  type: 'registered';
  bookingType: BookingMode;
  bookingGuest?: Array<BookingGuest>;
};

export type GuestUser = BaseBookingPerson & {
  type: 'guest';
  bookingType: BookingMode;
  bookingGuest?: Array<BookingGuest>;
};

// Combined type for client-side use
export type BookingPerson = RegisteredUser | GuestUser;

export const bookingTypes = [
  {
    id: 1,
    name: 'Single Booking',
    description: 'Schedule service for yourself',
    bookingType: 'single'
  },
  {
    id: 2,
    name: 'Multiple Bookings',
    description: 'For yourself and others',
    bookingType: 'group'
  }
]