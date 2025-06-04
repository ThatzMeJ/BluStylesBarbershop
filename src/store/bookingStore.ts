// src/store/bookingStore.ts
import { create } from 'zustand'
import type { BookingPerson, BookingGuest } from '../../constant/bookingTypes'
import type { Service } from '../../constant/ServiceType'

type BookingState = {
  userData: BookingPerson
  mainUserServices: Service[]
  isSelectingForGuest: boolean
  step: number
  previousStep: number | null
  selectedBarber: number
  setStep: (step: number) => void
  setIsSelectingForGuest: (isSelectingForGuest: boolean) => void
  setSelectedBarber: (barberId: number) => void
  setUserData: (data: Partial<BookingPerson>) => void
  setMainUserServices: (services: Service[]) => void
  addGuest: (guest: BookingGuest) => void
  updateGuestBarber: (guestId: number, barberId: number) => void
  resetBooking: () => void,
}

export const useBookingStore = create<BookingState>((set) => ({
  userData: {
    type: 'guest',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    profile_pic: '',
    no_shows: 0,
    bookingType: null,
    bookingGuest: []
  },
  mainUserServices: [],
  isSelectingForGuest: false,
  step: 1,
  previousStep: null,
  selectedBarber: 0,
  setStep: (step) => set({ step }),
  setIsSelectingForGuest: (isSelectingForGuest) =>
    set({ isSelectingForGuest }),
  setUserData: (data) =>
    set((state) => ({
      userData: { ...state.userData, ...data }
    })),
  setMainUserServices: (services) =>
    set(
      { mainUserServices: services }
    ),
  setSelectedBarber: (barberId) =>
    set({ selectedBarber: barberId }),
  addGuest: (guest) =>
    set((state) => ({
      userData: {
        ...state.userData,
        bookingGuest: [...(state.userData.bookingGuest || []), guest]
      }
    })),
  updateGuestBarber: (guestId, barberId) =>
    set((state) => {
      // Find and update the guest with the matching ID
      const updatedGuests = state.userData.bookingGuest?.map(guest =>
        guest.id === guestId ? { ...guest, barber_id: barberId } : guest
      ) || [];

      return {
        userData: {
          ...state.userData,
          bookingGuest: updatedGuests
        }
      };
    }),
  resetBooking: () =>
    set({
      userData: {
        type: 'guest',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        profile_pic: '',
        no_shows: 0,
        bookingType: null,
        bookingGuest: []
      },
      mainUserServices: []
    }),
}))