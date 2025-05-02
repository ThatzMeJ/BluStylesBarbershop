import { Avatar, Button, Input, Spinner } from '@heroui/react';
import { useAuth } from '@/app/context/AuthContext';
import React from 'react'

interface ContentProps {
  onClose: () => void;
}

export const ProfileSettingsContent: React.FC<ContentProps> = ({ onClose }) => {
  const { user } = useAuth();

  // Handle case where user data might not be loaded yet
  if (!user) {
    return <div className='flex justify-center h-full'>
      <Spinner />
    </div>
  }

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 mt-[-20px] mr-[-10px] text-gray-400 hover:text-white focus:outline-none"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-2xl font-semibold mb-8">Profile</h2>

      <div className="relative mb-6 w-24 h-24">
        <Avatar
          radius="full"
          className="w-full h-full object-cover bg-gray-500"
          size="lg"
        />
        <button className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 border-2 border-[#1a1a1a] hover:bg-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
        </button>
      </div>
      <div className="space-y-6">
        {/* Email (as read-only example, assuming username is not available) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
          <div className="relative">
            <Input
              id="email"
              value={user.email}
              readOnly
              className="w-full !bg-[#2a2a2a] !border-gray-600 !text-white placeholder-gray-500 !rounded-md pr-10"
            />
            <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </button>
          </div>
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1">First name</label>
          <Input
            id="firstName"
            defaultValue={user.first_name}
            placeholder="Your first name"
            className="w-full !bg-[#2a2a2a] !border-gray-600 !text-white placeholder-gray-500 !rounded-md"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1">Last name</label>
          <Input
            id="lastName"
            defaultValue={user.last_name}
            placeholder="Your last name"
            className="w-full !bg-[#2a2a2a] !border-gray-600 !text-white placeholder-gray-500 !rounded-md"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400 mb-1">Phone number</label>
          <Input
            id="phoneNumber"
            defaultValue={user.phone_number}
            placeholder="Your phone number"
            className="w-full !bg-[#2a2a2a] !border-gray-600 !text-white placeholder-gray-500 !rounded-md"
          />
        </div>

      </div>

      {/* Save Button - Placeholder */}
      <div className="mt-8 pt-4 border-t border-gray-700 flex justify-end">
        <Button color="primary" variant='solid'>Save Changes</Button>
      </div>
    </div>
  );
};

export const SettingsContent: React.FC<ContentProps> = ({ onClose }) => {
  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 mt-[-20px] mr-[-10px] text-gray-400 hover:text-white focus:outline-none"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-semibold mb-8">Settings</h2>
      {/* Settings form elements go here */}
      <p>General settings content...</p>
    </div>
  );
};

// Add placeholder for Pay History
export const PayHistoryContent: React.FC<ContentProps> = ({ onClose }) => {
  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 mt-[-20px] mr-[-10px] text-gray-400 hover:text-white focus:outline-none"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-semibold mb-8">Payment History</h2>
      <p>Payment history content will go here...</p>
      {/* TODO: Implement payment history display */}
    </div>
  );
};

// Add placeholder for Help
export const HelpContent: React.FC<ContentProps> = ({ onClose }) => {
  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 mt-[-20px] mr-[-10px] text-gray-400 hover:text-white focus:outline-none"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-semibold mb-8">Help & Support</h2>
      <p>Help and support information will go here...</p>
      {/* TODO: Implement help/support section */}
    </div>
  );
};

