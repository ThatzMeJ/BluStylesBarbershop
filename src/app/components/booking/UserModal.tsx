'use client'
import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { LockIcon, MailIcon } from 'lucide-react';
import GoogleLogo from '../../../../public/img/google-logo.png'
import FacebookLogo from '../../../../public/img/Facebook_Logo_Primary.png'
import Image from 'next/image';

interface UserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: 'Login' | 'Sign Up';
  authMethod?: 'email' | 'google' | 'facebook';
  onUserUpdate?: (userData: unknown) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

// TODO: Add authMethod to the props and setError to the props
const UserModal = ({
  isOpen,
  onOpenChange,
  title,
  onUserUpdate,
}: UserModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  console.log(formData);
  const handleSubmit = async () => {
    // Here you would typically call your authentication API
    try {
      // Simulate successful authentication
      const userData = {
        ...formData,
        type: 'registered',
        no_shows: 0
      };

      // Update the user state in the parent component
      if (onUserUpdate) {
        onUserUpdate(userData);
      }

      // Close the modal
      onOpenChange(false);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };



  const handleSocialAuth = async (authType: 'Facebook' | 'Google') => {
    const url = `http://localhost:3005/auth/${String(authType).toLowerCase()}`
    window.location.href = url
  };

  return (
    <>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent className=" bg-[var(--primary)]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">{title}</ModalHeader>
              <ModalBody>
                {title === 'Login' ? (
                  <>
                    <Input
                      isRequired
                      name="email"
                      label="Email"
                      labelPlacement="outside"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      startContent={<MailIcon className="text-default-400 pointer-events-none flex-shrink-0" />}
                    />

                    <Input
                      isRequired
                      type="password"
                      name="password"
                      label="Password"
                      labelPlacement="outside"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      startContent={<LockIcon className="text-default-400 pointer-events-none flex-shrink-0" />}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      isRequired
                      name="email"
                      label="Email"
                      labelPlacement="outside"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      startContent={<MailIcon className="text-default-400 pointer-events-none flex-shrink-0" />}
                    />

                    <div className='flex gap-2'>
                      <Input
                        isRequired
                        name="firstName"
                        label="First Name"
                        labelPlacement="outside"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                      <Input
                        name="lastName"
                        label="Last Name"
                        labelPlacement="outside"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <Input
                      isRequired
                      type="password"
                      name="password"
                      label="Password"
                      labelPlacement="outside"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      startContent={<LockIcon className="text-default-400 pointer-events-none flex-shrink-0" />}
                    />

                    <Input
                      isRequired
                      name="phoneNumber"
                      label="Phone Number"
                      labelPlacement="outside"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </>
                )}

                <div className="flex flex-col justify-center items-center gap-2 mt-4">
                  <p className="text-white text-center">Or continue with</p>
                  <div className="flex flex-col justify-center gap-4 max-w-56">
                    <Button
                      variant="flat"
                      className='bg-white font-bold flex justify-start'
                      onPress={() => handleSocialAuth('Google')}
                    >
                      < Image
                        src={GoogleLogo}
                        width={30}
                        height={30}
                        alt='Google Logo'
                      />
                      Sign {title === 'Sign Up' ? 'up' : 'in'} with Google
                    </Button>
                    <Button
                      className='bg-white font-bold flex justify-start'
                      variant="flat"
                      name='Facebook'
                      onPress={() => handleSocialAuth('Facebook')}
                    >
                      <Image
                        src={FacebookLogo}
                        width={30}
                        height={30}
                        alt='Google Logo'
                      />
                      Sign {title === 'Sign Up' ? 'up' : 'in'} with Facebook
                    </Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button className='bg-gradient-to-r from-blue-400 to-blue-600 text-white' onPress={handleSubmit}>
                  {title}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default UserModal