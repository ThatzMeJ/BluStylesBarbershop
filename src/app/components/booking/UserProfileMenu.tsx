import React, { useState } from 'react'
import { Badge, Avatar, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, Tooltip } from "@heroui/react";
import useWindowDimensions from '@/app/hooks/WindowDimensions';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSettingsModal from './ProfileSettingsModal';


interface UserProfileMenuProps {
  userData: {
    first_name: string,
    no_shows: number,
    profile_pic: string,
    type: 'guest' | 'registered'
  },
  logout: () => void
}



const UserProfileMenu = ({ userData, logout }: UserProfileMenuProps) => {
  const { width } = useWindowDimensions()
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const avatarSize = width < 640 ? 'sm' : 'md'
  const badgeColor = userData.no_shows === 0 ? 'primary' : 'danger'
  console.log(userData)

  const tooltipMotionProps = {
    variants: {
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.1, ease: "easeOut" },
      },
      enter: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.15, ease: "easeIn" },
      },
    },
  };

  const handleProfileClick = (modalNav: 'profile' | 'settings') => {
    switch (modalNav) {
      case 'profile':
        setIsProfileModalOpen(true);
        setMenuOpen(false);
        break;
      case 'settings':
        setIsProfileModalOpen(true);
        setMenuOpen(false);
        break;
    }
  };

  const handleCloseModal = () => {
    setIsProfileModalOpen(false);
  }

  return (
    <>
      <div className='flex justify-center gap-6 items-center'>

        <Tooltip
          content={(
            <div className="flex flex-col">
              <div className="text-sm font-bold">No-Shows: {userData.no_shows}</div>
            </div>
          )}
          placement="bottom"
          showArrow={false}
          color="default"
          className="px-2 py-1 bg-gray-900 text-white border border-gray-800 rounded-md"
          motionProps={tooltipMotionProps}
        >
          <div className="inline-block">
            <Badge color={badgeColor} content={userData.no_shows}>
              <Avatar src={userData.profile_pic} radius="md" size={avatarSize} />
            </Badge>
          </div>
        </Tooltip>


        <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownTrigger>
            <button className='bg-gray-900 border-gray-800  rounded-full overflow-hidden transition-all duration-300 hover:cursor-pointer flex justify-between items-center min-w-24 px-4 py-2 gap-2 text-white'>
              <p className={`${avatarSize === 'sm' ? 'text-sm' : 'text-md'}`}>Menu</p>
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.svg
                    key="close"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="hamburger"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="User menu actions"
            variant="flat"
            className="!bg-gray-900 !shadow-none !border !border-gray-800 !rounded-lg p-1"
            classNames={{
              base: "!bg-gray-900 !border !border-gray-800",
              list: "!bg-gray-900 !p-0 !shadow-none !rounded-lg !border !border-gray-800"
            }}
            onAction={(key) => {
              if (key === 'logout') {
                logout();
              } else if (key === 'profile') {
                handleProfileClick('profile');
              } else if (key === 'settings') handleProfileClick('settings');

             
            }}
          >
            <DropdownItem
              key="profile"
              className="text-white data-[hover=true]:bg-blue-600 data-[hover=true]:text-white data-[selected=true]:bg-blue-600 data-[selected=true]:text-white"
            >
              Profile
            </DropdownItem>
            <DropdownItem key="settings" className="text-white data-[hover=true]:bg-blue-600 data-[hover=true]:text-white data-[selected=true]:bg-blue-600 data-[selected=true]:text-white">
              Settings
            </DropdownItem>
            <DropdownItem key="help" className="text-white data-[hover=true]:bg-blue-600 data-[hover=true]:text-white data-[selected=true]:bg-blue-600 data-[selected=true]:text-white">
              Help & Feedback
            </DropdownItem>
            <DropdownItem
              key="logout"
              className="text-red-400 data-[hover=true]:bg-red-900 data-[hover=true]:text-red-300 data-[selected=true]:bg-red-900 data-[selected=true]:text-red-300"

            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

      </div>
      <AnimatePresence>
        {isProfileModalOpen && (
          <>
            <ProfileSettingsModal
              onClose={handleCloseModal}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}
export default UserProfileMenu;
