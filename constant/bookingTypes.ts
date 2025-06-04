import Service from './ServiceType'; // Adjusted path relative to the new file location

export type BookingMode = 'single' | 'group' | null;

// Define types that match your database schema
export type BaseBookingPerson = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  profile_pic?: string;
  no_shows?: number;
  bookingType: BookingMode;
  bookingGuest?: Array<BookingGuest>;
};

export interface BookingGuest {
  id: number;
  name: string;
  barber_id: number | null;
  services: Array<Service>;
}


export type RegisteredUser = BaseBookingPerson & {
  type: 'registered';
};

export type GuestUser = BaseBookingPerson & {
  type: 'guest';
};

// Combined type for client-side use
export type BookingPerson = RegisteredUser | GuestUser;

export const bookingTypes = [
  {
    id: 0,
    name: 'Single Booking',
    description: 'Schedule service for yourself',
    bookingType: 'single' as BookingMode
  },
  {
    id: -1,
    name: 'Multiple Bookings',
    description: 'For yourself and others',
    bookingType: 'group' as BookingMode
  }
]