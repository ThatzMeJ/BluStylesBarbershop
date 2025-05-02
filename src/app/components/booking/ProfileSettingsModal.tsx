import React, { useEffect, useRef, useState } from 'react';
import { Avatar } from "@heroui/react";
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import ProfileSettingLink from '../../components/booking/ProfileSettingLink'
import { useAuth } from '../../context/AuthContext'
// Import the content components
import { ProfileSettingsContent, SettingsContent, PayHistoryContent, HelpContent } from './ProfileSettingModalComp';
// Define the possible setting names as a type for better type safety
type SettingName = 'Profile' | 'Pay History' | 'Settings' | 'Help';

interface ProfileSettingsModalProps {
  onClose: () => void;
  // ContentComp prop removed
}

// Define animation variants for clarity
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};


const containerVariants = {
  close: {
    width: '5rem',
    minWidth: '5rem',
    transition: {
      type: 'spring',
      damping: 15,
      duration: 0.5,
    }
  },
  open: {
    width: '16rem',
    transition: {
      type: 'spring',
      damping: 15,
      duration: 0.5,
    }
  }
}

const svgVariants = {
  close: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ onClose }) => {
  const { logout } = useAuth()
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [activeSetting, setActiveSetting] = useState<SettingName>('Profile');
  const containerControls = useAnimationControls()
  const svgControls = useAnimationControls()
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      containerControls.start("open")
      svgControls.start("open")
    } else {
      containerControls.start("close")
      svgControls.start("close")
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (modalContainerRef.current && !modalContainerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleClickOutNavSection = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen((prev) => !prev);
      }
    };

    // Add event listener when the component mounts (since it's controlled by AnimatePresence)
    document.addEventListener('mousedown', handleClickOutside);

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutNavSection)
    }


    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutNavSection)
    };
    // We only need onClose in dependency array now, as mounting/unmounting is handled externally
  }, [onClose, isOpen]);


  // Placeholder data - replace with actual user data prop later
  const userData = {
    username: 'samlee',
    fullName: 'Sam Lee',
    website: 'samlee.com',
    bio: '',
    profilePictureUrl: 'https://i.pravatar.cc/150?img=1',
    socialLinks: [{ type: 'instagram', handle: 'samlee' }]
  };

  const handleSettingClick = (name: SettingName) => {
    setActiveSetting(name);
  };

  const handleOpenClose = () => {
    setIsOpen(!isOpen)
  }

  // Helper function to render the correct content component
  const renderContent = () => {
    switch (activeSetting) {
      case 'Profile':
        return <ProfileSettingsContent onClose={onClose} />;
      case 'Settings':
        return <SettingsContent onClose={onClose} />;
      // Add cases for 'Pay History' and 'Help'
      case 'Pay History':
        return <PayHistoryContent onClose={onClose} />;
      case 'Help':
        return <HelpContent onClose={onClose} />;
      default:
        return null; // Or a default view
    }
  };

  return (
    // 3. Wrap the backdrop in motion.div and add animation props
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden" // Animate backdrop fade out
      transition={{ duration: 0.2 }} // Adjust duration as needed
    >
      {/* Attach the ref to the main modal content div */}
      {/* Also wrap the modal content itself for separate animation */}
      <motion.div
        ref={modalContainerRef}
        className="bg-neutral-900 text-white rounded-lg shadow-xl w-full max-w-2xl min-h-[500px] max-h-[85vh] flex overflow-hidden border border-gray-700 mx-2"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit" // Use the defined exit variant
      >

        {/* Left Sidebar */}
        <motion.div
          className={`bg-[#1a1a1a] p-4 flex flex-col items-start border-r border-gray-700`}
          variants={containerVariants}
          animate={containerControls}
          initial="close"
          ref={navRef}
        >
          <div className='flex flex-row w-full justify-between place-items-center mb-8'>
            <AnimatePresence>
              {isOpen &&
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.1 } }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                >
                  <Avatar
                    src={userData.profilePictureUrl}
                    radius="full"
                    className="w-10 h-10 object-cover"
                    size="lg"
                  />
                </motion.div>}
            </AnimatePresence>

            <button
              className="p-1 rounded-full flex"
              onClick={() => handleOpenClose()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-8 h-8 stroke-neutral-200"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={svgVariants}
                  animate={svgControls}
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                />
              </svg>
            </button>
          </div>


          <div className="flex flex-col gap-3 ">
            <ProfileSettingLink
              name={"Profile"}
              isOpen={isOpen}
              isActive={activeSetting === 'Profile'}
              onClick={() => handleSettingClick('Profile')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </ProfileSettingLink>

            <ProfileSettingLink
              name={"Pay History"}
              isOpen={isOpen}
              isActive={activeSetting === 'Pay History'}
              onClick={() => handleSettingClick('Pay History')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
            </ProfileSettingLink>

            <ProfileSettingLink
              name={"Settings"}
              isOpen={isOpen}
              isActive={activeSetting === 'Settings'}
              onClick={() => handleSettingClick('Settings')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
              </svg>
            </ProfileSettingLink>


            <ProfileSettingLink
              name={"Help"}
              isOpen={isOpen}
              isActive={activeSetting === 'Help'}
              onClick={() => handleSettingClick('Help')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </ProfileSettingLink>


          </div>


          {/* Bottom Buttons */}
          <div className="mt-auto">
            <ProfileSettingLink name={"Logout"} isOpen={isOpen} textColor='text-red-500' onClick={() => logout()}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
            </ProfileSettingLink>
          </div>


        </motion.div>


        {/* Right Content Area */}
        <div className="flex-grow p-8 relative overflow-y-auto">
          {renderContent()}
        </div>
      </motion.div> {/* End of modal content motion.div */}
    </motion.div> // End of backdrop motion.div
  );
};

export default ProfileSettingsModal;
